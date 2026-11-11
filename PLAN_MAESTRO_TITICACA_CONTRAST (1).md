# TITICACA CONTRAST
## Plan maestro de arquitectura, desarrollo, validación científica y despliegue

**Versión del documento:** 1.0  
**Fecha de planificación:** 8 de noviembre de 2026  
**Tipo:** plataforma web pública de análisis geoespacial y estadístico  
**Zona de estudio:** cuencas Ramis, Coata, Ilave y Huancané, Puno, Perú  
**Variable principal:** precipitación mensual y anual estimada por NASA GPM-IMERG V07  
**Horizonte histórico inicial:** enero de 2001 a diciembre de 2025, condicionado a disponibilidad y completitud comprobadas  
**Política económica:** cero licencias, APIs y suscripciones obligatorias de pago; dominio y hosting contratados opcionalmente

---

# 1. Instrucción principal para Codex o Antigravity

> Desarrolla **TITICACA CONTRAST** siguiendo este documento como especificación contractual. Trabaja por fases y no anticipes funciones futuras. El repositorio debe quedar limpio, profesional, ejecutable en Windows y preparado para hosting estático. Usa exclusivamente bibliotecas, datos y servicios gratuitos con licencias compatibles. No incorpores servicios de pago, API de IA, claves expuestas, cuentas para visitantes, base de datos externa obligatoria ni datos científicos inventados. No presentes números simulados como resultados reales. El código fuente debe tener nombres claros, consistentes y estructura profesional, sin comentarios dentro del código fuente, mensajes de autoría automática, referencias a concursos ni textos ajenos al producto. Mantén las explicaciones necesarias en la documentación técnica y en las vistas metodológicas; no incluyas comentarios en archivos de código. Implementa pruebas en cada fase, ejecuta compilación, lint y pruebas antes de declararla completa. Si falta una descarga o una credencial, explica el bloqueo y conserva el estado «datos no disponibles», sin fabricar un resultado. En cada fase entrega: archivos creados/modificados, comandos utilizados, salida de las verificaciones, limitaciones pendientes y pasos para la siguiente fase.

**Prioridades inalterables, en este orden:** (1) corrección científica y ausencia de datos inventados; (2) funcionalidad real; (3) seguridad y gratuidad; (4) pruebas automatizadas; (5) experiencia de usuario; (6) ampliaciones estéticas.

**Regla para agentes:** leer este documento completo al comenzar y no modificar los requisitos sin documentar la decisión. Si aparece una incompatibilidad técnica, resolverla con la alternativa gratuita menos compleja, conservar el contrato de datos y registrarla en `docs/decisiones.md`.

---

# 2. Problema, alcance y propuesta diferencial

## 2.1. Problema

Las lluvias de las cuencas que alimentan el lago Titicaca no tienen por qué evolucionar de forma idéntica. Un promedio regional puede ocultar diferencias territoriales. Las herramientas de mapas climáticos suelen representar series y tendencias individuales, pero no siempre ofrecen una comparación **emparejada, explicable, reproducible y estadísticamente contrastada** entre cuencas elegidas.

## 2.2. Objetivo general

Desarrollar una plataforma web de acceso público para explorar y contrastar cambios históricos de precipitación entre cuatro cuencas de Puno a partir de datos gratuitos NASA, con resultados estadísticos reproducibles, cartografía oficial y comunicación transparente de la incertidumbre.

## 2.3. Hipótesis de producto, no afirmación empírica

La plataforma permitirá identificar si existen **diferencias en la evolución de la precipitación** entre determinadas parejas de cuencas. No se afirma de antemano que tales diferencias sean estadísticamente significativas. La ausencia de diferencias también es un resultado válido.

## 2.4. Diferenciador central

**Detector de contrastes climáticos:** compara pares de cuencas en años coincidentes, evalúa el cambio en la brecha temporal entre sus precipitaciones, controla comparaciones múltiples y publica una ficha de evidencia con fuente, versión de datos, intervalo de confianza, unidades, período y límites del análisis.

No describir el producto como «el primero del mundo» ni afirmar originalidad absoluta sin una investigación adicional. No usar «inteligencia artificial predictiva» como reclamo, ya que el núcleo es estadística reproducible y análisis geoespacial.

## 2.5. Alcance inicial y exclusiones

**En alcance:** cuatro cuencas verificadas en la cartografía oficial; NASA IMERG mensual; 2001–2025 si completo; tendencias individuales; análisis emparejado entre seis pares; interfaz responsive; exportación CSV/PNG/impresión a PDF; metodología; fuentes; tests; despliegue estático.

**Fuera del alcance inicial:** pronósticos a 2035, inundaciones en tiempo real, caudales observados, alertas sanitarias, contaminación, predicción con redes neuronales, integración con cuentas de usuario, APIs pagadas, chatbots, modelos 3D costosos, mapas catastrales por vivienda y diagnósticos por distrito a 100 m. Temperatura, humedad del suelo, provincias y nuevos territorios quedan para futuras versiones.

---

# 3. Seis aspectos de calidad obligatorios

## A1. Funcionalidad

- [ ] Página inicial con descripción del problema, acceso al explorador y pregunta científica central.
- [ ] Explorador de cuencas con polígonos reales de Ramis, Coata, Ilave y Huancané; ficha de área y procedencia.
- [ ] Selector de una cuenca y consulta de serie de precipitación mensual y anual.
- [ ] Comparación de dos cuencas y período común; gráficos con unidades y fechas explícitas.
- [ ] Motor de tendencias individuales y detector de contraste entre parejas.
- [ ] Panel de hallazgos ordenado por evidencia, no por cifras visualmente llamativas.
- [ ] Ficha de evidencia reproducible para cada resultado.
- [ ] Exportación de series CSV, figura PNG y reporte imprimible que pueda guardarse como PDF.
- [ ] Vista de metodología, glosario, licencias, procedencia y limitaciones.
- [ ] Estados explícitos de carga, error, ausencia de datos y resultados no concluyentes.

## A2. Usabilidad y accesibilidad

- [ ] Español como idioma principal; arquitectura preparada para traducción posterior.
- [ ] Diseño responsive desde 360 px hasta escritorio; menú y filtros utilizables con teclado.
- [ ] Semántica HTML correcta, etiquetas, contraste apropiado y mensajes accesibles.
- [ ] No depender exclusivamente del color para indicar aumentos, descensos o evidencia.
- [ ] Explicar «tendencia», «anomalía», «significancia» y «contraste» mediante ayuda contextual.
- [ ] Mantener un estado compartible mediante parámetros de URL sin información personal.
- [ ] No requerir registro, geolocalización, permisos del dispositivo ni instalación de aplicaciones.

