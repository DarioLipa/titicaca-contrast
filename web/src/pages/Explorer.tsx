import React, { useState } from "react"
import type { HydrologyData } from "../app/dataLoader"
import { useLanguage } from "../app/i18n"
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
  const { t, lang } = useLanguage()
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
          {t("explorer_title")}
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: "0.95rem" }}>
          {t("explorer_subtitle")}
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
              label={lang === "es" ? "Seleccionar cuenca tributaria:" : "Select tributary watershed:"}
              selectedBasin={selectedBasin}
              onSelectBasin={setSelectedBasin}
              basins={data.basins}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--color-border-discrete)", paddingBottom: "var(--spacing-xs)" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                  {lang === "es" ? "Cuenca oficial" : "Official watershed"}
                </span>
                <strong style={{ fontSize: "1.3rem", color: "var(--color-text-main)" }}>
                  {lang === "es" ? `Cuenca ${currentBasin.name}` : `${currentBasin.name} Watershed`}
                </strong>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  {t("explorer_card_area")}
                </span>
                <strong style={{ fontSize: "1.1rem", color: "var(--color-primary-cyan)", fontFamily: "var(--font-family-mono)" }}>
                  {Number(currentBasin.area_km2).toLocaleString()} km²
                </strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border-discrete)" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  {t("explorer_card_trend")} (2001–2024):
                </span>
                <strong style={{ fontSize: "1.15rem", color: "var(--color-status-warning)", fontFamily: "var(--font-family-mono)" }}>
                  {currentTrend ? `${currentTrend.sen_slope_mm_per_year} ${lang === "es" ? "mm/año" : "mm/yr"}` : (lang === "es" ? "Calculando..." : "Calculating...")}
                </strong>
              </div>
              <span className="badge" style={{ backgroundColor: "rgba(214, 164, 97, 0.15)", color: "var(--color-status-warning)", border: "1px solid rgba(214, 164, 97, 0.3)" }}>
                {currentTrend && currentTrend.mann_kendall_p < 0.05 ? (lang === "es" ? "Tendencia significativa" : "Significant trend") : (lang === "es" ? "Variabilidad interanual" : "Interannual variability")}
              </span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.55, margin: 0 }}>
              {currentTrend
                ? (lang === "es"
                    ? `La serie anual 2001–2024 presenta una tasa mediana de cambio de ${currentTrend.sen_slope_mm_per_year} mm/año. El contraste no paramétrico de Mann-Kendall reporta p = ${currentTrend.mann_kendall_p}, ${currentTrend.mann_kendall_p < 0.05 ? "confirmando una tendencia decreciente con significancia al 5%." : "reflejando fluctuación interanual con evidencia no concluyente de tendencia monótona."}`
                    : `The 2001–2024 annual series exhibits a median rate of change of ${currentTrend.sen_slope_mm_per_year} mm/yr. The non-parametric Mann-Kendall test reports p = ${currentTrend.mann_kendall_p}, ${currentTrend.mann_kendall_p < 0.05 ? "confirming a decreasing trend with 5% statistical significance." : "reflecting interannual fluctuation with inconclusive monotonic trend evidence."}`)
                : (lang === "es" ? "Cargando serie histórica de precipitación satelital..." : "Loading historical satellite precipitation series...")}
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
                {lang === "es" ? "Parámetros técnicos y metadatos oficiales" : "Technical parameters and official metadata"}
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
                  <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>{t("explorer_card_code")}:</span>
                  <strong style={{ color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>{currentBasin.official_code}</strong>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>{lang === "es" ? "Fuente cartográfica:" : "Cartography source:"}</span>
                  <strong style={{ color: "var(--color-text-main)" }}>{currentBasin.source} SNIRH</strong>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>Mann-Kendall p-value:</span>
                  <strong style={{ color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>
                    {currentTrend ? currentTrend.mann_kendall_p : "-"}
                  </strong>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.72rem" }}>{t("contrast_period_prefix")}</span>
                  <strong style={{ color: "var(--color-text-main)", fontFamily: "var(--font-family-mono)" }}>24 {lang === "es" ? "años" : "years"} (2001–2024)</strong>
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
            {chartMode === "annual"
              ? (lang === "es" ? `Precipitación anual y línea Theil-Sen: Cuenca ${currentBasin.name}` : `Annual precipitation & Theil-Sen trend line: ${currentBasin.name} Basin`)
              : (lang === "es" ? `Ciclo estacional medio multianual: Cuenca ${currentBasin.name}` : `Multi-year mean seasonal cycle: ${currentBasin.name} Basin`)}
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
              {t("explorer_tab_annual")}
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
              {t("explorer_tab_monthly")}
            </button>
          </div>
        </div>

        <ClimateChart
          mode={chartMode}
          basinAId={selectedBasin}
          basinAName={lang === "es" ? `Cuenca ${currentBasin.name}` : `${currentBasin.name} Basin`}
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
