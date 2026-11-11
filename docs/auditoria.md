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

---

## Fase 4 — Frontend Científico y Visualización Interactiva

- **Fecha:** Noviembre 2026
- **Responsable:** Antigravity / Pair Programming
- **Estado general:** Completada y aprobada

### Componentes y verificaciones técnicas
- [x] Implementación de los 10 componentes obligatorios del sistema:
  - `Header`: Navegación clara con indicador visual del estado de integridad de los datos (`ready`, `unavailable`, etc.).
  - `BasinMap`: Mapa interactivo con Leaflet que proyecta `basins.geojson` con estilos diferenciados por cuenca, resaltado de selección única o por parejas, tooltips con códigos ANA y áreas oficiales, botón de restablecer vista y fallback accesible para tecnologías de asistencia.
  - `BasinSelector`: Selector semántico de cuencas con bloqueo dinámico de selección duplicada en modo comparativo.
  - `PeriodSelector`: Selector de rango temporal acotado a años completos válidos (2001–2024) con botones de acceso rápido (Período completo, Referencia 2001–2020, Decenio reciente).
  - `ClimateChart`: Gráfico interactivo con Apache ECharts con soporte responsive, selector de modo (serie anual + Theil-Sen, ciclo estacional medio mensual, y serie de brechas $D(t)$ con línea HAC), y visualización accesible alternativa en formato tabla HTML.
  - `ContrastCard`: Tarjeta de resumen de contraste emparejado con etiquetas semánticas de estado de evidencia (`supported`, `inconclusive`, `no_change`), pendiente con intervalo de confianza al 95% y valores $p$ y $q$ (FDR).
  - `EvidencePanel`: Ficha modal accesible (con cierre por teclado `Escape`) que expone la especificación principal, la tabla de sensibilidad a 3 rezagos HAC ($L=1, 2, 3$), la autocorrelación de orden 1 y la advertencia explícita de no causalidad.
  - `ExportControls`: Módulo de exportación con descarga de CSV mensual, anual y por parejas, y copia de enlace permanente.
  - `StatusMessage`: Mensajes transparentes para estados del sistema (`loading`, `ready`, `partial`, `unavailable`, `error`).
  - `Footer`: Metadatos de fuentes oficiales (NASA y ANA), licencias libres y cláusula de independencia institucional.
- [x] Conexión integral de vistas:
  - `Home`: Visión general, hallazgos principales 2001–2024 y accesos directos.
  - `Explorer`: Exploración detallada individual con mapa sincronizado, series históricas y resumen univariado.
  - `Compare`: Comparación emparejada con validación de cuencas distintas, mapa conjunto y serie de brechas $D(t)$.
  - `Findings`: Matriz completa de las 6 parejas con filtrado por estado de evidencia y acceso a fichas reproducibles.
  - `Methodology`: Documentación de ecuaciones de agregación espacial, conversión de unidades, estimadores estadísticos y límites.
  - `Sources`: DOIs oficiales, enlaces SNIRH, licencias y tabla de hashes SHA-256 para verificación independiente.
- [x] Optimización de empaquetado:
  - Configuración de `manualChunks` en Vite para Leaflet, Apache ECharts y React, garantizando una carga rápida y modular.
- [x] Pruebas de interfaz y accesibilidad:
  - 16 pruebas unitarias de frontend con Vitest (100% pasadas).
  - Verificación global limpia con `scripts/check-project.ps1` (0 errores en TypeScript, linting, tests de frontend, compilación y 32 tests de pipeline).

---

## Fase 5 — Auditoría, Verificación y Publicación

- **Fecha:** Noviembre 2026
- **Responsable:** Antigravity / Pair Programming
- **Estado general:** Completada y aprobada para publicación

### Verificaciones de auditoría final y entrega
- [x] Ejecución integral del script de auditoría global `scripts/check-project.ps1`:
  - Typecheck de TypeScript: 0 errores
  - Linter de TypeScript: 0 advertencias
  - Pruebas frontend (Vitest): 16 de 16 pruebas pasadas
  - Compilación de producción (Vite): `web/dist/` generado con empaquetado optimizado (`manualChunks`)
  - Pruebas de pipeline (Pytest): 32 de 32 pruebas pasadas
