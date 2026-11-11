# Registro de Verificaciones del Sistema

Este documento certifica el cumplimiento de la matriz de pruebas y criterios de aceptación definidos en el Plan Maestro (Sección 11).

## Matriz de pruebas y criterios de aceptación

| ID | Tipo | Comprobación | Criterio de aceptación | Resultado | Estado |
|---|---|---|---|---|---|
| **T01** | Datos | Cuatro identificadores únicos y códigos ANA confirmados | 4 cuencas oficiales identificadas sin ambigüedad | Ramis (0179+018+019), Coata (0176), Ilave (016), Huancané (0178) | **Aprobado** |
| **T02** | Datos | CRS, polígonos válidos, área > 0 | Geometrías continuas sin solapamiento topológico (intersección = 0.0) | Validado con `test_boundaries.py` y `test_exported_basins_geojson_topology_and_crs` | **Aprobado** |
| **T03** | Datos | Conversión horaria mensual exacta | Factor exacto `rate * 24 * días` (ej. Feb bisiesto = 29 días) | Validado con `test_units.py` | **Aprobado** |
| **T04** | Datos | Ausencias y valores de relleno NASA | Valores missing nunca se imputan como 0.0 mm | Validado con `test_missing_value_handling_never_zero` | **Aprobado** |
| **T05** | Datos | Duplicados por cuenca y mes | Rechazo y reporte de error | Validado en `test_timeseries.py` | **Aprobado** |
| **T06** | Datos | Píxeles parciales | Media ponderada exactamente por área de intersección | Validado con `test_weighted_mean_small_raster` | **Aprobado** |
| **T07** | Datos | Mes incompleto (< 95% área) | Marcado como inválido | Validado con `test_incomplete_month_rejected` | **Aprobado** |
| **T08** | Datos | Año incompleto (< 12 meses) | Excluido del total anual válido (ej. 2025) | Validado con `test_exported_annual_json_flags` | **Aprobado** |
| **T09** | Estadística | Serie monótona creciente conocida | Tendencia positiva calculada (Theil-Sen > 0, Mann-Kendall p < 0.05) | Validado con `test_strictly_increasing_series` | **Aprobado** |
| **T10** | Estadística | Serie plana conocida | Pendiente nula sin tendencia artificial | Validado con `test_flat_series` | **Aprobado** |
| **T11** | Estadística | Parejas con igual pendiente temporal | Brecha constante sin pendiente espuria | Validado con `test_equal_slope_gap_trend` | **Aprobado** |
| **T12** | Estadística | Brecha creciente sintética | Pendiente HAC positiva y estadísticamente significativa | Validado con `test_strictly_increasing_gap_trend` | **Aprobado** |
| **T13** | Estadística | Corrección de multiplicidad FDR | Valores q reproducibles según Benjamini-Hochberg (m = 6) | Validado con `test_benjamini_hochberg_correction` | **Aprobado** |
| **T14** | Estadística | Series con años no coincidentes | Emparejamiento temporal estricto en intersección de años | Validado con `test_compute_gap_series_pairing` | **Aprobado** |
| **T15** | UI | Comparador de cuencas | Selección de Ramis y Coata, alerta ante cuencas idénticas | Validado con `selectors.test.tsx` y `evidence.test.tsx` | **Aprobado** |

---

## Verificación de seguridad y privacidad

- [x] Cero credenciales, tokens de NASA Earthdata o contraseñas en el código fuente, artefactos estáticos o historial de commits.
- [x] Reglas en `.gitignore` previenen la inclusión accidental de variables de entorno (`.env`, `*.env`).
- [x] El frontend estático compilado en `web/dist/` funciona de manera autónoma sin conexiones activas a APIs externas de NASA ni servidores backend.

---

## Verificación de compilación y pruebas globales

- **Pruebas de Pipeline Python:** 32 pruebas unitarias e integrales pasadas (100%).
- **Pruebas de Frontend TypeScript:** 16 pruebas unitarias pasadas con Vitest (100%).
- **Compilación de Producción:** Vite genera `web/dist/` con código modularizado (`manualChunks` para Leaflet, ECharts y React).
