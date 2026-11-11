import React from "react"

export const Methodology: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
          Metodología científica y protocolo inferencial
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5, fontSize: "0.95rem" }}>
          Documentación transparente de las ecuaciones, estimadores estadísticos, correcciones de multiplicidad y limitaciones físicas adoptadas en TITICACA CONTRAST.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          1. Conversión de tasa horaria a lámina mensual acumulada
        </h3>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          El producto NASA GPM IMERG Final (<code>GPM_3IMERGM_07</code>) provee la variable <code>precipitation</code> como tasa media horaria del mes en <code>mm/h</code>. Para obtener la lámina mensual acumulada en milímetros (<code>mm</code>) sobre cada píxel, se multiplica la tasa horaria por 24 horas y por el número exacto de días calendario de dicho mes:
        </p>
        <pre
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            borderRadius: "var(--border-radius-sm)",
            fontFamily: "var(--font-family-mono)",
            fontSize: "0.9rem",
            color: "var(--color-primary-cyan)",
            overflowX: "auto"
          }}
        >
          Precipitación mensual (mm) = Tasa media (mm/h) × 24 × Días del mes
        </pre>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "var(--spacing-xs)" }}>
          Se calculan exactamente 28 días para febrero convencional y 29 días para años bisiestos (ej. 2004, 2008, 2012, 2016, 2020, 2024).
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          2. Agregación espacial con ponderación exacta por área de intersección
        </h3>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          Para evitar distorsiones causadas por celdas perimetrales o geometría irregular de las divisorias de aguas, la precipitación sobre la cuenca corresponde al promedio ponderado de las celdas IMERG (0.1° × 0.1°) que intersectan el polígono oficial ANA:
        </p>
        <pre
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            borderRadius: "var(--border-radius-sm)",
            fontFamily: "var(--font-family-mono)",
            fontSize: "0.9rem",
            color: "var(--color-primary-cyan)",
            overflowX: "auto"
          }}
        >
          P_cuenca = Σ(P_pixel × Área_intersección) / Σ(Área_intersección)
        </pre>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "var(--spacing-xs)" }}>
          Criterio de representatividad: una cuenca debe contar con un área válida cubierta de al menos 95% para ser admitida como mes válido. Los valores faltantes nunca se imputan como precipitación cero.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          3. Tendencias univariadas: Estimador Theil-Sen y prueba Mann-Kendall
        </h3>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          La tasa de cambio interanual de la precipitación acumulada anual de cada cuenca se cuantifica con el estimador de Theil-Sen, correspondiente a la mediana de las pendientes calculadas entre todos los pares de años posibles:
        </p>
        <pre
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            borderRadius: "var(--border-radius-sm)",
            fontFamily: "var(--font-family-mono)",
            fontSize: "0.9rem",
            color: "var(--color-primary-cyan)",
            overflowX: "auto"
          }}
        >
          Pendiente Theil-Sen = mediana [ (P_j - P_i) / (t_j - t_i) ] para todo i &lt; j
        </pre>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "var(--spacing-xs)" }}>
          Este estimador no paramétrico es insensible a valores extremos y no asume normalidad en los residuos. La significancia estadística se evalúa con la prueba no paramétrica de Mann-Kendall con corrección por empates.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          4. Detector de contrastes emparejados: Errores robustos HAC y control FDR
        </h3>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          Para evaluar si dos cuencas tributarias A y B divergen en su comportamiento hídrico, se calcula la serie temporal de brechas emparejadas para cada año común t:
        </p>
        <pre
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            borderRadius: "var(--border-radius-sm)",
            fontFamily: "var(--font-family-mono)",
            fontSize: "0.9rem",
            color: "var(--color-primary-cyan)",
            overflowX: "auto"
          }}
        >
          D(t) = P_A(t) - P_B(t)
        </pre>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          La tendencia se estima por regresión lineal OLS: <code>D(t) = α + β·t + ε(t)</code>. Dada la inercia climática interanual y los ciclos ENSO, los errores estándar se corrigen mediante el estimador de Newey–West consistente con heterocedasticidad y autocorrelación (HAC) con rezago primario L = 2, registrando adicionalmente la sensibilidad ante L = 1 y L = 3.
        </p>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          Para evitar conclusiones espurias derivadas de realizar 6 comparaciones simultáneas sobre las 4 cuencas, se aplica la corrección de Benjamini–Hochberg fijando una tasa de descubrimientos falsos (FDR) de q ≤ 0.05.
        </p>
        <div
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            padding: "var(--spacing-md)",
            borderRadius: "var(--border-radius-sm)"
          }}
        >
          <strong style={{ display: "block", marginBottom: "6px", fontSize: "0.9rem", color: "var(--color-text-main)" }}>Matriz de decisión de evidencia:</strong>
          <ul style={{ margin: 0, paddingLeft: "var(--spacing-md)", fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
            <li style={{ marginBottom: "4px" }}><strong style={{ color: "var(--color-status-positive)" }}>Cambio sustentado (supported):</strong> p &lt; 0.05 y q (FDR) ≤ 0.05 con dirección estable ante rezagos HAC.</li>
            <li style={{ marginBottom: "4px" }}><strong style={{ color: "var(--color-status-warning)" }}>Inconcluso (inconclusive):</strong> p univariada &lt; 0.05 pero q &gt; 0.05 (no sobrevive a la corrección por multiplicidad), o sensibilidad excesiva a los rezagos.</li>
            <li><strong style={{ color: "var(--color-primary-cyan)" }}>Sin cambio detectable (no_change):</strong> p &gt; 0.05 y el intervalo de confianza al 95% contiene al cero.</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ lineHeight: 1.6 }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-status-warning)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          5. Limitaciones científicas y principio de no causalidad
        </h3>
        <ul style={{ paddingLeft: "var(--spacing-lg)", fontSize: "0.92rem", color: "var(--color-text-secondary)" }}>
          <li style={{ marginBottom: "6px" }}>
            <strong style={{ color: "var(--color-text-main)" }}>Ausencia de inferencia causal:</strong> Esta plataforma analiza estrictamente tendencias lineales en precipitación. No debe interpretarse que un cambio o estabilidad en la precipitación sea la causa exclusiva de las variaciones del nivel del Lago Titicaca, pues entran en juego la evapotranspiración, balance térmico, extracción para riego y dinámicas glaciares.
          </li>
          <li style={{ marginBottom: "6px" }}>
            <strong style={{ color: "var(--color-text-main)" }}>Incertidumbre satelital en alta montaña:</strong> Las estimaciones radiométricas pasivas y de radar orbital pueden presentar atenuación o sobrestimación por congelamiento y relieve accidentado en la cordillera andina (&gt;3,800 m s.n.m.).
          </li>
          <li>
            <strong style={{ color: "var(--color-text-main)" }}>Períodos completos:</strong> El análisis confirmatorio se limita a los 24 años completos (2001–2024). Los meses parciales de 2025 se excluyen del cómputo anual para garantizar rigor numérico.
          </li>
        </ul>
      </div>
    </div>
  )
}