- [x] Cumplimiento del 100% de la matriz de pruebas del Plan Maestro (T01 a T15) documentado en `docs/verificaciones.md`.
- [x] Autonomía estática completa: El sitio web opera sin dependencia de APIs dinámicas externas en tiempo de visita; todos los datos se sirven desde archivos estáticos inmutables en `./data/`.
- [x] Cero credenciales ni secretos en el repositorio o historial de Git.
- [x] Verificación de ausencia de comentarios en archivos de código fuente (`.py`, `.ts`, `.tsx`).
- [x] Integridad de datos asegurada mediante hashes SHA-256 en `web/public/data/manifest.json`.
- [x] Licencia MIT y metadatos de procedencia oficial (ANA y NASA) claramente expuestos en la interfaz.




---

## Rediseño Profesional del Hero / Portada (Noviembre 2026)

- **Referencia visual:** Maqueta de observatorio tecnológico de alta fidelidad (`media_1794407865912_deb4a53c.jpg`).
- **Paleta implementada:**
  - Fondo azul profundo: `#061827`
  - Azul petróleo: `#0B2B40`
  - Azul secundario: `#123E56`
  - Cian tecnológico: `#23D7E5`
  - Turquesa: `#70DCD8`
  - Verde indicador: `#20D8A1`
  - Texto blanco: `#F7FAFC`
  - Texto secundario: `#BCD0DC`
  - Acento ámbar: `#DCA86F`
- **Fondo panorámico auténtico:**
  - Fotografía panorámica documental real del lago Titicaca tomada desde la Isla Taquile (Puno, Perú), por Martin St-Amant (Wikimedia Commons, CC-BY-SA).
  - Superposición con gradiente petróleo y oscurecimiento progresivo lateral para garantizar contraste WCAG AAA en los textos.
- **Modelo 3D de Cuencas y Lago:**
  - Geometrías extruidas a partir de cartografía oficial de la Autoridad Nacional del Agua (ANA): Cuenca Ramis, Cuenca Huancané, Cuenca Coata, Cuenca Ilave y Lago Titicaca (`web/public/data/lake.geojson`).
  - Anillo orbital tecnológico giratorio con marcas radiales, nodos luminosos y ticks cardinales.
  - Modelo de satélite 3D con cuerpo de manta térmica dorada (MLI), paneles solares fotovoltaicos, antena parabólica y haz cónico de escaneo activo con pulso hacia el territorio.
  - Microinteracciones de rotación orbital con inercia, zoom con rueda de ratón acotado (5.6 a 10.2), botón de reinicio de ángulo de vista y control de pausa/reanudación respetuoso de `prefers-reduced-motion`.
- **Tarjetas flotantes HUD de telemetría:**
  - Monitoreo satelital (NASA IMERG V07, actualización mensual calibrada).
  - Precipitación (tendencia histórica con minigráfico de barras en cian luminoso: -8.2 mm/año promedio).
  - Altiplano (3,812 msnm).
  - Contrastes (Inferencia HAC / FDR).
- **Fallback WebGL:**
  - Representación isométrica 2.5D en SVG vectorial con polígonos oficiales interactivos cuando WebGL no está disponible o en entornos de prueba automatizada.
## Auditoría y Rediseño Integral UI/UX e Identidad Visual (Noviembre 2026)

- **Referencia y aprobación visual:** Isotipo y logotipo oficial `TITICACA CONTRAST` (`media_1794411952634_c706c15a.jpg`) y escena 3D validada.
- **Identidad corporativa integrada:**
  - Componente vectorial escalable `web/src/components/Logo.tsx` con variantes `full` (cabecera de escritorio), `compact` (pie de página y navegación compacta) y `symbol` (favicons e isotipos).
  - Isotipo en squircle con satélite en órbita y haz de radar, cordillera andina nevada y olas del lago Titicaca con degradados cian/turquesa sobre fondo `#061827`.
  - Tipografía oficial `TITICACA CONTRAST` y subtítulo institucional `OBSERVATORIO DE CUENCAS · PUNO`.
  - Favicon vectorial en `web/public/favicon.svg` actualizado al isotipo squircle oficial.
  - Eliminación definitiva del rótulo redundante `"INVESTIGACIÓN AMBIENTAL · PUNO, PERÚ"`.
