import React, { useState } from "react"
import type { HydrologyData } from "../app/dataLoader"
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
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-xs)" }}>
          Comparador de cuencas emparejadas
        </h2>
        <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
          Evaluación rigurosa de la brecha temporal D(t) = P_A(t) - P_B(t) con errores estándar robustos HAC y control FDR.
        </p>
      </div>

      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-md)" }}>
          <BasinSelector
            id="basin-a"
            label="Primera cuenca (A):"
            selectedBasin={basinA}
            onSelectBasin={setBasinA}
            basins={data.basins}
            disabledBasin={basinB}
          />

          <BasinSelector
            id="basin-b"
            label="Segunda cuenca (B):"
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
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "var(--border-radius-sm)",
              backgroundColor: "#FDF3ED",
              color: "var(--color-alert)",
              fontSize: "0.9rem",
              fontWeight: 500
            }}
          >
            Selecciona cuencas distintas para realizar la comparación emparejada.
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
                height="360px"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              {contrast && (
                <ContrastCard
                  contrast={contrast}
                  basinAName={basinAObj.name}
                  basinBName={basinBObj.name}
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
              <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary-navy)", margin: 0 }}>
                {compareMode === "gap"
                  ? `Brecha temporal anual D(t) = ${basinAObj.name} - ${basinBObj.name}`
                  : (compareMode === "annual" ? `Precipitaciones anuales superpuestas: ${basinAObj.name} vs ${basinBObj.name}` : `Ciclos estacionales comparados: ${basinAObj.name} vs ${basinBObj.name}`)}
              </h3>

              <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                <button
                  type="button"
                  onClick={() => setCompareMode("gap")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--border-radius-sm)",
                    backgroundColor: compareMode === "gap" ? "var(--color-action-blue)" : "var(--color-surface-muted)",
                    color: compareMode === "gap" ? "#FFFFFF" : "var(--color-text-main)",
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  Brecha D(t)
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode("annual")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--border-radius-sm)",
                    backgroundColor: compareMode === "annual" ? "var(--color-action-blue)" : "var(--color-surface-muted)",
                    color: compareMode === "annual" ? "#FFFFFF" : "var(--color-text-main)",
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  Superpuesta anual
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode("monthly")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--border-radius-sm)",
                    backgroundColor: compareMode === "monthly" ? "var(--color-action-blue)" : "var(--color-surface-muted)",
                    color: compareMode === "monthly" ? "#FFFFFF" : "var(--color-text-main)",
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  Ciclos estacionales
                </button>
              </div>
            </div>

            <ClimateChart
              mode={compareMode}
              basinAId={basinA}
              basinAName={`Cuenca ${basinAObj.name}`}
              basinBId={basinB}
              basinBName={`Cuenca ${basinBObj.name}`}
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
