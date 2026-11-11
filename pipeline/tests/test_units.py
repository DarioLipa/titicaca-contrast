import pytest
from titicaca_pipeline.imerg import calculate_monthly_precipitation_mm, get_days_in_month

def test_january_days():
    assert get_days_in_month(2023, 1) == 31

def test_february_leap_year():
    assert get_days_in_month(2024, 2) == 29

def test_february_common_year():
    assert get_days_in_month(2023, 2) == 28

def test_rate_conversion_january():
    rate = 0.5
    expected = 0.5 * 31 * 24
    assert calculate_monthly_precipitation_mm(rate, 2023, 1) == pytest.approx(expected)

def test_rate_conversion_february_leap():
    rate = 1.0
    expected = 1.0 * 29 * 24
    assert calculate_monthly_precipitation_mm(rate, 2024, 2) == pytest.approx(expected)

def test_negative_rate_rejection():
    with pytest.raises(ValueError):
        calculate_monthly_precipitation_mm(-0.1, 2023, 1)