- **Sistema de diseño unificado (Dark Theme Institucional):**
  - Fin absoluto de la discrepancia visual entre páginas claras y oscuras: todas las rutas (`Inicio`, `Explorador`, `Comparar`, `Hallazgos`, `Metodología`, `Fuentes`) comparten la misma escala cromática sobria.
  - Paleta centralizada en `web/src/styles/tokens.css` y `web/src/styles/global.css`:
    - Fondo principal: `#061827`
    - Fondo secundario: `#0B2B40`
    - Superficie de tarjetas: `#102E43`
    - Superficie elevada: `#153C52`
    - Color principal (Cian): `#20D7DF`
    - Color secundario (Turquesa): `#69DAD6`
    - Texto principal: `#F7FAFC`
    - Texto secundario: `#BED1DD`
    - Bordes discretos: `#28536A`
    - Estado positivo: `#20D6A0`
    - Advertencia: `#D6A461`
    - Error: `#E97979`
    - Colores por cuenca: Ramis (`#20D7DF`), Coata (`#20D6A0`), Ilave (`#C084FC`), Huancané (`#69DAD6`), Lago (`#0369A1`).
- **Encuadre, límites de cámara y corrección del visor 3D:**
  - Eliminación de bordes o marcos rectangulares en el contenedor 3D; fondo transparente integrado sobre el paisaje andino.
  - Cálculo adaptativo de distancia de cámara `getOptimalDistance(aspect)` según la relación de aspecto del contenedor para impedir cualquier recorte del satélite o del anillo orbital exterior (R=3.22) en monitores ultrapanorámicos, portátiles o pantallas verticales.
  - Restricción del ángulo de inclinación vertical (pitch clamped entre `-0.15` y `0.45` radianes) y zoom seguro para evitar inversiones o vistas anómalas.
- **Reorganización espacial de telemetría (HeroTelemetryPanels):**
  - Separación física en columna auxiliar lateral derecha independiente del canvas 3D para erradicar cualquier solapamiento sobre la cartografía o el satélite.
  - 1. Monitoreo satelital (NASA IMERG V07, actualización mensual).
  - 2. Precipitación (tendencia histórica con minigráfico interactivo + badge Altiplano 3,812 msnm).
  - 3. Contrastes (diferenciales de precipitación y rigor inferencial HAC / FDR).
- **Sobriedad y eliminación de redundancias textuales:**
  - Supresión de eslóganes repetitivos como `"Análisis reproducible y transparente"` o citas repetidas en cada tarjeta.
  - Datos de período calibrados honestamente a los 24 años completos (2001-2024).
- **Verificación de calidad y estándares:**
  - 16/16 pruebas unitarias y de integración de frontend en Vitest (100% pasadas).
  - 32/32 pruebas de pipeline científico en Pytest (100% pasadas).
  - 0 errores en `tsc --noEmit` y compilación de producción Vite limpia.
  - 0 comentarios de código en archivos de código fuente (`.ts`, `.tsx`, `.py`).

---

## Corrección de Layout Fluido, Integración del Lago Titicaca y Perfeccionamiento 3D (Noviembre 2026)

- **Aprovechamiento de pantalla y distribución fluida:**
  - Se eliminaron las restricciones de ancho rígido (`max-width: 1440px`) en `.container`, expandiéndolo a `max-width: 1800px` con padding lateral dinámico `clamp(20px, 4.2vw, 72px)`. En monitores de 1650 px los márgenes laterales se sitúan entre 60 y 70 px.
  - Hero estructurado en dos zonas principales: columna izquierda de ~40% (título, descripción, botones CTA y fuentes científicas sin redundancias) y columna derecha de ~60% (modelo 3D y columna auxiliar de paneles).
- **Incorporación oficial y conforme del Lago Titicaca:**
  - Se extrajo e integró la cartografía del Lago Titicaca (`web/public/data/lake.geojson`) reproyectada en el mismo sistema geodésico y plano de referencia conforme que las cuatro cuencas tributarias (`web/src/data/basinPolygons.ts`).
  - Modelado tridimensional de Lago Mayor y Lago Menor (Huiñaymarca) en agua azul profundo reflectante (`#073F69`), extrusión conceptual a nivel de espejo de agua (`y = 0.02`) y contorno perimétrico cian discreto (`#20D7DF`).
  - Cohesión geográfica auténtica: las cuencas de Ramis (noroeste), Huancané (noreste), Coata (centro-oeste) e Ilave (suroeste) desembocan y encajan exactamente en el litoral del lago.
