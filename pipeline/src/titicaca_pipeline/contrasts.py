from typing import Any, Dict, List, Tuple
import numpy as np
import statsmodels.api as sm

def compute_gap_series(years_a: List[int], values_a: List[float], years_b: List[int], values_b: List[float]) -> Tuple[List[int], List[float]]:
    dict_a = dict(zip(years_a, values_a))
    dict_b = dict(zip(years_b, values_b))
    common_years = sorted(list(set(dict_a.keys()) & set(dict_b.keys())))
    gaps = [dict_a[y] - dict_b[y] for y in common_years]
    return common_years, gaps

def fit_hac_gap_trend(years: List[int], gaps: List[float], max_lags: int = 2) -> Dict[str, Any]:
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
    resid = np.array(results.resid)
    autocorr = float(np.corrcoef(resid[:-1], resid[1:])[0, 1]) if len(resid) > 2 else 0.0
    return {
        "slope": slope,
        "p_value": p_value,
        "ci_lower": ci_lower,
        "ci_upper": ci_upper,
        "autocorr_lag1": autocorr
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

def compute_all_contrasts_and_evidence(annual_records: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    valid_records = [r for r in annual_records if r.get("valid_year")]
    by_basin = {}
    for r in valid_records:
        b = r["basin_id"]
        if b not in by_basin:
            by_basin[b] = {}
        by_basin[b][int(r["year"])] = float(r["annual_precip_mm"])

    pairs = [
        ("ramis", "coata", "Ramis", "Coata"),
        ("ramis", "ilave", "Ramis", "Ilave"),
        ("ramis", "huancane", "Ramis", "Huancané"),
        ("coata", "ilave", "Coata", "Ilave"),
        ("coata", "huancane", "Coata", "Huancané"),
        ("ilave", "huancane", "Ilave", "Huancané")
    ]

    pair_data = []
    p_values = []

    for b_a, b_b, name_a, name_b in pairs:
        dict_a = by_basin.get(b_a, {})
        dict_b = by_basin.get(b_b, {})
        common_years = sorted(list(set(dict_a.keys()) & set(dict_b.keys())))
        gaps = [dict_a[y] - dict_b[y] for y in common_years]
        mean_a = float(np.mean([dict_a[y] for y in common_years])) if common_years else 0.0
        mean_b = float(np.mean([dict_b[y] for y in common_years])) if common_years else 0.0
        mean_gap = float(np.mean(gaps)) if gaps else 0.0

        if len(common_years) >= 5:
            res_primary = fit_hac_gap_trend(common_years, gaps, max_lags=2)
            sens_lags = {}
            for lag in [1, 2, 3]:
                r_lag = fit_hac_gap_trend(common_years, gaps, max_lags=lag)
                sens_lags[str(lag)] = {
                    "slope": round(float(r_lag["slope"]), 2),
                    "ci95": [round(float(r_lag["ci_lower"]), 2), round(float(r_lag["ci_upper"]), 2)],
                    "p_value": round(float(r_lag["p_value"]), 4)
                }
            p_values.append(res_primary["p_value"])
        else:
            res_primary = {"slope": 0.0, "p_value": 1.0, "ci_lower": 0.0, "ci_upper": 0.0, "autocorr_lag1": 0.0}
            sens_lags = {}
            p_values.append(1.0)

        pair_data.append({
            "basin_a": b_a,
            "basin_b": b_b,
            "name_a": name_a,
            "name_b": name_b,
            "years": common_years,
            "mean_a": mean_a,
            "mean_b": mean_b,
            "mean_gap": mean_gap,
            "primary": res_primary,
            "sensitivity": sens_lags
        })

    q_values = benjamini_hochberg(p_values)

    contrasts_items = []
    evidence_items = []

    for item, q_val in zip(pair_data, q_values):
        b_a = item["basin_a"]
        b_b = item["basin_b"]
        yrs = item["years"]
        n_paired = len(yrs)
        prim = item["primary"]
        slope = round(float(prim["slope"]), 2)
        ci_lower = round(float(prim["ci_lower"]), 2)
        ci_upper = round(float(prim["ci_upper"]), 2)
        p_val = round(float(prim["p_value"]), 4)
        q_round = round(float(q_val), 4)

        if n_paired < 20:
            status = "insufficient_data"
            interpretation = "Muestra insuficiente de años emparejados (se requieren al menos 20 años coincidentes)."
        elif (ci_lower > 0 or ci_upper < 0) and q_round <= 0.05:
            status = "supported"
            if slope > 0:
                interpretation = f"Contraste respaldado: la brecha de precipitacion entre {item['name_a']} y {item['name_b']} se incrementa significativamente a una tasa de {slope:+.2f} mm/año (FDR q={q_round:.4f})."
            else:
                interpretation = f"Contraste respaldado: la brecha de precipitacion entre {item['name_a']} y {item['name_b']} se reduce significativamente a una tasa de {slope:+.2f} mm/año (FDR q={q_round:.4f})."
        elif p_val <= 0.05 and q_round > 0.05:
            status = "inconclusive"
            interpretation = f"Contraste observado no concluyente: se observa una variacion de brecha de {slope:+.2f} mm/año con significancia marginal univariada (p={p_val:.4f}), pero no supera el control de descubrimientos falsos (FDR q={q_round:.4f})."
        else:
            status = "no_change"
            interpretation = f"Sin cambio detectable en la brecha temporal entre {item['name_a']} y {item['name_b']} (pendiente {slope:+.2f} mm/año, p={p_val:.4f}, q={q_round:.4f}). Las trayectorias no divergen significativamente."

        contrasts_items.append({
            "basin_a": b_a,
            "basin_b": b_b,
            "start_year": int(min(yrs)) if yrs else 0,
            "end_year": int(max(yrs)) if yrs else 0,
            "n_paired_years": int(n_paired),
            "gap_slope_mm_per_year": slope,
            "gap_slope_ci95": [ci_lower, ci_upper],
            "p_value": p_val,
            "q_value_fdr": q_round,
            "evidence_status": status,
            "method_version": "1.0.0"
        })

        evidence_items.append({
            "basin_a": b_a,
            "basin_b": b_b,
            "basin_a_name": item["name_a"],
            "basin_b_name": item["name_b"],
            "start_year": int(min(yrs)) if yrs else 0,
            "end_year": int(max(yrs)) if yrs else 0,
            "n_paired_years": int(n_paired),
            "mean_basin_a_mm": round(item["mean_a"], 2),
            "mean_basin_b_mm": round(item["mean_b"], 2),
            "mean_gap_mm": round(item["mean_gap"], 2),
            "gap_slope_mm_per_year": slope,
            "gap_slope_ci95": [ci_lower, ci_upper],
            "p_value": p_val,
            "q_value_fdr": q_round,
            "evidence_status": status,
            "sensitivity_lags": item["sensitivity"],
            "autocorrelation_lag1": round(float(prim.get("autocorr_lag1", 0.0)), 4),
            "interpretation": interpretation,
            "method_version": "1.0.0",
            "dataset_version": "07",
            "dataset_doi": "10.5067/GPM/IMERG/3B-MONTH/07"
        })

    return contrasts_items, evidence_items
