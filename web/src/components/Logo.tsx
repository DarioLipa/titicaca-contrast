import React from "react"

export interface LogoProps {
  variant?: "full" | "compact" | "symbol"
  height?: number
  className?: string
  style?: React.CSSProperties
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  height = 44,
  className,
  style
}) => {
  const renderSymbol = () => (
    <svg
      width={height}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="logoBadgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#20D7DF" />
          <stop offset="50%" stopColor="#69DAD6" />
          <stop offset="100%" stopColor="#1177A7" />
        </linearGradient>
        <linearGradient id="logoWaterGlow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#20D7DF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#061827" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="logoWave1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#20D7DF" />
          <stop offset="100%" stopColor="#0B2B40" />
        </linearGradient>
        <linearGradient id="logoWave2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#102E43" />
          <stop offset="100%" stopColor="#20D7DF" />
        </linearGradient>
        <clipPath id="badgeClip">
          <rect x="3" y="3" width="94" height="94" rx="22" ry="22" />
        </clipPath>
      </defs>

      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="22"
        ry="22"
        fill="#061827"
        stroke="url(#logoBadgeBorder)"
        strokeWidth="4"
      />

      <g clipPath="url(#badgeClip)">
        <path
          d="M60 41 A16 16 0 0 1 73 34"
          stroke="#20D7DF"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M58 46 A22 22 0 0 1 78 37"
          stroke="#20D7DF"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
        <path
          d="M56 51 A28 28 0 0 1 82 40"
          stroke="#20D7DF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        <g transform="translate(71, 23) rotate(35)">
          <rect x="-5" y="-6" width="10" height="12" rx="1.5" fill="#F7FAFC" stroke="#061827" strokeWidth="1" />
          <rect x="-18" y="-4" width="11" height="8" rx="1" fill="#153C52" stroke="#20D7DF" strokeWidth="1.2" />
          <line x1="-12.5" y1="-4" x2="-12.5" y2="4" stroke="#20D7DF" strokeWidth="0.8" />
          <rect x="7" y="-4" width="11" height="8" rx="1" fill="#153C52" stroke="#20D7DF" strokeWidth="1.2" />
          <line x1="12.5" y1="-4" x2="12.5" y2="4" stroke="#20D7DF" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="1.5" fill="#20D7DF" />
        </g>

        <polygon points="12,58 34,42 45,52 64,36 88,58" fill="#0B2B40" />

        <polygon points="34,42 27,47 34,51 40,46" fill="#F7FAFC" />
        <polygon points="64,36 54,44 64,52 74,45" fill="#F7FAFC" />
        <polygon points="64,36 74,45 80,48 78,54 64,52" fill="#BED1DD" opacity="0.6" />

        <path
          d="M10 58 L90 58"
          stroke="#69DAD6"
          strokeWidth="1.5"
          opacity="0.8"
        />

        <line x1="26" y1="62" x2="74" y2="62" stroke="#20D7DF" strokeWidth="1.8" opacity="0.85" />
        <line x1="32" y1="66" x2="68" y2="66" stroke="#20D7DF" strokeWidth="1.6" opacity="0.7" />
        <line x1="38" y1="70" x2="62" y2="70" stroke="#20D7DF" strokeWidth="1.4" opacity="0.55" />
        <line x1="44" y1="74" x2="56" y2="74" stroke="#20D7DF" strokeWidth="1.2" opacity="0.4" />

        <path
          d="M0 80 Q 25 68 52 77 T 100 73 L 100 100 L 0 100 Z"
          fill="url(#logoWave1)"
          opacity="0.9"
        />
        <path
          d="M0 80 Q 25 68 52 77 T 100 73"
          stroke="#20D7DF"
          strokeWidth="3"
          fill="none"
        />

        <path
          d="M0 90 Q 28 82 56 88 T 100 84 L 100 100 L 0 100 Z"
          fill="url(#logoWave2)"
          opacity="0.95"
        />
        <path
          d="M0 90 Q 28 82 56 88 T 100 84"
          stroke="#69DAD6"
          strokeWidth="2.5"
          fill="none"
        />
      </g>
    </svg>
  )

  if (variant === "symbol") {
    return (
      <div className={className} style={{ display: "inline-flex", alignItems: "center", ...style }}>
        {renderSymbol()}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${Math.round(height * 0.28)}px`,
        textDecoration: "none",
        userSelect: "none",
        ...style
      }}
    >
      {renderSymbol()}

      <div
        style={{
          width: "2px",
          height: `${Math.round(height * 0.82)}px`,
          backgroundColor: "#20D7DF",
          opacity: 0.65,
          borderRadius: "1px",
          flexShrink: 0
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: `${Math.round(height * 0.16)}px`, lineHeight: 1.05 }}>
          <span
            style={{
              fontSize: `${Math.round(height * 0.44)}px`,
              fontWeight: 800,
              color: "#F7FAFC",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-family-base)"
            }}
          >
            TITICACA
          </span>
          <span
            style={{
              fontSize: `${Math.round(height * 0.44)}px`,
              fontWeight: 800,
              color: "#20D7DF",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-family-base)"
            }}
          >
            CONTRAST
          </span>
        </div>

        {variant === "full" && (
          <span
            style={{
              fontSize: `${Math.max(10, Math.round(height * 0.2))}px`,
              fontWeight: 600,
              color: "#BED1DD",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: `${Math.round(height * 0.08)}px`,
              fontFamily: "var(--font-family-base)",
              lineHeight: 1
            }}
          >
            OBSERVATORIO DE CUENCAS · PUNO
          </span>
        )}
      </div>
    </div>
  )
}