- **Ampliación de escala y encuadre 3D (70% - 85% de ocupación):**
  - El conjunto territorial ocupa el ~80% del área vertical y horizontal de la escena.
  - Cámara calibrada a `FOV = 38°`, posición `(0, 3.6, dist)` y target en el centroide geográfico `(0, 0.1, 0)`.
  - Zoom dinámico acotado estrictamente entre 4.8 y 9.8 unidades para evitar desbordes y pérdidas de contexto.
- **Refinamiento de satélite y anillo orbital:**
  - Satélite reposicionado a altura visible equilibrada (`y = 2.05`) dentro del encuadre. Cuerpo central octogonal de manta térmica dorada (MLI), aviónica plateada/blanca, alas fotovoltaicas simétricas de celda azul profundo, sensor parabólico apuntando al lago y haz de escaneo cónico translúcido cian con pulso armónico.
  - Anillo orbital exterior concéntrico (`R = 3.32 - 3.36`) rodeando limpiamente todo el conjunto de lago y cuencas con marcas radiales y nodos de telemetría sin colisiones geométricas.
- **Columna auxiliar de telemetría HUD (200 - 240 px):**
  - Reorganizada en 3 paneles uniformes sin superposiciones sobre el modelo 3D:
    1. *Monitoreo satelital* (NASA GPM-IMERG V07, actualización mensual calibrada).
    2. *Precipitación* (Tendencia histórica con minigráfico interactivo y tasa media de -8.2 mm/año).
    3. *Contrastes* (Brechas territoriales intercuenca con inferencia HAC / FDR).
  - Eliminada la tarjeta independiente de Altiplano.
- **Fotografía panorámica auténtica visible:**
  - Fondo fotográfico del lago Titicaca optimizado con doble degradado sutil: oscurecimiento profundo lateral en la zona de textos (izquierda) y transparencia luminosa en el centro/derecha para apreciar con nitidez el espejo de agua andino y la cordillera.
- **Validación visual automatizada en navegador real (Headless Chrome):**
  - Captura y verificación de renderizado en `desktop-1650x900.png`, `laptop-1366x768.png` y `mobile-390x844.png`.
  - En móviles, botones CTA apilados verticalmente a ancho completo sin desbordes horizontales ni recortes.

---

## Auditoría Final de Preparación para Producción (Noviembre 2026)

- **Objetivo:** Auditoría exhaustiva y refinamiento integral de la plataforma TITICACA CONTRAST para su lanzamiento público y despliegue en producción.
- **Responsable:** Antigravity / Pair Programming
- **Estado general:** APROBADO PARA PRODUCCIÓN

### 1. Portada / Inicio (`Home.tsx`)
- [x] Remoción de tarjetas metodológicas redundantes, panel de transparencia técnica excesivo y badges duplicados.
- [x] Reestructuración del bloque inferior bajo la denominación oficial **"Hallazgos clave"**.
- [x] Presentación sobria y focalizada en 4 tarjetas de datos esenciales:
  - 4 cuencas tributarias oficiales (Ramis, Coata, Ilave, Huancané).
  - Período validado de 24 años completos (2001–2024).
  - Tasa de precipitación estimada (4/4 cuencas con tendencia Theil-Sen decreciente).
  - Evidencia de divergencia: 0 de 6 contrastes emparejados confirmados tras corrección FDR ($q > 0.05$).
- [x] Erradicación de afirmaciones no científicas que declaraban "estabilidad demostrada" u "homogeneidad comprobada"; se adopta la interpretación rigurosa de evidencia insuficiente para rechazar la hipótesis nula.

### 2. Explorador de Cuencas (`Explorer.tsx`)
- [x] Optimización de proporciones del mapa cartográfico oficial (Leaflet sobre OpenStreetMap libre de API keys).
- [x] Agrupamiento lógico de controles de selección de cuenca y rango temporal (2001–2024).
- [x] Jerarquía visual clara: Nombre de cuenca, área oficial en $\text{km}^2$, tendencia Theil-Sen en $\text{mm/año}$ e interpretación científica concisa visible directamente.
- [x] Parámetros técnicos secundarios (código oficial ANA, fuente cartográfica SNIRH, valor p de Mann-Kendall y observaciones validadas) reubicados en un componente `<details>` expandible.
- [x] Preservación de atibución OpenStreetMap, integridad cartográfica y descarga directa de series CSV.

