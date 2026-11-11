import React from "react"
import type { DataStatus } from "../app/dataLoader"

export interface StatusMessageProps {
  status: DataStatus
  message?: string
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ status, message }) => {
  if (status === "ready") {
    return null
  }

  const getDetails = () => {
    switch (status) {
      case "loading":
        return {
          title: "Cargando catálogo de datos",
          desc: message || "Verificando manifiesto de integridad científica...",
          bg: "rgba(16, 46, 67, 0.75)",
          border: "var(--color-border-discrete)",
          color: "var(--color-primary-cyan)"
        }
      case "unavailable":
        return {
          title: "Datos pendientes de procesamiento",
          desc: message || "Los datos de precipitación NASA IMERG V07 y cuencas ANA se encuentran en fase de extracción y validación. No se muestran datos simulados ni aproximaciones sin sustento.",
          bg: "rgba(214, 164, 97, 0.15)",
          border: "rgba(214, 164, 97, 0.35)",
          color: "var(--color-status-warning)"
        }
      case "partial":
        return {
          title: "Conjunto de datos parcial",
          desc: message || "Parte de las series históricas está disponible, pero faltan meses para completar el período de 25 años.",
          bg: "rgba(214, 164, 97, 0.15)",
          border: "rgba(214, 164, 97, 0.35)",
          color: "var(--color-status-warning)"
        }
      case "error":
      default:
        return {
          title: "Error de validación de datos",
          desc: message || "No se pudo verificar la integridad científica del archivo de datos cargado.",
          bg: "rgba(233, 121, 121, 0.15)",
          border: "rgba(233, 121, 121, 0.35)",
          color: "var(--color-status-error)"
        }
    }
  }

  const details = getDetails()

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        backgroundColor: details.bg,
        border: `1px solid ${details.border}`,
        borderRadius: "var(--border-radius-md)",
        padding: "var(--spacing-md)",
        marginBottom: "var(--spacing-lg)",
        color: details.color
      }}
    >
      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--spacing-xs)" }}>
        {details.title}
      </h3>
      <p style={{ fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
        {details.desc}
      </p>
    </div>
  )
}
