import React from "react"

export const Methodology: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-md)" }}>
        Metodología científica y rigor estadístico
      </h2>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          1. Conversión de unidades de precipitación
        </h3>
        <p style={{ marginBottom: "var(--spacing-sm)" }}>
          El producto GPM_3IMERGM_07 provee la tasa media horaria de precipitación en <code>mm/h</code>. Para obtener la lámina mensual acumulada en milímetros (mm) sobre la cuenca, se multiplica por 24 horas y por el número exacto de días del mes:
        </p>
        <pre style={{
          backgroundColor: "var(--color-surface-muted)",
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--border-radius-sm)",
          fontFamily: "var(--font-family-mono)",
          fontSize: "0.9rem",
          overflowX: "auto"
        }}>
          Precipitación mensual (mm) = Tasa media (mm/h) × 24 × Días del mes
        </pre>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          2. Agregación espacial ponderada por área
        </h3>
        <p style={{ marginBottom: "var(--spacing-sm)" }}>
          Para evitar sesgos por píxeles de borde o formas irregulares, la precipitación de la cuenca corresponde a la media ponderada por el área de intersección entre cada celda IMERG (0.1°) y el polígono oficial de la cuenca:
        </p>
        <pre style={{
          backgroundColor: "var(--color-surface-muted)",
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--border-radius-sm)",
          fontFamily: "var(--font-family-mono)",
          fontSize: "0.9rem",
          overflowX: "auto"
        }}>
          P_cuenca = Σ(P_pixel × Área_intersección) / Σ(Área_intersección)
        </pre>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: "var(--spacing-xs)" }}>
          Se exige que la cuenca cuente con al menos un 95% de área válida cubierta en el mes para considerar el dato representativo.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          3. Detector de contrastes climáticos
        </h3>
        <p>
          Para cada pareja de cuencas (A y B) y año común t, se evalúa la brecha <code>D(t) = P_A(t) - P_B(t)</code>. La tendencia de esta brecha se modela mediante mínimos cuadrados ordinarios con matriz de covarianza robusta a heterocedasticidad y autocorrelación (HAC / Newey–West).
        </p>
        <p style={{ marginTop: "var(--spacing-xs)" }}>
          La significancia conjunta de los seis contrastes se controla mediante el procedimiento Benjamini–Hochberg fijando una tasa de descubrimientos falsos (FDR) de q ≤ 0.05.
        </p>
      </div>

      <div className="card" style={{ lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.2rem", color: "var(--color-alert)", marginBottom: "var(--spacing-sm)" }}>
          4. Limitaciones científicas explícitas
        </h3>
        <ul style={{ paddingLeft: "var(--spacing-lg)", fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
          <li>No se infiere causalidad sobre el nivel del lago Titicaca, caudales observados ni sequías socioeconómicas sin incorporar balance hídrico y uso del suelo.</li>
          <li>Los datos satelitales calibrados pueden presentar incertidumbre por orografía compleja en los Andes peruanos.</li>
          <li>Un resultado no estadísticamente significativo (p &gt; 0.05) indica ausencia de evidencia de cambio monótono, no una demostración de inmutabilidad climática absoluta.</li>
        </ul>
      </div>
    </div>
  )
}
