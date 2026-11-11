from typing import List, Tuple

def compute_weighted_average(pixel_values: List[float], intersection_areas: List[float]) -> float:
    if len(pixel_values) != len(intersection_areas):
        raise ValueError("Longitudes dispares entre valores y areas")
    if not pixel_values:
        raise ValueError("Coleccion de datos vacia")
    total_area = sum(intersection_areas)
    if total_area <= 0:
        raise ValueError("El area total debe ser estrictamente positiva")
    weighted_sum = sum(p * a for p, a in zip(pixel_values, intersection_areas))
    return weighted_sum / total_area

def is_valid_coverage(valid_area_fraction: float, threshold: float = 0.95) -> bool:
    return valid_area_fraction >= threshold

