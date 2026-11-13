import React, { useState } from "react"
import { OrbitCardStack, type OrbitStackItem } from "./ui/orbit-card-stack"
import { TERRITORY_SVG_PATHS } from "../data/territorySvgPaths"
import { useLanguage } from "../app/i18n"

export interface TerritoryHeroVisualProps {
  onSelectBasin?: (basinId: string) => void
}

export const TerritoryHeroVisual: React.FC<TerritoryHeroVisualProps> = ({ onSelectBasin }) => {
  const { lang } = useLanguage()

  const territories: OrbitStackItem[] = [
    {
      id: "ramis",
      name: lang === "es" ? "Cuenca Ramis" : "Ramis Basin",
      role: lang === "es" ? "Tributario Norte · Mayor Cuenca" : "Northern Tributary · Largest Basin",
      description: lang === "es"
        ? "La mayor cuenca hidrográfica del sistema. Drena la cordillera hacia el norte del lago Titicaca."
        : "The largest hydrographic watershed in the system, draining the cordillera into northern Lake Titicaca.",
      initials: "RA",
      stat: "15,870.42 km²",
      metricLabel: lang === "es" ? "Superficie de cuenca" : "Watershed Area",
      trend: "-11.45 mm/año",
      trendLabel: lang === "es" ? "Tendencia" : "Trend",
      accent: "#20D7DF",
      badge: "48.4% Área",
      code: "ANA 0179+018+019",
      svgPath: TERRITORY_SVG_PATHS.ramis,
      coordinates: "14.5° S, 70.2° W"
    },
    {
      id: "coata",
      name: lang === "es" ? "Cuenca Coata" : "Coata Basin",
      role: lang === "es" ? "Tributario Central · Valle de Juliaca" : "Central Tributary · Juliaca Valley",
      description: lang === "es"
        ? "Cuenca central que integra los ríos Cabanillas y Lampa, irrigando valles agropecuarios y urbanos."
        : "Central watershed integrating Cabanillas and Lampa rivers, irrigating agricultural and urban valleys.",
      initials: "CO",
      stat: "4,882.42 km²",
      metricLabel: lang === "es" ? "Superficie de cuenca" : "Watershed Area",
      trend: "-8.13 mm/año",
      trendLabel: lang === "es" ? "Tendencia" : "Trend",
      accent: "#20D6A0",
      badge: "14.9% Área",
      code: "ANA 0176",
      svgPath: TERRITORY_SVG_PATHS.coata,
      coordinates: "15.4° S, 70.4° W"
    },
    {
      id: "titicaca",
      name: lang === "es" ? "Lago Titicaca" : "Lake Titicaca",
      role: lang === "es" ? "Cuerpo Receptor · Espejo Altiplánico" : "Receiving Body · Altiplanic Mirror",
      description: lang === "es"
        ? "El lago navegable más alto del mundo (3,812 m s.n.m.). Espejo termorregulador donde drenan las 4 cuencas."
        : "The highest navigable lake in the world (3,812 m a.s.l.). Thermoregulating mirror where all 4 watersheds drain.",
      initials: "LT",
      stat: "8,372 km²",
      metricLabel: lang === "es" ? "Superficie hídrica" : "Water Surface",
      trend: "3,812 m s.n.m.",
      trendLabel: lang === "es" ? "Altitud oficial" : "Official altitude",
      accent: "#38BDF8",
      badge: "★ Espejo Central ★",
      code: "ANA SNIRH Perú",
      svgPath: TERRITORY_SVG_PATHS.titicaca,
      coordinates: "15.8° S, 69.4° W"
    },
    {
      id: "ilave",
      name: lang === "es" ? "Cuenca Ilave" : "Ilave Basin",
      role: lang === "es" ? "Tributario Sur · Altiplano Meridional" : "Southern Tributary · Southern Altiplano",
      description: lang === "es"
        ? "Segunda cuenca en extensión. Nace en las cumbres volcánicas del sur hacia la bahía de Chucuito."
        : "Second largest watershed, originating in southern volcanic peaks toward Chucuito Bay.",
      initials: "IL",
      stat: "7,791.00 km²",
      metricLabel: lang === "es" ? "Superficie de cuenca" : "Watershed Area",
      trend: "-4.88 mm/año",
      trendLabel: lang === "es" ? "Tendencia" : "Trend",
      accent: "#C084FC",
      badge: "23.8% Área",
      code: "ANA 016",
      svgPath: TERRITORY_SVG_PATHS.ilave,
      coordinates: "16.1° S, 69.8° W"
    },
    {
      id: "huancane",
      name: lang === "es" ? "Cuenca Huancané" : "Huancané Basin",
      role: lang === "es" ? "Tributario Oriental · Cordillera Real" : "Eastern Tributary · Real Range",
      description: lang === "es"
        ? "Cuenca nororiental adyacente a la frontera boliviana, caracterizada por humedales y bofedales."
        : "Northeastern watershed adjacent to the Bolivian border, characterized by high-altitude wetlands.",
      initials: "HU",
      stat: "3,611.92 km²",
      metricLabel: lang === "es" ? "Superficie de cuenca" : "Watershed Area",
      trend: "-10.68 mm/año",
      trendLabel: lang === "es" ? "Tendencia" : "Trend",
      accent: "#69DAD6",
      badge: "11.0% Área",
      code: "ANA 0178",
      svgPath: TERRITORY_SVG_PATHS.huancane,
      coordinates: "15.1° S, 69.6° W"
    }
  ]

  const [activeTerritory, setActiveTerritory] = useState<OrbitStackItem>(territories[2])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "12px",
        position: "relative"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          padding: "0 4px"
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--color-text-secondary, #BED1DD)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "block"
            }}
          >
            {lang === "es" ? "Territorio en foco" : "Currently viewing"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#F7FAFC",
                margin: 0,
                letterSpacing: "-0.01em"
              }}
            >
              {activeTerritory.name}
            </h2>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 8px",
                borderRadius: "9999px",
                backgroundColor: `${activeTerritory.accent}20`,
                color: activeTerritory.accent,
                border: `1px solid ${activeTerritory.accent}55`,
                fontWeight: 700
              }}
            >
              {activeTerritory.badge}
            </span>
          </div>
        </div>

        {activeTerritory.id !== "titicaca" ? (
          onSelectBasin && (
            <button
              type="button"
              onClick={() => onSelectBasin(activeTerritory.id!)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "rgba(16, 46, 67, 0.8)",
                border: `1px solid ${activeTerritory.accent}`,
                color: activeTerritory.accent,
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: `0 0 10px ${activeTerritory.accent}30`
              }}
            >
              {lang === "es"
                ? `Abrir ${activeTerritory.name} en Explorador →`
                : `Open ${activeTerritory.name} in Explorer →`}
            </button>
          )
        ) : (
          onSelectBasin && (
            <button
              type="button"
              onClick={() => onSelectBasin("ramis")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "rgba(16, 46, 67, 0.8)",
                border: `1px solid ${activeTerritory.accent}`,
                color: activeTerritory.accent,
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: `0 0 10px ${activeTerritory.accent}30`
              }}
            >
              {lang === "es" ? "Ver cuencas en Explorador →" : "View watersheds in Explorer →"}
            </button>
          )
        )}
      </div>

      <div style={{ width: "100%", height: "500px", position: "relative" }}>
        <OrbitCardStack
          items={territories}
          defaultActiveIndex={2}
          spread={140}
          lift={38}
          onActiveChange={(item) => setActiveTerritory(item)}
          onCardClick={(item) => {
            if (item.id === "titicaca") {
              onSelectBasin?.("ramis")
            } else if (item.id && onSelectBasin) {
              onSelectBasin(item.id)
            }
          }}
        />
      </div>
    </div>
  )
}