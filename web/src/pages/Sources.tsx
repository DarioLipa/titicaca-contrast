import React from "react"
import type { HydrologyData } from "../app/dataLoader"
import { useLanguage } from "../app/i18n"

export interface SourcesProps {
  data: HydrologyData
}

export const Sources: React.FC<SourcesProps> = ({ data }) => {
  const { lang, t } = useLanguage()
  const manifest = data.manifest

  const files = [
    { name: "basins.geojson", desc: lang === "es" ? "Geometrías de cuencas simplificadas topológicamente (WGS84 EPSG:4326)" : "Topologically simplified watershed geometries (WGS84 EPSG:4326)", path: "./data/basins.geojson" },
    { name: "lake.geojson", desc: lang === "es" ? "Geometría oficial de la porción peruana del lago Titicaca (ANA)" : "Official geometry of the Peruvian portion of Lake Titicaca (ANA)", path: "./data/lake.geojson" },
    { name: "basins.json", desc: lang === "es" ? "Metadatos, códigos oficiales ANA y áreas en km²" : "Metadata, official ANA codes and areas in km²", path: "./data/basins.json" },
    { name: "precipitation-monthly.csv", desc: lang === "es" ? "Serie mensual 2001-2025 (1,200 registros de cuenca/mes)" : "Monthly series 2001-2025 (1,200 watershed/month records)", path: "./data/precipitation-monthly.csv" },
    { name: "precipitation-annual.json", desc: lang === "es" ? "Series anuales agregadas (2001–2024 completos)" : "Aggregated annual series (2001–2024 complete)", path: "./data/precipitation-annual.json" },
    { name: "trends.json", desc: lang === "es" ? "Resultados Theil-Sen y Mann-Kendall por cuenca" : "Theil-Sen and Mann-Kendall results per watershed", path: "./data/trends.json" },
    { name: "contrasts.json", desc: lang === "es" ? "Resultados emparejados HAC / Newey-West y control FDR" : "HAC / Newey-West pairwise results & FDR control", path: "./data/contrasts.json" },
    { name: "evidence.json", desc: lang === "es" ? "Fichas completas de evidencia y sensibilidad" : "Comprehensive evidence and sensitivity sheets", path: "./data/evidence.json" },
    { name: "manifest.json", desc: lang === "es" ? "Manifiesto de procedencia, parámetros y hashes SHA-256" : "Provenance manifest, parameters and SHA-256 hashes", path: "./data/manifest.json" }
  ]

  const coreDownloads = [
    { name: "precipitation-annual.json", label: lang === "es" ? "Series anuales validadas (JSON)" : "Validated annual series (JSON)", path: "./data/precipitation-annual.json" },
    { name: "precipitation-monthly.csv", label: lang === "es" ? "Serie mensual 2001-2025 (CSV)" : "Monthly series 2001-2025 (CSV)", path: "./data/precipitation-monthly.csv" },
    { name: "basins.geojson", label: lang === "es" ? "Geometrías oficiales ANA (GeoJSON)" : "Official ANA geometries (GeoJSON)", path: "./data/basins.geojson" },
    { name: "trends.json", label: lang === "es" ? "Tendencias Theil-Sen (JSON)" : "Theil-Sen trends (JSON)", path: "./data/trends.json" },
    { name: "contrasts.json", label: lang === "es" ? "Contrastes pareados HAC/FDR (JSON)" : "HAC/FDR paired contrasts (JSON)", path: "./data/contrasts.json" },
    { name: "manifest.json", label: lang === "es" ? "Manifiesto de integridad (JSON)" : "Integrity manifest (JSON)", path: "./data/manifest.json" }
  ]

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
          {t("sources_title")}
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5, fontSize: "0.95rem" }}>
          {t("sources_subtitle")}
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          {lang === "es" ? "1. Precipitación satelital: NASA GPM-IMERG" : "1. Satellite Precipitation: NASA GPM-IMERG"}
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Producto:" : "Product:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>GPM IMERG Final Precipitation L3 1 month 0.1 degree × 0.1 degree V07 (GPM_3IMERGM_07)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "DOI oficial:" : "Official DOI:"}</dt>
          <dd>
            <a href="https://doi.org/10.5067/GPM/IMERG/3B-MONTH/07" target="_blank" rel="noreferrer">
              10.5067/GPM/IMERG/3B-MONTH/07
            </a>
          </dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Proveedor:" : "Provider:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>NASA GES DISC / Goddard Earth Sciences Data and Information Services Center</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Licencia:" : "License:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>{lang === "es" ? "Datos abiertos de NASA Earth Science (acceso público y gratuito)" : "NASA Earth Science Open Data (public, open-access)"}</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Versión:" : "Version:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>{manifest ? manifest.dataset_version : "07"} ({lang === "es" ? "Corrida Final calibrada" : "Final calibrated run"})</dd>
        </dl>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          {lang === "es" ? "2. Cartografía de cuencas hidrográficas y lago: ANA Perú" : "2. Watershed & Lake Cartography: ANA Peru"}
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Entidad oficial:" : "Official agency:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Autoridad Nacional del Agua (ANA), Ministerio de Desarrollo Agrario y Riego, Perú</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Conjunto de datos:" : "Dataset:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Unidades Hidrográficas del Perú ({lang === "es" ? "delimitación oficial con metodología Pfafstetter" : "official delineation via Pfafstetter methodology"})</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Catálogo nacional:" : "National catalog:"}</dt>
          <dd>
            <a href="https://catalogo.geoidep.gob.pe/metadatos/srv/api/records/7479fd98-28a4-4a33-8ee8-01b55dfc1108" target="_blank" rel="noreferrer">
              {lang === "es" ? "Metadatos oficiales en GeoIDEP (Código 7479fd98)" : "Official GeoIDEP Metadata (Code 7479fd98)"}
            </a>
          </dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Enlace de descarga oficial:" : "Official download link:"}</dt>
          <dd>
            <a href="https://geosnirh.ana.gob.pe/Repositorio/Shape/UnidadesHidrograficas.zip" target="_blank" rel="noreferrer">
              SNIRH - UnidadesHidrograficas.zip
            </a>
          </dd>
        </dl>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          {lang === "es" ? "3. Fotografía panorámica del lago Titicaca y atribución" : "3. Panoramic Lake Titicaca Photography & Attribution"}
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Obra:" : "Work:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Panorama of Lake Titicaca from Taquile Island, Puno, Peru</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Autor:" : "Author:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Martin St-Amant (Wikimedia Commons)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Licencia:" : "License:"}</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Creative Commons Attribution-ShareAlike (CC-BY-SA 2.5 / 2.0 / 1.0)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{lang === "es" ? "Fuente documental:" : "Documentary source:"}</dt>
          <dd>
            <a href="https://commons.wikimedia.org/wiki/File:Panorama_Lac_Titicaca_-_D%C3%A9cembre_2006.jpg" target="_blank" rel="noreferrer">
              Wikimedia Commons: Panorama Lac Titicaca - Martin St-Amant
            </a>
          </dd>
        </dl>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          {lang === "es" ? "4. Descarga de conjuntos de datos principales" : "4. Primary Research Datasets Download"}
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "var(--spacing-md)" }}>
          {lang === "es"
            ? "Acceso directo a las series de precipitación, geometrías vectoriales oficiales y resultados estadísticos para su replicación:"
            : "Direct access to precipitation series, official vector geometries, and inferential statistics for independent replication:"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--spacing-sm)" }}>
          {coreDownloads.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                backgroundColor: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border-discrete)",
                borderRadius: "var(--border-radius-sm)"
              }}
            >
              <div>
                <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--color-text-main)" }}>{item.label}</strong>
                <span style={{ fontFamily: "var(--font-family-mono)", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{item.name}</span>
              </div>
              <a
                href={item.path}
                download={item.name}
                style={{
                  padding: "5px 12px",
                  borderRadius: "var(--border-radius-sm)",
                  backgroundColor: "rgba(35, 215, 229, 0.12)",
                  border: "1px solid rgba(35, 215, 229, 0.35)",
                  color: "var(--color-primary-cyan)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  textDecoration: "none"
                }}
              >
                {lang === "es" ? "Descargar" : "Download"}
              </a>
            </div>
          ))}
        </div>
      </div>

      <details
        className="card"
        style={{
          marginBottom: "var(--spacing-lg)",
          backgroundColor: "var(--color-surface-card)"
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            fontSize: "1rem",
            color: "var(--color-primary-cyan)",
            fontWeight: 700,
            padding: "4px 0",
            userSelect: "none"
          }}
        >
          {t("sources_inventory_title")}
        </summary>
        <div style={{ paddingTop: "var(--spacing-md)" }}>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "var(--spacing-sm)" }}>
            {lang === "es"
              ? "Catálogo completo de archivos generados por el pipeline de investigación con verificación criptográfica SHA-256:"
              : "Complete inventory of research artifacts with SHA-256 cryptographic verification:"}
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", border: "1px solid var(--color-border-discrete)" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-surface-elevated)", textAlign: "left", color: "var(--color-text-main)" }}>
                  <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>{lang === "es" ? "Archivo" : "File"}</th>
                  <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>{lang === "es" ? "Descripción" : "Description"}</th>
                  <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>Hash SHA-256</th>
                  <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>{lang === "es" ? "Acción" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => {
                  const hash = manifest?.integrity ? manifest.integrity[file.name] : ""
                  return (
                    <tr key={file.name} style={{ borderBottom: "1px solid var(--color-border-discrete)", backgroundColor: "var(--color-surface-card)" }}>
                      <td style={{ padding: "10px 12px", fontFamily: "var(--font-family-mono)", fontWeight: 600, color: "var(--color-primary-cyan)" }}>{file.name}</td>
                      <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)" }}>{file.desc}</td>
                      <td style={{ padding: "10px 12px", fontFamily: "var(--font-family-mono)", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {hash ? `${hash.substring(0, 16)}...` : "-"}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <a
                          href={file.path}
                          download={file.name}
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "var(--border-radius-sm)",
                            backgroundColor: "var(--color-surface-elevated)",
                            border: "1px solid var(--color-border-discrete)",
                            color: "var(--color-primary-cyan)",
                            fontWeight: 600,
                            fontSize: "0.78rem"
                          }}
                        >
                          {lang === "es" ? "Descargar" : "Download"}
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      <div className="card">
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          {lang === "es" ? "5. Licencia y declaración de independencia institucional" : "5. License & Institutional Independence Disclaimer"}
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0, marginBottom: "var(--spacing-xs)" }}>
          {lang === "es"
            ? "El software y pipeline de TITICACA CONTRAST se publica bajo licencia de código abierto MIT."
            : "The software and pipeline of TITICACA CONTRAST is published under the open-source MIT License."}
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5, margin: 0 }}>
          <strong>{lang === "es" ? "Aviso institucional:" : "Institutional Disclaimer:"}</strong> {lang === "es"
            ? "TITICACA CONTRAST es una iniciativa de observatorio climático independiente y de código abierto. No posee filiación oficial ni representa posición formal alguna de la Autoridad Nacional del Agua (ANA) de Perú, del Ministerio de Desarrollo Agrario y Riego, ni de la National Aeronautics and Space Administration (NASA)."
            : "TITICACA CONTRAST is an independent, open-source climate observatory research initiative. It holds no official affiliation with and does not represent the formal view of the National Water Authority (ANA) of Peru, the Ministry of Agrarian Development and Irrigation, or the National Aeronautics and Space Administration (NASA)."}
        </p>
      </div>
    </div>
  )
}
