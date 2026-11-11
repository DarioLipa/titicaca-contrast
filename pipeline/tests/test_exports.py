import csv
import json
from pathlib import Path
import pytest
from titicaca_pipeline.validation import validate_manifest_dict

def get_repo_root() -> Path:
    if Path("web/public/data").exists():
        return Path(".")
    if Path("../web/public/data").exists():
        return Path("..")
    return Path(__file__).resolve().parents[2]

def test_manifest_validation_success():
    root = get_repo_root()
    manifest_path = root / "web/public/data/manifest.json"
    assert manifest_path.exists()
    with open(manifest_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert validate_manifest_dict(data) is True
    assert data["data_status"] in ["ready", "partial", "unavailable"]
    assert data["dataset_id"] == "GPM_3IMERGM"
    assert data["dataset_version"] == "07"

def test_exported_monthly_csv_structure_and_completeness():
    root = get_repo_root()
    csv_path = root / "web/public/data/precipitation-monthly.csv"
    assert csv_path.exists()
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = list(csv.DictReader(f))
    assert len(reader) == 1200
    seen = set()
    for row in reader:
        key = (row["basin_id"], int(row["year"]), int(row["month"]))
        assert key not in seen
        seen.add(key)
        assert row["source_dataset"] == "GPM_3IMERGM"
        assert row["source_version"] == "07"
        if row["precip_mm"]:
            val = float(row["precip_mm"])
            assert val >= 0.0

def test_exported_annual_json_structure():
    root = get_repo_root()
    annual_path = root / "web/public/data/precipitation-annual.json"
    assert annual_path.exists()
    with open(annual_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert len(data) == 100
    valid_count = sum(1 for item in data if item["valid_year"])
    assert valid_count == 96
    incomplete_2025 = [item for item in data if item["year"] == 2025]
    assert len(incomplete_2025) == 4
    for item in incomplete_2025:
        assert item["valid_year"] is False
        assert item["complete_months"] == 9
        assert item["annual_precip_mm"] is None