## A3. Seguridad y privacidad

- [ ] Sin credenciales de Earthdata en frontend, repositorio, logs ni archivos publicados.
- [ ] `.env`, `.netrc`, tokens y archivos de sesión excluidos con `.gitignore`.
- [ ] Sin autenticación de visitantes ni recogida de datos personales.
- [ ] Datos cargados desde JSON/CSV locales; no evaluar código recibido ni ejecutar HTML procedente de parámetros.
- [ ] Validar esquemas de los archivos de datos antes del procesamiento y de la visualización.
- [ ] Evitar dependencias innecesarias; `npm audit` y comprobación de dependencias Python.
- [ ] HTTPS en producción; encabezados de seguridad configurados según capacidades del hosting.
- [ ] Sin analítica de terceros, cookies de seguimiento ni envío de formularios a servicios externos.

## A4. Rendimiento

- [ ] Procesamiento geoespacial y estadístico pesado antes del despliegue, nunca por visita.
- [ ] Datos públicos compactos y compresión HTTP cuando el hosting lo permita.
- [ ] Geometrías simplificadas preservando topología; originales archivados en el pipeline.
- [ ] No cargar imágenes satelitales masivas ni archivos NetCDF en el navegador.
- [ ] Carga diferida de gráficas o módulos secundarios; sin llamadas a tiles comerciales.
- [ ] Objetivo orientativo móvil: LCP <= 2,5 s, INP <= 200 ms y CLS <= 0,1 en una prueba representativa; registrar mediciones reales.
- [ ] La selección entre cuencas debe responder inmediatamente una vez cargado el conjunto público.

## A5. Confiabilidad y rigor científico

- [ ] Identificar dataset exacto, DOI, versión y fecha de acceso.
- [ ] Mantener unidades y conversiones explícitas, con pruebas unitarias.
- [ ] Validar geometría, sistema de coordenadas, superposición de píxeles y cobertura espacial.
- [ ] Comprobar completitud mensual y anual, ausencia de duplicados y manejo de valores faltantes.
- [ ] Distinguir tendencias individuales de pruebas de diferencia entre tendencias.
- [ ] Mostrar incertidumbre, tamaño del efecto, número de años y corrección de pruebas múltiples.
- [ ] No inferir causalidad, nivel del lago, caudal ni sequía agrícola únicamente desde lluvia.
- [ ] Ejecutar tests científicos con datos sintéticos **solo dentro del entorno de pruebas**, nunca en los resultados públicos.

## A6. Mantenimiento y crecimiento

- [ ] Separar procesamiento Python del sitio web estático.
- [ ] Contratos de datos versionados y validados automáticamente.
- [ ] Dependencias fijadas mediante archivos de bloqueo compatibles.
- [ ] Pipeline modular con comandos reproducibles; caché para evitar descargas repetidas.
- [ ] Tests de unidad, integración, interfaz y construcción automatizados.
- [ ] Preparar incorporar nuevas cuencas/variables sin modificar componentes principales.
- [ ] Documentación de despliegue, actualización de datos, auditoría y recuperación de fallos.

---

# 4. Fuentes oficiales, licencias y política de gratuidad

## 4.1. Precipitación

**Fuente principal obligatoria:** NASA GPM IMERG Final Precipitation L3, 1 mes, resolución 0,1 grados, **V07**, identificador `GPM_3IMERGM_07`, DOI `10.5067/GPM/IMERG/3B-MONTH/07`.

- Catálogo NASA: https://data.nasa.gov/dataset/gpm-imerg-final-precipitation-l3-1-month-0-1-degree-x-0-1-degree-v07-gpm-3imergm-at-ges-di-75e72
- Directorio oficial GPM: https://gpm.nasa.gov/data/directory
- Ficha de colección: https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGM_07/summary
- Catálogo de referencia del mismo producto en Earth Engine: https://developers.google.com/earth-engine/datasets/catalog/NASA_GPM_L3_IMERG_MONTHLY_V07
- Autenticación gratuita: https://urs.earthdata.nasa.gov/

**Verificaciones exigidas antes de descargar:** comprobar que el enlace de distribución sigue vigente, que el recurso es la versión V07 y ejecución Final, que el campo elegido representa una tasa de precipitación en `mm/h`, y que cada granulo contiene el período esperado. No usar silenciosamente un producto Early, Late, V06 o versión diferente. Si se adopta otra versión por cambios de disponibilidad, detener el pipeline hasta aprobar y documentar la migración; no mezclar versiones en una sola serie.

**Nota importante:** IMERG Final combina estimaciones satelitales y ajustes con pluviómetros. Describirlo como estimación multifuente, no como medición perfecta directamente observada en cada cuenca.

**Disponibilidad temporal:** la cobertura nominal del catálogo es amplia, pero el corte 2001–2025 será publicado solo si los 300 meses de la colección elegida están disponibles y pasan controles. El producto Final tiene latencia; no prometer actualización instantánea.

**Acceso:** usar la cuenta gratuita Earthdata para descargar y procesar localmente. Se puede utilizar el servicio de búsqueda NASA Earthdata y herramientas libres de descarga; verificar el método vigente de autenticación. No introducir credenciales en el navegador ni en scripts versionados.

## 4.2. Cuencas

**Fuente oficial:** Autoridad Nacional del Agua (ANA), conjunto «Unidades Hidrográficas» registrado en GeoIDEP.

- Metadatos oficiales: https://catalogo.geoidep.gob.pe/metadatos/srv/api/records/7479fd98-28a4-4a33-8ee8-01b55dfc1108
- Descarga oficial publicada: https://geosnirh.ana.gob.pe/Repositorio/Shape/UnidadesHidrograficas.zip
- Visor ANA: https://snirh.ana.gob.pe/observatoriosnirh/Index.aspx

El pipeline debe **inspeccionar de verdad** los atributos y la jerarquía del shapefile. Identificar códigos y nombres completos de Ramis, Coata, Ilave y Huancané; elegir unidades equivalentes en nivel hidrográfico; detectar polígonos superpuestos por jerarquía, corregir geometrías inválidas y dejar constancia del área calculada. No asumir que un filtro textual parcial garantiza la cuenca correcta. No inventar códigos Pfafstetter ni áreas.

Para el mapa usar solo geometrías validadas, con atribución ANA. Si el ZIP oficial está temporalmente caído, se permite descarga manual desde el geoportal oficial, registrando origen y hash. No sustituir automáticamente por dibujos aproximados ni límites administrativos.

## 4.3. Servicios que no se contratarán