### 3. Herramienta de Comparación (`Compare.tsx` y `ContrastCard.tsx`)
- [x] Priorización inmediata de los elementos primordiales: cuencas seleccionadas, período de análisis (2001–2024), pendiente estimada de la brecha temporal ($\Delta\text{Trend}$ en $\text{mm/año}$), interpretación en lenguaje claro y gráfico comparativo (modo brecha $D(t)$, serie anual o ciclo estacional).
- [x] Métricas econométricas de inferencia (intervalo de confianza al 95% Newey-West con $L=2$, valor $p$ de Wald y valor $q$ ajustado por Benjamini–Hochberg) organizadas dentro de la sección colapsable "Detalles de inferencia estadística (HAC / FDR)".
- [x] Acceso directo a la ficha completa de evidencia (`EvidencePanel.tsx`) con evaluación de sensibilidad a rezagos ($L=1, 2, 3$).

### 4. Hallazgos Científicos (`Findings.tsx`)
- [x] Sustitución formal de etiquetas ambiguas ("Inconclusivo", "Sin cambio") por designaciones científicas honestas: **"Evidencia insuficiente tras FDR"** (par Coata ↔ Ilave) y **"Evidencia insuficiente de divergencia"** (5 pares restantes).
- [x] Prohibición expresa de interpretar la ausencia de significancia estadística como prueba de homogeneidad física o estabilidad climática.
- [x] Tarjetas compactas con nombres de cuencas, diferencial estimado, insignia de estado y botón de detalles de evidencia.
- [x] Supresión de párrafos descriptivos repetitivos; síntesis basada estrictamente en los resultados cuantitativos auditados.

### 5. Metodología (`Methodology.tsx`)
- [x] Reorganización en exactamente 5 pasos metodológicos secuenciales y claros:
  1. *Delimitación cartográfica oficial:* ANA SNIRH, Pfafstetter y simplificación topológica en EPSG:4326.
  2. *Extracción y calibración satelital:* NASA GPM IMERG V07 Final, conversión horaria a lámina mensual y promedio ponderado por área de celda.
  3. *Estimación univariada de tendencias:* Pendiente Theil-Sen y prueba de monotonicidad Mann-Kendall con corrección de empates (2001–2024).
  4. *Contraste intercuenca con covarianza robusta HAC:* Brecha temporal $D(t) = P_A(t) - P_B(t)$ con estimador Newey–West ($L=2$) y sensibilidad ante $L=1, 3$.
  5. *Control de descubrimientos falsos (FDR) y limitaciones:* Benjamini–Hochberg ($m=6, q \le 0.05$) y principio de no causalidad hidrológica.
- [x] Fórmulas matemáticas, tolerancias, especificaciones de kernel y umbrales empaquetados en contenedores colapsables `<details>`.

### 6. Fuentes y Descargas (`Sources.tsx`)
- [x] Conservación visible y destacada de procedencia institucional: NASA GES DISC (DOI: 10.5067/GPM/IMERG/3B-MONTH/07), ANA Perú (SNIRH / GeoIDEP) y autoría de la fotografía panorámica (Martin St-Amant, CC-BY-SA).
- [x] Módulo destacado de descargas principales con acceso directo a 6 conjuntos de datos:
  - `precipitation-annual.json`
  - `precipitation-monthly.csv`
  - `basins.geojson`
  - `trends.json`
  - `contrasts.json`
  - `manifest.json`
- [x] Inventario exhaustivo de archivos con sus respectivos hashes criptográficos SHA-256 trasladado a la sección expandible "Datos de investigación: Inventario técnico completo e integridad SHA-256".

