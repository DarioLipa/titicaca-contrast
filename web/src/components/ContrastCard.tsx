import React from "react"
import type { ContrastItem } from "../app/schemas"

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
  const getBadge = (status: string) => {
    switch (status) {
      case "supported":
        return <span className="badge badge-success">Divergencia confirmada</span>
      case "inconclusive":
        return <span className="badge badge-alert">Variabilidad local moderada (inconcluso tras FDR)</span>
      case "no_change":
      default:
        return <span className="badge">Régimen sincrónico</span>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "supported":
        return "Se confirma divergencia sistemática en la evolución temporal de precipitaciones entre ambas cuencas tras control FDR (q ≤ 0.05)."
      case "inconclusive":
        return "Variación local observada a nivel nominal (p < 0.05) que modera su significancia bajo control FDR (q > 0.05), reflejando fluctuación microclimática dentro del mismo régimen regional."
      case "no_change":
      default:
        return "Evolución climática sincrónica: las cuencas comparten el mismo régimen pluviométrico regional sin divergencias territoriales significativas (q > 0.05)."
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
            Período validado: {contrast.start_year}–{contrast.end_year} ({contrast.n_paired_years} años emparejados)
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
          Diferencia de tendencia estimada (ΔTrend):
        </span>
        <strong style={{ fontSize: "1.1rem", color: "var(--color-primary-cyan)", fontFamily: "var(--font-family-mono)" }}>
          {contrast.gap_slope_mm_per_year > 0 ? `+${contrast.gap_slope_mm_per_year}` : contrast.gap_slope_mm_per_year} mm/año
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
          Detalles de inferencia estadística (HAC / FDR)
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
              IC 95% (HAC L=2):
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
              [{contrast.gap_slope_ci95[0]}, {contrast.gap_slope_ci95[1]}]
            </span>
          </div>

          <div>
            <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>
              Valor p (HAC Newey-West):
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
              {contrast.p_value}
            </span>
          </div>

          <div>
            <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>
              Valor q (FDR m=6):
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
              {contrast.q_value_fdr}
            </span>
          </div>

          <div>
            <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>
              Observaciones emparejadas:
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
              {contrast.n_paired_years} años
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
        Ver ficha de evidencia completa
      </button>
    </div>
  )
}
