import os
from pathlib import Path
from typing import Dict, Optional, Tuple
import requests
from dotenv import load_dotenv

class MissingCredentialsError(Exception):
    pass

class DownloadError(Exception):
    pass

def load_local_env() -> None:
    project_env = Path(".env")
    if project_env.exists():
        load_dotenv(project_env)
    else:
        load_dotenv()

def get_earthdata_credentials() -> Dict[str, Optional[str]]:
    load_local_env()
    token = os.environ.get("EARTHDATA_TOKEN")
    user = os.environ.get("EARTHDATA_USERNAME")
    pwd = os.environ.get("EARTHDATA_PASSWORD")
    if token:
        return {"type": "token", "token": token}
    if user and pwd:
        return {"type": "basic", "username": user, "password": pwd}
    raise MissingCredentialsError("No se encontraron credenciales de NASA Earthdata en .env ni en variables de entorno")

def get_granule_filename(year: int, month: int) -> str:
    m = f"{month:02d}"
    return f"3B-MO.MS.MRG.3IMERG.{year}{m}01-S000000-E235959.{m}.V07B.HDF5"

def build_ges_disc_url(year: int, month: int) -> str:
    filename = get_granule_filename(year, month)
    return f"https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGM.07/{year}/{filename}"

def download_granule(
    year: int,
    month: int,
    cache_dir: Path,
    timeout: int = 30
) -> Path:
    cache_dir.mkdir(parents=True, exist_ok=True)
    filename = get_granule_filename(year, month)
    dest_path = cache_dir / filename
    if dest_path.exists() and dest_path.stat().st_size > 100000:
        return dest_path

    creds = get_earthdata_credentials()
    url = build_ges_disc_url(year, month)

    session = requests.Session()
    session.headers.update({"User-Agent": "TiticacaContrast/1.0"})

    if creds["type"] == "token":
        session.headers.update({"Authorization": f"Bearer {creds['token']}"})
    else:
        session.auth = (creds["username"], creds["password"])

    response = session.get(url, stream=True, timeout=timeout)
    if response.status_code == 401 or response.status_code == 403:
        raise DownloadError(f"Error de autenticacion HTTP {response.status_code} en Earthdata para el archivo {filename}")
    if response.status_code != 200:
        raise DownloadError(f"Fallo en descarga de {filename} con codigo HTTP {response.status_code}")

    temp_path = dest_path.with_suffix(".tmp")
    with open(temp_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=65536):
            if chunk:
                f.write(chunk)
    temp_path.replace(dest_path)
    return dest_path
