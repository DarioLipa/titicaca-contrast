import React, { useState } from "react"
import type { HydrologyData } from "../app/dataLoader"
import { useLanguage } from "../app/i18n"
import { StatusMessage } from "../components/StatusMessage"
import { BasinMap } from "../components/BasinMap"
import { BasinSelector } from "../components/BasinSelector"
import { PeriodSelector } from "../components/PeriodSelector"
import { ClimateChart } from "../components/ClimateChart"
import { ContrastCard } from "../components/ContrastCard"
import { EvidencePanel } from "../components/EvidencePanel"
import { ExportControls } from "../components/ExportControls"

export interface CompareProps {
  data: HydrologyData
}

export const Compare: React.FC<CompareProps> = ({ data }) => {
  const { t, lang } = useLanguage()
  const [basinA, setBasinA] = useState<string>("ramis")
  const [basinB, setBasinB] = useState<string>("coata")
  const [startYear, setStartYear] = useState<number>(2001)
  const [endYear, setEndYear] = useState<number>(2024)
  const [compareMode, setCompareMode] = useState<"annual" | "gap" | "monthly">("gap")
  const [selectedEvidencePair, setSelectedEvidencePair] = useState<{ a: string; b: string } | null>(null)

  const basins = data.basins.length > 0 ? data.basins : [
    { id: "ramis" as const, name: "Ramis", official_code: "0179+018+019", area_km2: 15870.42, source: "ANA" },
    { id: "coata" as const, name: "Coata", official_code: "0176", area_km2: 4882.42, source: "ANA" },
    { id: "ilave" as const, name: "Ilave", official_code: "016", area_km2: 7791.0, source: "ANA" },
    { id: "huancane" as const, name: "Huancané", official_code: "0178", area_km2: 3611.92, source: "ANA" }
  ]

  const basinAObj = basins.find((b) => b.id === basinA) || basins[0]
  const basinBObj = basins.find((b) => b.id === basinB) || basins[1]
  const isSameBasin = basinA === basinB

  const contrast = data.contrasts.find(
    (c) => (c.basin_a === basinA && c.basin_b === basinB) || (c.basin_a === basinB && c.basin_b === basinA)
  )

  const evidenceItem = selectedEvidencePair
    ? data.evidence.find(
        (e) => (e.basin_a === selectedEvidencePair.a && e.basin_b === selectedEvidencePair.b) ||
               (e.basin_a === selectedEvidencePair.b && e.basin_b === selectedEvidencePair.a)
      ) || null
    : null

  const annualA = data.annual.filter((d) => d.basin_id === basinA && d.valid_year)
  const annualB = data.annual.filter((d) => d.basin_id === basinB && d.valid_year)

  const gapSeries = annualA
    .map((dA) => {
      const dB = annualB.find((item) => item.year === dA.year)
      if (!dB || dA.annual_precip_mm === null || dB.annual_precip_mm === null) return null
      return {
        year: dA.year,
        gap: dA.annual_precip_mm - dB.annual_precip_mm
      }
    })
    .filter((d): d is { year: number; gap: number } => d !== null)

  const handlePeriodChange = (start: number, end: number) => {
    setStartYear(start)
    setEndYear(end)
  }

  const handleDownloadCsv = () => {
    const csvContent = "year,basin_a,basin_a_precip_mm,basin_b,basin_b_precip_mm,gap_d_t_mm\n" +
      gapSeries.map(g => {
        const valA = annualA.find(a => a.year === g.year)?.annual_precip_mm || ""
        const valB = annualB.find(b => b.year === g.year)?.annual_precip_mm || ""
        return `${g.year},${basinA},${valA},${basinB},${valB},${g.gap.toFixed(2)}`
      }).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `contraste-${basinA}-vs-${basinB}-${startYear}-${endYear}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
          {t("compare_title")}
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: "0.95rem" }}>
          {t("compare_subtitle")}
        </p>
      </div>

      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-md)" }}>
          <BasinSelector
            id="basin-a"
            label={`${t("compare_first_basin")} (A):`}
            selectedBasin={basinA}
            onSelectBasin={setBasinA}
            basins={data.basins}
            disabledBasin={basinB}
          />

          <BasinSelector
            id="basin-b"
            label={`${t("compare_second_basin")} (B):`}
            selectedBasin={basinB}
            onSelectBasin={setBasinB}
            basins={data.basins}
            disabledBasin={basinA}
          />
        </div>

        {isSameBasin && (
          <div
            role="alert"
            style={{
              marginTop: "var(--spacing-md)",
              padding: "10px 14px",
              borderRadius: "var(--border-radius-sm)",
              backgroundColor: "rgba(214, 164, 97, 0.15)",
              border: "1px solid rgba(214, 164, 97, 0.35)",
              color: "var(--color-status-warning)",
              fontSize: "0.9rem",
              fontWeight: 500
            }}
          >
            {t("compare_alert_same")}
          </div>
        )}
      </div>

      {!isSameBasin && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--spacing-lg)", marginBottom: "var(--spacing-xl)" }}>
            <div>
              <BasinMap
                selectedBasin={basinA}
                secondSelectedBasin={basinB}
                onSelectBasin={setBasinA}
                geoJsonData={data.geoJson}
                basins={data.basins}
                height="380px"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              {contrast && (
                <ContrastCard
                  contrast={contrast}
                  basinAName={lang === "es" ? `Cuenca ${basinAObj.name}` : `${basinAObj.name} Basin`}
                  basinBName={lang === "es" ? `Cuenca ${basinBObj.name}` : `${basinBObj.name} Basin`}
                  onOpenEvidence={(a, b) => setSelectedEvidencePair({ a, b })}
                />
              )}

              <PeriodSelector
                startYear={startYear}
                endYear={endYear}
                onPeriodChange={handlePeriodChange}
                minYear={2001}
                maxYear={2024}
              />
            </div>
          </div>

          <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
              <h3 style={{ fontSize: "1.15rem", color: "var(--color-text-main)", margin: 0, fontWeight: 700 }}>
                {compareMode === "gap"
                  ? (lang === "es" ? `Brecha temporal anual D(t) = ${basinAObj.name} - ${basinBObj.name}` : `Annual time gap D(t) = ${basinAObj.name} - ${basinBObj.name}`)
                  : (compareMode === "annual"
                      ? (lang === "es" ? `Precipitaciones anuales superpuestas: ${basinAObj.name} vs ${basinBObj.name}` : `Superimposed annual precipitation: ${basinAObj.name} vs ${basinBObj.name}`)
                      : (lang === "es" ? `Ciclos estacionales comparados: ${basinAObj.name} vs ${basinBObj.name}` : `Seasonal cycles comparison: ${basinAObj.name} vs ${basinBObj.name}`))}
              </h3>

              <div style={{ display: "flex", gap: "var(--spacing-xs)", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setCompareMode("gap")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--border-radius-full)",
                    backgroundColor: compareMode === "gap" ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
                    color: compareMode === "gap" ? "#061827" : "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-discrete)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "all 0.15s ease"
                  }}
                >
                  {t("compare_btn_gap")}
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode("annual")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--border-radius-full)",
                    backgroundColor: compareMode === "annual" ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
                    color: compareMode === "annual" ? "#061827" : "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-discrete)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "all 0.15s ease"
                  }}
                >
                  {t("compare_btn_annual")}
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode("monthly")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--border-radius-full)",
                    backgroundColor: compareMode === "monthly" ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
                    color: compareMode === "monthly" ? "#061827" : "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-discrete)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "all 0.15s ease"
                  }}
                >
                  {t("compare_btn_monthly")}
                </button>
              </div>
            </div>

            <ClimateChart
              mode={compareMode}
              basinAId={basinA}
              basinAName={lang === "es" ? `Cuenca ${basinAObj.name}` : `${basinAObj.name} Basin`}
              basinBId={basinB}
              basinBName={lang === "es" ? `Cuenca ${basinBObj.name}` : `${basinBObj.name} Basin`}
              annualData={data.annual}
              monthlyData={data.monthly}
              trends={data.trends}
              gapSeries={gapSeries}
              gapSlope={contrast ? contrast.gap_slope_mm_per_year : undefined}
              startYear={startYear}
              endYear={endYear}
              height="380px"
            />
          </div>

          <ExportControls
            onDownloadCsv={handleDownloadCsv}
          />
        </>
      )}

      {selectedEvidencePair && (
        <EvidencePanel
          evidence={evidenceItem}
          onClose={() => setSelectedEvidencePair(null)}
          onDownloadCsv={handleDownloadCsv}
        />
      )}
    </div>
  )
}