- Sin OpenAI API, Gemini API, Claude API, mapas propietarios, Firebase, bases de datos SaaS, pagos por consulta o nubes comerciales obligatorias.
- Google Earth Engine podrá utilizarse como **herramienta opcional de investigación**, nunca como dependencia de funcionamiento, ya que su modalidad no comercial gratuita tiene condiciones y cuotas.
- No realizar consultas directas a NASA desde cada navegador visitante.
- Sin uso obligatorio de una API de geocodificación o de tiles. El mapa base puede componerse con geometrías oficiales y elementos vectoriales propios, sin solicitar mapas externos.
- Hosting estático en GitHub Pages para demostración gratuita o servidor contratado que publique archivos `dist/`. GitHub Pages tiene cuotas y restricciones para uso comercial; verificar compatibilidad con el uso real.

**Regla de costo:** ningún paquete, API, plugin, control de mapa, icono o fuente requiere tarjeta bancaria ni pago para ejecutar el MVP. El equipo local, conexión personal y tiempo de trabajo no se contabilizan como servicios de software gratuitos.

---

# 5. Arquitectura definitiva

```text
Datos NASA + cartografía ANA
        |
        v
pipeline/  Python: descarga, controles, extracción, análisis, exportación
        |
        v
web/public/data/  CSV + JSON + GeoJSON + manifiesto
        |
        v
web/  React + TypeScript + Vite + Leaflet + ECharts
        |
        v
Compilación estática web/dist/
        |
        v
Hosting estático con HTTPS
```

**Principio:** la página funcionará leyendo archivos pequeños ya procesados, sin servidor Python permanente. No usar FastAPI en la primera versión. El navegador no conoce contraseñas NASA y no ejecuta cálculos geoespaciales grandes. El sitio podrá funcionar en un hosting estático básico.

## 5.1. Tecnologías

| Capa | Elección | Motivo |
|---|---|---|
| Frontend | React, TypeScript, Vite | Aplicación estática tipada, rápida y portable |
| Estilo | CSS modular o Tailwind CSS | Diseño propio consistente sin dependencias comerciales |
| Cartografía | Leaflet con GeoJSON propio | Sin token ni cuenta de proveedor de mapas |
| Gráficos | Apache ECharts | Visualización y exportación de figuras en navegador |
| Validación frontend | Zod | Rechazo de archivos públicos incompatibles |
| Tests frontend | Vitest, Testing Library | Pruebas rápidas de unidades y componentes |
| E2E | Playwright | Flujo real en navegador |
| Pipeline | Python 3.11/3.12 | Procesamiento reproducible y compatible |
| Datos y geoespacial | pandas, numpy, xarray, GeoPandas, Shapely, pyproj | Series y polígonos |
| Lectura científica | h5netcdf/netCDF4 y herramientas compatibles | Lectura de productos nativos; confirmar formato descargado |
| Estadística | SciPy, statsmodels, pymannkendall | Tendencias y contraste emparejado |
| Validación Python | pytest, jsonschema | Verificación automática |
| Versionamiento | Git | Historia y auditoría |

Usar versiones estables compatibles verificadas en la fecha de implementación, registrar las versiones efectivas y generar `package-lock.json` y archivo de dependencias Python fijadas. No fijar números obsoletos por anticipado.

## 5.2. Estructura de carpetas objetivo

```text
titicaca-contrast/
├── README.md
├── LICENSE
├── .gitignore
├── .editorconfig
├── docs/
│   ├── arquitectura.md
│   ├── metodologia.md
│   ├── diccionario-datos.md
│   ├── fuentes-y-licencias.md
│   ├── despliegue.md
│   ├── auditoria.md
│   ├── decisiones.md
│   └── verificaciones.md
├── pipeline/
│   ├── README.md
│   ├── pyproject.toml
│   ├── requirements-lock.txt
│   ├── config/
│   │   ├── basins.yaml
│   │   ├── analysis.yaml
│   │   └── sources.yaml
│   ├── src/
│   │   └── titicaca_pipeline/
│   │       ├── __init__.py
│   │       ├── cli.py
│   │       ├── download.py
│   │       ├── boundaries.py
│   │       ├── imerg.py
│   │       ├── aggregate.py
│   │       ├── trends.py
│   │       ├── contrasts.py
│   │       ├── validation.py
│   │       ├── provenance.py
│   │       └── export.py
│   ├── data/
│   │   ├── raw/.gitkeep
│   │   ├── cache/.gitkeep
│   │   └── interim/.gitkeep
│   └── tests/
│       ├── test_boundaries.py
│       ├── test_units.py
│       ├── test_aggregation.py
│       ├── test_timeseries.py
│       ├── test_trends.py
│       ├── test_contrasts.py
│       └── test_exports.py
├── web/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   ├── favicon.svg
│   │   └── data/
│   │       ├── manifest.json
│   │       ├── basins.geojson
│   │       ├── basins.json
│   │       ├── precipitation-monthly.csv
│   │       ├── precipitation-annual.json
│   │       ├── trends.json
│   │       ├── contrasts.json
│   │       └── evidence.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── app/
│       │   ├── routes.tsx
│       │   ├── dataLoader.ts
│       │   └── schemas.ts
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── BasinMap.tsx
│       │   ├── BasinSelector.tsx
│       │   ├── PeriodSelector.tsx
│       │   ├── ClimateChart.tsx
│       │   ├── ContrastCard.tsx
│       │   ├── EvidencePanel.tsx
│       │   ├── ExportControls.tsx
│       │   └── StatusMessage.tsx
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Explorer.tsx
│       │   ├── Compare.tsx
│       │   ├── Findings.tsx
│       │   ├── Methodology.tsx
│       │   └── Sources.tsx
│       ├── lib/
│       │   ├── format.ts
│       │   ├── csv.ts
│       │   ├── downloads.ts
│       │   └── selection.ts
│       ├── styles/
│       │   ├── tokens.css
│       │   └── global.css
│       └── tests/
│           ├── navigation.test.tsx
│           ├── selectors.test.tsx
│           ├── dataLoader.test.ts
│           ├── evidence.test.tsx
│           └── exports.test.ts
├── e2e/
│   ├── explorer.spec.ts
│   └── compare.spec.ts
└── scripts/
    ├── check-project.ps1
    └── check-project.sh
```

La estructura es un **objetivo de construcción**, no una afirmación de que estos archivos ya existan. No versionar `node_modules/`, `.venv/`, credenciales, imágenes científicas masivas ni datos brutos grandes. Los archivos de datos públicos solo se publicarán cuando se hayan validado; si aún no existen, la interfaz tendrá un estado honesto «Datos pendientes de procesamiento».

---

# 6. Contratos de datos y trazabilidad

## 6.1. Identidad de cuencas

