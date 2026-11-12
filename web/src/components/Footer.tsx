import React from "react"
import { useLanguage } from "../app/i18n"
import { Logo } from "./Logo"

export interface FooterProps {
  onSelectTab: (tab: string) => void
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const { t } = useLanguage()

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
              {t("footer_link_methodology")}
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("sources")}
              style={{ color: "var(--color-primary-cyan)", fontSize: "0.85rem" }}
            >
              {t("footer_link_sources")}
            </button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(40, 83, 106, 0.4)", paddingTop: "var(--spacing-md)", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
          <p style={{ margin: 0 }}>
            © 2026 DalíPE. {t("footer_rights")} · {t("footer_affiliation")}
          </p>
        </div>
      </div>
    </footer>
  )
}
