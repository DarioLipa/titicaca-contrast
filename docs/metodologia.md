# Metodología Científica

## 1. Definición de cuencas

Las cuatro cuencas seleccionadas corresponden a unidades hidrográficas tributarias principales de la vertiente del lago Titicaca:
- Ramis
- Coata
- Ilave
- Huancané

Las delimitaciones provienen del catálogo oficial de Unidades Hidrográficas de la Autoridad Nacional del Agua (ANA), verificadas en nivel hidrográfico equivalente y validadas topológicamente.

## 2. Estimación de precipitación mensual

La variable de precipitación proviene de NASA GPM IMERG Final V07 (`GPM_3IMERGM_07`). La variable original se expresa como tasa media en mm/h.
La conversión a lámina mensual acumulada se calcula con la fórmula:

$$P_{\text{mes}} (\text{mm}) = \text{tasa media} (\text{mm/h}) \times 24 \times d_{\text{mes}}$$

donde $d_{\text{mes}}$ representa el número exacto de días del mes considerado (incluyendo 29 días para febrero en años bisiestos).

La agregación espacial a nivel de cuenca se realiza mediante media ponderada por área de intersección:

$$P_{\text{cuenca}} = \frac{\sum (P_{\text{píxel}} \times \text{área}_{\text{intersección}})}{\sum \text{área}_{\text{intersección}}}$$

Se exige un umbral mínimo de 95% de área válida por mes para considerar la observación completa.

## 3. Estimación anual

La precipitación anual corresponde a la suma de los 12 meses completos del año calendario:

$$P_{\text{anual}} = \sum_{m=1}^{12} P_{\text{mes}, m}$$

No se interpolan meses faltantes. Si un año presenta meses incompletos, se marca como inválido para las series anuales principales.

## 4. Tendencias individuales

Para cada cuenca se calcula:
- Pendiente de Theil–Sen (mm/año y mm/década).
- Prueba no paramétrica de Mann–Kendall para verificar significancia estadística ($p \le 0.05$).

## 5. Detector de contrastes climáticos (análisis emparejado)

Para cada pareja de cuencas $(A, B)$ y para cada año común completo $t$:

$$D(t) = P_A(t) - P_B(t)$$

Se evalúa la tendencia temporal de la brecha $D(t)$ mediante regresión lineal con errores estándar robustos a heterocedasticidad y autocorrelación (HAC / Newey–West).
Para controlar la tasa de descubrimientos falsos en los 6 contrastes simultáneos, se aplica el procedimiento de Benjamini–Hochberg con un umbral de $q \le 0.05$.

## 6. Clasificación de evidencia

1. **Contraste respaldado:** Pendiente de la brecha con intervalo de confianza al 95% que no incluye cero y $q \le 0.05$.
2. **Contraste observado, no concluyente:** Variaciones observadas sin significancia estadística suficiente tras corrección múltiple.
3. **Sin cambio detectable en la brecha:** La prueba no rechaza la hipótesis nula de pendiente cero.
4. **Datos insuficientes:** Menos de 20 años emparejados completos o problemas de calidad en fuentes.
