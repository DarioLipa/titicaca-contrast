import hashlib
from pathlib import Path
from typing import Dict

def compute_file_sha256(file_path: Path) -> str:
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def generate_integrity_manifest(files_dir: Path) -> Dict[str, str]:
    integrity = {}
    for p in files_dir.iterdir():
        if p.is_file() and p.name != "manifest.json":
            integrity[p.name] = compute_file_sha256(p)
    return integrity