### 7. Auditoría de Integridad de Datos y Resolución de Discrepancias
- [x] **Investigación de registros temporales:**
  - Se confirmó que los 297 meses procesados corresponden exactamente a las observaciones mensuales calibradas de NASA GPM IMERG Final V07 publicadas al momento del corte (2001-01 a 2025-09).
  - El archivo `precipitation-monthly.csv` contiene exactamente 1,200 filas porque abarca 25 años completos de calendario civil (2001-01 a 2025-12) para las 4 cuencas ($25 \times 12 \times 4 = 1,200$).
  - Los últimos 3 meses de 2025 (octubre, noviembre y diciembre, 12 registros de cuenca) son valores nulos registrados de forma transparente debido a la latencia oficial de calibración del producto Final de la NASA (2 a 3 meses), sin imputaciones ficticias.
  - La línea base estadística confirmatoria se restringe a los 24 años completos (2001–2024, 1,152 registros mensuales y 96 registros anuales), garantizando solidez numérica y homogeneidad temporal.

### 8. Sistema Visual y Accesibilidad
- [x] Paleta institucional unificada (Dark Theme): Azul profundo `#061827`, azul petróleo `#0B2B40`, superficie de tarjeta `#102E43`, cian tecnológico `#20D7DF` y turquesa `#69DAD6`.
- [x] Estándares de contraste WCAG 2.2 AA superados en todos los textos e indicadores de interfaz.
- [x] Tipografía, botones semánticos, selectores, bordes redondeados y espaciados estandarizados mediante variables CSS en `tokens.css`.

### 9. Pie de Página Corporativo (`Footer.tsx`)
- [x] Unificación del pie de página con texto institucional obligatorio:
  `© 2026 DalíPE. All rights reserved. · Academic affiliation: UPRIT`
- [x] Enlaces directos y funcionales hacia Metodología y Fuentes oficiales.

### 10. Auditoría de Seguridad Web (OWASP Top 10:2025)
- [x] **A01: Broken Access Control:** Inexistente; arquitectura cliente-estática sin endpoints de servidor ni elevación de privilegios.
- [x] **A02: Cryptographic Failures:** Todos los recursos remotos se consumen sobre TLS/HTTPS seguro. Hashes SHA-256 verificados para cada archivo de datos.
- [x] **A03: Injection:** Cero consultas SQL o shells dinámicos en tiempo de ejecución web; renderizado React con escape de contexto nativo.
- [x] **A04: Insecure Design:** Enfoque estático inmutable por diseño.
- [x] **A05: Security Misconfiguration:** Dependencias fijadas, rutas relativas configuradas y sugerencia de cabeceras de seguridad (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`).
- [x] **A06: Vulnerable and Outdated Components:** Auditoría `npm audit` realizada; 0 vulnerabilidades explotables en el bundle estático de producción.
- [x] **A07: Identification and Authentication Failures:** No aplica; el observatorio es de acceso público y abierto, sin sesiones de usuario.
- [x] **A08: Software and Data Integrity Failures:** Verificación criptográfica con `manifest.json`.
- [x] **A09: Security Logging and Monitoring Failures:** Telemetría estática y mensajes semánticos de estado en interfaz (`StatusMessage`).
- [x] **A10: Server-Side Request Forgery (SSRF):** Inexistente; no hay proxies dinámicos en servidor.

### 11. Rendimiento y Diseño Adaptativo
- [x] Verificación de maquetación en resoluciones clave:
  - Monitor Ultra/Escritorio: 1650 × 900 px (ancho fluido hasta 1800 px, márgenes laterales equilibrados).
  - Portátil estándar: 1366 × 768 px (sin solapamientos ni desbordes).
  - Dispositivo móvil: 390 × 844 px (navegación vertical fluida, botones apilados a ancho completo, controles táctiles accesibles).

### 12. Verificación Integral de Código y Entregables
- [x] **CERO COMENTARIOS:** Verificación automatizada con script de análisis léxico sobre todos los archivos `.ts`, `.tsx` y `.py`; se certifica la ausencia total de comentarios (`//`, `/* */`, `#`).
- [x] **Compilación y Tipado:** `npm run typecheck` finalizado con 0 errores; `npm run lint` finalizado con 0 advertencias.
- [x] **Pruebas Frontend:** 16 de 16 pruebas unitarias y de integración pasadas en Vitest (100%).
- [x] **Pruebas de Pipeline:** 32 de 32 pruebas científicas pasadas en Pytest (100%).
- [x] **Compilación de Producción:** Vite genera exitosamente `web/dist/` optimizado con `manualChunks`.
