import React from "react"
import { Logo } from "./Logo"

export interface FooterProps {
  onSelectTab: (tab: string) => void
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer
      style={{
        marginTop: "auto",
        backgroundColor: "var(--color-bg-secondary, #0B2B40)",
        color: "var(--color-text-main, #F7FAFC)",
        borderTop: "1px solid var(--color-border-discrete, #28536A)",
        paddingTop: "var(--spacing-xl)",
        paddingBottom: "var(--spacing-xl)"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-md)",
          fontSize: "0.85rem",
          color: "var(--color-text-secondary, #BED1DD)"
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--spacing-md)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Logo variant="compact" height={32} />
          </div>

          <div style={{ display: "flex", gap: "var(--spacing-md)", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onSelectTab("methodology")}
              style={{ color: "var(--color-primary-cyan)", fontSize: "0.85rem" }}
            >
              Metodología
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("sources")}
              style={{ color: "var(--color-primary-cyan)", fontSize: "0.85rem" }}
            >
              Fuentes y licencias
            </button>
          </div>
        </div>

        <div style={{ lineHeight: 1.6, borderTop: "1px solid rgba(40, 83, 106, 0.4)", paddingTop: "var(--spacing-md)" }}>
          <p style={{ margin: 0 }}>
            Estimaciones satelitales NASA GPM-IMERG Final V07 y cartografía de Unidades Hidrográficas de la Autoridad Nacional del Agua (ANA), Perú.
          </p>
          <p style={{ margin: 0, marginTop: "var(--spacing-xs)", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            Iniciativa de investigación científica abierta independiente.
          </p>
        </div>
      </div>
    </footer>
  )
}
