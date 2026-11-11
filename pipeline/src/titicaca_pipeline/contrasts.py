from typing import Dict, List, Tuple
import numpy as np
import statsmodels.api as sm

def compute_gap_series(years_a: List[int], values_a: List[float], years_b: List[int], values_b: List[float]) -> Tuple[List[int], List[float]]:
    dict_a = dict(zip(years_a, values_a))
    dict_b = dict(zip(years_b, values_b))
    common_years = sorted(list(set(dict_a.keys()) & set(dict_b.keys())))
    gaps = [dict_a[y] - dict_b[y] for y in common_years]
    return common_years, gaps

def fit_hac_gap_trend(years: List[int], gaps: List[float], max_lags: int = 2) -> Dict[str, float]:
    if len(years) < 5:
        raise ValueError("Numero insuficiente de anos emparejados")
    x = np.array(years, dtype=float)
    y = np.array(gaps, dtype=float)
    x_matrix = sm.add_constant(x)
    model = sm.OLS(y, x_matrix)
    results = model.fit(cov_type="HAC", cov_kwds={"maxlags": max_lags})
    slope = float(results.params[1])
    p_value = float(results.pvalues[1])
    conf = results.conf_int(alpha=0.05)[1]
    ci_lower = float(conf[0])
    ci_upper = float(conf[1])
    return {
        "slope": slope,
        "p_value": p_value,
        "ci_lower": ci_lower,
        "ci_upper": ci_upper
    }

def benjamini_hochberg(p_values: List[float]) -> List[float]:
    m = len(p_values)
    if m == 0:
        return []
    sorted_indices = sorted(range(m), key=lambda i: p_values[i])
    sorted_p = [p_values[i] for i in sorted_indices]
    q_values_sorted = [0.0] * m
    accum_min = 1.0
    for rank_minus_one in range(m - 1, -1, -1):
        rank = rank_minus_one + 1
        q = (sorted_p[rank_minus_one] * m) / rank
        accum_min = min(accum_min, q)
        q_values_sorted[rank_minus_one] = min(1.0, accum_min)
    original_order_q = [0.0] * m
    for orig_idx, q_val in zip(sorted_indices, q_values_sorted):
        original_order_q[orig_idx] = q_val
    return original_order_q

