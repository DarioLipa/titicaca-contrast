# Registro de Decisiones de Arquitectura y Metodología (ADR)

## ADR-001: Desacoplamiento de procesamiento y visualización estática

- **Fecha:** 2026-11-10
- **Decisión:** Mantener el pipeline de datos en Python y el frontend en React + TypeScript como capas desacopladas, comunicadas únicamente mediante artefactos versionados en `web/public/data/`.
- **Motivo:** Garantizar que la aplicación web pública funcione con cero costo de infraestructura en tiempo de ejecución (hosting estático gratuito), sin exponer credenciales científicas ni requerir un backend activo de alta demanda computacional.
- **Consecuencias:** Los cálculos geoespaciales y estadísticos se precalculan y validan antes del despliegue. Si los datos aún no están procesados o validados, el frontend debe indicar de forma transparente el estado "datos no disponibles".

## ADR-002: Ausencia de comentarios en código fuente

- **Fecha:** 2026-11-10
- **Decisión:** Cumplir estrictamente la directriz del Plan Maestro: código fuente limpio sin comentarios internos (`//`, `/* */`, `#`). Toda la justificación técnica, científica y de diseño se documenta en `docs/` y en las vistas metodológicas de la interfaz.
- **Motivo:** Especificación contractual del Plan Maestro.

