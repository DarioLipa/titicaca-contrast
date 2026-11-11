# Arquitectura de TITICACA CONTRAST

## 1. Principio fundamental

La plataforma opera bajo el principio de desacoplamiento total entre el cálculo geoespacial/estadístico pesado y la visualización pública:
- El procesamiento científico se ejecuta de manera local y reproducible mediante el paquete Python `pipeline`.
- Los resultados validados se exportan como artefactos estáticos (`CSV`, `JSON`, `GeoJSON`, `manifest.json`) en `web/public/data/`.
- El frontend web es una Single Page Application (SPA) estática construida con React, TypeScript y Vite.
- El despliegue no requiere servidor backend activo, bases de datos externas ni credenciales en tiempo de ejecución.

## 2. Flujo de datos

```text
[NASA Earthdata IMERG V07]  +  [ANA GeoIDEP Unidades Hidrográficas]
                  │
                  ▼
         pipeline/ (Python)
         - Validación geométrica
         - Agregación espacial ponderada por área
         - Series temporales mensuales y anuales
         - Detección de contrastes y pruebas estadísticas
                  │
                  ▼
         web/public/data/
         - manifest.json
         - basins.geojson
         - basins.json
         - precipitation-monthly.csv
         - precipitation-annual.json
         - trends.json
         - contrasts.json
         - evidence.json
                  │
                  ▼
         web/ (React + TypeScript)
         - Validación de esquemas (Zod)
         - Renderizado reactivo (Leaflet + Apache ECharts)
         - Vistas de exploración, contraste y evidencia
```

## 3. Componentes tecnológicos

| Capa | Herramienta | Función |
|---|---|---|
| Pipeline Python | Python 3.11+, Pandas, GeoPandas, Shapely, SciPy, Statsmodels | Extracción, procesamiento y análisis |
| Frontend | React 18/19, TypeScript, Vite | Aplicación web interactiva |
| Cartografía | Leaflet, React-Leaflet | Renderizado de geometrías oficiales en EPSG:4326 |
| Visualización | Apache ECharts | Gráficos interactivos y exportación de imágenes |
| Validación de datos | Zod | Control estricto de contratos en el cliente |
| Pruebas | Vitest (Frontend), Pytest (Pipeline) | Verificación automatizada de calidad |
