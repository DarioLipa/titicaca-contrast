import pytest
from titicaca_pipeline.trends import compute_theil_sen_slope, compute_mann_kendall

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

