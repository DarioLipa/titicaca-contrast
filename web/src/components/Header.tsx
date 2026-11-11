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
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(11, 43, 64, 0.8)",
              border: "1px solid rgba(32, 216, 161, 0.35)",
              color: "var(--color-indicator-green, #20D8A1)",
              fontSize: "0.8rem",
              fontWeight: 600,
              boxShadow: "0 0 16px rgba(32, 216, 161, 0.15)",
              backdropFilter: "blur(12px)"
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#20D8A1",
                boxShadow: "0 0 8px #20D8A1"
              }}
            />
            Datos actualizados
          </span>
        )
      case "partial":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(11, 43, 64, 0.8)",
              border: "1px solid rgba(220, 168, 111, 0.35)",
              color: "var(--color-accent-amber, #DCA86F)",
              fontSize: "0.8rem",
              fontWeight: 600,
              backdropFilter: "blur(12px)"
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#DCA86F"
              }}
            />
            Datos parciales
          </span>
        )
      case "loading":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(11, 43, 64, 0.8)",
              border: "1px solid rgba(35, 215, 229, 0.35)",
              color: "var(--color-cyan-tech, #23D7E5)",
              fontSize: "0.8rem",
              fontWeight: 600,
              backdropFilter: "blur(12px)"
            }}
          >
            Cargando catálogo...
          </span>
        )
      case "unavailable":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(11, 43, 64, 0.8)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#F87171",
              fontSize: "0.8rem",
              fontWeight: 600,
              backdropFilter: "blur(12px)"
            }}
          >
            Datos pendientes de procesamiento
          </span>
        )
      default:
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(11, 43, 64, 0.8)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#F87171",
              fontSize: "0.8rem",
              fontWeight: 600,
              backdropFilter: "blur(12px)"
            }}
          >
            Datos no disponibles
          </span>
        )
    }
  }

  return (
    <header
      style={{
        backgroundColor: "rgba(6, 24, 39, 0.85)",
        borderBottom: "1px solid rgba(35, 215, 229, 0.15)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "14px",
          paddingBottom: "14px",
          gap: "var(--spacing-md)"
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
          onClick={() => onSelectTab("home")}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0B4A6F 0%, #0E7490 100%)",
              border: "1px solid rgba(35, 215, 229, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(35, 215, 229, 0.3)"
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#23D7E5"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 11c3-3.5 6-3.5 9 0s6 3.5 9 0" />
              <path d="M2 16c3-3.5 6-3.5 9 0s6 3.5 9 0" opacity="0.6" />
            </svg>
          </div>
          <div>
            <h1
              style={{
                fontSize: "1.12rem",
                fontWeight: 800,
                color: "var(--color-text-hero-white, #F7FAFC)",
                letterSpacing: "0.02em",
                lineHeight: 1.15,
                margin: 0
              }}
            >
              TITICACA CONTRAST
            </h1>
            <p
              style={{
                fontSize: "0.66rem",
                fontWeight: 600,
                color: "var(--color-turquoise, #70DCD8)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0
              }}
            >
              Observatorio de Cuencas · Puno
            </p>
          </div>
        </div>

        <nav aria-label="Navegación principal">
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              gap: "4px",
              margin: 0,
              padding: "4px",
              backgroundColor: "rgba(11, 43, 64, 0.65)",
              borderRadius: "9999px",
              border: "1px solid rgba(35, 215, 229, 0.2)",
              backdropFilter: "blur(12px)",
              flexWrap: "wrap"
            }}
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      padding: "7px 18px",
                      borderRadius: "9999px",
                      fontSize: "0.86rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#F7FAFC" : "#BCD0DC",
                      backgroundColor: isActive ? "#0E7490" : "transparent",
                      boxShadow: isActive ? "0 0 16px rgba(35, 215, 229, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)" : "none",
                      transition: "all 0.18s ease"
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