Cada cuenca tendrá un `basin_id` fijo interno (`ramis`, `coata`, `ilave`, `huancane`) y además su **nombre y código oficial obtenidos de ANA**, nivel jerárquico, área calculada, sistema de referencia original y fecha/URL de descarga.

## 6.2. CSV de precipitación mensual

Columnas obligatorias:

`basin_id,year,month,precip_mm,valid_area_fraction,source_dataset,source_version`

Reglas:

- `precip_mm` es la **lámina media mensual de precipitación en la cuenca**, no el volumen total de agua ni la precipitación de un punto.
- Cada fila corresponde a una sola cuenca y mes; claves únicas por `basin_id,year,month`.
- `valid_area_fraction` está entre 0 y 1 y describe la fracción del área ponderada con datos válidos.
- Valor ausente se representa como `null` en JSON o campo vacío en CSV, nunca como cero inventado.
- Valores negativos no válidos; los valores de relleno nativos deben transformarse a ausentes antes de operar.
- No mezclar productos/ejecuciones/versions dentro de una misma serie sin protocolo de armonización revisado.

## 6.3. Resumen anual

Para cada cuenca y año: `year`, `basin_id`, `annual_precip_mm`, `complete_months`, `valid_year`, `source_version`. La precipitación anual es la suma de los doce totales mensuales en milímetros; **no** suma de las tasas en mm/h.

No completar un año incompleto mediante interpolación automática. Un año con meses incompletos debe quedar marcado como inválido para tendencias principales, salvo una decisión metodológica explícita documentada y validada.

## 6.4. Contrato de resultados estadísticos

Por cuenca: `basin_id`, `start_year`, `end_year`, `n_years`, `sen_slope_mm_per_year`, `mann_kendall_p`, `trend_direction`, `data_quality`, `method_version`.

Por contraste de pareja: `basin_a`, `basin_b`, `start_year`, `end_year`, `n_paired_years`, `gap_slope_mm_per_year`, `gap_slope_ci95`, `p_value`, `q_value_fdr`, `evidence_status`, `method_version`.

Aclaración: la pendiente de la **brecha anual** y la diferencia de pendientes Sen calculadas por separado no son necesariamente idénticas. Reportar con terminología correcta qué estimó cada procedimiento.

## 6.5. Manifiesto obligatorio

`manifest.json` tendrá, como mínimo: `schema_version`, `generated_at_utc`, `data_status`, `dataset_id`, `dataset_doi`, `dataset_version`, `dataset_processing_level`, `dataset_run`, `start_month`, `end_month`, `source_downloaded_at_utc`, `boundary_source`, `boundary_downloaded_at_utc`, `boundary_hash_sha256`, `processing_version`, `method_version`, `notes`, `integrity`.

Los archivos públicos se validan contra JSON Schema y Zod. `data_status` solo puede ser `ready`, `partial` o `unavailable`. La aplicación no mostrará afirmaciones científicas si el estado es `unavailable`, o si un resultado específico es inválido.

---

# 7. Procesamiento geoespacial correcto

## 7.1. Preparación de límites

1. Descargar shapefile ANA de la fuente oficial.
2. Inspeccionar capas, campos, codificación, CRS, niveles jerárquicos y códigos.
3. Seleccionar exactamente cuatro unidades hidrográficas equivalentes por código/nombre confirmado, no por aproximación visual.
4. Reparar o rechazar geometrías inválidas; detectar solapamientos que provengan de unidades anidadas.
5. Calcular áreas en un CRS adecuado de área equivalente o mediante área geodésica; registrar km².
6. Exportar GeoJSON en EPSG:4326 para el navegador con simplificación topológicamente segura y tolerancia documentada.
7. Conservar geometría sin simplificar para análisis científico.

## 7.2. Descarga del producto IMERG

1. Comprobar existencia y disponibilidad de los 300 meses 2001–2025.
2. Obtener archivos mediante mecanismo vigente de NASA Earthdata; se permite descarga manual autenticada si falla la automatización.
3. Limitar espacialmente el procesamiento al rectángulo de las cuatro cuencas, agregando margen mínimo para no truncar píxeles de borde.
4. Registrar nombres originales, URL de origen, hash SHA-256, fecha, versión y variable/unidades.
5. Usar caché local; repetir el pipeline sin volver a descargar archivos intactos.
6. Si un mes no puede obtenerse, registrar el error; no sustituir con otro producto sin aprobación.

## 7.3. Unidades de precipitación

En el producto mensual GPM_3IMERGM_07 la variable de precipitación está documentada como **tasa media `mm/h`**. El total de cada mes debe calcularse mediante:

`precipitación mensual (mm) = tasa media (mm/h) × 24 × días del mes`.

El pipeline debe verificar el atributo de unidades del archivo descargado antes de aplicar esta fórmula; no multiplicar si se usa accidentalmente un producto GIS cuyos valores ya sean acumulaciones mensuales en mm. Probar febrero de años bisiestos, cambio de año y meses de 30/31 días.

## 7.4. Agregación espacial

Para cada mes, estimar la precipitación media de cada cuenca utilizando pesos de superficie de intersección entre la cuenca y los píxeles IMERG:

`P_cuenca = Σ(P_pixel × área_intersección_válida) / Σ(área_intersección_válida)`.

Usar áreas calculadas consistentemente en una proyección de área equivalente o geodesia; validar el tratamiento de coordenadas, orden de ejes y polígonos multianillo. No usar media aritmética sin ponderación cuando los píxeles de borde sean parciales. Registrar porcentaje de superficie válida. Adoptar umbral inicial del 95 % de área válida por mes; si no se alcanza, declarar el mes incompleto y documentarlo.

## 7.5. Reglas de calidad

- 300 meses esperados por cuenca para 2001–2025, si las fuentes permiten cobertura total.
- 1.200 filas mensuales esperadas en total cuando todas las series estén completas.
- Cuatro series anuales de 25 observaciones completas, sujetas a validación.
- Duplicados y valores fuera de rango deben detener la exportación.
- Comparaciones solo entre años que sean válidos simultáneamente en ambas cuencas.
- La fecha de última actualización y los meses ausentes deben aparecer en la vista de fuentes.
- No presentar estimaciones como lecturas de una estación meteorológica.

---

# 8. Metodología estadística: decisiones cerradas

## 8.1. Unidad de análisis

Observaciones anuales en mm/año por cuenca. Los datos mensuales sirven para visualización de estacionalidad y para formar totales anuales. Los tests de tendencia principales emplean **años completos y comparables**.

## 8.2. Tendencia individual por cuenca

