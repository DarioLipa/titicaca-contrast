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
        return <span className="badge badge-success">Cambio sustentado</span>
      case "inconclusive":
        return <span className="badge badge-alert">Inconcluso (q &gt; 0.05)</span>
      case "no_change":
      default:
        return <span className="badge">Sin cambio detectable</span>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "supported":
        return "Existe evidencia confirmada tras control FDR de una divergencia o convergencia sistemática entre ambas cuencas."
      case "inconclusive":
        return "Se detecta significancia marginal sin corrección (p < 0.05), pero no supera el umbral FDR (q > 0.05). No se confirma divergencia."
      case "no_change":
      default:
        return "La evolución histórica de las precipitaciones en ambas cuencas no exhibe una separación temporal sistemática estadísticamente distinguible."
    }
  }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--spacing-sm)" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-navy)", fontWeight: 700 }}>
            {basinAName} ↔ {basinBName}
          </h3>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            Período: {contrast.start_year}–{contrast.end_year} ({contrast.n_paired_years} años emparejados)
          </span>
        </div>
        {getBadge(contrast.evidence_status)}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "var(--spacing-sm)",
        padding: "var(--spacing-sm)",
        backgroundColor: "var(--color-surface-muted)",
        borderRadius: "var(--border-radius-sm)",
        fontSize: "0.85rem"
      }}>
        <div>
          <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
            Pendiente brecha:
          </span>
          <strong style={{ fontSize: "1rem", color: "var(--color-primary-navy)" }}>
            {contrast.gap_slope_mm_per_year > 0 ? `+${contrast.gap_slope_mm_per_year}` : contrast.gap_slope_mm_per_year} mm/año
          </strong>
        </div>

        <div>
          <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
            IC 95% (HAC L=2):
          </span>
          <span style={{ fontWeight: 600 }}>
            [{contrast.gap_slope_ci95[0]}, {contrast.gap_slope_ci95[1]}]
          </span>
        </div>

        <div>
          <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
            Valor p (HAC):
          </span>
          <span style={{ fontWeight: 600 }}>
            {contrast.p_value}
          </span>
        </div>

        <div>
          <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
            Valor q (FDR m=6):
          </span>
          <span style={{ fontWeight: 600 }}>
            {contrast.q_value_fdr}
          </span>
        </div>
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5, margin: 0 }}>
        {getStatusText(contrast.evidence_status)}
      </p>

      <button
        type="button"
        onClick={() => onOpenEvidence(contrast.basin_a, contrast.basin_b)}
        style={{
          alignSelf: "flex-start",
          padding: "6px 12px",
          borderRadius: "var(--border-radius-sm)",
          backgroundColor: "var(--color-action-blue)",
          color: "#FFFFFF",
          fontSize: "0.85rem",
          fontWeight: 600
        }}
      >
        Ver ficha de evidencia completa
      </button>
    </div>
  )
}
