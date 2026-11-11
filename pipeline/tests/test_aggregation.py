import numpy as np
import pytest
from titicaca_pipeline.aggregate import compute_weighted_average, is_valid_coverage
from titicaca_pipeline.imerg import aggregate_basin_precipitation

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

def test_aggregate_basin_precipitation_valid():
    grid = np.zeros((3600, 1800), dtype=np.float32)
    grid[100, 200] = 1.0
    grid[100, 201] = 2.0
    weights_info = {
        "entries": [
            (100, 200, 0.5),
            (100, 201, 0.5)
        ]
    }
    precip_mm, fraction = aggregate_basin_precipitation(grid, weights_info, 2023, 1)
    assert fraction == pytest.approx(1.0)
    expected_rate = 1.5
    expected_mm = expected_rate * 24 * 31
    assert precip_mm == pytest.approx(expected_mm)

def test_aggregate_basin_precipitation_rejects_low_coverage():
    grid = np.zeros((3600, 1800), dtype=np.float32)
    grid[100, 200] = 1.0
    grid[100, 201] = -9999.9
    weights_info = {
        "entries": [
            (100, 200, 0.5),
            (100, 201, 0.5)
        ]
    }
    precip_mm, fraction = aggregate_basin_precipitation(grid, weights_info, 2023, 1, min_area_fraction=0.95)
    assert fraction == pytest.approx(0.5)
    assert precip_mm is None
