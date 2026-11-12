import React, { useState } from "react"
import type { HydrologyData } from "../app/dataLoader"
import { useLanguage } from "../app/i18n"
import { StatusMessage } from "../components/StatusMessage"
import { ContrastCard } from "../components/ContrastCard"
import { EvidencePanel } from "../components/EvidencePanel"
import type { ContrastItem } from "../app/schemas"

export interface FindingsProps {
  data: HydrologyData
}

export const Findings: React.FC<FindingsProps> = ({ data }) => {
  const { t, lang } = useLanguage()
  const [filter, setFilter] = useState<"all" | "inconclusive" | "no_change">("all")
  const [selectedEvidencePair, setSelectedEvidencePair] = useState<{ a: string; b: string } | null>(null)

  const basinsMap: Record<string, string> = {
    ramis: lang === "es" ? "Cuenca Ramis" : "Ramis Basin",
    coata: lang === "es" ? "Cuenca Coata" : "Coata Basin",
    ilave: lang === "es" ? "Cuenca Ilave" : "Ilave Basin",
    huancane: lang === "es" ? "Cuenca Huancané" : "Huancané Basin"
  }

  const contrasts: ContrastItem[] = data.contrasts.length > 0
    ? data.contrasts
    : [
        { basin_a: "ramis", basin_b: "coata", start_year: 2001, end_year: 2024, n_paired_years: 24, gap_slope_mm_per_year: -2.42, gap_slope_ci95: [-6.58, 1.74], p_value: 0.2545, q_value_fdr: 0.3165, evidence_status: "no_change", method_version: "1.0.0" },
        { basin_a: "ramis", basin_b: "ilave", start_year: 2001, end_year: 2024, n_paired_years: 24, gap_slope_mm_per_year: -4.48, gap_slope_ci95: [-10.54, 1.57], p_value: 0.1465, q_value_fdr: 0.293, evidence_status: "no_change", method_version: "1.0.0" },
        { basin_a: "ramis", basin_b: "huancane", start_year: 2001, end_year: 2024, n_paired_years: 24, gap_slope_mm_per_year: -1.13, gap_slope_ci95: [-3.32, 1.05], p_value: 0.308, q_value_fdr: 0.3165, evidence_status: "no_change", method_version: "1.0.0" },
        { basin_a: "coata", basin_b: "ilave", start_year: 2001, end_year: 2024, n_paired_years: 24, gap_slope_mm_per_year: -2.07, gap_slope_ci95: [-4.07, -0.06], p_value: 0.0443, q_value_fdr: 0.2659, evidence_status: "inconclusive", method_version: "1.0.0" },
        { basin_a: "coata", basin_b: "huancane", start_year: 2001, end_year: 2024, n_paired_years: 24, gap_slope_mm_per_year: 0.94, gap_slope_ci95: [-1.75, 3.63], p_value: 0.4877, q_value_fdr: 0.4877, evidence_status: "no_change", method_version: "1.0.0" },
        { basin_a: "ilave", basin_b: "huancane", start_year: 2001, end_year: 2024, n_paired_years: 24, gap_slope_mm_per_year: 3.36, gap_slope_ci95: [-2.42, 9.14], p_value: 0.2505, q_value_fdr: 0.3165, evidence_status: "no_change", method_version: "1.0.0" }
      ]

  const filteredContrasts = contrasts.filter((c) => {
    if (filter === "inconclusive") return c.evidence_status === "inconclusive"
    if (filter === "no_change") return c.evidence_status === "no_change"
    return true
  })

  const evidenceItem = selectedEvidencePair
    ? data.evidence.find(
        (e) => (e.basin_a === selectedEvidencePair.a && e.basin_b === selectedEvidencePair.b) ||
               (e.basin_a === selectedEvidencePair.b && e.basin_b === selectedEvidencePair.a)
      ) || null
    : null

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
          {t("findings_title")}
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5, fontSize: "0.95rem" }}>
          {t("findings_subtitle")}
        </p>
      </div>

      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <div style={{ display: "flex", gap: "var(--spacing-xs)", marginBottom: "var(--spacing-lg)", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setFilter("all")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--border-radius-full)",
            backgroundColor: filter === "all" ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
            color: filter === "all" ? "#061827" : "var(--color-text-secondary)",
            border: "1px solid var(--color-border-discrete)",
            fontWeight: 600,
            fontSize: "0.85rem",
            transition: "all 0.15s ease"
          }}
        >
          {t("findings_filter_all")}
        </button>
        <button
          type="button"
          onClick={() => setFilter("inconclusive")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--border-radius-full)",
            backgroundColor: filter === "inconclusive" ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
            color: filter === "inconclusive" ? "#061827" : "var(--color-text-secondary)",
            border: "1px solid var(--color-border-discrete)",
            fontWeight: 600,
            fontSize: "0.85rem",
            transition: "all 0.15s ease"
          }}
        >
          {t("findings_filter_inconclusive")}
        </button>
        <button
          type="button"
          onClick={() => setFilter("no_change")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--border-radius-full)",
            backgroundColor: filter === "no_change" ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
            color: filter === "no_change" ? "#061827" : "var(--color-text-secondary)",
            border: "1px solid var(--color-border-discrete)",
            fontWeight: 600,
            fontSize: "0.85rem",
            transition: "all 0.15s ease"
          }}
        >
          {t("findings_filter_synchronous")}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--spacing-lg)", marginBottom: "var(--spacing-xl)" }}>
        {filteredContrasts.map((c) => (
          <ContrastCard
            key={`${c.basin_a}-${c.basin_b}`}
            contrast={c}
            basinAName={basinsMap[c.basin_a] || c.basin_a}
            basinBName={basinsMap[c.basin_b] || c.basin_b}
            onOpenEvidence={(a, b) => setSelectedEvidencePair({ a, b })}
          />
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          {t("findings_synthesis_title")}
        </h3>
        <ul style={{ paddingLeft: "var(--spacing-lg)", fontSize: "0.92rem", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
          <li style={{ marginBottom: "6px" }}>
            <strong style={{ color: "var(--color-text-main)" }}>{t("findings_synth_trends_label")} </strong>
            {t("findings_synth_trends_text")}
          </li>
          <li style={{ marginBottom: "6px" }}>
            <strong style={{ color: "var(--color-text-main)" }}>{t("findings_synth_sync_label")} </strong>
            {t("findings_synth_sync_text")}
          </li>
          <li style={{ marginBottom: "6px" }}>
            <strong style={{ color: "var(--color-text-main)" }}>{t("findings_synth_pair_label")} </strong>
            {t("findings_synth_pair_text")}
          </li>
          <li>
            <strong style={{ color: "var(--color-text-main)" }}>{t("findings_synth_causality_label")} </strong>
            {t("findings_synth_causality_text")}
          </li>
        </ul>
      </div>

      {selectedEvidencePair && (
        <EvidencePanel
          evidence={evidenceItem}
          onClose={() => setSelectedEvidencePair(null)}
        />
      )}
    </div>
  )
}
