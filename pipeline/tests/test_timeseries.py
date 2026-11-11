import pytest

def calculate_annual_precipitation(monthly_records):
    by_basin_year = {}
    for r in monthly_records:
        k = (r["basin_id"], r["year"])
        if k not in by_basin_year:
            by_basin_year[k] = []
        by_basin_year[k].append(r)

    annual_items = []
    for (basin_id, year), records in by_basin_year.items():
        complete_months = sum(1 for m in records if m["precip_mm"] is not None)
        if complete_months == 12:
            total_mm = sum(m["precip_mm"] for m in records if m["precip_mm"] is not None)
            annual_items.append({
                "year": year,
                "basin_id": basin_id,
                "annual_precip_mm": round(total_mm, 2),
                "complete_months": 12,
                "valid_year": True,
                "source_version": "07"
            })
        else:
            annual_items.append({
                "year": year,
                "basin_id": basin_id,
                "annual_precip_mm": None,
                "complete_months": complete_months,
                "valid_year": False,
                "source_version": "07"
            })
    return annual_items

def test_complete_year_annual_sum():
    monthly = [
        {"basin_id": "ramis", "year": 2020, "month": m, "precip_mm": 50.0}
        for m in range(1, 13)
    ]
    res = calculate_annual_precipitation(monthly)
    assert len(res) == 1
    assert res[0]["valid_year"] is True
    assert res[0]["complete_months"] == 12
    assert res[0]["annual_precip_mm"] == pytest.approx(600.0)

def test_incomplete_year_invalidated():
    monthly = [
        {"basin_id": "ramis", "year": 2020, "month": m, "precip_mm": 50.0}
        for m in range(1, 12)
    ]
    monthly.append({"basin_id": "ramis", "year": 2020, "month": 12, "precip_mm": None})
    res = calculate_annual_precipitation(monthly)
    assert len(res) == 1
    assert res[0]["valid_year"] is False
    assert res[0]["complete_months"] == 11
    assert res[0]["annual_precip_mm"] is None