- Estimador de magnitud: pendiente de Theil–Sen, expresada en `mm/año por año` o, de manera más clara, `mm por década` multiplicando la pendiente anual por diez.
- Prueba de tendencia: Mann–Kendall, revisando autocorrelación y, de ser necesario, utilizando una versión corregida documentada.
- Reportar cantidad de años, dirección, valor p, pendiente, rango temporal y advertencias.
- `p > 0,05` significa evidencia insuficiente para afirmar una tendencia monotónica, no «demostración de ausencia de cambio».
- No extrapolar automáticamente tendencias como pronósticos futuros.

## 8.3. Detector de contrastes — método principal

Para cada pareja A, B y año `t` completo en ambos:

`D(t) = P_A(t) − P_B(t)`.

Estimar la pendiente temporal de la **brecha** `D(t)` mediante regresión lineal con errores estándar robustos a autocorrelación y heterocedasticidad (HAC/Newey–West), utilizando una política de rezagos explícita fijada antes del análisis. Esta estimación pregunta si la diferencia anual entre cuencas tiende a aumentar o disminuir a lo largo del tiempo.

- Reportar pendiente de la brecha, IC 95 %, p y número de años emparejados.
- Realizar sensibilidad con un conjunto pequeño de rezagos HAC (por ejemplo, 1, 2 y 3), mostrando si el veredicto cambia; definir rezago primario = 2 para la serie anual de 25 años, sujeto a revisión de autocorrelación.
- Contrastar los seis pares posibles de cuatro cuencas, usando la corrección Benjamini–Hochberg para controlar la tasa de descubrimientos falsos (FDR) con `q <= 0,05`.
- No afirmar «pendientes Sen significativamente distintas» basándose solo en el valor p de cada cuenca: la prueba principal es la pendiente de la brecha emparejada.
- Si la serie presenta valores extremos dominantes o pocos años válidos, añadir análisis de sensibilidad y marcar la conclusión como exploratoria/no concluyente.

## 8.4. Clasificación de resultados

1. **Contraste respaldado:** brecha con IC 95 % que excluye cero y `q <= 0,05`, con datos completos y sensibilidad aceptable.
2. **Contraste observado, no concluyente:** diferencia descriptiva o tendencias visuales distintas sin evidencia estadística suficiente.
3. **Sin cambio detectable en la brecha:** la prueba no identifica un cambio significativo en la brecha; nunca afirmar equivalencia estadística sin una prueba de equivalencia.
4. **Datos insuficientes:** cobertura, calidad o tamaño de muestra inadecuados.

Distinguir significancia estadística de importancia hidrológica. Una pendiente significativamente distinta de cero no implica necesariamente un impacto grande o una causa identificada.

## 8.5. Períodos y multiplicidad

**Análisis principal confirmatorio fijo:** 2001–2025, siempre que haya 25 años completos. Con un período menor, marcar explícitamente cambio de alcance. Para pruebas inferenciales exigir un mínimo inicial de 20 años comunes; con menos años, limitar la interfaz a análisis descriptivo, salvo una metodología alternativa revisada.

Permitir visualmente explorar años individuales y subperíodos, pero no presentar valores p generados tras búsquedas arbitrarias como conclusiones confirmatorias. Los subperíodos son exploratorios; el resultado principal se fija antes de seleccionar hallazgos llamativos.

## 8.6. Anomalías y promedios

El promedio de referencia inicial, si se necesita, será **2001–2020**, informado como «referencia interna 2001–2020», no como «normal climatológica OMM de 30 años». Las anomalías se calculan por cuenca, manteniendo unidades mm y, de modo opcional, porcentajes con cuidado ante denominadores pequeños.

## 8.7. No causalidad

La aplicación no debe afirmar que un patrón en precipitaciones *causó* un cambio del lago, del caudal o de una economía local. Para tales inferencias serían necesarias otras variables y diseños. Los datos satelitales pueden contener sesgos por topografía andina, intensidad de lluvia y validación pluviométrica insuficiente; la página debe explicar esas limitaciones.

---

# 9. Pantallas y diseño detallado

## 9.1. Identidad visual

Nombre visible: **TITICACA CONTRAST**. Subtítulo: **Un mismo lago, diferentes realidades climáticas**.

Estilo: observatorio científico contemporáneo, no panel genérico. Fondo claro con opción oscura si no compromete tiempo; azul profundo para navegación, celeste y verde agua como acentos, texto de alto contraste, tipografía de sistema sin dependencia de CDN, íconos SVG originales o con licencia libre. Evitar gráficos decorativos que parezcan datos reales.

Propuesta inicial de tokens: azul `#12314A`, azul de acción `#1177A7`, verde agua `#1D8F87`, fondo `#F5F8FA`, texto `#142532`, alerta `#A44F24`. Comprobar contraste WCAG; los tonos son orientativos y pueden ajustarse para accesibilidad.

## 9.2. Navegación

- **Inicio:** propósito, explicación breve, estado real de los datos, botón «Explorar cuencas».
- **Explorar:** mapa de cuatro cuencas, selector, ficha, serie mensual, serie anual, tendencia individual.
- **Comparar:** cuenca A, cuenca B, gráfico superpuesto, brecha anual, tarjeta de evidencia.
- **Hallazgos:** seis parejas, estado de evidencia, filtro, acceso a ficha reproducible.
- **Metodología:** fuentes, fórmula de agregación, unidades, métodos, limitaciones.
- **Fuentes:** DOI, licencias, versiones y descargas.

## 9.3. Componentes obligatorios

`Header`, `BasinMap`, `BasinSelector`, `PeriodSelector`, `ClimateChart`, `ContrastCard`, `EvidencePanel`, `ExportControls`, `StatusMessage`, `Footer`.

Estados del sistema: `loading`, `ready`, `partial`, `empty`, `unavailable`, `invalid`.

## 9.4. Interacciones y restricciones

- Mapa: clic o teclado en polígono selecciona cuenca; botón de restablecer.
- Dos cuencas iguales: mensaje accesible «Selecciona cuencas distintas», sin ejecutar comparación inválida.
- Períodos: mostrar rango de disponibilidad; bloquear fechas que no existan en los archivos.
- Gráficos: ejes etiquetados, tooltip, leyendas, indicación de faltantes.
- Tabla accesible alternativa a la visualización principal cuando sea necesario.
- Ficha de evidencia: botón para ver método y descargar CSV correspondiente.
- Exportaciones: nombres de archivo coherentes, unidades y rango temporal incluidos.
- URL compartible: cuencas y período como parámetros, validados en carga.
- Footer: fuentes NASA y ANA, fecha de datos, enlace a metodología y aclaración de independencia institucional.

---

# 10. Plan de ejecución obligatorio por fases

