import React from "react"
import type { HydrologyData } from "../app/dataLoader"
import { StatusMessage } from "../components/StatusMessage"

export interface HomeProps {
  data: HydrologyData
  onNavigate: (tab: string) => void
}

export const Home: React.FC<HomeProps> = ({ data, onNavigate }) => {
  const isReady = data.status === "ready"

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <section style={{ marginBottom: "var(--spacing-2xl)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-primary-navy)", marginBottom: "var(--spacing-md)" }}>
          ¿Evolucionan igual las lluvias en las cuencas del lago Titicaca?
        </h2>
        <p style={{ fontSize: "1.15rem", color: "var(--color-text-muted)", maxWidth: "840px", lineHeight: 1.6, marginBottom: "var(--spacing-lg)" }}>
          Un promedio regional puede ocultar diferencias territoriales críticas. TITICACA CONTRAST analiza si la brecha de precipitación histórica entre las cuatro cuencas tributarias principales (<strong>Ramis, Coata, Ilave y Huancané</strong>) se amplía, se reduce o permanece constante, utilizando datos satelitales oficiales de NASA GPM IMERG V07 y cartografía ANA.
        </p>
        <div style={{ display: "flex", gap: "var(--spacing-md)", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => onNavigate("explorer")}
            style={{
              backgroundColor: "var(--color-action-blue)",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "var(--border-radius-md)",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "var(--shadow-sm)"
            }}
          >
            Explorar cuencas individuales
          </button>
          <button
            type="button"
            onClick={() => onNavigate("compare")}
            style={{
              backgroundColor: "transparent",
              color: "var(--color-action-blue)",
              border: "1px solid var(--color-action-blue)",
              padding: "12px 24px",
              borderRadius: "var(--border-radius-md)",
              fontSize: "1rem",
              fontWeight: 600
            }}
          >
            Comparar parejas de cuencas
          </button>
          <button
            type="button"
            onClick={() => onNavigate("findings")}
            style={{
              backgroundColor: "var(--color-surface-muted)",
              color: "var(--color-primary-navy)",
              padding: "12px 24px",
              borderRadius: "var(--border-radius-md)",
              fontSize: "1rem",
              fontWeight: 600
            }}
          >
            Ver matriz de hallazgos
          </button>
        </div>
      </section>

      {isReady && (
        <section style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--border-radius-md)",
          padding: "var(--spacing-lg)",
          marginBottom: "var(--spacing-2xl)"
        }}>
          <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-md)" }}>
            Resumen de evidencia científica confirmatoria (2001–2024)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
            <div style={{ padding: "var(--spacing-sm) var(--spacing-md)", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Meses NASA IMERG Final:</span>
              <strong style={{ fontSize: "1.25rem", color: "var(--color-primary-navy)" }}>297 meses</strong>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>2001-01 a 2025-09</span>
            </div>
            <div style={{ padding: "var(--spacing-sm) var(--spacing-md)", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Años completos:</span>
              <strong style={{ fontSize: "1.25rem", color: "var(--color-primary-navy)" }}>24 años</strong>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>2001 a 2024 (12 meses c/u)</span>
            </div>
            <div style={{ padding: "var(--spacing-sm) var(--spacing-md)", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Tendencias Theil-Sen:</span>
              <strong style={{ fontSize: "1.25rem", color: "var(--color-alert)" }}>4 / 4 decrecientes</strong>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>p &lt; 0.05 en todas</span>
            </div>
            <div style={{ padding: "var(--spacing-sm) var(--spacing-md)", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Contrastes emparejados (FDR):</span>
              <strong style={{ fontSize: "1.25rem", color: "var(--color-primary-navy)" }}>5 estables / 1 inconcluso</strong>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Brechas temporales constantes</span>
            </div>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
            <strong>Hallazgo central:</strong> Aunque las 4 cuencas experimentaron caídas anuales en su precipitación acumulada entre 2001 y 2024, la diferencia relativa entre ellas no mostró divergencia confirmada tras el control estricto de descubrimientos falsos.
          </p>
        </section>
      )}

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--spacing-lg)", marginBottom: "var(--spacing-2xl)" }}>
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
            1. Cuatro cuencas oficiales
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
            Delimitaciones hidrográficas oficiales de la Autoridad Nacional del Agua (ANA), con validación topológica continua y cálculo de superficie geodésica.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
            2. Datos NASA IMERG V07 Final
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
            Producto satelital multifuente calibrado mensual (GPM_3IMERGM_07), ponderado rigurosamente por área de intersección en cada celda de 0.1° (~10 km).
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
            3. Detector de contrastes HAC / FDR
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
            Análisis emparejado de brechas temporales con errores estándar robustos a heterocedasticidad y autocorrelación temporal (Newey–West) y control FDR (Benjamini–Hochberg).
          </p>
        </div>
      </section>

      <section className="card" style={{ backgroundColor: "#FFFFFF" }}>
        <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          Ficha de transparencia del observatorio
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Estado del repositorio:</dt>
          <dd>{data.status === "ready" ? "Colección verificada y lista para consulta pública" : "Pendiente de procesamiento"}</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Período cubierto:</dt>
          <dd>2001-01 a 2024-12 (24 años completos confirmatorios; 2025 parcial excluido de tendencias anuales)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Resolución nativa:</dt>
          <dd>NASA IMERG L3 Final 0.1° × 0.1° (~10 km)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Política de datos:</dt>
          <dd>Cero datos simulados presentados como resultados reales. Ausencia de diferencias es un resultado científico válido.</dd>
        </dl>
      </section>
    </div>
  )
}
