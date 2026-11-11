import json
from pathlib import Path
from typing import Any, Dict, List

def load_basins_config(config_path: Path) -> List[Dict[str, Any]]:
    import yaml
    with open(config_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("basins", [])

def validate_basin_ids(basin_ids: List[str]) -> bool:
    expected = {"ramis", "coata", "ilave", "huancane"}
    return set(basin_ids) == expected