Cada fase termina con una **puerta de calidad**. No pasar a la siguiente si fallan las verificaciones de la actual. Los comandos indicados son el contrato que debe implementar el proyecto; no suponer que funcionan antes de generar el código.

## Fase 0 — Preparación del repositorio

**Objetivo:** establecer estructura, entornos, scripts y estándares.

1. Crear raíz, frontend Vite React TypeScript, paquete Python y documentación.
2. Definir `.gitignore`, `.editorconfig`, scripts `lint`, `test`, `build`, `typecheck` y verificación global.
3. Fijar dependencias con lockfiles y establecer instrucciones Windows PowerShell.
4. Crear la interfaz mínima con estado «datos no disponibles».
5. Configurar tests mínimos y ejecutar primer build.

**Aceptar solo si:** `npm run build`, `npm run typecheck` y pruebas iniciales finalizan sin errores; las credenciales no aparecen en Git.

## Fase 1 — Cartografía ANA

1. Descargar o recibir archivo oficial.
2. Inspeccionar capa, atributos, jerarquía y geometría.
3. Identificar las cuatro cuencas con códigos oficiales, verificar sus áreas.
4. Exportar `basins.geojson` y `basins.json` con procedencia.
5. Crear pruebas de integridad espacial, CRS y cuatro identificadores únicos.

**Aceptar solo si:** no hay polígonos inventados, cuencas mal identificadas ni geometrías inválidas en archivos públicos.

## Fase 2 — NASA IMERG

1. Implementar autenticación segura y descarga/caché de granulos.
2. Verificar versión V07 Final, variable, unidades y metadatos.
3. Procesar primero **un mes y una cuenca** como prueba piloto, sin lanzar todo el período.
4. Comparar el valor procesado con una comprobación independiente o cálculo manual de un conjunto pequeño.
5. Procesar 2001–2025 si se confirma disponibilidad completa.
6. Crear `precipitation-monthly.csv`, `precipitation-annual.json` y manifiesto.

**Aceptar solo si:** 300 meses por cuenca o una explicación explícita de faltantes; conversión correcta de mm/h a mm/mes; cálculos espaciales validados.

## Fase 3 — Estadística

1. Construir tests unitarios con series sintéticas conocidas.
2. Calcular tendencia individual y revisar autocorrelación.
3. Calcular seis series de brechas emparejadas y regresión HAC.
4. Aplicar Benjamini–Hochberg a las seis pruebas del período principal.
5. Incorporar IC 95 %, estado de evidencia y análisis de sensibilidad.
6. Exportar `trends.json`, `contrasts.json` y `evidence.json`.

**Aceptar solo si:** las pruebas reproducen resultados de referencia, ningún resultado se presenta sin trazabilidad y la clasificación concuerda con el método.

## Fase 4 — Frontend científico

1. Aplicar diseño visual y navegación móvil/escritorio.
2. Cargar manifiesto, validar contratos y detectar estados de disponibilidad.
3. Implementar explorador, gráficos y comparación de dos cuencas.
4. Implementar panel de hallazgos y fichas de evidencia.
5. Implementar exportaciones, metodología y fuentes.
6. Probar teclado, contraste, lectura móvil y errores de red/datos.

**Aceptar solo si:** todas las interacciones funcionan sobre datos validados, la web no contiene números simulados y las pruebas de UI pasan.

## Fase 5 — Auditoría y publicación

1. Ejecutar checks de Python, frontend, accesibilidad básica, E2E y compilación.
2. Revisar documentos, licencias y privacidad.
3. Probar sitio sin conexión a APIs NASA para garantizar independencia en tiempo de visita.
4. Construir `web/dist/` y probarlo con un servidor de vista previa.
5. Configurar `base` de Vite según dominio propio o ruta del repositorio.
6. Publicar en hosting estático y comprobar HTTPS, recursos y rutas internas.
7. Ejecutar auditoría visual y funcional desde celular y escritorio.

**Aceptar solo si:** compilación reproducible, sitio operativo, links correctos, resultados trazables, cero credenciales publicadas y documentación de ejecución completa.

---

# 11. Matriz de pruebas y criterios de aceptación

| ID | Tipo | Comprobación | Esperado |
|---|---|---|---|
| T01 | Datos | Cuatro identificadores únicos y códigos ANA confirmados | 4 cuencas verificadas |
| T02 | Datos | CRS, polígonos válidos, área > 0 | Sin geometrías inválidas |
| T03 | Datos | Mes enero: 31 días, febrero bisiesto: 29 | Conversión exacta mm/h a mm |
| T04 | Datos | Ausencias y valores de relleno | Nunca se convierten en lluvia cero |
| T05 | Datos | Duplicados por cuenca/mes | Rechazo y log de error |
| T06 | Datos | Píxeles parciales | Media ponderada por área correcta |
| T07 | Datos | Mes incompleto (<95 % área válida) | Marcado inválido |
| T08 | Datos | Año sin uno de los 12 meses válidos | No usado como total anual completo |
| T09 | Estadística | Serie monótona creciente conocida | Tendencia positiva calculada |
| T10 | Estadística | Serie plana conocida | Sin pendiente artificial |
| T11 | Estadística | Diferencias de parejas con igual pendiente | Brecha sin tendencia espuria |
| T12 | Estadística | Brecha creciente sintética | Signo de pendiente positivo |
| T13 | Estadística | Corrección FDR de seis pruebas | `q` reproducible |
| T14 | Estadística | Años no coincidentes | Solo años emparejados |
| T15 | UI | Selección de Ramis y Coata | Comparación correcta |
| T16 | UI | Selección de la misma cuenca en ambos campos | Mensaje de validación |
| T17 | UI | Datos ausentes | Estado explícito, ningún dato ficticio |
| T18 | UI | CSV y PNG | Archivos correctos y legibles |
| T19 | UI | Mobile 360 px | Sin desbordamiento esencial |
| T20 | UI | Navegación teclado | Controles y mapa operables |
| T21 | Seguridad | Escaneo de credenciales en código y `dist/` | Sin secretos |
| T22 | Seguridad | Dependencias | Sin vulnerabilidades críticas sin tratar |
| T23 | Despliegue | Recarga en URL publicada | Sitio no produce 404 |
| T24 | Despliegue | Sitio sin servicio externo de datos | Consultas siguen operativas |
| T25 | Trazabilidad | Tarjeta de hallazgo → fuente y fórmula | Evidencia verificable |
| T26 | Integración | Generar dos veces el mismo dataset | Resultados consistentes, salvo metadatos de ejecución |
| T27 | Integración | Archivo público modificado o corrupto | Validación rechaza el archivo |
| T28 | Auditoría | Reprocesar una pareja desde los CSV publicados | Resultado coincide con reporte |

