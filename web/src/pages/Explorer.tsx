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
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
          Explorador de cuencas tributarias
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: "0.95rem" }}>
          Visualización de cartografía oficial ANA, series históricas de precipitación NASA IMERG y análisis univariado Theil-Sen / Mann-Kendall.
        </p>
      </div>

      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--spacing-lg)", marginBottom: "var(--spacing-xl)" }}>
        <div>
          <BasinMap
            selectedBasin={selectedBasin}
            onSelectBasin={setSelectedBasin}
            geoJsonData={data.geoJson}
            basins={data.basins}
            height="440px"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            <BasinSelector
              id="basin-selector-explorer"
              label="Seleccionar cuenca tributaria:"
              selectedBasin={selectedBasin}
              onSelectBasin={setSelectedBasin}
              basins={data.basins}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--color-border-discrete)", paddingBottom: "var(--spacing-xs)" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                  Cuenca oficial
                </span>
                <strong style={{ fontSize: "1.3rem", color: "var(--color-text-main)" }}>
                  Cuenca {currentBasin.name}
                </strong>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  Superficie hidrográfica
                </span>
                <strong style={{ fontSize: "1.1rem", color: "var(--color-primary-cyan)", fontFamily: "var(--font-family-mono)" }}>
                  {Number(currentBasin.area_km2).toLocaleString()} km²
                </strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  Tendencia Theil-Sen (2001–2024):
                </span>
                <strong style={{ fontSize: "1.15rem", color: "var(--color-status-warning)", fontFamily: "var(--font-family-mono)" }}>
                  {currentTrend ? `${currentTrend.sen_slope_mm_per_year} mm/año` : "Calculando..."}
                </strong>
              </div>
              <span className="badge" style={{ backgroundColor: "rgba(214, 164, 97, 0.15)", color: "var(--color-status-warning)", border: "1px solid rgba(214, 164, 97, 0.3)" }}>
                {currentTrend && currentTrend.mann_kendall_p < 0.05 ? "Tendencia significativa" : "Variabilidad interanual"}
              </span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.55, margin: 0 }}>
              {currentTrend
                ? `La serie anual 2001–2024 presenta una tasa mediana de cambio de ${currentTrend.sen_slope_mm_per_year} mm/año. El contraste no paramétrico de Mann-Kendall reporta p = ${currentTrend.mann_kendall_p}, ${currentTrend.mann_kendall_p < 0.05 ? "confirmando una tendencia decreciente con significancia al 5%." : "reflejando fluctuación interanual con evidencia no concluyente de tendencia monótona."}`
                : "Cargando serie histórica de precipitación satelital..."}
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
                Parámetros técnicos y metadatos oficiales
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
                  <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>Código oficial ANA:</span>
                  <strong style={{ color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>{currentBasin.official_code}</strong>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>Fuente cartográfica:</span>
                  <strong style={{ color: "var(--color-text-main)" }}>{currentBasin.source} SNIRH</strong>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>Mann-Kendall p-value:</span>
                  <strong style={{ color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
                    {currentTrend ? currentTrend.mann_kendall_p : "-"}
                  </strong>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>Período validado:</span>
                  <strong style={{ color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>24 años (2001–2024)</strong>
                </div>
              </div>
            </details>
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
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-text-main)", margin: 0, fontWeight: 700 }}>
            {chartMode === "annual" ? `Precipitación anual y línea Theil-Sen: Cuenca ${currentBasin.name}` : `Ciclo estacional medio multianual: Cuenca ${currentBasin.name}`}
          </h3>
          <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
            <button
              type="button"
              onClick={() => setChartMode("annual")}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--border-radius-full)",
                backgroundColor: chartMode === "annual" ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
                color: chartMode === "annual" ? "#061827" : "var(--color-text-secondary)",
                border: "1px solid var(--color-border-discrete)",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.15s ease"
              }}
            >
              Serie anual + Tendencia
            </button>
            <button
              type="button"
              onClick={() => setChartMode("monthly")}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--border-radius-full)",
                backgroundColor: chartMode === "monthly" ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
                color: chartMode === "monthly" ? "#061827" : "var(--color-text-secondary)",
                border: "1px solid var(--color-border-discrete)",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.15s ease"
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
