import React, { useState } from "react"

export interface ExportControlsProps {
  onExportChart?: () => void
  onDownloadCsv?: (type: "monthly" | "annual" | "contrasts") => void
  currentUrl?: string
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  onExportChart,
  onDownloadCsv,
  currentUrl
}) => {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopyLink = () => {
    const url = currentUrl || window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-sm)",
      flexWrap: "wrap",
      padding: "var(--spacing-sm) var(--spacing-md)",
      backgroundColor: "var(--color-surface-card)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--border-radius-md)"
    }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-main)" }}>
        Exportar y compartir:
      </span>

      {onDownloadCsv && (
        <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
          <button
            type="button"
            onClick={() => onDownloadCsv("monthly")}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-text-main)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Descargar CSV mensual
          </button>
          <button
            type="button"
            onClick={() => onDownloadCsv("annual")}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-text-main)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Descargar CSV anual
          </button>
        </div>
      )}

      {onExportChart && (
        <button
          type="button"
          onClick={onExportChart}
          style={{
            padding: "6px 12px",
            borderRadius: "var(--border-radius-sm)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface-elevated)",
            color: "var(--color-text-main)",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Guardar imagen del gráfico
        </button>
      )}

      <button
        type="button"
        onClick={handleCopyLink}
        style={{
          padding: "6px 14px",
          borderRadius: "var(--border-radius-sm)",
          border: "none",
          backgroundColor: copied ? "var(--color-status-positive)" : "var(--color-primary-cyan)",
          color: "#061827",
          fontSize: "0.8rem",
          fontWeight: 700,
          cursor: "pointer"
        }}
      >
        {copied ? "¡Enlace copiado!" : "Copiar enlace permanente"}
      </button>
    </div>
  )
}

