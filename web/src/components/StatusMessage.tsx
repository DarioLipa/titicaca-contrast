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
          bg: "#E8EEF3",
          border: "#CFD9E1",
          color: "#142532"
        }
      case "unavailable":
        return {
          title: "Datos pendientes de procesamiento",
          desc: message || "Los datos de precipitación NASA IMERG V07 y cuencas ANA se encuentran en fase de extracción y validación. No se muestran datos simulados ni aproximaciones sin sustento.",
          bg: "#FDF3ED",
          border: "#F1D4C3",
          color: "var(--color-alert)"
        }
      case "partial":
        return {
          title: "Conjunto de datos parcial",
          desc: message || "Parte de las series históricas está disponible, pero faltan meses para completar el período de 25 años.",
          bg: "#FFF9E6",
          border: "#FDE68A",
          color: "#92400E"
        }
      case "error":
      default:
        return {
          title: "Error de validación de datos",
          desc: message || "No se pudo verificar la integridad científica del archivo de datos cargado.",
          bg: "#FEE2E2",
          border: "#FCA5A5",
          color: "#991B1B"
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
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "var(--spacing-xs)" }}>
        {details.title}
      </h3>
      <p style={{ fontSize: "0.9rem", margin: 0 }}>
        {details.desc}
      </p>
    </div>
  )
}
