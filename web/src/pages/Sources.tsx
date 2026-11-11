import React from "react"
import type { HydrologyData } from "../app/dataLoader"

export interface SourcesProps {
  data: HydrologyData
}

export const Sources: React.FC<SourcesProps> = ({ data }) => {
  const manifest = data.manifest

  const files = [
    { name: "basins.geojson", desc: "Geometrías de cuencas simplificadas topológicamente (WGS84 EPSG:4326)", path: "./data/basins.geojson" },
    { name: "lake.geojson", desc: "Geometría oficial de la porción peruana del lago Titicaca (ANA)", path: "./data/lake.geojson" },
    { name: "basins.json", desc: "Metadatos, códigos oficiales ANA y áreas en km²", path: "./data/basins.json" },
    { name: "precipitation-monthly.csv", desc: "Serie mensual 2001-2025 (1,200 registros de cuenca/mes)", path: "./data/precipitation-monthly.csv" },
    { name: "precipitation-annual.json", desc: "Series anuales agregadas (2001–2024 completos)", path: "./data/precipitation-annual.json" },
    { name: "trends.json", desc: "Resultados Theil-Sen y Mann-Kendall por cuenca", path: "./data/trends.json" },
    { name: "contrasts.json", desc: "Resultados emparejados HAC / Newey-West y control FDR", path: "./data/contrasts.json" },
    { name: "evidence.json", desc: "Fichas completas de evidencia y sensibilidad", path: "./data/evidence.json" },
    { name: "manifest.json", desc: "Manifiesto de procedencia, parámetros y hashes SHA-256", path: "./data/manifest.json" }
  ]

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
          Fuentes oficiales, metadatos y descargas
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5, fontSize: "0.95rem" }}>
          Procedencia institucional de los datos, identificadores DOI y hashes criptográficos para verificación de integridad independiente.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          1. Precipitación satelital: NASA GPM-IMERG
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Producto:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>GPM IMERG Final Precipitation L3 1 month 0.1 degree × 0.1 degree V07 (GPM_3IMERGM_07)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>DOI oficial:</dt>
          <dd>
            <a href="https://doi.org/10.5067/GPM/IMERG/3B-MONTH/07" target="_blank" rel="noreferrer">
              10.5067/GPM/IMERG/3B-MONTH/07
            </a>
          </dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Proveedor:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>NASA GES DISC / Goddard Earth Sciences Data and Information Services Center</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Licencia:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Datos abiertos de NASA Earth Science (acceso público y gratuito)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Identificador:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>{manifest ? manifest.dataset_id : "GPM_3IMERGM"}</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Versión procesada:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>{manifest ? manifest.dataset_version : "07"} (Corrida Final calibrada)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Fecha de descarga:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>{manifest?.source_downloaded_at_utc || "Noviembre 2026"}</dd>
        </dl>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          2. Cartografía de cuencas hidrográficas y lago: ANA Perú
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Entidad oficial:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Autoridad Nacional del Agua (ANA), Ministerio de Desarrollo Agrario y Riego, Perú</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Conjunto de datos:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Unidades Hidrográficas del Perú (delimitación oficial con metodología Pfafstetter)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Catálogo nacional:</dt>
          <dd>
            <a href="https://catalogo.geoidep.gob.pe/metadatos/srv/api/records/7479fd98-28a4-4a33-8ee8-01b55dfc1108" target="_blank" rel="noreferrer">
              Metadatos oficiales en GeoIDEP (Código 7479fd98)
            </a>
          </dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Enlace de descarga oficial:</dt>
          <dd>
            <a href="https://geosnirh.ana.gob.pe/Repositorio/Shape/UnidadesHidrograficas.zip" target="_blank" rel="noreferrer">
              Repositorio oficial SNIRH - UnidadesHidrograficas.zip
            </a>
          </dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Hash SHA-256 fuente:</dt>
          <dd style={{ fontFamily: "var(--font-family-mono)", fontSize: "0.8rem", color: "var(--color-primary-cyan)", wordBreak: "break-all" }}>
            {manifest?.boundary_hash_sha256 || "2d5dd3dc4b82f2f0a7e54d99390ab5d39d28787172647cfa911e7e9df623493d"}
          </dd>
        </dl>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          3. Fotografía panorámica del lago Titicaca y atribución
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Obra:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Panorámica del Lago Titicaca desde la Isla Taquile, Puno, Perú</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Autor:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Martin St-Amant (Wikimedia Commons)</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Licencia:</dt>
          <dd style={{ color: "var(--color-text-main)" }}>Creative Commons Atribución-CompartirIgual (CC-BY-SA 2.5 / 2.0 / 1.0) y GNU Free Documentation License</dd>

          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Fuente documental:</dt>
          <dd>
            <a href="https://commons.wikimedia.org/wiki/File:Panorama_Lac_Titicaca_-_D%C3%A9cembre_2006.jpg" target="_blank" rel="noreferrer">
              Wikimedia Commons: File:Panorama Lac Titicaca - Décembre 2006.jpg
            </a>
          </dd>
        </dl>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          4. Descarga de datos abiertos y comprobación de integridad criptográfica
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "var(--spacing-md)" }}>
          Todos los archivos generados por el pipeline reproducible están disponibles en formato abierto para descarga directa y auditoría:
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", border: "1px solid var(--color-border-discrete)" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface-elevated)", textAlign: "left", color: "var(--color-text-main)" }}>
                <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>Archivo</th>
                <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>Descripción</th>
                <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>Hash SHA-256</th>
                <th style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border-discrete)" }}>Acción</th>
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
                          padding: "5px 12px",
                          borderRadius: "var(--border-radius-sm)",
                          backgroundColor: "var(--color-surface-elevated)",
                          border: "1px solid var(--color-border-discrete)",
                          color: "var(--color-primary-cyan)",
                          fontWeight: 600,
                          fontSize: "0.8rem"
                        }}
                      >
                        Descargar
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)", fontWeight: 700 }}>
          5. Licencia y declaración de independencia institucional
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0, marginBottom: "var(--spacing-xs)" }}>
          El software y pipeline de TITICACA CONTRAST se publica bajo licencia de código abierto MIT.
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5, margin: 0 }}>
          <strong>Aviso institucional:</strong> TITICACA CONTRAST es una iniciativa de observatorio climático independiente y de código abierto. No posee filiación oficial ni representa posición formal alguna de la Autoridad Nacional del Agua (ANA) de Perú, del Ministerio de Desarrollo Agrario y Riego, ni de la National Aeronautics and Space Administration (NASA).
        </p>
      </div>
    </div>
  )
}
