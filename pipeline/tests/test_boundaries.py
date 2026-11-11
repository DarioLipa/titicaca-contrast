import json
from pathlib import Path
import geopandas as gpd
from titicaca_pipeline.boundaries import validate_basin_ids

def get_repo_root() -> Path:
    if Path("web/public/data").exists():
        return Path(".")
    if Path("../web/public/data").exists():
        return Path("..")
    return Path(__file__).resolve().parents[2]

def test_validate_exact_four_basins():
    valid = ["ramis", "coata", "ilave", "huancane"]
    assert validate_basin_ids(valid) is True

def test_reject_incomplete_basins():
    incomplete = ["ramis", "coata", "ilave"]
    assert validate_basin_ids(incomplete) is False

def test_reject_unknown_basins():
    unknown = ["ramis", "coata", "ilave", "otro"]
    assert validate_basin_ids(unknown) is False

def test_exported_basins_json_integrity():
    root = get_repo_root()
    json_path = root / "web/public/data/basins.json"
    assert json_path.exists()
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert len(data) == 4
    basin_ids = [b["id"] for b in data]
    assert validate_basin_ids(basin_ids) is True
    for item in data:
        assert item["area_km2"] > 0
        assert item["calculated_area_km2"] > 0
        assert item["source"] == "ANA GeoIDEP Unidades Hidrograficas"
        assert item["crs_original"] == "EPSG:4326"

def test_exported_basins_geojson_topology_and_crs():
    root = get_repo_root()
    geojson_path = root / "web/public/data/basins.geojson"
    assert geojson_path.exists()
    gdf = gpd.read_file(geojson_path)
    assert len(gdf) == 4
    assert str(gdf.crs).upper() in ["EPSG:4326", "OGC:CRS84"]
    for _, row in gdf.iterrows():
        assert row.geometry.is_valid is True
        assert not row.geometry.is_empty
    names = list(gdf["id"])
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            g1 = gdf.loc[gdf["id"] == names[i], "geometry"].iloc[0]
            g2 = gdf.loc[gdf["id"] == names[j], "geometry"].iloc[0]
            intersection = g1.intersection(g2)
            assert intersection.area < 1e-9
