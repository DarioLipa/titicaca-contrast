from pathlib import Path
from typing import Optional

def check_cache(cache_dir: Path, filename: str) -> bool:
    target = cache_dir / filename
    return target.exists() and target.stat().st_size > 0

def get_granule_name(year: int, month: int) -> str:
    month_str = f"{month:02d}"
    return f"3B-MO.MS.MRG.3IMERG.{year}{month_str}01-S000000-E235959.{month_str}.V07B.HDF5"

