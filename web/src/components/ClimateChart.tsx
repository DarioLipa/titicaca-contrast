import React, { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import type { AnnualPrecipitationItem, MonthlyPrecipitationRow, TrendItem } from "../app/schemas"

export interface ClimateChartProps {
  mode: "annual" | "monthly" | "gap"
  basinAId: string
  basinAName?: string
  basinBId?: string
  basinBName?: string
  annualData?: AnnualPrecipitationItem[]
  monthlyData?: MonthlyPrecipitationRow[]
  trends?: TrendItem[]
  gapSeries?: { year: number; gap: number }[]
  gapSlope?: number
  startYear?: number
  endYear?: number
  height?: string
}

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"]

const getBasinColor = (id?: string, fallback = "#20D7DF") => {
  switch (id) {
    case "ramis":
      return "#20D7DF"
    case "coata":
      return "#20D6A0"
    case "ilave":
      return "#C084FC"
    case "huancane":
      return "#69DAD6"
    default:
      return fallback
  }
}

export const ClimateChart: React.FC<ClimateChartProps> = ({
  mode,
  basinAId,
  basinAName = "Cuenca A",
  basinBId,
  basinBName = "Cuenca B",
  annualData = [],
  monthlyData = [],
  trends = [],
  gapSeries = [],
  gapSlope,
  startYear = 2001,
  endYear = 2024,
  height = "380px"
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)
  const [showTable, setShowTable] = useState<boolean>(false)

  const annualA = annualData.filter(
    (d) => d.basin_id === basinAId && d.valid_year && d.year >= startYear && d.year <= endYear
  ).sort((a, b) => a.year - b.year)

  const annualB = basinBId
    ? annualData.filter((d) => d.basin_id === basinBId && d.valid_year && d.year >= startYear && d.year <= endYear).sort((a, b) => a.year - b.year)
    : []

  const trendA = trends.find((t) => t.basin_id === basinAId)

  const computeMonthlyClimatology = (basinId: string) => {
    const basinMonthly = monthlyData.filter(
      (d) => d.basin_id === basinId && d.precip_mm !== null && d.year >= startYear && d.year <= endYear
    )
    const sums = new Array(12).fill(0)
    const counts = new Array(12).fill(0)

    basinMonthly.forEach((d) => {
      const mIdx = d.month - 1
      if (mIdx >= 0 && mIdx < 12 && d.precip_mm !== null) {
        sums[mIdx] += d.precip_mm
        counts[mIdx] += 1
      }
    })

    return sums.map((sum, i) => (counts[i] > 0 ? parseFloat((sum / counts[i]).toFixed(1)) : 0))
  }

  const monthlyClimatologyA = computeMonthlyClimatology(basinAId)
  const monthlyClimatologyB = basinBId ? computeMonthlyClimatology(basinBId) : []

  useEffect(() => {
    if (!chartContainerRef.current) return

    let chart = chartInstanceRef.current
    if (!chart) {
      try {
        chart = echarts.init(chartContainerRef.current, undefined, { renderer: "canvas" })
        chartInstanceRef.current = chart
      } catch {
        return
      }
    }

    const handleResize = () => {
      chartInstanceRef.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      try {
        chart?.dispose()
      } catch {
        return
      }
      chartInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const chart = chartInstanceRef.current
    if (!chart) return

    let option: echarts.EChartsOption = {}

    const colorA = getBasinColor(basinAId, "#20D7DF")
    const colorB = getBasinColor(basinBId, "#D6A461")

    if (mode === "annual") {
      const years = annualA.map((d) => d.year.toString())
      const valuesA = annualA.map((d) => d.annual_precip_mm || 0)

      let trendLineData: (number | null)[] = []
      if (trendA && annualA.length > 1) {
        const meanY = valuesA.reduce((acc, v) => acc + v, 0) / valuesA.length
        const meanX = annualA.reduce((acc, v) => acc + v.year, 0) / annualA.length
        const slope = trendA.sen_slope_mm_per_year
        const intercept = meanY - slope * meanX
        trendLineData = annualA.map((d) => parseFloat((intercept + slope * d.year).toFixed(1)))
      }

      const seriesList: any[] = [
        {
          name: basinAName,
          type: "bar",
          data: valuesA,
          itemStyle: { color: colorA, borderRadius: [4, 4, 0, 0] }
        }
      ]

      if (basinBId && annualB.length > 0) {
        seriesList.push({
          name: basinBName,
          type: "bar",
          data: annualB.map((d) => d.annual_precip_mm || 0),
          itemStyle: { color: colorB, borderRadius: [4, 4, 0, 0] }
        })
      }

      if (trendLineData.length > 0) {
        seriesList.push({
          name: `Tendencia Theil-Sen (${trendA?.sen_slope_mm_per_year} mm/año)`,
          type: "line",
          data: trendLineData,
          itemStyle: { color: "#F7FAFC" },
          lineStyle: { width: 2, type: "dashed", color: "#F7FAFC" },
          symbol: "none"
        })
      }

      option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(16, 46, 67, 0.95)",
          borderColor: "#28536A",
          borderWidth: 1,
          textStyle: { color: "#F7FAFC", fontSize: 12 },
          valueFormatter: (value) => `${value} mm`
        },
        legend: {
          top: 0,
          textStyle: { color: "#BED1DD", fontSize: 12 }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "8%",
          top: "16%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: years,
          axisLine: { lineStyle: { color: "#28536A" } },
          axisLabel: { color: "#BED1DD" }
        },
        yAxis: {
          type: "value",
          name: "Precipitación (mm)",
          nameTextStyle: { color: "#BED1DD", fontSize: 12 },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "rgba(40, 83, 106, 0.4)" } },
          axisLabel: { color: "#BED1DD" }
        },
        series: seriesList
      }
    } else if (mode === "monthly") {
      const seriesList: any[] = [
        {
          name: basinAName,
          type: "line",
          smooth: true,
          data: monthlyClimatologyA,
          itemStyle: { color: colorA },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(32, 215, 223, 0.35)" },
              { offset: 1, color: "rgba(32, 215, 223, 0.0)" }
            ])
          }
        }
      ]

      if (basinBId && monthlyClimatologyB.length > 0) {
        seriesList.push({
          name: basinBName,
          type: "line",
          smooth: true,
          data: monthlyClimatologyB,
          itemStyle: { color: colorB },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(214, 164, 97, 0.3)" },
              { offset: 1, color: "rgba(214, 164, 97, 0.0)" }
            ])
          }
        })
      }

      option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(16, 46, 67, 0.95)",
          borderColor: "#28536A",
          borderWidth: 1,
          textStyle: { color: "#F7FAFC", fontSize: 12 },
          valueFormatter: (value) => `${value} mm`
        },
        legend: {
          top: 0,
          textStyle: { color: "#BED1DD", fontSize: 12 }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "8%",
          top: "16%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: MONTH_NAMES,
          axisLine: { lineStyle: { color: "#28536A" } },
          axisLabel: { color: "#BED1DD" }
        },
        yAxis: {
          type: "value",
          name: "Lámina mensual media (mm)",
          nameTextStyle: { color: "#BED1DD", fontSize: 12 },
          splitLine: { lineStyle: { color: "rgba(40, 83, 106, 0.4)" } },
          axisLabel: { color: "#BED1DD" }
        },
        series: seriesList
      }
    } else if (mode === "gap") {
      const filteredGaps = gapSeries.filter((d) => d.year >= startYear && d.year <= endYear)
      const years = filteredGaps.map((d) => d.year.toString())
      const gaps = filteredGaps.map((d) => parseFloat(d.gap.toFixed(1)))

      let trendLineData: number[] = []
      if (gapSlope !== undefined && filteredGaps.length > 1) {
        const meanY = gaps.reduce((acc, v) => acc + v, 0) / gaps.length
        const meanX = filteredGaps.reduce((acc, v) => acc + v.year, 0) / filteredGaps.length
        const intercept = meanY - gapSlope * meanX
        trendLineData = filteredGaps.map((d) => parseFloat((intercept + gapSlope * d.year).toFixed(1)))
      }

      option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(16, 46, 67, 0.95)",
          borderColor: "#28536A",
          borderWidth: 1,
          textStyle: { color: "#F7FAFC", fontSize: 12 },
          valueFormatter: (value) => `${value} mm`
        },
        legend: {
          top: 0,
          textStyle: { color: "#BED1DD", fontSize: 12 }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "8%",
          top: "16%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: years,
          axisLine: { lineStyle: { color: "#28536A" } },
          axisLabel: { color: "#BED1DD" }
        },
        yAxis: {
          type: "value",
          name: `Brecha (${basinAName} - ${basinBName}) (mm)`,
          nameTextStyle: { color: "#BED1DD", fontSize: 12 },
          splitLine: { lineStyle: { color: "rgba(40, 83, 106, 0.4)" } },
          axisLabel: { color: "#BED1DD" }
        },
        series: [
          {
            name: "Brecha anual observada D(t)",
            type: "bar" as const,
            data: gaps,
            itemStyle: {
              color: (params: any) => (params.value >= 0 ? "#20D7DF" : "#D6A461"),
              borderRadius: [3, 3, 0, 0]
            }
          },
          ...(trendLineData.length > 0
            ? [
                {
                  name: `Tendencia HAC (${gapSlope} mm/año)`,
                  type: "line" as const,
                  data: trendLineData,
                  itemStyle: { color: "#F7FAFC" },
                  lineStyle: { width: 2, type: "dashed", color: "#F7FAFC" },
                  symbol: "none"
                }
              ]
            : [])
        ] as any
      }
    }

    try {
      chart.setOption(option, true)
    } catch {
      return
    }
  }, [mode, basinAId, basinAName, basinBId, basinBName, annualA, annualB, trendA, monthlyClimatologyA, monthlyClimatologyB, gapSeries, gapSlope, startYear, endYear])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          style={{
            fontSize: "0.8rem",
            color: "var(--color-primary-cyan)",
            padding: "4px 8px",
            borderRadius: "var(--border-radius-sm)",
            backgroundColor: "transparent",
            textDecoration: "underline"
          }}
        >
          {showTable ? "Ocultar tabla de datos" : "Ver datos en formato tabla accesible"}
        </button>
      </div>

      <div
        ref={chartContainerRef}
        role="region"
        aria-label={`Gráfico de ${mode === "annual" ? "precipitación anual" : (mode === "monthly" ? "ciclo estacional" : "brecha emparejada")}`}
        style={{
          width: "100%",
          height,
          backgroundColor: "var(--color-surface-elevated, #153C52)",
          borderRadius: "var(--border-radius-md)",
          border: "1px solid var(--color-border-discrete)"
        }}
      />

      {showTable && (
        <div style={{ overflowX: "auto", marginTop: "var(--spacing-sm)" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
              backgroundColor: "var(--color-surface-card)",
              border: "1px solid var(--color-border-discrete)"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface-elevated)", textAlign: "left", color: "var(--color-text-main)" }}>
                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>
                  {mode === "monthly" ? "Mes" : "Año"}
                </th>
                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>
                  {basinAName} (mm)
                </th>
                {basinBId && (
                  <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>
                    {basinBName} (mm)
                  </th>
                )}
                {mode === "gap" && (
                  <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>
                    Brecha D(t) (mm)
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {mode === "monthly"
                ? MONTH_NAMES.map((name, i) => (
                    <tr key={name} style={{ borderBottom: "1px solid var(--color-border-discrete)", color: "var(--color-text-secondary)" }}>
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--color-text-main)" }}>{name}</td>
                      <td style={{ padding: "8px 12px" }}>{monthlyClimatologyA[i]}</td>
                      {basinBId && <td style={{ padding: "8px 12px" }}>{monthlyClimatologyB[i]}</td>}
                    </tr>
                  ))
                : annualA.map((d, i) => {
                    const valB = annualB[i]?.annual_precip_mm || null
                    const gapVal = valB !== null ? ((d.annual_precip_mm || 0) - valB).toFixed(1) : "-"
                    return (
                      <tr key={d.year} style={{ borderBottom: "1px solid var(--color-border-discrete)", color: "var(--color-text-secondary)" }}>
                        <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--color-text-main)" }}>{d.year}</td>
                        <td style={{ padding: "8px 12px" }}>{d.annual_precip_mm}</td>
                        {basinBId && <td style={{ padding: "8px 12px" }}>{valB}</td>}
                        {mode === "gap" && <td style={{ padding: "8px 12px" }}>{gapVal}</td>}
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
