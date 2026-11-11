import React, { useState } from "react"
import type { DataPayload } from "../app/dataLoader"
import { StatusMessage } from "../components/StatusMessage"

export interface CompareProps {
  data: DataPayload
}

export const Compare: React.FC<CompareProps> = ({ data }) => {
  const [basinA, setBasinA] = useState<string>("ramis")
  const [basinB, setBasinB] = useState<string>("coata")

  const basins = [
    { id: "ramis", name: "Ramis" },
    { id: "coata", name: "Coata" },
    { id: "ilave", name: "Ilave" },
    { id: "huancane", name: "Huancané" }
  ]

  const isSameBasin = basinA === basinB

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-md)" }}>
        Comparador de cuencas emparejadas
      </h2>

      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-md)" }}>
          <div>
            <label htmlFor="basin-a" style={{ display: "block", fontWeight: 600, marginBottom: "var(--spacing-xs)" }}>
              Primera cuenca (A):
            </label>
            <select
              id="basin-a"
              value={basinA}
              onChange={(e) => setBasinA(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                border: "1px solid var(--color-border)",
                fontSize: "1rem"
              }}
            >
              {basins.map((b) => (
                <option key={`a-${b.id}`} value={b.id}>
                  Cuenca {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="basin-b" style={{ display: "block", fontWeight: 600, marginBottom: "var(--spacing-xs)" }}>
              Segunda cuenca (B):
            </label>
            <select
              id="basin-b"
              value={basinB}
              onChange={(e) => setBasinB(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                border: "1px solid var(--color-border)",
                fontSize: "1rem"
              }}
            >
              {basins.map((b) => (
                <option key={`b-${b.id}`} value={b.id}>
                  Cuenca {b.name}
                </option>
              ))}
            </select>
          </div>
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

      <div className="card">
        <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          Detector de contrastes: Brecha temporal D(t)
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
          Fórmula analítica: <code>D(t) = Precipitación(A, t) - Precipitación(B, t)</code>
        </p>
        <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginTop: "var(--spacing-xs)" }}>
          La estimación de pendientes HAC (Newey–West) y niveles de evidencia se presentará con la serie completa validada.
        </p>
      </div>
    </div>
  )
}
