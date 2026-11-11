import React, { useEffect, useRef } from "react"
import L from "leaflet"
import type { Basin } from "../app/schemas"

export interface BasinMapProps {
  selectedBasin?: string
  secondSelectedBasin?: string
  onSelectBasin: (id: string) => void
  geoJsonData?: any
  basins?: Basin[]
  height?: string
}

const BASIN_COLORS: Record<string, string> = {
  ramis: "#1177A7",
  coata: "#1D8F87",
  ilave: "#4F46E5",
  huancane: "#0284C7"
}

export const BasinMap: React.FC<BasinMapProps> = ({
  selectedBasin = "ramis",
  secondSelectedBasin,
  onSelectBasin,
  geoJsonData,
  basins = [],
  height = "420px"
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    try {
      const map = L.map(mapContainerRef.current, {
        center: [-15.5, -70.0],
        zoom: 8,
        zoomControl: true,
        attributionControl: true
      })

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 14,
        minZoom: 6
      }).addTo(map)

      mapInstanceRef.current = map
    } catch {
      return
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !geoJsonData) return

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current)
      geoJsonLayerRef.current = null
    }

    try {
      const layer = L.geoJSON(geoJsonData, {
        style: (feature) => {
          const id = feature?.properties?.id || ""
          const isPrimary = id === selectedBasin
          const isSecondary = id === secondSelectedBasin
          const baseColor = BASIN_COLORS[id] || "#1177A7"

          return {
            color: isPrimary ? "#12314A" : (isSecondary ? "#A44F24" : baseColor),
            weight: isPrimary || isSecondary ? 3 : 1.5,
            fillColor: baseColor,
            fillOpacity: isPrimary ? 0.7 : (isSecondary ? 0.6 : 0.35),
            dashArray: isSecondary ? "6, 6" : undefined
          }
        },
        onEachFeature: (feature, featureLayer) => {
          const props = feature.properties || {}
          const id = props.id || ""
          const name = props.name || id
          const area = props.area_km2 ? `${Number(props.area_km2).toLocaleString()} km²` : ""
          const code = props.official_code ? `ANA: ${props.official_code}` : ""

          featureLayer.bindTooltip(
            `<div style="font-weight:600;font-size:13px;">Cuenca ${name}</div><div style="font-size:11px;color:#555;">${code} | ${area}</div>`,
            { sticky: true }
          )

          featureLayer.on({
            click: () => {
              onSelectBasin(id)
            },
            mouseover: (e) => {
              const target = e.target
              target.setStyle({ fillOpacity: 0.85 })
            },
            mouseout: (e) => {
              const target = e.target
              const isPrimary = id === selectedBasin
              const isSecondary = id === secondSelectedBasin
              target.setStyle({
                fillOpacity: isPrimary ? 0.7 : (isSecondary ? 0.6 : 0.35)
              })
            }
          })
        }
      }).addTo(map)

      geoJsonLayerRef.current = layer

      const bounds = layer.getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] })
      }
    } catch {
      return
    }
  }, [geoJsonData, selectedBasin, secondSelectedBasin, onSelectBasin])

  const handleResetView = () => {
    if (mapInstanceRef.current && geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds()
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] })
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          Mapa hidrográfico oficial (clic en un polígono para seleccionar)
        </span>
        <button
          type="button"
          onClick={handleResetView}
          style={{
            fontSize: "0.8rem",
            padding: "4px 8px",
            borderRadius: "var(--border-radius-sm)",
            backgroundColor: "var(--color-surface-muted)",
            color: "var(--color-primary-navy)",
            fontWeight: 500
          }}
        >
          Restablecer vista
        </button>
      </div>

      <div
        ref={mapContainerRef}
        role="region"
        aria-label="Mapa interactivo de cuencas del Lago Titicaca"
        style={{
          width: "100%",
          height,
          borderRadius: "var(--border-radius-md)",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          backgroundColor: "#E5ECEF",
          position: "relative"
        }}
      />

      <div
        className="basin-map-fallback"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--spacing-xs)",
          marginTop: "var(--spacing-xs)"
        }}
      >
        {(basins.length > 0 ? basins : [
          { id: "ramis", name: "Ramis", official_code: "0179+018+019", area_km2: 15870.42, source: "ANA" },
          { id: "coata", name: "Coata", official_code: "0176", area_km2: 4882.42, source: "ANA" },
          { id: "ilave", name: "Ilave", official_code: "016", area_km2: 7791.0, source: "ANA" },
          { id: "huancane", name: "Huancané", official_code: "0178", area_km2: 3611.92, source: "ANA" }
        ]).map((b) => {
          const isSelected = b.id === selectedBasin
          const isSecondary = b.id === secondSelectedBasin
          const baseColor = BASIN_COLORS[b.id] || "#1177A7"
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBasin(b.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "var(--border-radius-sm)",
                border: isSelected ? "2px solid #12314A" : (isSecondary ? "2px dashed #A44F24" : "1px solid var(--color-border)"),
                backgroundColor: isSelected || isSecondary ? "#FFFFFF" : "var(--color-surface-card)",
                fontSize: "0.8rem",
                fontWeight: isSelected || isSecondary ? 700 : 500,
                color: "var(--color-text-main)"
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: baseColor,
                  display: "inline-block"
                }}
              />
              Cuenca {b.name} ({b.area_km2.toLocaleString()} km²)
            </button>
          )
        })}
      </div>
    </div>
  )
}

