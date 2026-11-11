import pytest
from titicaca_pipeline.validation import validate_manifest_dict

def test_manifest_validation_success():
    sample_manifest = {
        "schema_version": "1.0",
        "generated_at_utc": "2026-11-10T12:00:00Z",
        "data_status": "unavailable",
        "dataset_id": "GPM_3IMERGM",
        "dataset_doi": "10.5067/GPM/IMERG/3B-MONTH/07",
        "dataset_version": "07",
        "dataset_processing_level": "L3",
        "dataset_run": "Final",
        "start_month": "2001-01",
        "end_month": "2025-12",
        "source_downloaded_at_utc": None,
        "boundary_source": "ANA GeoIDEP Unidades Hidrograficas",
        "boundary_downloaded_at_utc": None,
        "boundary_hash_sha256": None,
        "processing_version": "1.0.0",
        "method_version": "1.0.0",
        "notes": "Fase inicial de preparacion",
        "integrity": {}
    }
    assert validate_manifest_dict(sample_manifest) is True

def test_manifest_validation_rejects_missing_field():
    invalid_manifest = {
        "schema_version": "1.0",
        "data_status": "unavailable"
    }
    with pytest.raises(Exception):
        validate_manifest_dict(invalid_manifest)
