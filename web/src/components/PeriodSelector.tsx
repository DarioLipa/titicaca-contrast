import React from "react"

export interface PeriodSelectorProps {
  startYear: number
  endYear: number
  onPeriodChange: (start: number, end: number) => void
  minYear?: number
  maxYear?: number
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  startYear,
  endYear,
  onPeriodChange,
  minYear = 2001,
  maxYear = 2024
}) => {
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)

  const handleStartChange = (val: number) => {
    if (val <= endYear) {
      onPeriodChange(val, endYear)
    }
  }

  const handleEndChange = (val: number) => {
    if (val >= startYear) {
      onPeriodChange(startYear, val)
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-sm)",
      padding: "var(--spacing-md)",
      backgroundColor: "var(--color-surface-card)",
      borderRadius: "var(--border-radius-md)",
      border: "1px solid var(--color-border)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-main)" }}>
          Período de análisis: {startYear} – {endYear} ({endYear - startYear + 1} años)
        </span>
        <div style={{ display: "flex", gap: "var(--spacing-xs)", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => onPeriodChange(2001, 2024)}
            style={{
              padding: "5px 10px",
              fontSize: "0.75rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid " + (startYear === 2001 && endYear === 2024 ? "var(--color-primary-cyan)" : "var(--color-border)"),
              backgroundColor: startYear === 2001 && endYear === 2024 ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
              color: startYear === 2001 && endYear === 2024 ? "#061827" : "var(--color-text-secondary)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            2001–2024 (Completo)
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange(2001, 2020)}
            style={{
              padding: "5px 10px",
              fontSize: "0.75rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid " + (startYear === 2001 && endYear === 2020 ? "var(--color-primary-cyan)" : "var(--color-border)"),
              backgroundColor: startYear === 2001 && endYear === 2020 ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
              color: startYear === 2001 && endYear === 2020 ? "#061827" : "var(--color-text-secondary)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            2001–2020 (Referencia)
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange(2015, 2024)}
            style={{
              padding: "5px 10px",
              fontSize: "0.75rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid " + (startYear === 2015 && endYear === 2024 ? "var(--color-primary-cyan)" : "var(--color-border)"),
              backgroundColor: startYear === 2015 && endYear === 2024 ? "var(--color-primary-cyan)" : "var(--color-surface-elevated)",
              color: startYear === 2015 && endYear === 2024 ? "#061827" : "var(--color-text-secondary)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            2015–2024 (Decenio)
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--spacing-md)", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
          <label htmlFor="start-year-select" style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
            Desde:
          </label>
          <select
            id="start-year-select"
            value={startYear}
            onChange={(e) => handleStartChange(parseInt(e.target.value, 10))}
            style={{
              padding: "6px 10px",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-text-main)",
              fontSize: "0.9rem"
            }}
          >
            {years.filter(y => y <= endYear).map(y => (
              <option key={`start-${y}`} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
          <label htmlFor="end-year-select" style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
            Hasta:
          </label>
          <select
            id="end-year-select"
            value={endYear}
            onChange={(e) => handleEndChange(parseInt(e.target.value, 10))}
            style={{
              padding: "6px 10px",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-text-main)",
              fontSize: "0.9rem"
            }}
          >
            {years.filter(y => y >= startYear).map(y => (
              <option key={`end-${y}`} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

