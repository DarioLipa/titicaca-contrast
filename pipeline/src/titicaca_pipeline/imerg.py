import calendar
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import geopandas as gpd
import h5py
import numpy as np
from shapely.geometry import box

def get_days_in_month(year: int, month: int) -> int:
    if month < 1 or month > 12:
        raise ValueError(f"Mes invalido: {month}")
    return calendar.monthrange(year, month)[1]

def calculate_monthly_precipitation_mm(rate_mm_per_h: float, year: int, month: int) -> float:
    if rate_mm_per_h < 0:
        raise ValueError("La tasa de precipitacion no puede ser negativa")
    days = get_days_in_month(year, month)
    hours = days * 24
    return rate_mm_per_h * hours

def precompute_basin_weights(basins_geojson_path: Path) -> Dict[str, Dict[str, Any]]:
    gdf = gpd.read_file(basins_geojson_path)
    weights_by_basin = {}
    for _, r in gdf.iterrows():
        b_id = str(r["id"])
        geom = r.geometry
        bounds = geom.bounds
        min_lon_idx = int(np.floor((bounds[0] + 180.0) / 0.1))
        max_lon_idx = int(np.ceil((bounds[2] + 180.0) / 0.1))
        min_lat_idx = int(np.floor((bounds[1] + 90.0) / 0.1))
        max_lat_idx = int(np.ceil((bounds[3] + 90.0) / 0.1))

        entries = []
        total_inter_area = 0.0
        for i in range(min_lon_idx, max_lon_idx + 1):
            lon_c = -180.0 + i * 0.1 + 0.05
            for j in range(min_lat_idx, max_lat_idx + 1):
                lat_c = -90.0 + j * 0.1 + 0.05
                cell = box(lon_c - 0.05, lat_c - 0.05, lon_c + 0.05, lat_c + 0.05)
                if cell.intersects(geom):
                    inter = cell.intersection(geom)
                    if inter.area > 0:
                        entries.append((i, j, inter.area))
                        total_inter_area += inter.area

        if total_inter_area <= 0:
            raise ValueError(f"Area de interseccion no valida para cuenca {b_id}")

        normalized_entries = [(i, j, a / total_inter_area) for i, j, a in entries]
        weights_by_basin[b_id] = {
            "total_area": total_inter_area,
            "polygon_area": geom.area,
            "entries": normalized_entries
        }
    return weights_by_basin

def read_imerg_precipitation_grid(file_path: Path) -> Tuple[np.ndarray, Dict[str, Any]]:
    with h5py.File(file_path, "r") as f:
        if "Grid" in f:
            precip_ds = f["Grid"]["precipitation"]
            data = np.array(precip_ds)
            if data.ndim == 3:
                data = data[0]
            units = precip_ds.attrs.get("units", b"").decode("utf-8") if isinstance(precip_ds.attrs.get("units"), bytes) else str(precip_ds.attrs.get("units", ""))
            metadata = {
                "units": units or "mm/hr",
                "shape": list(data.shape),
                "lon_offset": 0,
                "lat_offset": 0
            }
        else:
            precip_ds = f["precipitation"]
            data = np.array(precip_ds)
            if data.ndim == 3:
                data = data[0]
            units = precip_ds.attrs.get("units", b"").decode("utf-8") if isinstance(precip_ds.attrs.get("units"), bytes) else str(precip_ds.attrs.get("units", ""))
            metadata = {
                "units": units or "mm/hr",
                "shape": list(data.shape),
                "lon_offset": 1085,
                "lat_offset": 725
            }
    return data, metadata

def aggregate_basin_precipitation(
    precip_grid: np.ndarray,
    basin_weight_info: Dict[str, Any],
    year: int,
    month: int,
    min_area_fraction: float = 0.95,
    lon_offset: int = 0,
    lat_offset: int = 0
) -> Tuple[Optional[float], float]:
    entries = basin_weight_info["entries"]
    valid_weight_sum = 0.0
    weighted_rate_sum = 0.0

    for lon_i, lat_j, weight in entries:
        grid_i = lon_i - lon_offset
        grid_j = lat_j - lat_offset
        val = precip_grid[grid_i, grid_j]
        if val >= 0 and not np.isnan(val):
            valid_weight_sum += weight
            weighted_rate_sum += val * weight

    if valid_weight_sum < min_area_fraction:
        return None, valid_weight_sum

    effective_rate = weighted_rate_sum / valid_weight_sum
    precip_mm = calculate_monthly_precipitation_mm(effective_rate, year, month)
    return precip_mm, valid_weight_sum
