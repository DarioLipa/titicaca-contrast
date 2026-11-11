import React from "react"
import type { HydrologyData } from "../app/dataLoader"
import { StatusMessage } from "../components/StatusMessage"
import { TerritoryHeroVisual } from "../components/TerritoryHeroVisual"

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
          backgroundColor: "#061827",
          backgroundImage: `
            radial-gradient(ellipse 65% 45% at 88% 10%, rgba(35, 215, 229, 0.18) 0%, rgba(14, 116, 144, 0.08) 45%, transparent 80%),
            radial-gradient(circle at 18% 45%, rgba(6, 24, 39, 0.96) 0%, rgba(6, 24, 39, 0.8) 50%, transparent 80%),
            linear-gradient(180deg, #061827 0%, rgba(6, 24, 39, 0.82) 40%, rgba(11, 43, 64, 0.65) 75%, rgba(6, 24, 39, 0.96) 100%),
            url(/images/titicaca-panorama.jpg)
          `,
          backgroundPosition: "center top, left center, center center, center bottom",
          backgroundSize: "auto, auto, auto, cover",
          backgroundRepeat: "no-repeat",
          color: "#F7FAFC",
          paddingTop: "var(--spacing-xl)",
          paddingBottom: "var(--spacing-2xl)",
          overflow: "hidden",
          borderBottom: "1px solid rgba(35, 215, 229, 0.2)"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(35, 215, 229, 0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none"
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10, maxWidth: "1280px" }}>
          <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

          <div className="hero-grid">
            <div style={{ maxWidth: "560px", zIndex: 15 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  background: "rgba(11, 43, 64, 0.85)",
                  border: "1px solid rgba(35, 215, 229, 0.35)",
                  color: "#23D7E5",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "var(--spacing-md)",
                  backdropFilter: "blur(12px)"
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "#23D7E5",
                    boxShadow: "0 0 10px #23D7E5"
                  }}
                />
                Investigación Ambiental · Puno, Perú
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: "-0.025em",
                  marginBottom: "var(--spacing-md)",
                  color: "#F7FAFC"
                }}
              >
                Un mismo lago.
                <br />
                <span style={{ color: "#23D7E5" }}>
                  Diferentes realidades
                </span>
                <br />
                climáticas.
              </h1>

              <p
                style={{
                  fontSize: "1.08rem",
                  lineHeight: 1.65,
                  color: "var(--color-text-hero-secondary, #BCD0DC)",
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
                  marginBottom: "var(--spacing-2xl)"
                }}
              >
                <button
                  type="button"
                  onClick={() => onNavigate("explorer")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "#0E7490",
                    border: "1px solid #23D7E5",
                    color: "#F7FAFC",
                    padding: "14px 28px",
                    borderRadius: "9999px",
                    fontSize: "0.96rem",
                    fontWeight: 700,
                    boxShadow: "0 0 24px rgba(35, 215, 229, 0.45)",
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
                    backgroundColor: "rgba(11, 43, 64, 0.75)",
                    color: "#F7FAFC",
                    border: "1px solid rgba(35, 215, 229, 0.35)",
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
                  borderTop: "1px solid rgba(35, 215, 229, 0.2)",
                  paddingTop: "var(--spacing-lg)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(35, 215, 229, 0.12)",
                      border: "1px solid rgba(35, 215, 229, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#23D7E5"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.84rem", display: "block", color: "#F7FAFC" }}>
                      Datos satelitales
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "#BCD0DC" }}>
                      NASA IMERG
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(112, 220, 216, 0.12)",
                      border: "1px solid rgba(112, 220, 216, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#70DCD8"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.84rem", display: "block", color: "#F7FAFC" }}>
                      Cartografía oficial
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "#BCD0DC" }}>
                      ANA
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(32, 216, 161, 0.12)",
                      border: "1px solid rgba(32, 216, 161, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#20D8A1"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.84rem", display: "block", color: "#F7FAFC" }}>
                      Análisis reproducible
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "#BCD0DC" }}>
                      y transparente
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: "100%", position: "relative", minHeight: "540px" }}>
              <TerritoryHeroVisual onSelectBasin={() => onNavigate("explorer")} />
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: "var(--spacing-2xl)", paddingBottom: "var(--spacing-2xl)" }}>
        {isReady && (
          <section
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--border-radius-md)",
              padding: "var(--spacing-lg)",
              marginBottom: "var(--spacing-2xl)",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
              <h2 style={{ fontSize: "1.25rem", color: "var(--color-primary-navy)", margin: 0, fontWeight: 700 }}>
                Resumen de evidencia científica confirmatoria (2001–2024)
              </h2>
              <span className="badge badge-success">24 años completos analizados</span>
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
                  backgroundColor: "var(--color-surface-muted)",
                  borderRadius: "var(--border-radius-sm)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  Meses NASA IMERG Final:
                </span>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-primary-navy)" }}>297 meses</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  2001-01 a 2025-09
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-muted)",
                  borderRadius: "var(--border-radius-sm)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  Años completos:
                </span>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-primary-navy)" }}>24 años</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  2001 a 2024 (12 meses c/u)
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-muted)",
                  borderRadius: "var(--border-radius-sm)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  Tendencias Theil-Sen:
                </span>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-alert)" }}>
                  4 / 4 decrecientes
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  p &lt; 0.05 en todas
                </span>
              </div>

              <div
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  backgroundColor: "var(--color-surface-muted)",
                  borderRadius: "var(--border-radius-sm)"
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  Contrastes emparejados (FDR):
                </span>
                <strong style={{ fontSize: "1.35rem", color: "var(--color-primary-navy)" }}>
                  5 estables / 1 inconcluso
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                  Brechas temporales constantes
                </span>
              </div>
            </div>

            <p style={{ fontSize: "0.92rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
              <strong>Hallazgo central:</strong> Aunque las 4 cuencas experimentaron caídas anuales en su precipitación acumulada entre 2001 y 2024, la diferencia relativa entre ellas no mostró divergencia confirmada tras el control estricto de descubrimientos falsos.
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
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
              1. Cuatro cuencas oficiales
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
              Delimitaciones hidrográficas oficiales de la Autoridad Nacional del Agua (ANA), con validación topológica continua y cálculo de superficie geodésica.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
              2. Datos NASA IMERG V07 Final
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
              Producto satelital multifuente calibrado mensual (GPM_3IMERGM_07), ponderado rigurosamente por área de intersección en cada celda de 0.1° (~10 km).
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
              3. Detector de contrastes HAC / FDR
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
              Análisis emparejado de brechas temporales con errores estándar robustos a heterocedasticidad y autocorrelación temporal (Newey–West) y control FDR (Benjamini–Hochberg).
            </p>
          </div>
        </section>

        <section className="card" style={{ backgroundColor: "#FFFFFF" }}>
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary-navy)", marginBottom: "var(--spacing-sm)" }}>
            Ficha de transparencia del observatorio
          </h3>
          <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--spacing-xs)", columnGap: "var(--spacing-md)", fontSize: "0.9rem" }}>
            <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Estado del repositorio:</dt>
            <dd>{data.status === "ready" ? "Colección verificada y lista para consulta pública" : "Pendiente de procesamiento"}</dd>

            <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Período cubierto:</dt>
            <dd>2001-01 a 2024-12 (24 años completos confirmatorios; 2025 parcial excluido de tendencias anuales)</dd>

            <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Resolución nativa:</dt>
            <dd>NASA IMERG L3 Final 0.1° × 0.1° (~10 km)</dd>

            <dt style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>Política de datos:</dt>
            <dd>Cero datos simulados presentados como resultados reales. Ausencia de diferencias es un resultado científico válido.</dd>
          </dl>
        </section>
      </div>
    </div>
  )
}
