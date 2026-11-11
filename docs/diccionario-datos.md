# Diccionario de Datos

## 1. Archivo `precipitation-monthly.csv`

| Campo | Tipo | Descripción | Restricciones / Formato |
|---|---|---|---|
| `basin_id` | Cadena | Identificador interno de cuenca | `ramis`, `coata`, `ilave`, `huancane` |
| `year` | Entero | Año calendario | 2001 a 2025 |
| `month` | Entero | Mes calendario | 1 a 12 |
| `precip_mm` | Decimal | Lámina de precipitación media mensual (mm) | $\ge 0$, o vacío si ausente |
| `valid_area_fraction` | Decimal | Fracción de superficie con datos válidos | $0.00$ a $1.00$ |
| `source_dataset` | Cadena | Nombre oficial del dataset satelital | `GPM_3IMERGM` |
| `source_version` | Cadena | Versión de procesamiento | `07` |

## 2. Archivo `precipitation-annual.json`

Estructura de arreglo de objetos:
- `year`: Entero (año)
- `basin_id`: Cadena (`ramis`, `coata`, `ilave`, `huancane`)
- `annual_precip_mm`: Decimal (suma en mm) o `null` si incompleto
- `complete_months`: Entero (0 a 12)
- `valid_year`: Booleano (`true` si `complete_months === 12`)
- `source_version`: Cadena

## 3. Archivo `trends.json`

Arreglo de resultados de tendencia individual por cuenca:
- `basin_id`: Cadena
- `start_year`: Entero
- `end_year`: Entero
- `n_years`: Entero
- `sen_slope_mm_per_year`: Decimal
- `mann_kendall_p`: Decimal
- `trend_direction`: Cadena (`increasing`, `decreasing`, `no_trend`)
- `data_quality`: Cadena (`complete`, `partial`)
- `method_version`: Cadena

## 4. Archivo `contrasts.json`

Arreglo de resultados del detector de contrastes emparejados (6 pares):
- `basin_a`: Cadena
- `basin_b`: Cadena
- `start_year`: Entero
- `end_year`: Entero
- `n_paired_years`: Entero
- `gap_slope_mm_per_year`: Decimal
- `gap_slope_ci95`: Arreglo de 2 decimales `[limite_inferior, limite_superior]`
- `p_value`: Decimal
- `q_value_fdr`: Decimal
- `evidence_status`: Cadena (`supported`, `inconclusive`, `no_change`, `insufficient_data`)
- `method_version`: Cadena

## 5. Archivo `manifest.json`

Objeto de metadatos de integridad y trazabilidad:
- `schema_version`: Cadena
- `generated_at_utc`: Cadena ISO 8601
- `data_status`: Cadena (`ready`, `partial`, `unavailable`)
- `dataset_id`: Cadena
- `dataset_doi`: Cadena
- `dataset_version`: Cadena
- `dataset_processing_level`: Cadena
- `dataset_run`: Cadena
- `start_month`: Cadena (`YYYY-MM`)
- `end_month`: Cadena (`YYYY-MM`)
- `source_downloaded_at_utc`: Cadena ISO 8601 o `null`
- `boundary_source`: Cadena
- `boundary_downloaded_at_utc`: Cadena ISO 8601 o `null`
- `boundary_hash_sha256`: Cadena o `null`
- `processing_version`: Cadena
- `method_version`: Cadena
- `notes`: Cadena
- `integrity`: Objeto con hashes SHA-256 de los archivos derivados
