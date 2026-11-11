import math
from typing import Any, Dict, List, Tuple
from scipy import stats

def compute_theil_sen_slope(years: List[int], values: List[float]) -> float:
    if len(years) != len(values) or len(years) < 3:
        raise ValueError("Se requieren al menos 3 puntos temporales")
    res = stats.theilslopes(values, years)
    return float(res.slope)

def compute_mann_kendall(values: List[float]) -> Tuple[float, float, str]:
    n = len(values)
    if n < 3:
        raise ValueError("Se requieren al menos 3 observaciones")
    s = 0
    for i in range(n - 1):
        for j in range(i + 1, n):
            diff = values[j] - values[i]
            if diff > 0:
                s += 1
            elif diff < 0:
                s -= 1
    var_s = (n * (n - 1) * (2 * n + 5)) / 18.0
    if s > 0:
        z = (s - 1) / math.sqrt(var_s)
    elif s < 0:
        z = (s + 1) / math.sqrt(var_s)
    else:
        z = 0.0
    p_value = 2.0 * (1.0 - stats.norm.cdf(abs(z)))
    if p_value <= 0.05:
        direction = "increasing" if s > 0 else "decreasing"
    else:
        direction = "no_trend"
    return float(z), float(p_value), direction

def compute_all_basin_trends(annual_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    valid_records = [r for r in annual_records if r.get("valid_year")]
    by_basin = {}
    for r in valid_records:
        b = r["basin_id"]
        if b not in by_basin:
            by_basin[b] = []
        by_basin[b].append(r)

    trend_items = []
    for b_id in ["ramis", "coata", "ilave", "huancane"]:
        recs = by_basin.get(b_id, [])
        recs.sort(key=lambda x: x["year"])
        years = [r["year"] for r in recs]
        vals = [float(r["annual_precip_mm"]) for r in recs]
        if len(years) >= 3:
            slope = compute_theil_sen_slope(years, vals)
            _, p_val, direction = compute_mann_kendall(vals)
            trend_items.append({
                "basin_id": b_id,
                "start_year": int(min(years)),
                "end_year": int(max(years)),
                "n_years": int(len(years)),
                "sen_slope_mm_per_year": round(float(slope), 2),
                "mann_kendall_p": round(float(p_val), 4),
                "trend_direction": direction,
                "data_quality": "complete" if len(years) >= 20 else "partial",
                "method_version": "1.0.0"
            })
    return trend_items
