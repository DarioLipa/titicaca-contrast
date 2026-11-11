from typing import Any, Dict, List
import jsonschema

MANIFEST_SCHEMA = {
    "type": "object",
    "required": [
        "schema_version",
        "generated_at_utc",
        "data_status",
        "dataset_id",
        "dataset_doi",
        "dataset_version",
        "dataset_processing_level",
        "dataset_run",
        "start_month",
        "end_month",
        "boundary_source",
        "processing_version",
        "method_version",
        "notes",
        "integrity"
    ],
    "properties": {
        "schema_version": {"type": "string"},
        "generated_at_utc": {"type": "string"},
        "data_status": {"type": "string", "enum": ["ready", "partial", "unavailable"]},
        "dataset_id": {"type": "string"},
        "dataset_doi": {"type": "string"},
        "dataset_version": {"type": "string"},
        "dataset_processing_level": {"type": "string"},
        "dataset_run": {"type": "string"},
        "start_month": {"type": "string"},
        "end_month": {"type": "string"},
        "source_downloaded_at_utc": {"type": ["string", "null"]},
        "boundary_source": {"type": "string"},
        "boundary_downloaded_at_utc": {"type": ["string", "null"]},
        "boundary_hash_sha256": {"type": ["string", "null"]},
        "processing_version": {"type": "string"},
        "method_version": {"type": "string"},
        "notes": {"type": "string"},
        "integrity": {"type": "object"}
    }
}

def validate_manifest_dict(data: Dict[str, Any]) -> bool:
    jsonschema.validate(instance=data, schema=MANIFEST_SCHEMA)
    return True

