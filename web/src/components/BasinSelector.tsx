import React from "react"
import type { Basin } from "../app/schemas"

export interface BasinSelectorProps {
  selectedBasin: string
  onSelectBasin: (id: string) => void
  label?: string
  id?: string
  basins?: Basin[]
  disabledBasin?: string
}

const DEFAULT_BASINS = [
  { id: "ramis", name: "Ramis", code: "0179+018+019" },
  { id: "coata", name: "Coata", code: "0176" },
  { id: "ilave", name: "Ilave", code: "016" },
  { id: "huancane", name: "Huancané", code: "0178" }
]

export const BasinSelector: React.FC<BasinSelectorProps> = ({
  selectedBasin,
  onSelectBasin,
  label = "Seleccionar cuenca",
  id = "basin-select",
  basins,
  disabledBasin
}) => {
  const options = basins && basins.length > 0
    ? basins.map(b => ({ id: b.id, name: b.name, code: b.official_code }))
    : DEFAULT_BASINS

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-primary-navy)" }}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={selectedBasin}
        onChange={(e) => onSelectBasin(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "var(--border-radius-sm)",
          border: "1px solid var(--color-border)",
          backgroundColor: "#FFFFFF",
          fontSize: "1rem",
          color: "var(--color-text-main)",
          fontWeight: 500
        }}
      >
        {options.map((b) => (
          <option
            key={b.id}
            value={b.id}
            disabled={b.id === disabledBasin}
          >
            Cuenca {b.name} (ANA: {b.code}){b.id === disabledBasin ? " — seleccionada en par" : ""}
          </option>
        ))}
      </select>
    </div>
  )
}
