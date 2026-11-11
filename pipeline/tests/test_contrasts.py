import pytest
from titicaca_pipeline.contrasts import compute_gap_series, fit_hac_gap_trend, benjamini_hochberg

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

def test_benjamini_hochberg_correction():
    p_vals = [0.001, 0.004, 0.010, 0.040, 0.060, 0.120]
    q_vals = benjamini_hochberg(p_vals)
    assert len(q_vals) == 6
    for i in range(len(q_vals) - 1):
        assert q_vals[i] <= q_vals[i + 1]
    assert q_vals[0] == pytest.approx(0.001 * 6 / 1)
