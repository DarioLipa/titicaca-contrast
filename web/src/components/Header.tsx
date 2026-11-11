import React from "react"
import type { DataStatus } from "../app/dataLoader"

export interface HeaderProps {
  currentTab: string
  onSelectTab: (tab: string) => void
  status: DataStatus
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, status }) => {
  const navItems = [
    { id: "home", label: "Inicio" },
    { id: "explorer", label: "Explorador" },
    { id: "compare", label: "Comparar" },
    { id: "findings", label: "Hallazgos" },
    { id: "methodology", label: "Metodología" },
    { id: "sources", label: "Fuentes" }
  ]

  const getStatusBadge = () => {
    switch (status) {
      case "ready":
        return <span className="badge badge-success">Datos listos (V07)</span>
      case "partial":
        return <span className="badge badge-alert">Datos parciales</span>
      case "unavailable":
        return <span className="badge badge-alert">Datos pendientes de procesamiento</span>
      case "loading":
        return <span className="badge">Cargando manifiesto...</span>
      default:
        return <span className="badge badge-alert">Estado de datos no disponible</span>
    }
  }

  return (
    <header style={{
      backgroundColor: "var(--color-primary-navy)",
      color: "#FFFFFF",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
    }}>
      <div className="container" style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "var(--spacing-md)",
        paddingBottom: "var(--spacing-md)",
        gap: "var(--spacing-md)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              TITICACA CONTRAST
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--color-surface-muted)", margin: 0 }}>
              Un mismo lago, diferentes realidades climáticas
            </p>
          </div>
          {getStatusBadge()}
        </div>

        <nav aria-label="Navegación principal">
          <ul style={{
            display: "flex",
            listStyle: "none",
            gap: "var(--spacing-xs)",
            margin: 0,
            padding: 0,
            flexWrap: "wrap"
          }}>
            {navItems.map((item) => {
              const isActive = currentTab === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--border-radius-sm)",
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#FFFFFF" : "var(--color-surface-muted)",
                      backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
                      transition: "background-color 0.15s ease"
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
