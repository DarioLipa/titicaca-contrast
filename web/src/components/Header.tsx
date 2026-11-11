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
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "9999px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#34D399",
            fontSize: "0.78rem",
            fontWeight: 600
          }}>
            <span style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              boxShadow: "0 0 8px #10B981"
            }} />
            Datos actualizados (V07)
          </span>
        )
      case "partial":
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "9999px",
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            color: "#FBBF24",
            fontSize: "0.78rem",
            fontWeight: 600
          }}>
            Datos parciales
          </span>
        )
      case "loading":
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "9999px",
            background: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#38BDF8",
            fontSize: "0.78rem",
            fontWeight: 600
          }}>
            Cargando catálogo...
          </span>
        )
      case "unavailable":
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "9999px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#F87171",
            fontSize: "0.78rem",
            fontWeight: 600
          }}>
            Datos pendientes de procesamiento
          </span>
        )
      default:
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "9999px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#F87171",
            fontSize: "0.78rem",
            fontWeight: 600
          }}>
            Datos no disponibles
          </span>
        )
    }
  }

  return (
    <header style={{
      backgroundColor: "#040D18",
      borderBottom: "1px solid rgba(56, 189, 248, 0.15)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(16px)"
    }}>
      <div className="container" style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "14px",
        paddingBottom: "14px",
        gap: "var(--spacing-md)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => onSelectTab("home")}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #0284C7 0%, #0D9488 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(14, 165, 233, 0.4)"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c3-4 6-4 9 0s6 4 9 0" />
              <path d="M2 17c3-4 6-4 9 0s6 4 9 0" opacity="0.6" />
            </svg>
          </div>
          <div>
            <h1 style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              margin: 0
            }}>
              TITICACA CONTRAST
            </h1>
            <p style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "#38BDF8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0
            }}>
              Observatorio de Cuencas • Puno
            </p>
          </div>
        </div>

        <nav aria-label="Navegación principal">
          <ul style={{
            display: "flex",
            listStyle: "none",
            gap: "6px",
            margin: 0,
            padding: "4px",
            backgroundColor: "rgba(10, 30, 50, 0.6)",
            borderRadius: "9999px",
            border: "1px solid rgba(56, 189, 248, 0.18)",
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
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      fontSize: "0.85rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#FFFFFF" : "#94A3B8",
                      backgroundColor: isActive ? "#0284C7" : "transparent",
                      boxShadow: isActive ? "0 0 14px rgba(2, 132, 199, 0.5)" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div>
          {getStatusBadge()}
        </div>
      </div>
    </header>
  )
}
