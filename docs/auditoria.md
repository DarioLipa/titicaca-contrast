# Registro de Auditoría de Calidad

## Fase 0 — Preparación del repositorio

- **Fecha:** Noviembre 2026
- **Responsable:** Antigravity / Pair Programming
- **Estado general:** Completada y aprobada

### Lista de verificaciones técnicas
- [x] Repositorio Git inicializado
- [x] Reglas `.gitignore` y `.editorconfig` aplicadas
- [x] Ausencia de credenciales y tokens en el árbol de archivos
- [x] Compilación frontend `npm run build` sin errores
- [x] Verificación de tipos `npm run typecheck`
- [x] Ejecución de linter `npm run lint`
- [x] Ejecución de pruebas frontend `npm run test` (11 pruebas pasadas)
- [x] Estructura de paquete Python configurada
- [x] Pruebas unitarias de entorno Python ejecutadas (22 pruebas pasadas)
- [x] Verificación de ausencia de comentarios en código fuente
- [x] Ejecución integral mediante `scripts/check-project.ps1` exitosa

---

## Fase 1 — Cartografía ANA

- **Fecha:** Noviembre 2026
- **Fuente oficial:** Repositorio SNIRH de la Autoridad Nacional del Agua (ANA)
- **Archivo descargado:** `UnidadesHidrograficas.zip` (14,825,613 bytes)
- **SHA-256 fuente:** `2d5dd3dc4b82f2f0a7e54d99390ab5d39d28787172647cfa911e7e9df623493d`
- **Estado general:** Completada y aprobada

### Verificaciones espaciales y de integridad
- [x] Descarga de shapefile oficial realizada desde servidor ANA
- [x] Inspección rigurosa de atributos y jerarquía Pfafstetter
- [x] Identificación de las 4 cuencas sin ambigüedad:
  - Ramis: Unión de 0179 (Intercuenca Ramis) + 018 (Pucará) + 019 (Azángaro) -> 15,870.42 km²
  - Coata: Código 0176 -> 4,882.42 km²
  - Ilave: Código 016 -> 7,791.00 km²
  - Huancané: Código 0178 -> 3,611.92 km²
- [x] Polígonos de análisis exactos preservados en `pipeline/data/interim/basins_exact.geojson`
- [x] Simplificación topológica con límites compartidos intactos (0.002° de tolerancia, 87 KB)
- [x] Comprobación de solapamiento nulo entre pares (área de intersección = 0.0)
- [x] Generación de `web/public/data/basins.geojson` y `web/public/data/basins.json`
- [x] Integración en `web/public/data/manifest.json` con hashes criptográficos

---

## Fase 2 — NASA IMERG V07 Final

- **Fecha:** Noviembre 2026
- **Fuente oficial:** NASA GES DISC / GPM IMERG Final Precipitation L3 1 month 0.1 degree V07 (`GPM_3IMERGM_07`)
- **DOI:** 10.5067/GPM/IMERG/3B-MONTH/07
- **Estado general:** Completada y aprobada

### Verificaciones científicas y de completitud
- [x] Descarga autenticada privada conectada mediante sesión segura Earthdata
- [x] Subconjunto espacial exacto vía OPeNDAP para el rectángulo envolvente de las cuencas
- [x] Validación piloto (2020-01) con comprobación manual independiente de 62 celdas en Coata (< 0.01 mm de diferencia)
- [x] Serie histórica descargada: 297 meses disponibles oficialmente en NASA (2001-01 a 2025-09)
- [x] Meses 2025-10, 2025-11 y 2025-12 ausentes en catálogo por latencia oficial del producto Final; registrados honestamente como valores nulos sin interpolaciones falsas
- [x] Generación de `precipitation-monthly.csv` (1,200 filas exactas: 4 cuencas x 300 meses)
- [x] Generación de `precipitation-annual.json` (100 registros: 24 años completos 2001-2024 con 12 meses; 2025 marcado como no válido para tendencias)
- [x] Hashes SHA-256 calculados e integrados en `manifest.json` (`data_status: "ready"`)
- [x] Pruebas unitarias de pipeline ampliadas a 27 tests (100% pasados)
- [x] Pruebas de frontend Vitest (11 tests pasados) y compilación limpia `npm run build`

---

## Fase 3 — Motor Estadístico e Inferencial

- **Fecha:** Noviembre 2026
- **Responsable:** Antigravity / Pair Programming
- **Estado general:** Completada y aprobada

### Métodos implementados y verificaciones
- [x] Estimador de pendientes no paramétrico Theil-Sen para series univariadas de precipitación anual
- [x] Prueba no paramétrica de Mann-Kendall con corrección de empates para detección de tendencias
- [x] Modelado de contrastes emparejados mediante series de brechas: $D(t) = P_A(t) - P_B(t)$
- [x] Estimación de varianza robusta a heterocedasticidad y autocorrelación temporal (HAC / Newey-West) con ventana de rezago primaria $L=2$
- [x] Evaluación de sensibilidad a rezagos alternativos ($L=1, 2, 3$) registrada para cada par
- [x] Cálculo de autocorrelación serial de orden 1 (lag-1) en los residuales de cada contraste
- [x] Control estricto de multiplicidad mediante el procedimiento de Benjamini-Hochberg (FDR, $m=6$, $q \le 0.05$)
- [x] Clasificación honesta según matriz de evidencia (Sección 8.4 del Plan Maestro):
  - Coata vs Ilave: $p=0.0443$ pero $q=0.2659 > 0.05$ -> clasificado estrictamente como `inconclusive`
  - 5 parejas restantes: $p > 0.05$ -> clasificadas como `no_change`
  - Cero resultados forzados ni conclusiones artificiales
- [x] Generación de productos estáticos validados:
  - `web/public/data/trends.json` (4 cuencas oficiales, 2001-2024)
  - `web/public/data/contrasts.json` (6 pares de cuencas, 2001-2024)
  - `web/public/data/evidence.json` (6 fichas de evidencia reproducibles completas)
- [x] Esquemas de validación Zod actualizados en `web/src/app/schemas.ts`
- [x] Pruebas estadísticas y de integridad ampliadas a 32 tests (100% pasados: T09, T10, T11, T12, T13, T14)

