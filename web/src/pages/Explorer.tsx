import React, { useState } from "react"
import type { HydrologyData } from "../app/dataLoader"
import { StatusMessage } from "../components/StatusMessage"
import { BasinMap } from "../components/BasinMap"
import { BasinSelector } from "../components/BasinSelector"
import { PeriodSelector } from "../components/PeriodSelector"
import { ClimateChart } from "../components/ClimateChart"
import { ExportControls } from "../components/ExportControls"

export interface ExplorerProps {
  data: HydrologyData
}

export const Explorer: React.FC<ExplorerProps> = ({ data }) => {
  const [selectedBasin, setSelectedBasin] = useState<string>("ramis")
  const [startYear, setStartYear] = useState<number>(2001)
  const [endYear, setEndYear] = useState<number>(2024)
  const [chartMode, setChartMode] = useState<"annual" | "monthly">("annual")

  const basins = data.basins.length > 0 ? data.basins : [
    { id: "ramis" as const, name: "Ramis", official_code: "0179+018+019", area_km2: 15870.42, source: "ANA" },
    { id: "coata" as const, name: "Coata", official_code: "0176", area_km2: 4882.42, source: "ANA" },
    { id: "ilave" as const, name: "Ilave", official_code: "016", area_km2: 7791.0, source: "ANA" },
    { id: "huancane" as const, name: "Huancané", official_code: "0178", area_km2: 3611.92, source: "ANA" }
  ]

  const currentBasin = basins.find((b) => b.id === selectedBasin) || basins[0]
  const currentTrend = data.trends.find((t) => t.basin_id === selectedBasin)

  const handlePeriodChange = (start: number, end: number) => {
    setStartYear(start)
    setEndYear(end)
  }

  const handleDownloadCsv = (type: "monthly" | "annual" | "contrasts") => {
    if (type === "monthly") {
      const link = document.createElement("a")
      link.href = "./data/precipitation-monthly.csv"
      link.download = `titicaca-monthly-${selectedBasin}.csv`
      link.click()
    } else {
      const basinAnnual = data.annual.filter(a => a.basin_id === selectedBasin && a.valid_year)
      const csvContent = "year,basin_id,annual_precip_mm,complete_months\n" +
        basinAnnual.map(a => `${a.year},${a.basin_id},${a.annual_precip_mm},${a.complete_months}`).join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `titicaca-annual-${selectedBasin}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-xs)" }}>
          Explorador de cuencas tributarias
        </h2>
        <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
          Visualización de cartografía oficial ANA, series históricas de precipitación NASA IMERG V07 y análisis univariado Theil-Sen / Mann-Kendall.
        </p>
      </div>

      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--spacing-lg)", marginBottom: "var(--spacing-xl)" }}>
        <div>
          <BasinMap
            selectedBasin={selectedBasin}
            onSelectBasin={setSelectedBasin}
            geoJsonData={data.geoJson}
            basins={data.basins}
            height="400px"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div className="card">
            <BasinSelector
              id="basin-selector-explorer"
              label="Seleccionar cuenca:"
              selectedBasin={selectedBasin}
              onSelectBasin={setSelectedBasin}
              basins={data.basins}
            />

            <div style={{ marginTop: "var(--spacing-md)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-sm)", fontSize: "0.85rem" }}>
              <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
                <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Código oficial ANA:</span>
                <strong style={{ color: "var(--color-primary-navy)" }}>{currentBasin.official_code}</strong>
              </div>
              <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
                <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Área oficial:</span>
                <strong style={{ color: "var(--color-primary-navy)" }}>{Number(currentBasin.area_km2).toLocaleString()} km²</strong>
              </div>
              <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
                <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Tendencia Theil-Sen:</span>
                <strong style={{ color: "var(--color-alert)" }}>
                  {currentTrend ? `${currentTrend.sen_slope_mm_per_year} mm/año` : "Calculando..."}
                </strong>
              </div>
              <div style={{ padding: "8px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--border-radius-sm)" }}>
                <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Mann-Kendall p:</span>
                <strong style={{ color: "var(--color-primary-navy)" }}>
                  {currentTrend ? `p = ${currentTrend.mann_kendall_p}` : "Calculando..."}
                </strong>
              </div>
            </div>
          </div>

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
            {chartMode === "annual" ? `Precipitación anual y línea Theil-Sen: Cuenca ${currentBasin.name}` : `Ciclo estacional medio multianual: Cuenca ${currentBasin.name}`}
          </h3>
          <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
            <button
              type="button"
              onClick={() => setChartMode("annual")}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--border-radius-sm)",
                backgroundColor: chartMode === "annual" ? "var(--color-action-blue)" : "var(--color-surface-muted)",
                color: chartMode === "annual" ? "#FFFFFF" : "var(--color-text-main)",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
            >
              Serie anual + Tendencia
            </button>
            <button
              type="button"
              onClick={() => setChartMode("monthly")}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--border-radius-sm)",
                backgroundColor: chartMode === "monthly" ? "var(--color-action-blue)" : "var(--color-surface-muted)",
                color: chartMode === "monthly" ? "#FFFFFF" : "var(--color-text-main)",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
            >
              Ciclo estacional
            </button>
          </div>
        </div>

        <ClimateChart
          mode={chartMode}
          basinAId={selectedBasin}
          basinAName={`Cuenca ${currentBasin.name}`}
          annualData={data.annual}
          monthlyData={data.monthly}
          trends={data.trends}
          startYear={startYear}
          endYear={endYear}
          height="380px"
        />
      </div>

      <ExportControls
        onDownloadCsv={handleDownloadCsv}
      />
    </div>
  )
}
