import React from "react"

export interface FooterProps {
  onSelectTab: (tab: string) => void
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer style={{
      marginTop: "auto",
      backgroundColor: "var(--color-primary-navy)",
      color: "#FFFFFF",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      paddingTop: "var(--spacing-xl)",
      paddingBottom: "var(--spacing-xl)"
    }}>
      <div className="container" style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-md)",
        fontSize: "0.85rem",
        color: "var(--color-surface-muted)"
      }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--spacing-md)"
        }}>
          <div>
            <strong style={{ color: "#FFFFFF" }}>TITICACA CONTRAST</strong> — Observatorio de precipitaciones y contrastes climáticos
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
            <button
              type="button"
              onClick={() => onSelectTab("methodology")}
              style={{ color: "var(--color-surface-muted)", textDecoration: "underline", fontSize: "0.85rem" }}
            >
              Metodología científica
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("sources")}
              style={{ color: "var(--color-surface-muted)", textDecoration: "underline", fontSize: "0.85rem" }}
            >
              Fuentes y licencias
            </button>
          </div>
        </div>

        <div style={{ lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            <strong>Fuentes oficiales:</strong> Estimaciones satelitales NASA GPM-IMERG Final V07 (DOI 10.5067/GPM/IMERG/3B-MONTH/07) y cartografía oficial de Unidades Hidrográficas de la Autoridad Nacional del Agua (ANA), Perú.
          </p>
          <p style={{ margin: 0, marginTop: "var(--spacing-xs)" }}>
            <strong>Aclaración de independencia:</strong> Este proyecto de investigación abierta no representa una posición oficial ni afiliación directa de la NASA ni del Gobierno del Perú.
          </p>
        </div>
      </div>
    </footer>
  )
}
