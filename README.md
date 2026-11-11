# TITICACA CONTRAST

## Un mismo lago, diferentes realidades climáticas

Plataforma web de acceso público para explorar y contrastar cambios históricos de precipitación entre cuatro cuencas tributarias del lago Titicaca (Ramis, Coata, Ilave y Huancané), en Puno, Perú. Utiliza datos oficiales y gratuitos de NASA GPM-IMERG V07 y cartografía de la Autoridad Nacional del Agua (ANA).

### Estructura del repositorio

- `docs/`: Documentación técnica, metodológica, diccionario de datos y registros de decisiones.
- `pipeline/`: Procesamiento geoespacial y estadístico reproducible en Python.
- `web/`: Aplicación frontend estática en React, TypeScript, Vite, Leaflet y Apache ECharts.
- `scripts/`: Scripts PowerShell y Bash para verificación global de calidad.

### Requisitos

- Windows 10/11 con PowerShell 7 o Windows PowerShell 5.1
- Node.js LTS (v20+) y npm
- Python 3.11+
- Git

### Instrucciones rápidas (Windows)

#### Frontend
```powershell
cd web
npm install
npm run dev
```

#### Pipeline de datos
```powershell
cd pipeline
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e .
python -m pytest
```

### Licencia

Código publicado bajo licencia MIT. Los conjuntos de datos satelitales y cartográficos conservan sus respectivas licencias y términos oficiales (NASA Earthdata y Autoridad Nacional del Agua del Perú).

