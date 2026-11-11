import React from "react"

export const Methodology: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
          Metodología científica y protocolo inferencial
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5, fontSize: "0.95rem" }}>
          Protocolo reproducible de 5 etapas para el procesamiento satelital, estimación univariada y contraste pareado de cuencas del lago Titicaca.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            Paso 1: Delimitación cartográfica oficial
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            ANA SNIRH · Pfafstetter
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          Las 4 cuencas tributarias principales (Ramis, Coata, Ilave y Huancané) se extraen de la delimitación oficial de Unidades Hidrográficas del Perú (ANA SNIRH). Las geometrías vectoriales se simplifican topológicamente conservando continuidad espacial en EPSG:4326.
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            Detalles técnicos, tolerancias y verificación cartográfica
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <p style={{ margin: "0 0 6px 0" }}>
              Simplificación topológica mediante Visvalingam–Whyatt con umbral controlado de 0.001° conservando la divisoria de aguas hidrográfico-oficial y frontera binacional del lago Titicaca.
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-family-mono)", fontSize: "0.8rem", color: "var(--color-text-main)" }}>
              Códigos ANA: Ramis (0179+018+019, 15.870,42 km²), Coata (0176, 4.882,42 km²), Ilave (016, 7.791,00 km²), Huancané (0178, 3.611,92 km²).
            </p>
          </div>
        </details>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            Paso 2: Extracción y calibración satelital
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            NASA GPM IMERG V07 Final
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          Series mensuales de precipitación satelital calibrada con pluviómetros de superficie (GPM_3IMERGM_07) a resolución espacial de 0.1° × 0.1°. La lámina mensual se computa integrando la tasa media horaria y ponderando exactamente el área de intersección sobre cada cuenca.
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            Formulación matemática, umbrales y máscara espacial
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <pre
              style={{
                backgroundColor: "rgba(6, 24, 39, 0.6)",
                border: "1px solid var(--color-border-discrete)",
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                fontFamily: "var(--font-family-mono)",
                fontSize: "0.82rem",
                color: "var(--color-primary-cyan)",
                overflowX: "auto",
                margin: "4px 0 8px 0"
              }}
            >
              Precipitación mensual (mm) = Tasa media (mm/h) × 24 × Días del mes{"\n"}
              P_cuenca = Σ(P_pixel × Área_intersección) / Σ(Área_intersección)
            </pre>
            <p style={{ margin: 0 }}>
              Criterio de representatividad: umbral mínimo de cobertura válida ≥ 95% para considerar un mes admitido. Los meses incompletos o faltantes nunca se imputan como precipitación cero.
            </p>
          </div>
        </details>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            Paso 3: Estimación univariada de tendencias
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            Theil-Sen · Mann-Kendall
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          Determinación de la tasa de cambio interanual mediante el estimador no paramétrico de Theil-Sen y evaluación de monotonicidad con la prueba de Mann-Kendall con ajuste por empates sobre el período validado 2001–2024 (24 años completos).
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            Ecuaciones del estimador y consideraciones de robustez
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <pre
              style={{
                backgroundColor: "rgba(6, 24, 39, 0.6)",
                border: "1px solid var(--color-border-discrete)",
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                fontFamily: "var(--font-family-mono)",
                fontSize: "0.82rem",
                color: "var(--color-primary-cyan)",
                overflowX: "auto",
                margin: "4px 0 8px 0"
              }}
            >
              Pendiente Theil-Sen = mediana [ (P_j - P_i) / (t_j - t_i) ] para todo i &lt; j
            </pre>
            <p style={{ margin: 0 }}>
              Este estimador no paramétrico es insensible a valores extremos y no asume normalidad en los residuos. El estadístico S de Mann-Kendall se computa con corrección exacta de varianza ante empates pluviométricos.
            </p>
          </div>
        </details>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            Paso 4: Contraste intercuenca con covarianza robusta HAC
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            Newey-West (L=2) · Brecha D(t)
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          Evaluación de la brecha temporal D(t) = P_A(t) - P_B(t) entre las 6 parejas de cuencas posibles. Los errores estándar de la regresión lineal se corrigen ante heterocedasticidad y correlación serial mediante el estimador de Newey–West (HAC) con rezago base L = 2.
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            Modelo econométrico, rezagos y análisis de sensibilidad
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <pre
              style={{
                backgroundColor: "rgba(6, 24, 39, 0.6)",
                border: "1px solid var(--color-border-discrete)",
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                fontFamily: "var(--font-family-mono)",
                fontSize: "0.82rem",
                color: "var(--color-primary-cyan)",
                overflowX: "auto",
                margin: "4px 0 8px 0"
              }}
            >
              D(t) = α + β·t + ε(t){"\n"}
              H0: β = 0 (tendencias paralelas intercuenca)
            </pre>
            <p style={{ margin: 0 }}>
              Dada la inercia climática andina y las oscilaciones tipo ENSO, se emplea el kernel triangular de Bartlett con L = 2. Cada contraste incluye análisis de sensibilidad ante L = 1 y L = 3 para verificar la invariancia de conclusiones.
            </p>
          </div>
        </details>
      </div>

      <div className="card" style={{ lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            Paso 5: Control de descubrimientos falsos (FDR) y limitaciones
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            Benjamini-Hochberg (q ≤ 0.05)
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          Control riguroso de tasa de falso descubrimiento (FDR q ≤ 0.05) para compensar la multiplicidad de contrastes (m = 6). Los resultados no significativos se interpretan honestamente como evidencia insuficiente para rechazar la hipótesis nula, sin afirmar estabilidad o equivalencia física probada.
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            Algoritmo FDR, matriz de decisión y límites de causalidad
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <ul style={{ margin: "0 0 8px 0", paddingLeft: "var(--spacing-md)" }}>
              <li style={{ marginBottom: "4px" }}>
                <strong>Divergencia confirmada (supported):</strong> p &lt; 0.05 y q (FDR) ≤ 0.05 con signo robusto ante L=1, 2, 3.
              </li>
              <li style={{ marginBottom: "4px" }}>
                <strong>Evidencia insuficiente tras FDR (inconclusive):</strong> p univariada &lt; 0.05 pero q &gt; 0.05 (no supera la corrección múltiple).
              </li>
              <li style={{ marginBottom: "4px" }}>
                <strong>Evidencia insuficiente de divergencia (no_change):</strong> p &gt; 0.05 y el intervalo de confianza al 95% contiene al cero.
              </li>
            </ul>
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
              <strong>Principio de no causalidad:</strong> Este observatorio cuantifica tendencias pluviométricas en superficie. No debe inferirse causalidad directa y exclusiva sobre el nivel del lago Titicaca, el cual responde a evaporación neta, balances térmicos y demandas hídricas.
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
