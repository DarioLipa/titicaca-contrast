import React from "react"
import type { DataPayload } from "../app/dataLoader"

export interface SourcesProps {
  data: DataPayload
}

export const Sources: React.FC<SourcesProps> = ({ data }) => {
  const manifest = data.manifest

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-md)" }}>
        Fuentes oficiales y metadatos de procedencia
      </h2>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          1. Precipitación satelital: NASA GPM-IMERG
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600 }}>Producto:</dt>
          <dd>GPM IMERG Final Precipitation L3 1 month 0.1 degree x 0.1 degree V07 (GPM_3IMERGM_07)</dd>

          <dt style={{ fontWeight: 600 }}>DOI oficial:</dt>
          <dd>
            <a href="https://doi.org/10.5067/GPM/IMERG/3B-MONTH/07" target="_blank" rel="noreferrer">
              10.5067/GPM/IMERG/3B-MONTH/07
            </a>
          </dd>

          <dt style={{ fontWeight: 600 }}>Proveedor:</dt>
          <dd>NASA GES DISC / Goddard Earth Sciences Data and Information Services Center</dd>

          <dt style={{ fontWeight: 600 }}>Licencia:</dt>
          <dd>Datos abiertos de NASA Earth Science (acceso público y gratuito)</dd>

          <dt style={{ fontWeight: 600 }}>Identificador en catálogo:</dt>
          <dd>{manifest ? manifest.dataset_id : "GPM_3IMERGM"}</dd>

          <dt style={{ fontWeight: 600 }}>Versión procesada:</dt>
          <dd>{manifest ? manifest.dataset_version : "07"}</dd>
        </dl>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          2. Delimitación de Cuencas Hidrográficas: ANA
        </h3>
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
          <dt style={{ fontWeight: 600 }}>Entidad oficial:</dt>
          <dd>Autoridad Nacional del Agua (ANA), Ministerio de Desarrollo Agrario y Riego, Perú</dd>

          <dt style={{ fontWeight: 600 }}>Conjunto de datos:</dt>
          <dd>Unidades Hidrográficas del Perú (método Pfafstetter)</dd>

          <dt style={{ fontWeight: 600 }}>Catálogo nacional:</dt>
          <dd>
            <a href="https://catalogo.geoidep.gob.pe/metadatos/srv/api/records/7479fd98-28a4-4a33-8ee8-01b55dfc1108" target="_blank" rel="noreferrer">
              Metadatos oficiales en GeoIDEP
            </a>
          </dd>

          <dt style={{ fontWeight: 600 }}>Enlace de descarga:</dt>
          <dd>
            <a href="https://geosnirh.ana.gob.pe/Repositorio/Shape/UnidadesHidrograficas.zip" target="_blank" rel="noreferrer">
              Repositorio oficial SNIRH - UnidadesHidrograficas.zip
            </a>
          </dd>
        </dl>
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
          3. Código fuente y software
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
          El código de TITICACA CONTRAST se publica bajo licencia de código abierto MIT. No se emplean componentes propietarios, APIs de pago ni servicios con suscripción comercial obligatoria.
        </p>
      </div>
    </div>
  )
}
