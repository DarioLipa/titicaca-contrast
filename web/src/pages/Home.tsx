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
          background: "radial-gradient(ellipse 90% 80% at 75% 15%, #0B253E 0%, #061525 50%, #030C16 100%)",
          color: "#FFFFFF",
          paddingTop: "var(--spacing-2xl)",
          paddingBottom: "var(--spacing-2xl)",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(56, 189, 248, 0.15)"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none"
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <StatusMessage status={data.status} message={data.errorMessage || data.manifest?.notes} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              alignItems: "center",
              gap: "var(--spacing-xl)"
            }}
          >
            <div style={{ maxWidth: "560px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "5px 14px",
                  borderRadius: "9999px",
                  background: "rgba(14, 165, 233, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  color: "#38BDF8",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "var(--spacing-md)"
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#38BDF8",
                    boxShadow: "0 0 8px #38BDF8"
                  }}
                />
                Investigación Ambiental • Puno, Perú
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: "var(--spacing-md)",
                  color: "#FFFFFF"
                }}
              >
                Un mismo lago.
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #38BDF8 0%, #2DD4BF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block"
                  }}
                >
                  Diferentes realidades
                </span>
                <br />
                climáticas.
              </h1>

              <p
                style={{
                  fontSize: "1.08rem",
                  lineHeight: 1.6,
                  color: "#CBD5E1",
                  marginBottom: "var(--spacing-xl)",
                  maxWidth: "520px"
                }}
              >
                Descubre cómo evolucionan las precipitaciones en las cuencas que alimentan el lago Titicaca. Contrasta territorios, observa sus historias y examina la evidencia estadística detrás de cada hallazgo.
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
                    gap: "8px",
                    backgroundColor: "#0284C7",
                    color: "#FFFFFF",
                    padding: "13px 26px",
                    borderRadius: "9999px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    boxShadow: "0 0 20px rgba(2, 132, 199, 0.45)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease"
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
                    backgroundColor: "rgba(10, 30, 50, 0.7)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    padding: "13px 24px",
                    borderRadius: "9999px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    backdropFilter: "blur(8px)"
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
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "var(--spacing-md)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(56, 189, 248, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#38BDF8"
                    }}
                  >
                    🛰️
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.82rem", display: "block", color: "#FFFFFF" }}>
                      Datos satelitales
                    </strong>
                    <span style={{ fontSize: "0.74rem", color: "#94A3B8" }}>
                      NASA IMERG V07
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(45, 212, 191, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2DD4BF"
                    }}
                  >
                    🗺️
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.82rem", display: "block", color: "#FFFFFF" }}>
                      Cartografía oficial
                    </strong>
                    <span style={{ fontSize: "0.74rem", color: "#94A3B8" }}>
                      ANA Perú
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(139, 92, 246, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#A78BFA"
                    }}
                  >
                    📊
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.82rem", display: "block", color: "#FFFFFF" }}>
                      Inferencia HAC / FDR
                    </strong>
                    <span style={{ fontSize: "0.74rem", color: "#94A3B8" }}>
                      Análisis reproducible
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
              <TerritoryHeroVisual onSelectBasin={() => onNavigate("explorer")} />
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to top, rgba(3, 12, 22, 0.95), transparent)",
            pointerEvents: "none"
          }}
        >
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", opacity: 0.35 }}
          >
            <path
              d="M0 90 L0 50 L120 20 L240 60 L380 15 L520 45 L680 10 L820 40 L960 18 L1120 50 L1260 22 L1440 45 L1440 90 Z"
              fill="#0E2D4A"
            />
            <path
              d="M0 90 L0 65 L180 35 L320 65 L480 25 L640 55 L800 20 L940 50 L1100 30 L1280 60 L1440 40 L1440 90 Z"
              fill="#061A2D"
            />
          </svg>
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
