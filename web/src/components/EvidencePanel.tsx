import React, { useEffect } from "react"
import type { EvidenceItem } from "../app/schemas"
import { useLanguage } from "../app/i18n"

export interface EvidencePanelProps {
  evidence: EvidenceItem | null
  onClose: () => void
  onDownloadCsv?: (basinA: string, basinB: string) => void
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  onClose,
  onDownloadCsv
}) => {
  const { t, lang } = useLanguage()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!evidence) return null

  const getStatusBadge = (status: string) => {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(6, 24, 39, 0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-md)",
        zIndex: 1000
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "780px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "var(--color-surface-card, #102E43)",
          border: "1px solid var(--color-border-discrete, #28536A)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-lg)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--spacing-sm)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-xs)", flexWrap: "wrap" }}>
              <h2 id="evidence-modal-title" style={{ fontSize: "1.35rem", color: "var(--color-text-main)", margin: 0, fontWeight: 700 }}>
                {t("evidence_title")} {evidence.basin_a_name} ↔ {evidence.basin_b_name}
              </h2>
              {getStatusBadge(evidence.evidence_status)}
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              {t("evidence_subtitle")}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("evidence_btn_close")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--border-radius-sm)",
              backgroundColor: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border-discrete)",
              color: "var(--color-text-main)",
              fontWeight: 700,
              fontSize: "1rem"
            }}
          >
            ✕
          </button>
        </div>

        <section>
          <h3 style={{ fontSize: "1rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", borderBottom: "1px solid var(--color-border-discrete)", paddingBottom: "6px", fontWeight: 700 }}>
            {t("evidence_sec1_title")}
          </h3>
          <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--spacing-sm)", fontSize: "0.9rem" }}>
            <div style={{ padding: "10px", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
              <dt style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem" }}>{t("evidence_sec1_years")}</dt>
              <dd style={{ fontWeight: 600, margin: 0, color: "var(--color-text-main)" }}>{evidence.n_paired_years} {lang === "es" ? "años" : "years"} ({evidence.start_year} – {evidence.end_year})</dd>
            </div>
            <div style={{ padding: "10px", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
              <dt style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem" }}>{t("evidence_sec1_mean_gap")}</dt>
              <dd style={{ fontWeight: 600, margin: 0, color: "var(--color-text-main)" }}>{evidence.mean_gap_mm} mm</dd>
            </div>
            <div style={{ padding: "10px", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
              <dt style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem" }}>{t("evidence_sec1_slope")}</dt>
              <dd style={{ fontWeight: 600, margin: 0, color: "var(--color-primary-cyan)" }}>{evidence.gap_slope_mm_per_year} {lang === "es" ? "mm/año" : "mm/yr"}</dd>
            </div>
            <div style={{ padding: "10px", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
              <dt style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem" }}>{t("evidence_sec1_inference")}</dt>
              <dd style={{ fontWeight: 600, margin: 0, color: "var(--color-text-main)" }}>p = {evidence.p_value} | q (FDR) = {evidence.q_value_fdr}</dd>
            </div>
            <div style={{ padding: "10px", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
              <dt style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem" }}>{t("evidence_sec1_autocorr")}</dt>
              <dd style={{ fontWeight: 600, margin: 0, color: "var(--color-text-main)" }}>{evidence.autocorrelation_lag1}</dd>
            </div>
            <div style={{ padding: "10px", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
              <dt style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem" }}>{t("evidence_sec1_dataset")}</dt>
              <dd style={{ fontWeight: 600, margin: 0, color: "var(--color-text-main)" }}>NASA IMERG V{evidence.dataset_version} Final</dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 style={{ fontSize: "1rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", borderBottom: "1px solid var(--color-border-discrete)", paddingBottom: "6px", fontWeight: 700 }}>
            {t("evidence_sec2_title")}
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", border: "1px solid var(--color-border-discrete)" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-surface-elevated)", textAlign: "left", color: "var(--color-text-main)" }}>
                  <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>{t("evidence_sec2_th_lag")}</th>
                  <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>{t("evidence_sec2_th_role")}</th>
                  <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>{t("evidence_sec2_th_slope")}</th>
                  <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>{t("evidence_sec2_th_ci95")}</th>
                  <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>{t("evidence_sec2_th_pvalue")}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(evidence.sensitivity_lags).map(([lag, res]) => (
                  <tr key={lag} style={{ borderBottom: "1px solid var(--color-border-discrete)", backgroundColor: lag === "2" ? "rgba(32, 215, 223, 0.08)" : "transparent" }}>
                    <td style={{ padding: "8px 12px", fontWeight: lag === "2" ? 700 : 500, color: lag === "2" ? "var(--color-primary-cyan)" : "var(--color-text-main)" }}>L = {lag}</td>
                    <td style={{ padding: "8px 12px", color: "var(--color-text-secondary)" }}>{lag === "2" ? t("evidence_sec2_primary") : t("evidence_sec2_sensitivity")}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--color-text-main)" }}>{res.slope}</td>
                    <td style={{ padding: "8px 12px", color: "var(--color-text-secondary)" }}>[{res.ci95[0]}, {res.ci95[1]}]</td>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--color-text-main)" }}>{res.p_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ backgroundColor: "var(--color-surface-elevated)", padding: "var(--spacing-md)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
          <h3 style={{ fontSize: "0.95rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
            {t("evidence_sec3_title")}
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-main)", lineHeight: 1.55, margin: 0, marginBottom: "var(--spacing-xs)" }}>
            {evidence.interpretation}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", lineHeight: 1.45, margin: 0 }}>
            <strong>{t("evidence_sec3_notice_label")} </strong> {t("evidence_sec3_notice_text")}
          </p>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
          {onDownloadCsv && (
            <button
              type="button"
              onClick={() => onDownloadCsv(evidence.basin_a, evidence.basin_b)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--border-radius-full)",
                backgroundColor: "var(--color-surface-elevated)",
                border: "1px solid var(--color-primary-cyan)",
                color: "var(--color-primary-cyan)",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
            >
              {t("evidence_btn_download_csv")}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "var(--border-radius-full)",
              backgroundColor: "var(--color-primary-cyan)",
              border: "none",
              color: "#061827",
              fontSize: "0.85rem",
              fontWeight: 700
            }}
          >
            {t("evidence_btn_close")}
          </button>
        </div>
      </div>
    </div>
  )
}
