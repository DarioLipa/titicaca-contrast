import json
from pathlib import Path
import pytest
from titicaca_pipeline.contrasts import compute_gap_series, fit_hac_gap_trend, benjamini_hochberg

def get_repo_root() -> Path:
    if Path("web/public/data").exists():
        return Path(".")
    if Path("../web/public/data").exists():
        return Path("..")
    return Path(__file__).resolve().parents[2]

def test_compute_gap_series_pairing():
    years_a = [2001, 2002, 2003, 2004]
    vals_a = [500.0, 520.0, 510.0, 530.0]
    years_b = [2002, 2003, 2004, 2005]
    vals_b = [400.0, 400.0, 400.0, 400.0]
    common_years, gaps = compute_gap_series(years_a, vals_a, years_b, vals_b)
    assert common_years == [2002, 2003, 2004]
    assert gaps == pytest.approx([120.0, 110.0, 130.0])

def test_strictly_increasing_gap_trend():
    years = list(range(2001, 2021))
    gaps = [10.0 * (y - 2001) for y in years]
    res = fit_hac_gap_trend(years, gaps, max_lags=1)
    assert res["slope"] == pytest.approx(10.0, rel=1e-3)
    assert res["p_value"] < 0.001
    assert res["ci_lower"] > 0

def test_equal_slope_gap_trend():
    years = list(range(2001, 2025))
    vals_a = [500.0 + 5.0 * (y - 2001) + (0.5 if y % 2 == 0 else -0.5) for y in years]
    vals_b = [300.0 + 5.0 * (y - 2001) for y in years]
    common_years, gaps = compute_gap_series(years, vals_a, years, vals_b)
    res = fit_hac_gap_trend(common_years, gaps, max_lags=1)
    assert res["slope"] == pytest.approx(0.0, abs=1e-2)

def test_benjamini_hochberg_correction():
    p_vals = [0.001, 0.004, 0.010, 0.040, 0.060, 0.120]
    q_vals = benjamini_hochberg(p_vals)
    assert len(q_vals) == 6
    for i in range(len(q_vals) - 1):
        assert q_vals[i] <= q_vals[i + 1]
    assert q_vals[0] == pytest.approx(0.001 * 6 / 1)

def test_exported_contrasts_json_validation():
    root = get_repo_root()
    contrasts_path = root / "web/public/data/contrasts.json"
    assert contrasts_path.exists()
    with open(contrasts_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert len(data) == 6
    valid_statuses = {"supported", "inconclusive", "no_change"}
    for c in data:
        assert c["start_year"] == 2001
        assert c["end_year"] == 2024
        assert c["n_paired_years"] == 24
        assert c["evidence_status"] in valid_statuses
        assert 0.0 <= c["p_value"] <= 1.0
        assert 0.0 <= c["q_value_fdr"] <= 1.0

def test_exported_evidence_json_validation():
    root = get_repo_root()
    evidence_path = root / "web/public/data/evidence.json"
    assert evidence_path.exists()
    with open(evidence_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert len(data) == 6
    for item in data:
        assert "basin_a" in item
        assert "basin_b" in item
        assert "evidence_status" in item
        assert "sensitivity_lags" in item
        assert "autocorrelation_lag1" in item
        assert "interpretation" in item
