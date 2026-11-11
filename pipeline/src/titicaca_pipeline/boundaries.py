import json
from pathlib import Path
from typing import Any, Dict, List
import geopandas as gpd
from shapely.ops import polygonize, unary_union

def load_basins_config(config_path: Path) -> List[Dict[str, Any]]:
    import yaml
    with open(config_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("basins", [])

def validate_basin_ids(basin_ids: List[str]) -> bool:
    expected = {"ramis", "coata", "ilave", "huancane"}
    return set(basin_ids) == expected

def process_ana_shapefile(
    zip_path: Path,
    output_public_dir: Path,
    output_interim_dir: Path,
    download_hash: str
) -> Dict[str, Any]:
    gdf = gpd.read_file(f"zip://{zip_path}!zipfolder55/UnidadesHidrograficas.shp")
    titi = gdf[gdf["NOMB_UH_N1"].astype(str).str.contains("Titicaca", case=False, na=False)]

    ramis_parts = titi[titi["CODIGO"].isin(["0179", "018", "019"])]
    if len(ramis_parts) != 3:
        raise ValueError("No se encontraron las 3 subunidades oficiales de Ramis en el shapefile")
    ramis_geom = unary_union(ramis_parts.geometry)

    coata_row = titi[titi["CODIGO"] == "0176"]
    if len(coata_row) == 0:
        raise ValueError("No se encontro la cuenca Coata (0176)")
    coata_geom = coata_row.geometry.iloc[0]

    ilave_row = titi[titi["CODIGO"] == "016"]
    if len(ilave_row) == 0:
        raise ValueError("No se encontro la cuenca Ilave (016)")
    ilave_geom = ilave_row.geometry.iloc[0]

    huancane_row = titi[titi["CODIGO"] == "0178"]
    if len(huancane_row) == 0:
        raise ValueError("No se encontro la cuenca Huancané (0178)")
    huancane_geom = huancane_row.geometry.iloc[0]

    raw_basins = [
        {
            "id": "ramis",
            "name": "Ramis",
            "official_code": "0179+018+019",
            "hierarchical_level": "Nivel 3/4 Pfafstetter",
            "ana_area_km2": 15870.42,
            "geometry": ramis_geom
        },
        {
            "id": "coata",
            "name": "Coata",
            "official_code": "0176",
            "hierarchical_level": "Nivel 4 Pfafstetter",
            "ana_area_km2": 4882.42,
            "geometry": coata_geom
        },
        {
            "id": "ilave",
            "name": "Ilave",
            "official_code": "016",
            "hierarchical_level": "Nivel 3 Pfafstetter",
            "ana_area_km2": 7791.00,
            "geometry": ilave_geom
        },
        {
            "id": "huancane",
            "name": "Huancané",
            "official_code": "0178",
            "hierarchical_level": "Nivel 4 Pfafstetter",
            "ana_area_km2": 3611.92,
            "geometry": huancane_geom
        }
    ]

    basins_gdf = gpd.GeoDataFrame(raw_basins, crs="EPSG:4326")

    for idx, row in basins_gdf.iterrows():
        if not row.geometry.is_valid:
            basins_gdf.at[idx, "geometry"] = row.geometry.buffer(0)
            if not basins_gdf.at[idx, "geometry"].is_valid:
                raise ValueError(f"Geometria invalida no corregible en cuenca {row['id']}")

    proj_gdf = basins_gdf.to_crs(epsg=32719)
    basins_gdf["calculated_area_km2"] = (proj_gdf.geometry.area / 1e6).round(2)
    basins_gdf["area_km2"] = basins_gdf["ana_area_km2"]
    basins_gdf["source"] = "ANA GeoIDEP Unidades Hidrograficas"
    basins_gdf["source_url"] = "https://geosnirh.ana.gob.pe/Repositorio/Shape/UnidadesHidrograficas.zip"
    basins_gdf["crs_original"] = "EPSG:4326"
    basins_gdf["download_hash_sha256"] = download_hash

    output_interim_dir.mkdir(parents=True, exist_ok=True)
    interim_exact_path = output_interim_dir / "basins_exact.geojson"
    basins_gdf.to_file(interim_exact_path, driver="GeoJSON")

    boundary_lines = unary_union([p.boundary for p in basins_gdf.geometry])
    simplified_lines = boundary_lines.simplify(0.002, preserve_topology=True)
    reconstructed_polys = list(polygonize(simplified_lines))

    web_gdf = basins_gdf.copy()
    matched_geoms = []
    for _, r in basins_gdf.iterrows():
        best_poly = max(reconstructed_polys, key=lambda p: r.geometry.intersection(p).area)
        matched_geoms.append(best_poly)

    web_gdf["geometry"] = matched_geoms

    output_public_dir.mkdir(parents=True, exist_ok=True)
    web_geojson_path = output_public_dir / "basins.geojson"
    web_gdf.to_file(web_geojson_path, driver="GeoJSON")

    basins_json_records = []
    for _, r in basins_gdf.iterrows():
        basins_json_records.append({
            "id": r["id"],
            "name": r["name"],
            "official_code": r["official_code"],
            "hierarchical_level": r["hierarchical_level"],
            "area_km2": float(r["area_km2"]),
            "calculated_area_km2": float(r["calculated_area_km2"]),
            "source": r["source"],
            "source_url": r["source_url"],
            "crs_original": r["crs_original"],
            "download_hash_sha256": r["download_hash_sha256"]
        })

    web_json_path = output_public_dir / "basins.json"
    with open(web_json_path, "w", encoding="utf-8") as f:
        json.dump(basins_json_records, f, indent=2, ensure_ascii=False)

    return {
        "count": len(basins_json_records),
        "exact_geojson": str(interim_exact_path),
        "web_geojson": str(web_geojson_path),
        "web_json": str(web_json_path)
    }