**Pruebas de referencias:** usar fixtures sintéticos solo en `tests/`. No distribuir fixtures como datos oficiales. Para pruebas de geografía, utilizar geometrías pequeñas inventadas etiquetadas explícitamente como fixtures de tests, nunca como Ramis/Coata reales.

---

# 12. Contratos de comandos del proyecto

## 12.1. Requisitos locales

- Windows 10/11, PowerShell.
- Git instalado.
- Node.js LTS moderno y npm; verificar compatibilidad con la versión de Vite instalada.
- Python 3.11 o 3.12 y pip; verificar disponibilidad de ruedas binarias GIS en Windows.
- Cuenta NASA Earthdata **solo para quien reprocesa o descarga** datos originales.
- No requiere Docker, tarjeta de pago ni GPU.

## 12.2. Ejecutar la web después de implementar el repositorio

Desde la raíz del proyecto:

```powershell
cd web
npm ci
npm run dev
```

Abrir la URL local que indique Vite, normalmente `http://localhost:5173/` si el puerto está disponible. Para compilación y vista previa:

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

`npm run preview` sirve para inspección local de la compilación y no reemplaza un servidor de producción.

## 12.3. Preparar Python

```powershell
cd pipeline
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e .
python -m pytest -q
```

Si PowerShell bloquea la activación, ejecutar `.venv\Scripts\python.exe` directamente o ajustar la política exclusivamente para la sesión siguiendo las prácticas de seguridad habituales. No modificar la política global del equipo de manera injustificada.

## 12.4. Interfaz CLI propuesta para crear

```powershell
python -m titicaca_pipeline.cli validate-boundaries
python -m titicaca_pipeline.cli download-imerg
python -m titicaca_pipeline.cli extract
python -m titicaca_pipeline.cli analyze
python -m titicaca_pipeline.cli export
python -m titicaca_pipeline.cli verify
```

La primera versión puede implementar `download-imerg` con un modo de importación manual autenticada además de descarga automatizada. **Estos comandos son objetivos del desarrollo**, no órdenes ejecutables en un directorio vacío. La CLI debe documentar parámetros, códigos de salida y manejo de fallos. Un comando fallido no puede terminar con código de éxito ni escribir datos aparentemente válidos.

## 12.5. Orden correcto de uso

1. Ejecutar entorno Python, descarga ANA, descarga NASA y `verify`.
2. Copiar/exportar los archivos validados a `web/public/data/`.
3. Instalar dependencias web y ejecutar `npm run dev`.
4. Ejecutar tests, build y vista previa.
5. Publicar exclusivamente `web/dist/`, nunca `pipeline/data/raw`, `.venv`, `.netrc` ni `.env`.

**Modo de auditoría sin cuenta NASA:** quien recibe el ZIP con datos procesados reales validados puede ejecutar la web sin acceder a Earthdata. Para reproducir la extracción original sí necesita sus credenciales NASA y conectividad.

---

# 13. Auditoría manual que debe poder realizar el propietario

## 13.1. Inspección técnica

