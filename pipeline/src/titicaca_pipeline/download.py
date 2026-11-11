import os
from pathlib import Path
from typing import Dict, Optional, Tuple
import requests
from dotenv import load_dotenv

class MissingCredentialsError(Exception):
    pass

class DownloadError(Exception):
    pass

class EarthdataSession(requests.Session):
    def rebuild_auth(self, prepared_request, response):
        headers = prepared_request.headers
        url = prepared_request.url
        if "Authorization" in headers:
            redirect_parsed = requests.utils.urlparse(url)
            if redirect_parsed.hostname and ("earthdata.nasa.gov" in redirect_parsed.hostname or "gesdisc" in redirect_parsed.hostname or "cloudfront" in redirect_parsed.hostname):
                return
            del headers["Authorization"]
        return

def load_local_env() -> None:
    project_env = Path(".env")
    if project_env.exists():
        load_dotenv(project_env)
    home_env = Path.home() / ".env"
    if home_env.exists():
        load_dotenv(home_env)
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

def get_subset_filename(year: int, month: int) -> str:
    m = f"{month:02d}"
    return f"3B-MO.MS.MRG.3IMERG.{year}{m}01-S000000-E235959.{m}.V07B.subset.nc4"

def build_ges_disc_url(year: int, month: int) -> str:
    filename = get_granule_filename(year, month)
    return f"https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGM.07/{year}/{filename}"

def build_opendap_subset_url(year: int, month: int) -> str:
    fn = get_granule_filename(year, month)
    return f"https://opendap.earthdata.nasa.gov/collections/C2723754851-GES_DISC/granules/GPM_3IMERGM.07%3A{fn}.nc4?precipitation[0:0][1085:1110][725:762]"

def download_granule_subset(
    year: int,
    month: int,
    cache_dir: Path,
    session: Optional[requests.Session] = None,
    timeout: int = 30
) -> Path:
    cache_dir.mkdir(parents=True, exist_ok=True)
    filename = get_subset_filename(year, month)
    dest_path = cache_dir / filename
    if dest_path.exists() and dest_path.stat().st_size > 5000:
        return dest_path

    if session is None:
        creds = get_earthdata_credentials()
        session = EarthdataSession()
        session.headers.update({"User-Agent": "TiticacaContrast/1.0"})
        if creds["type"] == "token":
            session.headers.update({"Authorization": f"Bearer {creds['token']}"})
        else:
            session.auth = (creds["username"], creds["password"])

    url = build_opendap_subset_url(year, month)
    response = session.get(url, stream=True, timeout=timeout)
    if response.status_code == 401 or response.status_code == 403:
        raise DownloadError(f"Error de autenticacion HTTP {response.status_code} en Earthdata para {filename}")
    if response.status_code != 200:
        raise DownloadError(f"Fallo en descarga de {filename} con codigo HTTP {response.status_code}")

    temp_path = dest_path.with_suffix(".tmp")
    with open(temp_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=16384):
            if chunk:
                f.write(chunk)
    temp_path.replace(dest_path)
    return dest_path

def download_granule(
    year: int,
    month: int,
    cache_dir: Path,
    session: Optional[requests.Session] = None,
    timeout: int = 60
) -> Path:
    return download_granule_subset(year, month, cache_dir, session=session, timeout=timeout)
