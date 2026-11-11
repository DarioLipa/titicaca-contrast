import React, { useEffect } from "react"
import type { EvidenceItem } from "../app/schemas"

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
        return <span className="badge badge-success">Cambio sustentado</span>
      case "inconclusive":
        return <span className="badge badge-alert">Inconcluso (q &gt; 0.05)</span>
      case "no_change":
      default:
        return <span className="badge">Sin cambio detectable</span>
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
        backgroundColor: "rgba(18, 49, 74, 0.6)",
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
          maxWidth: "760px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#FFFFFF",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-lg)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-xs)" }}>
              <h2 id="evidence-modal-title" style={{ fontSize: "1.4rem", color: "var(--color-primary-navy)", margin: 0 }}>
                Ficha de Evidencia: {evidence.basin_a_name} ↔ {evidence.basin_b_name}
              </h2>
              {getStatusBadge(evidence.evidence_status)}
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              Evaluación estadística reproducible de contraste climático
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha de evidencia"
            style={{
              padding: "6px 12px",
              borderRadius: "var(--border-radius-sm)",
              backgroundColor: "var(--color-surface-muted)",
              color: "var(--color-text-main)",
              fontWeight: 700,
              fontSize: "1rem"
            }}
          >
            ✕
          </button>
        </div>

        <section>
          <h3 style={{ fontSize: "1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)", borderBottom: "1px solid var(--color-border)", paddingBottom: "4px" }}>
            1. Especificación confirmatoria principal (2001–2024)
          </h3>
          <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-sm)", fontSize: "0.9rem" }}>
            <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <dt style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Años válidos analizados:</dt>
              <dd style={{ fontWeight: 600, margin: 0 }}>{evidence.n_paired_years} años ({evidence.start_year} – {evidence.end_year})</dd>
            </div>
            <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <dt style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Brecha anual media D(t):</dt>
              <dd style={{ fontWeight: 600, margin: 0 }}>{evidence.mean_gap_mm} mm ({evidence.basin_a_name}: {evidence.mean_basin_a_mm} mm | {evidence.basin_b_name}: {evidence.mean_basin_b_mm} mm)</dd>
            </div>
            <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <dt style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Pendiente brecha OLS (HAC L=2):</dt>
              <dd style={{ fontWeight: 600, margin: 0 }}>{evidence.gap_slope_mm_per_year} mm/año (IC 95%: [{evidence.gap_slope_ci95[0]}, {evidence.gap_slope_ci95[1]}])</dd>
            </div>
            <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <dt style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Inferencia y control FDR:</dt>
              <dd style={{ fontWeight: 600, margin: 0 }}>p = {evidence.p_value} | q (FDR m=6) = {evidence.q_value_fdr}</dd>
            </div>
            <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <dt style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Autocorrelación serial lag-1 (r):</dt>
              <dd style={{ fontWeight: 600, margin: 0 }}>{evidence.autocorrelation_lag1}</dd>
            </div>
            <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
              <dt style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Conjunto satelital oficial:</dt>
              <dd style={{ fontWeight: 600, margin: 0 }}>NASA IMERG V{evidence.dataset_version} Final</dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 style={{ fontSize: "1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)", borderBottom: "1px solid var(--color-border)", paddingBottom: "4px" }}>
            2. Análisis de robustez y sensibilidad a rezagos temporales (HAC / Newey–West)
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-surface-muted)", textAlign: "left" }}>
                  <th style={{ padding: "6px 10px", borderBottom: "1px solid var(--color-border)" }}>Rezago (L)</th>
                  <th style={{ padding: "6px 10px", borderBottom: "1px solid var(--color-border)" }}>Rol en metodología</th>
                  <th style={{ padding: "6px 10px", borderBottom: "1px solid var(--color-border)" }}>Pendiente (mm/año)</th>
                  <th style={{ padding: "6px 10px", borderBottom: "1px solid var(--color-border)" }}>IC 95%</th>
                  <th style={{ padding: "6px 10px", borderBottom: "1px solid var(--color-border)" }}>Valor p</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(evidence.sensitivity_lags).map(([lag, res]) => (
                  <tr key={lag} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: lag === "2" ? "#F5F8FA" : "#FFFFFF" }}>
                    <td style={{ padding: "6px 10px", fontWeight: lag === "2" ? 700 : 500 }}>L = {lag}</td>
                    <td style={{ padding: "6px 10px", color: "var(--color-text-muted)" }}>{lag === "2" ? "Especificación primaria confirmatoria" : "Comprobación de sensibilidad"}</td>
                    <td style={{ padding: "6px 10px", fontWeight: 600 }}>{res.slope}</td>
                    <td style={{ padding: "6px 10px" }}>[{res.ci95[0]}, {res.ci95[1]}]</td>
                    <td style={{ padding: "6px 10px", fontWeight: 600 }}>{res.p_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ backgroundColor: "var(--color-surface-muted)", padding: "var(--spacing-md)", borderRadius: "var(--border-radius-sm)" }}>
          <h3 style={{ fontSize: "0.95rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-xs)" }}>
            3. Interpretación y límites científicos
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-main)", lineHeight: 1.5, margin: 0, marginBottom: "var(--spacing-xs)" }}>
            {evidence.interpretation}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4, margin: 0 }}>
            <strong>Aviso de no causalidad:</strong> Este resultado describe exclusivamente la relación lineal empírica entre las precipitaciones satelitales estimadas. No demuestra causalidad hidrológica, fluctuaciones en el nivel del Lago Titicaca ni impactos socioeconómicos directos.
          </p>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
          {onDownloadCsv && (
            <button
              type="button"
              onClick={() => onDownloadCsv(evidence.basin_a, evidence.basin_b)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--border-radius-sm)",
                backgroundColor: "var(--color-teal-water)",
                color: "#FFFFFF",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
            >
              Descargar serie temporal de este par (CSV)
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--border-radius-sm)",
              backgroundColor: "var(--color-surface-muted)",
              color: "var(--color-primary-navy)",
              fontSize: "0.85rem",
              fontWeight: 600
            }}
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  )
}
