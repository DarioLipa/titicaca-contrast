import pytest
from titicaca_pipeline.aggregate import compute_weighted_average, is_valid_coverage

def test_equal_area_weights():
    values = [10.0, 20.0]
    areas = [100.0, 100.0]
    assert compute_weighted_average(values, areas) == pytest.approx(15.0)

def test_unequal_area_weights():
    values = [10.0, 30.0]
    areas = [300.0, 100.0]
    assert compute_weighted_average(values, areas) == pytest.approx(15.0)

def test_zero_total_area_raises():
    with pytest.raises(ValueError):
        compute_weighted_average([10.0], [0.0])

def test_valid_coverage_threshold():
    assert is_valid_coverage(0.96) is True
    assert is_valid_coverage(0.95) is True
    assert is_valid_coverage(0.94) is False

