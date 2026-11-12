import React from "react"
import { useLanguage } from "../app/i18n"

export interface HeroTelemetryPanelsProps {
  className?: string
  style?: React.CSSProperties
}

export const HeroTelemetryPanels: React.FC<HeroTelemetryPanelsProps> = ({ className, style }) => {
  const { t, lang } = useLanguage()

  return (
    <div
      className={className ? `hero-telemetry-panels ${className}` : "hero-telemetry-panels"}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        zIndex: 20,
        ...style
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderRadius: "var(--border-radius-md, 10px)",
          background: "rgba(16, 46, 67, 0.90)",
          border: "1px solid var(--color-border-discrete, #28536A)",
          backdropFilter: "blur(14px)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "rgba(32, 215, 223, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary-cyan, #20D7DF)"
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
          </div>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-primary-cyan, #20D7DF)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {t("hero_telemetry_monitoring")}
          </span>
        </div>
        <strong style={{ fontSize: "0.88rem", color: "#F7FAFC", display: "block" }}>
          NASA GPM-IMERG V07
        </strong>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-status-positive, #20D6A0)", boxShadow: "0 0 6px #20D6A0" }} />
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary, #BED1DD)" }}>
            {t("hero_telemetry_calibrated")}
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "12px 14px",
          borderRadius: "var(--border-radius-md, 10px)",
          background: "rgba(16, 46, 67, 0.90)",
          border: "1px solid var(--color-border-discrete, #28536A)",
          backdropFilter: "blur(14px)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-text-secondary, #BED1DD)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {lang === "en" ? "Precipitation" : "Precipitación"}
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--color-secondary-turquoise, #69DAD6)", fontWeight: 600 }}>
            {lang === "en" ? "Trend" : "Tendencia"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "30px", margin: "6px 0" }}>
          {[14, 18, 16, 21, 19, 24, 22, 27].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}px`,
                borderRadius: "2px 2px 0 0",
                background: i >= 5
                  ? "linear-gradient(to top, #0E7490, #20D7DF)"
                  : "linear-gradient(to top, #0B2B40, #153C52)",
                boxShadow: i >= 5 ? "0 0 6px rgba(32, 215, 223, 0.35)" : "none"
              }}
            />
          ))}
        </div>

        <span style={{ fontSize: "0.74rem", color: "var(--color-primary-cyan, #20D7DF)", fontWeight: 700 }}>
          {lang === "en" ? "-8.2 mm/yr average" : "-8.2 mm/año promedio"}
        </span>
      </div>

      <div
        style={{
          padding: "12px 14px",
          borderRadius: "var(--border-radius-md, 10px)",
          background: "rgba(16, 46, 67, 0.90)",
          border: "1px solid var(--color-border-discrete, #28536A)",
          backdropFilter: "blur(14px)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-text-secondary, #BED1DD)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {lang === "en" ? "Contrasts" : "Contrastes"}
          </span>
          <span
            style={{
              fontSize: "0.64rem",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(192, 132, 252, 0.15)",
              color: "#C084FC",
              fontWeight: 600
            }}
          >
            HAC / FDR
          </span>
        </div>
        <strong style={{ fontSize: "0.85rem", color: "#F7FAFC", display: "block" }}>
          {t("hero_telemetry_contrasts")}
        </strong>
        <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary, #BED1DD)", display: "block", marginTop: "2px" }}>
          {t("hero_telemetry_synchronous")}
        </span>
      </div>
    </div>
  )
}