- Revisar el árbol de carpetas y confirmar que frontend, pipeline y documentación están separados.
- Ejecutar `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.
- Ejecutar pruebas Python e inspeccionar salidas.
- Buscar tokens, claves, contraseñas y direcciones personales en todos los archivos.
- Confirmar que `dist/` no incluye datos brutos, credenciales ni material de desarrollo sensible.
- Verificar que todos los recursos necesarios para visualizar resultados se sirven localmente desde el mismo sitio.

## 13.2. Inspección científica

- Abrir `manifest.json`: DOI, V07 Final, fechas, límites ANA, estado `ready` solo si corresponde.
- Abrir `precipitation-monthly.csv`: cuatro cuencas y 300 meses por cuenca cuando la serie sea completa.
- Tomar un mes, recalcular `mm/h × horas del mes` y revisar la media ponderada de una pequeña intersección espacial.
- Sumar doce meses de un año y verificar `annual_precip_mm`.
- Recalcular una tendencia y una brecha emparejada con script/notebook independiente.
- Verificar p, q, IC y advertencias visibles en UI.
- Si falta un período, comprobar que el sistema lo informa en vez de ocultarlo.

## 13.3. Inspección visual

- Probar 360 px, 768 px, 1366 px y 1920 px.
- Verificar que el mapa tenga polígonos reales, leyenda y fuente.
- Verificar que no existan botones vacíos, imágenes decorativas irrelevantes o enlaces rotos.
- Seleccionar cada cuenca, cambiar comparador, volver atrás, recargar y exportar.
- Comprobar que los mensajes estadísticos tengan lenguaje entendible sin sacrificar exactitud.

## 13.4. Documentos de cierre

Exigir `docs/auditoria.md` con fecha, versiones, comandos, resultado de cada test, fallos encontrados, correcciones y bloqueos. Exigir `docs/verificaciones.md` con ejemplos reproducibles de entrada y salida real, no capturas de datos ficticios.

---

# 14. Riesgos previstos y respuesta obligatoria

| Riesgo | Síntoma | Acción correcta |
|---|---|---|
| Earthdata requiere autorización | HTTP 401/403 o redirección | Verificar autorización y credenciales locales, nunca insertar token en frontend |
| Cambio en servidor NASA | URL anterior falla | Resolver URL de distribución vigente desde colección oficial, documentar cambio |
| Cobertura mensual faltante | Uno o varios meses no descargables | No inventar datos; registrar faltantes y reducir período solo con justificación |
| Confusión mm/h versus mm/mes | Totales incompatibles | Inspeccionar unidades nativas y pruebas de conversión antes de publicar |
| Shapefile ANA con jerarquías | Polígonos duplicados/anidados | Revisar códigos y nivel hidrográfico; detener antes de exportar |
| GEOJSON demasiado grande | Sitio lento | Simplificación topológica y separación de geometrías de análisis/publicación |
| Tendencia no significativa | Hallazgos poco espectaculares | Informar resultado; no manipular períodos para forzar significancia |
| Diferentes métodos discrepan | p o dirección inestable | Marcar sensibilidad y discutir incertidumbre, no ocultarla |
| Hosting tiene límite de rutas | Recargar produce 404 | Configurar `base`, enrutado hash o fallback compatible con hosting estático |
| Biblioteca vulnerada | Auditoría de dependencias falla | Actualizar dentro de compatibilidad, probar y regenerar lockfile |
| Agente crea datos falsos | Números sin fuente/manifest | Bloquear entrega; corregir y volver a ejecutar pipeline real |
| Proyecto excede tiempo | Módulos incompletos | Priorizar mapa + 4 cuencas + datos reales + un contraste válido + pruebas |

**Plan de contingencia científico:** si no se descargan los datos reales, entregar interfaz validada con estado «no disponible», pipeline auditable y procedimientos comprobables, **pero no declararla plataforma científica terminada**. Es preferible una limitación visible a resultados falsificados.

---

# 15. Criterios de entrega del proyecto terminado

La entrega de código solo podrá describirse como **completa** si incluye:

1. Carpeta raíz ordenada y README legible.
2. Frontend funcional y responsive.
3. Mapa de cuatro cuencas reales con procedencia ANA.
4. Dataset de precipitación real, con completitud documentada y metadatos NASA.
5. Análisis individual y seis contrastes emparejados computados o claramente marcados como no concluyentes.
6. Fichas de evidencia y exportaciones.
7. Pipeline Python reproducible.
8. Pruebas automatizadas y registros de su ejecución.
9. Política de gratuidad verificada, sin dependencias comerciales.
10. Procedimiento de instalación Windows y despliegue estático.
11. Archivos de configuración seguros y sin credenciales.
12. ZIP que contenga el código y los **datos públicos derivados validados**, pero no los grandes originales brutos ni secretos.

No afirmar «sin errores» de manera absoluta. Documentar los tests ejecutados, limitaciones y condiciones para reproducir. Una aplicación que compila no está validada científicamente por ese solo hecho.

---

# 16. Prompts de ejecución fase por fase

Copiar **un prompt a la vez**, después de entregar al agente este plan maestro. No pedir que genere todas las fases simultáneamente sin controles.

## Prompt 0 — Preparación

> Implementa exclusivamente la Fase 0 del PLAN_MAESTRO_TITICACA_CONTRAST.md. Crea el repositorio, el frontend mínimo React + TypeScript + Vite, estructura Python y documentación. No utilices datos falsos. Implementa scripts de prueba, lint, typecheck, build y `.gitignore` seguro. Ejecuta las verificaciones y entrega un reporte breve de archivos y resultados. No avances a la Fase 1 si falla cualquier comprobación.

## Prompt 1 — Cuencas

> Implementa exclusivamente la Fase 1 del plan. Descarga o procesa las delimitaciones oficiales de ANA, inspecciona códigos y jerarquía, selecciona Ramis, Coata, Ilave y Huancané sin ambigüedad, valida geometrías, exporta GeoJSON y metadatos de procedencia. Añade pruebas espaciales. No inventes geometrías. Detén la fase si la fuente oficial no permite identificar correctamente las cuatro unidades.

## Prompt 2 — NASA

> Implementa exclusivamente la Fase 2 del plan. Conecta la descarga autenticada y privada de NASA GPM_3IMERGM_07 Final. Verifica unidades y metadatos. Valida primero un solo mes con un cálculo independiente; después procesa 2001–2025 si los meses están disponibles. Exporta datos mensuales/anuales y manifiesto. No mezcles versiones ni conviertas faltantes en cero. Ejecuta tests de unidad, área y completitud antes de continuar.

## Prompt 3 — Estadística

> Implementa exclusivamente la Fase 3 del plan. Calcula pendientes de Sen, Mann–Kendall por cuenca y el detector principal mediante brecha emparejada, regresión con errores HAC, IC y FDR para los seis pares. Implementa fixtures estadísticos independientes en tests, reporta incertidumbre y produce archivos JSON con trazabilidad. Nunca selecciones períodos para forzar hallazgos.

## Prompt 4 — Aplicación

> Implementa exclusivamente la Fase 4 del plan. Diseña y construye todas las pantallas con aspecto profesional, mapa gratuito con polígonos propios, filtros, gráficos, hallazgos, fichas de evidencia y descargas. Consume únicamente archivos locales validados; no insertes datos de ejemplo en producción. Añade tests de frontend, accesibilidad básica y comportamiento responsive. Verifica todas las interacciones.

## Prompt 5 — Auditoría y despliegue

> Implementa exclusivamente la Fase 5 del plan. Ejecuta auditoría técnica, científica, seguridad, dependencias, interfaz, rendimiento y despliegue estático. Corrige fallos reproducibles. Crea un README de ejecución Windows y una guía de hosting. Genera informe de tests con resultados reales y prepara distribución ZIP sin credenciales ni datos brutos grandes. No declares éxito sin pruebas ejecutadas.

---

# 17. Referencias técnicas oficiales verificadas

1. NASA GPM, directorio de productos IMERG: https://gpm.nasa.gov/data/directory
2. NASA GPM, explicación y documentación IMERG: https://gpm.nasa.gov/data/imerg
3. NASA Open Data, IMERG Final V07, DOI 10.5067/GPM/IMERG/3B-MONTH/07: https://data.nasa.gov/dataset/gpm-imerg-final-precipitation-l3-1-month-0-1-degree-x-0-1-degree-v07-gpm-3imergm-at-ges-di-75e72
4. NASA Earthdata, acceso autenticado: https://urs.earthdata.nasa.gov/documentation/for_users/data_access/curl_and_wget
5. NASA IMERG mensual V07, campos y unidades: https://developers.google.com/earth-engine/datasets/catalog/NASA_GPM_L3_IMERG_MONTHLY_V07
6. ANA/GeoIDEP, Unidades Hidrográficas, condiciones y descargas: https://catalogo.geoidep.gob.pe/metadatos/srv/api/records/7479fd98-28a4-4a33-8ee8-01b55dfc1108
7. Google Earth Engine, modalidades no comerciales y cuotas: https://developers.google.com/earth-engine/guides/noncommercial_tiers
8. GitHub Pages, límites de servicio: https://docs.github.com/es/pages/getting-started-with-github-pages/github-pages-limits
9. Vite, despliegue de sitio estático: https://es.vite.dev/guide/static-deploy

**Nota de vigencia:** verificar URLs, términos de servicio y disponibilidad de granulos en el momento de ejecutar la implementación; una URL de documentación no certifica por sí sola que una descarga autenticada concreta haya funcionado.

---

# 18. Decisión final de alcance

**Primera versión obligatoria:** cuatro cuencas oficiales + lluvia NASA real de un período comprobado + mapa interactivo + series históricas + tendencias científicas + comparación emparejada de seis pares + evidencia reproducible + exportaciones + sitio estático + pruebas.

**No añadir** temperatura, humedad, provincias, modelos predictivos ni backend hasta que esta primera versión haya superado la auditoría.

**Resultado esperado:** una plataforma científica diferenciada por la investigación de **contrastes entre cuencas**, no por una acumulación de gráficos ni por una promesa de resultados espectaculares. El valor del sistema debe mantenerse incluso cuando el análisis encuentre diferencias no significativas.
