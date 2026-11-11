import React from "react"
import type { DataPayload } from "../app/dataLoader"
import { StatusMessage } from "../components/StatusMessage"

export interface FindingsProps {
  data: DataPayload
}

export const Findings: React.FC<FindingsProps> = ({ data }) => {
  const pairs = [
    { a: "Ramis", b: "Coata", status: "Pendiente" },
    { a: "Ramis", b: "Ilave", status: "Pendiente" },
    { a: "Ramis", b: "Huancané", status: "Pendiente" },
    { a: "Coata", b: "Ilave", status: "Pendiente" },
    { a: "Coata", b: "Huancané", status: "Pendiente" },
    { a: "Ilave", b: "Huancané", status: "Pendiente" }
  ]

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-md)" }}>
        Panel de hallazgos y contrastes emparejados
      </h2>

      <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

      <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "var(--spacing-lg)" }}>
        Matriz de contraste de las 6 parejas posibles entre las 4 cuencas oficiales. La clasificación de evidencia requiere datos completos y corrección por tasa de falsos descubrimientos (Benjamini–Hochberg FDR, q ≤ 0.05).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--spacing-md)" }}>
        {pairs.map((p, idx) => (
          <div key={idx} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--color-primary-navy)" }}>
                {p.a} ↔ {p.b}
              </h3>
              <span className="badge badge-alert">{p.status}</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
              Cálculo de brecha temporal e intervalo de confianza al 95% supeditado a la validación de Fase 3.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

