import React, { useState, useEffect, useRef } from "react"

export interface OrbitStackItem {
  id?: string
  name: string
  role: string
  description: string
  initials?: string
  stat?: string
  accent?: string
  image?: string
  code?: string
  metricLabel?: string
  trend?: string
  trendLabel?: string
  altitude?: string
  badge?: string
  svgPath?: string
  coordinates?: string
}

export interface OrbitCardStackProps {
  items: OrbitStackItem[]
  defaultActiveIndex?: number
  spread?: number
  lift?: number
  onActiveChange?: (item: OrbitStackItem, index: number) => void
  onCardClick?: (item: OrbitStackItem, index: number) => void
  className?: string
  style?: React.CSSProperties
}

export const OrbitCardStack: React.FC<OrbitCardStackProps> = ({
  items,
  defaultActiveIndex = 2,
  spread = 150,
  lift = 40,
  onActiveChange,
  onCardClick,
  className,
  style
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    if (defaultActiveIndex >= 0 && defaultActiveIndex < items.length) {
      return defaultActiveIndex
    }
    return Math.floor(items.length / 2)
  })
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSelect = (idx: number) => {
    setActiveIndex(idx)
    const item = items[idx]
    if (item && onActiveChange) {
      onActiveChange(item, idx)
    }
  }

  const effectiveSpread = isMobile ? Math.min(spread * 0.42, 58) : spread

  return (
    <div
      ref={containerRef}
      className={className ? `orbit-card-stack-root ${className}` : "orbit-card-stack-root"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: isMobile ? "500px" : "570px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        userSelect: "none",
        ...style
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "420px" : "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {items.map((item, idx) => {
          const diff = idx - activeIndex
          const isActive = idx === activeIndex
          const accentColor = item.accent || "#20D7DF"

          const xSpread = isHovered ? effectiveSpread : effectiveSpread * 0.65
          const translateX = diff * xSpread
          const arcDrop = isMobile ? 8 : 14
          const translateY = Math.abs(diff) * arcDrop - (isActive ? lift : 0)
          const rotateZ = diff * (isMobile ? 3.5 : 5.5)
          const scale = isActive ? (isMobile ? 1.03 : 1.06) : Math.max(0.88, 1 - Math.abs(diff) * 0.045)
          const zIndex = isActive ? 40 : 30 - Math.abs(diff) * 2
          const opacity = isActive ? 1.0 : Math.max(0.72, 1 - Math.abs(diff) * 0.12)

          return (
            <div
              key={item.id || item.name || idx}
              role="button"
              tabIndex={0}
              aria-label={`${item.name} - ${item.role}`}
              onClick={() => {
                handleSelect(idx)
                onCardClick?.(item, idx)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelect(idx)
                  onCardClick?.(item, idx)
                }
              }}
              style={{
                position: "absolute",
                width: isMobile ? "250px" : "clamp(270px, 21vw, 315px)",
                height: isMobile ? "400px" : "465px",
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotateZ}deg) scale(${scale})`,
                zIndex,
                opacity,
                transformOrigin: "center bottom",
                transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, box-shadow 0.4s ease",
                cursor: "pointer",
                borderRadius: "18px",
                padding: "16px",
                backgroundColor: "rgba(10, 31, 49, 0.96)",
                backgroundImage: `radial-gradient(circle at 50% 0%, ${accentColor}18 0%, rgba(6, 24, 39, 0.98) 75%)`,
                border: `1.5px solid ${isActive ? accentColor : "rgba(40, 83, 106, 0.65)"}`,
                boxShadow: isActive
                  ? `0 24px 48px -12px rgba(0, 0, 0, 0.75), 0 0 35px ${accentColor}40, 0 0 0 1px ${accentColor}80`
                  : "0 12px 28px -10px rgba(0, 0, 0, 0.55), 0 0 12px rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      background: `${accentColor}20`,
                      border: `1.5px solid ${accentColor}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: accentColor,
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      letterSpacing: "0.02em"
                    }}
                  >
                    {item.initials || item.name.substring(0, 2).toUpperCase()}
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        padding: "3px 9px",
                        borderRadius: "9999px",
                        backgroundColor: `${accentColor}22`,
                        border: `1px solid ${accentColor}60`,
                        color: accentColor,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.02em"
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: isMobile ? "1.05rem" : "1.2rem",
                    fontWeight: 800,
                    color: "#F7FAFC",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em"
                  }}
                >
                  {item.name}
                </h3>
                <span
                  style={{
                    fontSize: "0.74rem",
                    color: accentColor,
                    fontWeight: 600,
                    display: "block",
                    marginTop: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em"
                  }}
                >
                  {item.role}
                </span>
              </div>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: isMobile ? "135px" : "170px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  backgroundColor: "rgba(6, 24, 39, 0.65)",
                  border: "1px solid rgba(40, 83, 106, 0.4)",
                  overflow: "hidden",
                  margin: "8px 0"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
                      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px"
                  }}
                />

                {item.svgPath ? (
                  <svg
                    viewBox="0 0 280 200"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      zIndex: 2,
                      filter: isActive ? `drop-shadow(0 0 10px ${accentColor}70)` : `drop-shadow(0 0 4px ${accentColor}30)`,
                      transition: "filter 0.3s ease"
                    }}
                  >
                    <defs>
                      <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={accentColor} stopOpacity={isActive ? 0.65 : 0.4} />
                        <stop offset="100%" stopColor={accentColor} stopOpacity={isActive ? 0.2 : 0.08} />
                      </linearGradient>
                      <radialGradient id={`glow-${idx}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={accentColor} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                      </radialGradient>
                    </defs>
                    <ellipse cx="140" cy="100" rx="90" ry="70" fill={`url(#glow-${idx})`} />
                    <path
                      d={item.svgPath}
                      fill={`url(#grad-${idx})`}
                      stroke={accentColor}
                      strokeWidth={isActive ? "2.4" : "1.8"}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <div style={{ color: accentColor, fontSize: "0.9rem", fontWeight: 700 }}>
                    {item.name}
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    right: "8px",
                    fontSize: "0.65rem",
                    fontFamily: "var(--font-family-mono, monospace)",
                    color: "rgba(190, 209, 221, 0.65)",
                    zIndex: 3
                  }}
                >
                  {item.coordinates || "PUNO · PERÚ"}
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 2 }}>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--color-text-secondary, #BED1DD)",
                    lineHeight: 1.45,
                    margin: "0 0 10px 0"
                  }}
                >
                  {item.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "8px",
                    borderTop: "1px solid rgba(40, 83, 106, 0.5)",
                    fontSize: "0.75rem"
                  }}
                >
                  <div>
                    <span style={{ color: "rgba(190, 209, 221, 0.7)", display: "block", fontSize: "0.68rem" }}>
                      {item.metricLabel || "Métrica principal"}
                    </span>
                    <strong style={{ color: "#F7FAFC", fontFamily: "var(--font-family-mono, monospace)", fontSize: "0.88rem" }}>
                      {item.stat || "-"}
                    </strong>
                  </div>

                  {item.trend && (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ color: "rgba(190, 209, 221, 0.7)", display: "block", fontSize: "0.68rem" }}>
                        {item.trendLabel || "Tendencia"}
                      </span>
                      <strong style={{ color: accentColor, fontFamily: "var(--font-family-mono, monospace)", fontSize: "0.82rem" }}>
                        {item.trend}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "16px",
          zIndex: 45,
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIndex
          const accentColor = item.accent || "#20D7DF"
          return (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => handleSelect(idx)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: isMobile ? "5px 10px" : "6px 14px",
                borderRadius: "9999px",
                border: `1.5px solid ${isActive ? accentColor : "rgba(40, 83, 106, 0.5)"}`,
                backgroundColor: isActive ? "rgba(16, 46, 67, 0.95)" : "rgba(6, 24, 39, 0.7)",
                color: isActive ? "#F7FAFC" : "var(--color-text-secondary, #BED1DD)",
                fontSize: isMobile ? "0.72rem" : "0.78rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                boxShadow: isActive ? `0 0 12px ${accentColor}40` : "none",
                transition: "all 0.2s ease"
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: accentColor,
                  display: "inline-block",
                  boxShadow: isActive ? `0 0 6px ${accentColor}` : "none"
                }}
              />
              {item.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
