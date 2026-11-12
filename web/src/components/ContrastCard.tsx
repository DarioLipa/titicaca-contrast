import React from "react"
import type { ContrastItem } from "../app/schemas"
import { useLanguage } from "../app/i18n"

export interface ContrastCardProps {
  contrast: ContrastItem
  basinAName?: string
  basinBName?: string
  onOpenEvidence: (basinA: string, basinB: string) => void
}

export const ContrastCard: React.FC<ContrastCardProps> = ({
  contrast,
  basinAName = contrast.basin_a,
  basinBName = contrast.basin_b,
  onOpenEvidence
}) => {
  const { t, lang } = useLanguage()

  const getBadge = (status: string) => {
    switch (status) {
      case "supported":
        return <span className="badge badge-success">{t("contrast_badge_supported")}</span>
      case "inconclusive":
        return <span className="badge badge-alert">{t("contrast_badge_inconclusive")}</span>
      case "no_change":
      default:
        return <span className="badge">{t("contrast_badge_synchronous")}</span>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "supported":
        return t("contrast_status_supported")
      case "inconclusive":
        return t("contrast_status_inconclusive")
      case "no_change":
      default:
        return t("contrast_status_synchronous")
    }
  }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--spacing-sm)", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-text-main)", fontWeight: 700, margin: 0 }}>
            {basinAName} ↔ {basinBName}
          </h3>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
            {t("contrast_period_prefix")} {contrast.start_year}–{contrast.end_year} ({contrast.n_paired_years} {t("contrast_period_paired")})
          </span>
        </div>
        {getBadge(contrast.evidence_status)}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--spacing-sm) var(--spacing-md)",
          backgroundColor: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border-discrete)",
          borderRadius: "var(--border-radius-sm)"
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
          {t("contrast_delta_trend")}
        </span>
        <strong style={{ fontSize: "1.1rem", color: "var(--color-primary-cyan)", fontFamily: "var(--font-family-mono)" }}>
          {contrast.gap_slope_mm_per_year > 0 ? `+${contrast.gap_slope_mm_per_year}` : contrast.gap_slope_mm_per_year} {lang === "es" ? "mm/año" : "mm/yr"}
        </strong>
      </div>

      <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.55, margin: 0 }}>
        {getStatusText(contrast.evidence_status)}
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
            fontSize: "0.82rem",
            color: "var(--color-primary-cyan)",
            fontWeight: 600,
            padding: "4px 0",
            userSelect: "none"
          }}
        >
          {t("contrast_details_summary")}
        </summary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--spacing-xs)",
            paddingTop: "var(--spacing-xs)",
            fontSize: "0.8rem",
            borderTop: "1px solid var(--color-border-discrete)",
            marginTop: "6px"
          }}
        >
          <div>
            <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>
              {lang === "es" ? "IC 95% (HAC L=2):" : "95% CI (HAC L=2):"}
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
              [{contrast.gap_slope_ci95[0]}, {contrast.gap_slope_ci95[1]}]
            </span>
          </div>

          <div>
            <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>
              {lang === "es" ? "Valor p (HAC Newey-West):" : "p-value (HAC Newey-West):"}
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
              {contrast.p_value}
            </span>
          </div>

          <div>
            <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>
              {lang === "es" ? "Valor q (FDR m=6):" : "q-value (FDR m=6):"}
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
              {contrast.q_value_fdr}
            </span>
          </div>

          <div>
            <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>
              {lang === "es" ? "Observaciones emparejadas:" : "Paired observations:"}
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
              {contrast.n_paired_years} {lang === "es" ? "años" : "years"}
            </span>
          </div>
        </div>
      </details>

      <button
        type="button"
        onClick={() => onOpenEvidence(contrast.basin_a, contrast.basin_b)}
        style={{
          alignSelf: "flex-start",
          padding: "7px 14px",
          borderRadius: "var(--border-radius-full)",
          backgroundColor: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border-discrete)",
          color: "var(--color-primary-cyan)",
          fontSize: "0.85rem",
          fontWeight: 600,
          transition: "all 0.15s ease"
        }}
      >
        {t("contrast_btn_evidence")}
      </button>
    </div>
  )
}
