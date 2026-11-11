import React, { useEffect, useRef, useState } from "react"
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
  ramis: "#20D7DF",
  coata: "#20D6A0",
  ilave: "#C084FC",
  huancane: "#69DAD6"
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
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const [showBasemap, setShowBasemap] = useState<boolean>(true)

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    let resizeObserver: ResizeObserver | null = null

    try {
      const map = L.map(mapContainerRef.current, {
        center: [-15.5, -70.0],
        zoom: 8,
        zoomControl: true,
        attributionControl: true
      })

      const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
        maxZoom: 18,
        minZoom: 5,
        crossOrigin: true
      })

      tileLayer.addTo(map)
      tileLayerRef.current = tileLayer
      mapInstanceRef.current = map

      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize()
      })
      resizeObserver.observe(mapContainerRef.current)
      setTimeout(() => map.invalidateSize(), 150)
    } catch {
      return
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (showBasemap) {
      if (!tileLayerRef.current) {
        tileLayerRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          subdomains: ["a", "b", "c"],
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
          maxZoom: 18,
          minZoom: 5,
          crossOrigin: true
        })
      }
      if (!map.hasLayer(tileLayerRef.current)) {
        tileLayerRef.current.addTo(map)
      }
      map.invalidateSize()
    } else {
      if (tileLayerRef.current && map.hasLayer(tileLayerRef.current)) {
        map.removeLayer(tileLayerRef.current)
      }
    }
  }, [showBasemap])

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
          const baseColor = BASIN_COLORS[id] || "#20D7DF"

          return {
            color: isPrimary ? "#F7FAFC" : (isSecondary ? "#D6A461" : baseColor),
            weight: isPrimary || isSecondary ? 3.5 : 1.8,
            fillColor: baseColor,
            fillOpacity: isPrimary ? 0.72 : (isSecondary ? 0.6 : 0.4),
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
            `<div style="font-weight:700;font-size:13px;color:#F7FAFC;background:#102E43;padding:4px 8px;border-radius:4px;border:1px solid #28536A;">Cuenca ${name}<div style="font-size:11px;color:#BED1DD;font-weight:400;">${code} | ${area}</div></div>`,
            { sticky: true, className: "custom-leaflet-tooltip" }
          )

          featureLayer.on({
            click: () => {
              onSelectBasin(id)
            },
            mouseover: (e) => {
              const target = e.target
              target.setStyle({ fillOpacity: 0.88 })
            },
            mouseout: (e) => {
              const target = e.target
              const isPrimary = id === selectedBasin
              const isSecondary = id === secondSelectedBasin
              target.setStyle({
                fillOpacity: isPrimary ? 0.72 : (isSecondary ? 0.6 : 0.4)
              })
            }
          })
        }
      }).addTo(map)

      geoJsonLayerRef.current = layer

      const bounds = layer.getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] })
        setTimeout(() => map.invalidateSize(), 50)
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
        mapInstanceRef.current.invalidateSize()
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
          Mapa hidrográfico oficial (clic en un polígono para seleccionar)
        </span>
        <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
          <button
            type="button"
            onClick={() => setShowBasemap(!showBasemap)}
            style={{
              fontSize: "0.8rem",
              padding: "5px 10px",
              borderRadius: "var(--border-radius-sm)",
              backgroundColor: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border-discrete)",
              color: "var(--color-text-secondary)",
              fontWeight: 500
            }}
          >
            {showBasemap ? "Ocultar mapa OSM" : "Mostrar mapa OSM"}
          </button>
          <button
            type="button"
            onClick={handleResetView}
            style={{
              fontSize: "0.8rem",
              padding: "5px 10px",
              borderRadius: "var(--border-radius-sm)",
              backgroundColor: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border-discrete)",
              color: "var(--color-primary-cyan)",
              fontWeight: 600
            }}
          >
            Restablecer vista
          </button>
        </div>
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
          border: "1px solid var(--color-border-discrete)",
          backgroundColor: "#0B2B40",
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
          const baseColor = BASIN_COLORS[b.id] || "#20D7DF"
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBasin(b.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "var(--border-radius-full)",
                border: isSelected
                  ? "2px solid var(--color-primary-cyan)"
                  : (isSecondary ? "2px dashed var(--color-status-warning)" : "1px solid var(--color-border-discrete)"),
                backgroundColor: isSelected || isSecondary ? "var(--color-surface-elevated)" : "var(--color-surface-card)",
                fontSize: "0.82rem",
                fontWeight: isSelected || isSecondary ? 700 : 500,
                color: isSelected ? "var(--color-primary-cyan)" : "var(--color-text-main)",
                boxShadow: isSelected ? "0 0 10px rgba(32, 215, 223, 0.25)" : "none",
                transition: "all 0.15s ease"
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
