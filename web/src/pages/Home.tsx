import React from "react"
import type { HydrologyData } from "../app/dataLoader"
import { StatusMessage } from "../components/StatusMessage"
import { TerritoryHeroVisual } from "../components/TerritoryHeroVisual"
import { HeroTelemetryPanels } from "../components/HeroTelemetryPanels"

export interface HomeProps {
  data: HydrologyData
  onNavigate: (tab: string) => void
}

export const Home: React.FC<HomeProps> = ({ data, onNavigate }) => {
  const isReady = data.status === "ready"

  return (
    <div>
      <section
        style={{
          position: "relative",
          backgroundColor: "var(--color-bg-main, #061827)",
          backgroundImage: `
            radial-gradient(ellipse 65% 45% at 88% 10%, rgba(32, 215, 223, 0.16) 0%, rgba(11, 43, 64, 0.08) 45%, transparent 80%),
            radial-gradient(circle at 18% 45%, rgba(6, 24, 39, 0.96) 0%, rgba(6, 24, 39, 0.82) 50%, transparent 80%),
            linear-gradient(180deg, #061827 0%, rgba(6, 24, 39, 0.85) 40%, rgba(11, 43, 64, 0.7) 75%, rgba(6, 24, 39, 0.98) 100%),
            url(/images/titicaca-panorama.jpg)
          `,
          backgroundPosition: "center top, left center, center center, center bottom",
          backgroundSize: "auto, auto, auto, cover",
          backgroundRepeat: "no-repeat",
          color: "var(--color-text-main, #F7FAFC)",
          paddingTop: "var(--spacing-2xl)",
          paddingBottom: "var(--spacing-2xl)",
          overflow: "hidden",
          borderBottom: "1px solid var(--color-border-discrete)"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(32, 215, 223, 0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none"
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

          <div className="hero-grid">
            <div style={{ maxWidth: "580px", zIndex: 15 }}>
              <h1
                style={{
                  fontSize: "clamp(2.3rem, 4.6vw, 3.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: "-0.025em",
                  marginBottom: "var(--spacing-md)",
                  color: "#F7FAFC"
                }}
              >
                Un mismo lago.
                <br />
                <span style={{ color: "var(--color-primary-cyan, #20D7DF)" }}>
                  Diferentes realidades
                </span>
                <br />
                climáticas.
              </h1>

              <p
                style={{
                  fontSize: "1.06rem",
                  lineHeight: 1.65,
                  color: "var(--color-text-secondary, #BED1DD)",
                  marginBottom: "var(--spacing-xl)",
                  maxWidth: "520px"
                }}
              >
                Descubre cómo evolucionan las precipitaciones en las cuencas que alimentan el lago Titicaca. Contrasta territorios, observa sus historias y examina la evidencia detrás de cada hallazgo.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-md)",
                  flexWrap: "wrap",
                  marginBottom: "var(--spacing-xl)"
                }}
              >
                <button
                  type="button"
                  onClick={() => onNavigate("explorer")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "var(--color-primary-cyan, #20D7DF)",
                    border: "none",
                    color: "#061827",
                    padding: "14px 28px",
                    borderRadius: "9999px",
                    fontSize: "0.96rem",
                    fontWeight: 700,
                    boxShadow: "0 0 20px rgba(32, 215, 223, 0.4)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    cursor: "pointer"
                  }}
                >
                  Explorar las cuencas →
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("compare")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "rgba(16, 46, 67, 0.75)",
                    color: "#F7FAFC",
                    border: "1px solid var(--color-border-discrete)",
                    padding: "14px 26px",
                    borderRadius: "9999px",
                    fontSize: "0.96rem",
                    fontWeight: 600,
                    backdropFilter: "blur(12px)",
                    transition: "background 0.15s ease",
                    cursor: "pointer"
                  }}
                >
                  Comparar territorios
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-lg)",
                  flexWrap: "wrap",
                  borderTop: "1px solid var(--color-border-discrete)",
                  paddingTop: "var(--spacing-md)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      background: "rgba(32, 215, 223, 0.12)",
                      border: "1px solid rgba(32, 215, 223, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-primary-cyan)"
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.82rem", display: "block", color: "#F7FAFC" }}>
                      Datos satelitales
                    </strong>
                    <span style={{ fontSize: "0.74rem", color: "var(--color-text-secondary)" }}>
                      NASA IMERG
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      background: "rgba(105, 218, 214, 0.12)",
                      border: "1px solid rgba(105, 218, 214, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-secondary-turquoise)"
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.82rem", display: "block", color: "#F7FAFC" }}>
                      Cartografía oficial
                    </strong>
                    <span style={{ fontSize: "0.74rem", color: "var(--color-text-secondary)" }}>
                      ANA Perú
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      background: "rgba(32, 214, 160, 0.12)",
                      border: "1px solid rgba(32, 214, 160, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-status-positive)"
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.82rem", display: "block", color: "#F7FAFC" }}>
                      Inferencia estadística
                    </strong>
                    <span style={{ fontSize: "0.74rem", color: "var(--color-text-secondary)" }}>
                      HAC / FDR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-right-zone">
              <TerritoryHeroVisual onSelectBasin={() => onNavigate("explorer")} />
              <HeroTelemetryPanels />
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: "var(--spacing-2xl)", paddingBottom: "var(--spacing-2xl)" }}>
        {isReady && (
          <section
            className="card"
            style={{
              marginBottom: "var(--spacing-2xl)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
              <h2 style={{ fontSize: "1.25rem", color: "var(--color-text-main)", margin: 0, fontWeight: 700 }}>
                Resumen de evidencia científica confirmatoria
              </h2>
              <span className="badge badge-success">24 años analizados</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "var(--spacing-md)",
                marginBottom: "var(--spacing-md)"
              }}
            >
              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border-discrete)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  Meses satelitales procesados:
                </span>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-text-main)" }}>297 meses</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  2001-01 a 2025-09
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border-discrete)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  Años completos:
                </span>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-text-main)" }}>24 años</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  2001 a 2024 (12 meses c/u)
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border-discrete)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  Tendencias Theil-Sen:
                </span>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-status-warning)" }}>
                  4 / 4 decrecientes
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  p &lt; 0.05
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid var(--color-border-discrete)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
                  Contrastes emparejados (FDR):
                </span>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-primary-cyan)" }}>
                  5 estables / 1 inconcluso
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  Brechas temporales constantes
                </span>
              </div>
            </div>

            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: "var(--color-text-main)" }}>Hallazgo central:</strong> Aunque las 4 cuencas experimentaron caídas anuales en su precipitación acumulada entre 2001 y 2024, la diferencia relativa entre ellas no mostró divergencia confirmada tras el control estricto de descubrimientos falsos.
            </p>
          </section>
        )}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--spacing-lg)",
            marginBottom: "var(--spacing-2xl)"
          }}
        >
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)" }}>
              1. Cuatro cuencas oficiales
            </h3>
            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              Delimitaciones hidrográficas oficiales de la Autoridad Nacional del Agua (ANA), con validación topológica continua y cálculo de superficie geodésica.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)" }}>
              2. Estimaciones satelitales
            </h3>
            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              Producto satelital multifuente calibrado mensual NASA GPM IMERG Final (0.1° × 0.1°), ponderado por área de intersección en cada divisoria de aguas.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-cyan)", marginBottom: "var(--spacing-sm)" }}>
              3. Inferencia estadística HAC / FDR
            </h3>
            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              Análisis emparejado de brechas temporales con errores estándar robustos a heterocedasticidad y autocorrelación (Newey–West) y control FDR (Benjamini–Hochberg).
            </p>
          </div>
        </section>

        <section className="card">
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-sm)" }}>
            Ficha de transparencia del observatorio
          </h3>
          <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
            <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Estado de la colección:</dt>
            <dd style={{ color: "var(--color-text-main)" }}>{data.status === "ready" ? "Colección verificada y lista para consulta pública" : "Pendiente de procesamiento"}</dd>

            <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Período cubierto:</dt>
            <dd style={{ color: "var(--color-text-main)" }}>2001-01 a 2024-12 (24 años completos confirmatorios)</dd>

            <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Resolución nativa:</dt>
            <dd style={{ color: "var(--color-text-main)" }}>NASA IMERG L3 Final 0.1° × 0.1° (~10 km)</dd>

            <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Política de datos:</dt>
            <dd style={{ color: "var(--color-text-main)" }}>Cero datos simulados presentados como resultados reales. Ausencia de diferencias es un resultado científico válido.</dd>
          </dl>
        </section>
      </div>
    </div>
  )
}
