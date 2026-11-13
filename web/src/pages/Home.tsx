import React from "react"
import type { HydrologyData } from "../app/dataLoader"
import { useLanguage } from "../app/i18n"
import { StatusMessage } from "../components/StatusMessage"
import { TerritoryHeroVisual } from "../components/TerritoryHeroVisual"
import { HeroTelemetryPanels } from "../components/HeroTelemetryPanels"

export interface HomeProps {
  data: HydrologyData
  onNavigate: (tab: string) => void
  onSelectBasin?: (basinId: string) => void
}

export const Home: React.FC<HomeProps> = ({ data, onNavigate, onSelectBasin }) => {
  const { t } = useLanguage()
  const isReady = data.status === "ready"

  return (
    <div>
      <section
        style={{
          position: "relative",
          backgroundColor: "var(--color-bg-main, #061827)",
          backgroundImage: `
            linear-gradient(90deg, rgba(6, 24, 39, 0.96) 0%, rgba(6, 24, 39, 0.88) 36%, rgba(6, 24, 39, 0.50) 62%, rgba(6, 24, 39, 0.18) 85%, rgba(6, 24, 39, 0.38) 100%),
            linear-gradient(180deg, rgba(6, 24, 39, 0.70) 0%, transparent 20%, transparent 75%, rgba(6, 24, 39, 0.95) 100%),
            url(/images/titicaca-panorama.jpg)
          `,
          backgroundPosition: "left center, center top, center 42%",
          backgroundSize: "auto, auto, cover",
          backgroundRepeat: "no-repeat",
          color: "var(--color-text-main, #F7FAFC)",
          paddingTop: "clamp(24px, 4vh, 48px)",
          paddingBottom: "clamp(32px, 5vh, 60px)",
          overflow: "hidden",
          borderBottom: "1px solid var(--color-border-discrete)"
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

          <div className="hero-grid">
            <div style={{ maxWidth: "560px", zIndex: 15 }}>
              <h1
                style={{
                  fontSize: "clamp(2.4rem, 4.4vw, 3.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.14,
                  letterSpacing: "-0.03em",
                  marginBottom: "clamp(14px, 2vh, 22px)",
                  color: "#F7FAFC"
                }}
              >
                {t("hero_title_prefix")}
                <br />
                <span style={{ color: "var(--color-primary-cyan, #20D7DF)" }}>
                  {t("hero_title_highlight")}
                </span>
              </h1>

              <p
                style={{
                  fontSize: "clamp(0.98rem, 1.15vw, 1.08rem)",
                  lineHeight: 1.65,
                  color: "var(--color-text-secondary, #BED1DD)",
                  marginBottom: "clamp(20px, 3vh, 32px)",
                  maxWidth: "520px"
                }}
              >
                {t("hero_desc")}
              </p>

              <div
                className="hero-buttons"
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "clamp(20px, 3vh, 32px)",
                  width: "100%"
                }}
              >
                <button
                  type="button"
                  onClick={() => onNavigate("explorer")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "var(--color-primary-cyan, #20D7DF)",
                    border: "none",
                    color: "#061827",
                    padding: "12px 22px",
                    borderRadius: "9999px",
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    boxShadow: "0 0 20px rgba(32, 215, 223, 0.4)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    cursor: "pointer"
                  }}
                >
                  {t("hero_btn_explore")}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("compare")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(16, 46, 67, 0.8)",
                    color: "#F7FAFC",
                    border: "1px solid var(--color-border-discrete)",
                    padding: "12px 20px",
                    borderRadius: "9999px",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    backdropFilter: "blur(12px)",
                    transition: "background 0.15s ease",
                    cursor: "pointer"
                  }}
                >
                  {t("hero_btn_compare")}
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-lg)",
                  flexWrap: "wrap",
                  borderTop: "1px solid var(--color-border-discrete)",
                  paddingTop: "var(--spacing-md)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(32, 215, 223, 0.12)",
                      border: "1px solid rgba(32, 215, 223, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-primary-cyan)"
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.80rem", display: "block", color: "#F7FAFC" }}>
                      {t("hero_badge_satellite")}
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
                      NASA IMERG V07
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(105, 218, 214, 0.12)",
                      border: "1px solid rgba(105, 218, 214, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-secondary-turquoise)"
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.80rem", display: "block", color: "#F7FAFC" }}>
                      {t("hero_badge_cartography")}
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
                      ANA Perú
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(32, 214, 160, 0.12)",
                      border: "1px solid rgba(32, 214, 160, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-status-positive)"
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.80rem", display: "block", color: "#F7FAFC" }}>
                      {t("hero_badge_stats")}
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
                      HAC / FDR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-right-zone">
              <TerritoryHeroVisual onSelectBasin={(basinId) => {
                if (onSelectBasin) {
                  onSelectBasin(basinId)
                } else {
                  onNavigate("explorer")
                }
              }} />
              <HeroTelemetryPanels />
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: "var(--spacing-2xl)", paddingBottom: "var(--spacing-2xl)" }}>
        {isReady && (
          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-text-main)", margin: 0, fontWeight: 700 }}>
                {t("home_findings_title")}
              </h2>
              <span className="badge badge-cyan">{t("home_period_badge")}</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "var(--spacing-md)",
                marginBottom: "var(--spacing-md)"
              }}
            >
              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border-discrete)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  {t("home_card_basins_label")}
                </span>
                <strong style={{ fontSize: "1.25rem", color: "var(--color-text-main)" }}>
                  {t("home_card_basins_val")}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  {t("home_card_basins_sub")}
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border-discrete)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  {t("home_card_period_label")}
                </span>
                <strong style={{ fontSize: "1.25rem", color: "var(--color-text-main)" }}>
                  {t("home_card_period_val")}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  {t("home_card_period_sub")}
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border-discrete)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  {t("home_card_trends_label")}
                </span>
                <strong style={{ fontSize: "1.25rem", color: "var(--color-status-warning)" }}>
                  {t("home_card_trends_val")}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  {t("home_card_trends_sub")}
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border-discrete)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  {t("home_card_consistency_label")}
                </span>
                <strong style={{ fontSize: "1.25rem", color: "var(--color-primary-cyan)" }}>
                  {t("home_card_consistency_val")}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  {t("home_card_consistency_sub")}
                </span>
              </div>
            </div>

            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: "var(--color-text-main)" }}>{t("home_conclusion_label")} </strong>
              {t("home_conclusion_text")}
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
