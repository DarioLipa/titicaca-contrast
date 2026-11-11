import React, { useState } from "react"
import type { DataPayload } from "../app/dataLoader"
import { StatusMessage } from "../components/StatusMessage"

export interface ExplorerProps {
  data: DataPayload
}

export const Explorer: React.FC<ExplorerProps> = ({ data }) => {
  const [selectedBasin, setSelectedBasin] = useState<string>("ramis")

  const basins = [
    { id: "ramis", name: "Ramis", code: "0154", desc: "Mayor cuenca tributaria septentrional del Titicaca" },
    { id: "coata", name: "Coata", code: "0156", desc: "Cuenca centro-occidental formada por los ríos Cabanillas y Lampa" },
    { id: "ilave", name: "Ilave", code: "0160", desc: "Cuenca meridional formada por los ríos Huenque y Aguas Calientes" },
    { id: "huancane", name: "Huancané", code: "0152", desc: "Cuenca nororiental adyacente a la cuenca Ramis" }
  ]

  const current = basins.find((b) => b.id === selectedBasin) || basins[0]

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-md)" }}>
        Explorador de cuencas
      </h2>

      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--spacing-lg)", marginBottom: "var(--spacing-xl)" }}>
        <div className="card">
          <label htmlFor="basin-select" style={{ display: "block", fontWeight: 600, marginBottom: "var(--spacing-xs)" }}>
            Seleccionar cuenca tributaria:
          </label>
          <select
            id="basin-select"
            value={selectedBasin}
            onChange={(e) => setSelectedBasin(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-border)",
              fontSize: "1rem",
              marginBottom: "var(--spacing-md)"
            }}
          >
            {basins.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} (Código ANA: {b.code})
              </option>
            ))}
          </select>

          <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
            <p style={{ margin: 0, marginBottom: "var(--spacing-xs)" }}>
              <strong>Nombre oficial:</strong> Cuenca {current.name}
            </p>
            <p style={{ margin: 0, marginBottom: "var(--spacing-xs)" }}>
              <strong>Código ANA:</strong> {current.code}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Descripción:</strong> {current.desc}
            </p>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
            Estado de la serie histórica
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginBottom: "var(--spacing-md)" }}>
            La visualización de mapas Leaflet y series temporales ECharts se activará con los datos validados del pipeline (Fases 1 y 2).
          </p>
          <div style={{
            padding: "var(--spacing-md)",
            backgroundColor: "var(--color-surface-muted)",
            borderRadius: "var(--border-radius-sm)",
            fontSize: "0.85rem"
          }}>
            <strong>Regla científica:</strong> No se presentan números simulados ni interpolaciones no verificadas.
          </div>
        </div>
      </div>
    </div>
  )
}
