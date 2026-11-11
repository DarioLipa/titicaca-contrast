import math
from typing import Dict, List, Tuple
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

