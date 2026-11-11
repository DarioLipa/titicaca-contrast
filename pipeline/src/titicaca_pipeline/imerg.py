import calendar

def get_days_in_month(year: int, month: int) -> int:
    if month < 1 or month > 12:
        raise ValueError(f"Mes invalido: {month}")
    return calendar.monthrange(year, month)[1]

def calculate_monthly_precipitation_mm(rate_mm_per_h: float, year: int, month: int) -> float:
    if rate_mm_per_h < 0:
        raise ValueError("La tasa de precipitacion no puede ser negativa")
    days = get_days_in_month(year, month)
    hours = days * 24
    return rate_mm_per_h * hours
