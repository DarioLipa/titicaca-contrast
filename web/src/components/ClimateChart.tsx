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

  const monthlyA = monthlyData.filter(
    (d) => d.basin_id === basinAId && d.year >= startYear && d.year <= endYear && d.precip_mm !== null
  )

  const monthlyClimatologyA = Array.from({ length: 12 }, (_, mIdx) => {
    const month = mIdx + 1
    const matching = monthlyA.filter((d) => d.month === month && d.precip_mm !== null)
    if (matching.length === 0) return 0
    const sum = matching.reduce((acc, curr) => acc + (curr.precip_mm || 0), 0)
    return parseFloat((sum / matching.length).toFixed(1))
  })

  const monthlyB = basinBId
    ? monthlyData.filter((d) => d.basin_id === basinBId && d.year >= startYear && d.year <= endYear && d.precip_mm !== null)
    : []

  const monthlyClimatologyB = basinBId
    ? Array.from({ length: 12 }, (_, mIdx) => {
        const month = mIdx + 1
        const matching = monthlyB.filter((d) => d.month === month && d.precip_mm !== null)
        if (matching.length === 0) return 0
        const sum = matching.reduce((acc, curr) => acc + (curr.precip_mm || 0), 0)
        return parseFloat((sum / matching.length).toFixed(1))
      })
    : []

  useEffect(() => {
    if (!chartContainerRef.current) return
    let chart: echarts.ECharts | null = null
    try {
      chart = echarts.init(chartContainerRef.current)
      chartInstanceRef.current = chart
    } catch {
      return
    }

    const handleResize = () => {
      try {
        chart?.resize()
      } catch {
        return
      }
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
          itemStyle: { color: "#1177A7", borderRadius: [3, 3, 0, 0] }
        }
      ]

      if (basinBId && annualB.length > 0) {
        seriesList.push({
          name: basinBName,
          type: "bar",
          data: annualB.map((d) => d.annual_precip_mm || 0),
          itemStyle: { color: "#A44F24", borderRadius: [3, 3, 0, 0] }
        })
      }

      if (trendLineData.length > 0) {
        seriesList.push({
          name: `Tendencia Theil-Sen (${trendA?.sen_slope_mm_per_year} mm/año)`,
          type: "line",
          data: trendLineData,
          itemStyle: { color: "#12314A" },
          lineStyle: { width: 2, type: "dashed" },
          symbol: "none"
        })
      }

      option = {
        tooltip: {
          trigger: "axis",
          valueFormatter: (value) => `${value} mm`
        },
        legend: {
          top: 0,
          textStyle: { color: "#142532", fontSize: 12 }
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
          axisLine: { lineStyle: { color: "#CFD9E1" } },
          axisLabel: { color: "#536B7E" }
        },
        yAxis: {
          type: "value",
          name: "Precipitación (mm)",
          nameTextStyle: { color: "#536B7E", fontSize: 12 },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#E8EEF3" } },
          axisLabel: { color: "#536B7E" }
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
          itemStyle: { color: "#1177A7" },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(17,119,167,0.3)" }, { offset: 1, color: "rgba(17,119,167,0.0)" }]) }
        }
      ]

      if (basinBId && monthlyClimatologyB.length > 0) {
        seriesList.push({
          name: basinBName,
          type: "line",
          smooth: true,
          data: monthlyClimatologyB,
          itemStyle: { color: "#A44F24" },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(164,79,36,0.2)" }, { offset: 1, color: "rgba(164,79,36,0.0)" }]) }
        })
      }

      option = {
        tooltip: {
          trigger: "axis",
          valueFormatter: (value) => `${value} mm`
        },
        legend: {
          top: 0,
          textStyle: { color: "#142532", fontSize: 12 }
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
          axisLine: { lineStyle: { color: "#CFD9E1" } },
          axisLabel: { color: "#536B7E" }
        },
        yAxis: {
          type: "value",
          name: "Lámina mensual media (mm)",
          nameTextStyle: { color: "#536B7E", fontSize: 12 },
          splitLine: { lineStyle: { color: "#E8EEF3" } },
          axisLabel: { color: "#536B7E" }
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
        tooltip: {
          trigger: "axis",
          valueFormatter: (value) => `${value} mm`
        },
        legend: {
          top: 0,
          textStyle: { color: "#142532", fontSize: 12 }
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
          axisLine: { lineStyle: { color: "#CFD9E1" } },
          axisLabel: { color: "#536B7E" }
        },
        yAxis: {
          type: "value",
          name: `Brecha (${basinAName} - ${basinBName}) (mm)`,
          nameTextStyle: { color: "#536B7E", fontSize: 12 },
          splitLine: { lineStyle: { color: "#E8EEF3" } },
          axisLabel: { color: "#536B7E" }
        },
        series: [
          {
            name: "Brecha anual observada D(t)",
            type: "bar" as const,
            data: gaps,
            itemStyle: {
              color: (params: any) => (params.value >= 0 ? "#1177A7" : "#A44F24"),
              borderRadius: [2, 2, 0, 0]
            }
          },
          ...(trendLineData.length > 0
            ? [
                {
                  name: `Tendencia HAC (${gapSlope} mm/año)`,
                  type: "line" as const,
                  data: trendLineData,
                  itemStyle: { color: "#12314A" },
                  lineStyle: { width: 2, type: "dashed" },
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
            color: "var(--color-action-blue)",
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
          backgroundColor: "#FFFFFF",
          borderRadius: "var(--border-radius-md)",
          border: "1px solid var(--color-border)"
        }}
      />

      {showTable && (
        <div style={{ overflowX: "auto", marginTop: "var(--spacing-sm)" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
              backgroundColor: "#FFFFFF",
              border: "1px solid var(--color-border)"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface-muted)", textAlign: "left" }}>
                <th style={{ padding: "8px", borderBottom: "1px solid var(--color-border)" }}>
                  {mode === "monthly" ? "Mes" : "Año"}
                </th>
                <th style={{ padding: "8px", borderBottom: "1px solid var(--color-border)" }}>
                  {basinAName} (mm)
                </th>
                {basinBId && (
                  <th style={{ padding: "8px", borderBottom: "1px solid var(--color-border)" }}>
                    {basinBName} (mm)
                  </th>
                )}
                {mode === "gap" && (
                  <th style={{ padding: "8px", borderBottom: "1px solid var(--color-border)" }}>
                    Brecha D(t) (mm)
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {mode === "monthly"
                ? MONTH_NAMES.map((name, i) => (
                    <tr key={name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "6px 8px", fontWeight: 600 }}>{name}</td>
                      <td style={{ padding: "6px 8px" }}>{monthlyClimatologyA[i]}</td>
                      {basinBId && <td style={{ padding: "6px 8px" }}>{monthlyClimatologyB[i]}</td>}
                    </tr>
                  ))
                : annualA.map((d, i) => {
                    const valB = annualB[i]?.annual_precip_mm || null
                    const gapVal = valB !== null ? ((d.annual_precip_mm || 0) - valB).toFixed(1) : "-"
                    return (
                      <tr key={d.year} style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "6px 8px", fontWeight: 600 }}>{d.year}</td>
                        <td style={{ padding: "6px 8px" }}>{d.annual_precip_mm}</td>
                        {basinBId && <td style={{ padding: "6px 8px" }}>{valB}</td>}
                        {mode === "gap" && <td style={{ padding: "6px 8px" }}>{gapVal}</td>}
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
