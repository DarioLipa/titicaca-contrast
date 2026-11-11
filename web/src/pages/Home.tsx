import React from "react"
import type { DataPayload } from "../app/dataLoader"
import { StatusMessage } from "../components/StatusMessage"

export interface HomeProps {
  data: DataPayload
  onNavigate: (tab: string) => void
}

export const Home: React.FC<HomeProps> = ({ data, onNavigate }) => {
  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <section style={{ marginBottom: "var(--spacing-2xl)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-primary-navy)", marginBottom: "var(--spacing-md)" }}>
          ¿Evolucionan igual las lluvias en las cuencas del lago Titicaca?
        </h2>
        <p style={{ fontSize: "1.15rem", color: "var(--color-text-muted)", maxWidth: "800px", lineHeight: 1.6, marginBottom: "var(--spacing-lg)" }}>
          Un promedio regional puede ocultar diferencias territoriales críticas. TITICACA CONTRAST analiza si la brecha de precipitación histórica entre las cuencas <strong>Ramis, Coata, Ilave y Huancané</strong> se amplía, se reduce o permanece constante.
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
            Explorar cuencas
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
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--spacing-lg)", marginBottom: "var(--spacing-2xl)" }}>
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
            1. Cuatro cuencas oficiales
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
            Delimitaciones hidrográficas oficiales de la Autoridad Nacional del Agua (ANA), con validación topológica y cálculo de superficie geodésica.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
            2. Datos NASA IMERG V07
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
            Producto satelital multifuente calibrado mensual (GPM_3IMERGM_07), ponderado rigurosamente por área de intersección en cada cuenca.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
            3. Detector de contrastes
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
            Análisis emparejado de brechas temporales con errores estándar robustos (HAC / Newey–West) y control estricto de descubrimientos falsos (FDR).
          </p>
        </div>
      </section>

      <section className="card" style={{ backgroundColor: "#FFFFFF" }}>
        <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          Ficha de transparencia del producto
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Estado de datos:</dt>
          <dd>{data.status === "ready" ? "Colección verificada y lista" : "Pendiente de procesamiento (Fase 0)"}</dd>
          
          <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Período objetivo:</dt>
          <dd>2001 a 2025 (sujeto a disponibilidad comprobada de los 300 meses)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Resolución nativa:</dt>
          <dd>NASA IMERG L3 Final 0.1° x 0.1° (~10 km)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Política de datos:</dt>
          <dd>Cero datos simulados presentados como resultados reales. Ausencia de diferencias es un resultado válido.</dd>
        </dl>
      </section>
    </div>
  )
}
