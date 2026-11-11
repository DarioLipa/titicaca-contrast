import csv
import json
from pathlib import Path
from typing import Any, Dict, List

def export_json(data: Any, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def export_monthly_csv(records: List[Dict[str, Any]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "basin_id",
        "year",
        "month",
        "precip_mm",
        "valid_area_fraction",
        "source_dataset",
        "source_version"
    ]
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in records:
            writer.writerow({
                "basin_id": r["basin_id"],
                "year": r["year"],
                "month": r["month"],
                "precip_mm": f"{r['precip_mm']:.2f}" if r["precip_mm"] is not None else "",
                "valid_area_fraction": f"{r['valid_area_fraction']:.4f}",
                "source_dataset": r.get("source_dataset", "GPM_3IMERGM"),
                "source_version": r.get("source_version", "07")
            })

def export_annual_json(records: List[Dict[str, Any]], output_path: Path) -> None:
    export_json(records, output_path)
