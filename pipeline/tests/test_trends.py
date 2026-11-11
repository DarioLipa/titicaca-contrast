import json
from pathlib import Path
import pytest
from titicaca_pipeline.trends import (
    compute_theil_sen_slope,
    compute_mann_kendall,
    compute_all_basin_trends
)

def get_repo_root() -> Path:
    if Path("web/public/data").exists():
        return Path(".")
    if Path("../web/public/data").exists():
        return Path("..")
    return Path(__file__).resolve().parents[2]

def test_strictly_increasing_series():
    years = [2001, 2002, 2003, 2004, 2005]
    values = [100.0, 110.0, 120.0, 130.0, 140.0]
    slope = compute_theil_sen_slope(years, values)
    assert slope == pytest.approx(10.0)
    _, p_val, direction = compute_mann_kendall(values)
    assert direction == "increasing"
    assert p_val < 0.05

def test_flat_series():
    years = [2001, 2002, 2003, 2004, 2005]
    values = [100.0, 100.0, 100.0, 100.0, 100.0]
    slope = compute_theil_sen_slope(years, values)
    assert slope == pytest.approx(0.0)
    _, p_val, direction = compute_mann_kendall(values)
    assert direction == "no_trend"

def test_strictly_decreasing_series():
    years = [2001, 2002, 2003, 2004, 2005]
    values = [200.0, 190.0, 180.0, 170.0, 160.0]
    slope = compute_theil_sen_slope(years, values)
    assert slope == pytest.approx(-10.0)
    _, p_val, direction = compute_mann_kendall(values)
    assert direction == "decreasing"
    assert p_val < 0.05

def test_exported_trends_json_validation():
    root = get_repo_root()
    trends_path = root / "web/public/data/trends.json"
    assert trends_path.exists()
    with open(trends_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert len(data) == 4
    basins = {t["basin_id"] for t in data}
    assert basins == {"ramis", "coata", "ilave", "huancane"}
    for t in data:
        assert t["start_year"] == 2001
        assert t["end_year"] == 2024
        assert t["n_years"] == 24
        assert t["data_quality"] == "complete"
        assert t["trend_direction"] in ["increasing", "decreasing", "no_trend"]
        assert 0.0 <= t["mann_kendall_p"] <= 1.0
