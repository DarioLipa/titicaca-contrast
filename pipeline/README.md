# Pipeline de TITICACA CONTRAST

Módulo de procesamiento científico en Python para la extracción, validación y análisis estadístico de precipitación satelital NASA IMERG V07 y cuencas hidrográficas ANA.

## Instalación

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

## Ejecución de pruebas

```powershell
python -m pytest -q
```

## Comandos CLI planificados

- `python -m titicaca_pipeline.cli validate-boundaries`: Valida y simplifica el shapefile oficial de cuencas ANA.
- `python -m titicaca_pipeline.cli download-imerg`: Descarga o gestiona la caché de archivos NetCDF4/HDF5 IMERG.
- `python -m titicaca_pipeline.cli extract`: Realiza la intersección espacial cuenca-píxel y calcula láminas mensuales.
- `python -m titicaca_pipeline.cli analyze`: Estima tendencias Theil-Sen, Mann-Kendall y el detector de contrastes emparejados.
- `python -m titicaca_pipeline.cli export`: Genera los artefactos JSON, CSV y GeoJSON hacia `web/public/data/`.
- `python -m titicaca_pipeline.cli verify`: Ejecuta validaciones de integridad y consistencia en los datos producidos.
