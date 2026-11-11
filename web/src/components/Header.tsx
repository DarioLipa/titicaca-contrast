import React, { useState } from "react"
import type { DataStatus } from "../app/dataLoader"
import { Logo } from "./Logo"

export interface HeaderProps {
  currentTab: string
  onSelectTab: (tab: string) => void
  status: DataStatus
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, status }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

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
              background: "rgba(16, 46, 67, 0.8)",
              border: "1px solid rgba(32, 214, 160, 0.35)",
              color: "var(--color-status-positive, #20D6A0)",
              fontSize: "0.8rem",
              fontWeight: 600,
              boxShadow: "0 0 12px rgba(32, 214, 160, 0.15)",
              backdropFilter: "blur(12px)"
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#20D6A0",
                boxShadow: "0 0 8px #20D6A0"
              }}
            />
            Datos disponibles
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
              background: "rgba(16, 46, 67, 0.8)",
              border: "1px solid rgba(214, 164, 97, 0.35)",
              color: "var(--color-status-warning, #D6A461)",
              fontSize: "0.8rem",
              fontWeight: 600,
              backdropFilter: "blur(12px)"
            }}
          >
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#D6A461" }} />
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
              background: "rgba(16, 46, 67, 0.8)",
              border: "1px solid rgba(32, 215, 223, 0.35)",
              color: "var(--color-primary-cyan, #20D7DF)",
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
              background: "rgba(16, 46, 67, 0.8)",
              border: "1px solid rgba(233, 121, 121, 0.35)",
              color: "var(--color-status-error, #E97979)",
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
              background: "rgba(16, 46, 67, 0.8)",
              border: "1px solid rgba(233, 121, 121, 0.35)",
              color: "#E97979",
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

  const handleNavClick = (id: string) => {
    onSelectTab(id)
    setMobileMenuOpen(false)
  }

  return (
    <header
      style={{
        backgroundColor: "rgba(6, 24, 39, 0.88)",
        borderBottom: "1px solid var(--color-border-discrete)",
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
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "12px",
          paddingBottom: "12px",
          gap: "var(--spacing-md)"
        }}
      >
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => handleNavClick("home")}
          role="heading"
          aria-level={1}
          aria-label="TITICACA CONTRAST"
        >
          <Logo variant="full" height={42} />
        </div>

        <nav aria-label="Navegación principal" className="desktop-nav">
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              gap: "4px",
              margin: 0,
              padding: "4px",
              backgroundColor: "rgba(16, 46, 67, 0.7)",
              borderRadius: "9999px",
              border: "1px solid var(--color-border-discrete)",
              backdropFilter: "blur(12px)"
            }}
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      padding: "7px 18px",
                      borderRadius: "9999px",
                      fontSize: "0.88rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#061827" : "var(--color-text-secondary)",
                      backgroundColor: isActive ? "var(--color-primary-cyan)" : "transparent",
                      boxShadow: isActive ? "0 0 16px rgba(32, 215, 223, 0.4)" : "none",
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="desktop-status">
            {getStatusBadge()}
          </div>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              border: "1px solid var(--color-border-discrete)",
              background: "var(--color-surface-card)",
              color: "var(--color-primary-cyan)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            backgroundColor: "rgba(6, 24, 39, 0.98)",
            borderTop: "1px solid var(--color-border-discrete)",
            padding: "16px var(--spacing-md) 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {navItems.map((item) => {
              const isActive = currentTab === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#061827" : "var(--color-text-main)",
                      backgroundColor: isActive ? "var(--color-primary-cyan)" : "transparent"
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>

          <div style={{ paddingTop: "8px", borderTop: "1px solid var(--color-border-discrete)" }}>
            {getStatusBadge()}
          </div>
        </div>
      )}

      <style>{`
        .mobile-menu-btn { display: none !important; }
        .desktop-nav { display: block !important; }
        .desktop-status { display: block !important; }
        @media (max-width: 859px) {
          .desktop-nav { display: none !important; }
          .desktop-status { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 860px) {
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  )
}
