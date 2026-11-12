import React from "react"
import { useLanguage } from "../app/i18n"

export const Methodology: React.FC = () => {
  const { lang, t } = useLanguage()

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--color-text-main)", marginBottom: "var(--spacing-xs)", fontWeight: 700 }}>
          {t("methodology_title")}
        </h2>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5, fontSize: "0.95rem" }}>
          {t("methodology_subtitle")}
        </p>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            {lang === "es" ? "Paso 1: Delimitación cartográfica oficial" : "Step 1: Official Cartographic Delineation"}
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            ANA SNIRH · Pfafstetter
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          {lang === "es"
            ? "Las 4 cuencas tributarias principales (Ramis, Coata, Ilave y Huancané) se extraen de la delimitación oficial de Unidades Hidrográficas del Perú (ANA SNIRH). Las geometrías vectoriales se simplifican topológicamente conservando continuidad espacial en EPSG:4326."
            : "The 4 primary tributary watersheds (Ramis, Coata, Ilave, and Huancané) are extracted from Peru's official Hydrographic Units delineation (ANA SNIRH). Vector geometries are topologically simplified while strictly preserving spatial continuity in EPSG:4326."}
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            {lang === "es" ? "Detalles técnicos, tolerancias y verificación cartográfica" : "Technical details, tolerances & cartographic verification"}
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <p style={{ margin: "0 0 6px 0" }}>
              {lang === "es"
                ? "Simplificación topológica mediante Visvalingam–Whyatt con umbral controlado de 0.001° conservando la divisoria de aguas hidrográfico-oficial y frontera binacional del lago Titicaca."
                : "Topological simplification via Visvalingam–Whyatt with a controlled 0.001° threshold preserving the official hydrographic water divide and binational Lake Titicaca border."}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-family-mono)", fontSize: "0.8rem", color: "var(--color-text-main)" }}>
              {lang === "es"
                ? "Códigos ANA: Ramis (0179+018+019, 15.870,42 km²), Coata (0176, 4.882,42 km²), Ilave (016, 7.791,00 km²), Huancané (0178, 3.611,92 km²)."
                : "ANA Codes: Ramis (0179+018+019, 15,870.42 km²), Coata (0176, 4,882.42 km²), Ilave (016, 7,791.00 km²), Huancané (0178, 3,611.92 km²)."}
            </p>
          </div>
        </details>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            {lang === "es" ? "Paso 2: Extracción y calibración satelital" : "Step 2: Satellite Extraction and Calibration"}
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            NASA GPM IMERG V07 Final
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          {lang === "es"
            ? "Series mensuales de precipitación satelital calibrada con pluviómetros de superficie (GPM_3IMERGM_07) a resolución espacial de 0.1° × 0.1°. La lámina mensual se computa integrando la tasa media horaria y ponderando exactamente el área de intersección sobre cada cuenca."
            : "Monthly satellite precipitation series calibrated with surface rain gauges (GPM_3IMERGM_07) at 0.1° × 0.1° spatial resolution. Monthly depth is computed by integrating the mean hourly rate and exactly weighting intersection areas over each watershed."}
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            {lang === "es" ? "Formulación matemática, umbrales y máscara espacial" : "Mathematical formulation, thresholds & spatial mask"}
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <pre
              style={{
                backgroundColor: "rgba(6, 24, 39, 0.6)",
                border: "1px solid var(--color-border-discrete)",
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                fontFamily: "var(--font-family-mono)",
                fontSize: "0.82rem",
                color: "var(--color-primary-cyan)",
                overflowX: "auto",
                margin: "4px 0 8px 0"
              }}
            >
              {lang === "es"
                ? "Precipitación mensual (mm) = Tasa media (mm/h) × 24 × Días del mes\nP_cuenca = Σ(P_pixel × Área_intersección) / Σ(Área_intersección)"
                : "Monthly precipitation (mm) = Mean rate (mm/h) × 24 × Month days\nP_basin = Σ(P_pixel × Intersection_Area) / Σ(Intersection_Area)"}
            </pre>
            <p style={{ margin: 0 }}>
              {lang === "es"
                ? "Criterio de representatividad: umbral mínimo de cobertura válida ≥ 95% para considerar un mes admitido. Los meses incompletos o faltantes nunca se imputan como precipitación cero."
                : "Representativeness criterion: minimum valid coverage threshold ≥ 95% to admit a month. Incomplete or missing months are never imputed as zero precipitation."}
            </p>
          </div>
        </details>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            {lang === "es" ? "Paso 3: Estimación univariada de tendencias" : "Step 3: Univariate Trend Estimation"}
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            Theil-Sen · Mann-Kendall
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          {lang === "es"
            ? "Determinación de la tasa de cambio interanual mediante el estimador no paramétrico de Theil-Sen y evaluación de monotonicidad con la prueba de Mann-Kendall con ajuste por empates sobre el período validado 2001–2024 (24 años completos)."
            : "Determination of interannual rate of change using the non-parametric Theil-Sen estimator and monotonicity evaluation with the Mann-Kendall test adjusted for ties across the validated 2001–2024 period (24 complete years)."}
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            {lang === "es" ? "Ecuaciones del estimador y consideraciones de robustez" : "Estimator equations & robustness considerations"}
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <pre
              style={{
                backgroundColor: "rgba(6, 24, 39, 0.6)",
                border: "1px solid var(--color-border-discrete)",
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                fontFamily: "var(--font-family-mono)",
                fontSize: "0.82rem",
                color: "var(--color-primary-cyan)",
                overflowX: "auto",
                margin: "4px 0 8px 0"
              }}
            >
              {lang === "es"
                ? "Pendiente Theil-Sen = mediana [ (P_j - P_i) / (t_j - t_i) ] para todo i < j"
                : "Theil-Sen Slope = median [ (P_j - P_i) / (t_j - t_i) ] for all i < j"}
            </pre>
            <p style={{ margin: 0 }}>
              {lang === "es"
                ? "Este estimador no paramétrico es insensible a valores extremos y no asume normalidad en los residuos. El estadístico S de Mann-Kendall se computa con corrección exacta de varianza ante empates pluviométricos."
                : "This non-parametric estimator is robust against outliers and requires no residual normality assumptions. The Mann-Kendall S statistic is computed with exact variance correction for precipitation ties."}
            </p>
          </div>
        </details>
      </div>

      <div className="card" style={{ marginBottom: "var(--spacing-lg)", lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            {lang === "es" ? "Paso 4: Contraste intercuenca con covarianza robusta HAC" : "Step 4: Inter-basin Contrast with Robust HAC Covariance"}
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            Newey-West (L=2) · Brecha D(t)
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          {lang === "es"
            ? "Evaluación de la brecha temporal D(t) = P_A(t) - P_B(t) entre las 6 parejas de cuencas posibles. Los errores estándar de la regresión lineal se corrigen ante heterocedasticidad y correlación serial mediante el estimador de Newey–West (HAC) con rezago base L = 2."
            : "Evaluation of the temporal gap D(t) = P_A(t) - P_B(t) across all 6 pairwise basin combinations. Linear regression standard errors are corrected for heteroskedasticity and serial autocorrelation using the Newey–West (HAC) estimator with baseline lag L = 2."}
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            {lang === "es" ? "Modelo econométrico, rezagos y análisis de sensibilidad" : "Econometric model, lags & sensitivity analysis"}
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <pre
              style={{
                backgroundColor: "rgba(6, 24, 39, 0.6)",
                border: "1px solid var(--color-border-discrete)",
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                fontFamily: "var(--font-family-mono)",
                fontSize: "0.82rem",
                color: "var(--color-primary-cyan)",
                overflowX: "auto",
                margin: "4px 0 8px 0"
              }}
            >
              {lang === "es"
                ? "D(t) = α + β·t + ε(t)\nH0: β = 0 (tendencias paralelas intercuenca)"
                : "D(t) = α + β·t + ε(t)\nH0: β = 0 (parallel inter-basin trends)"}
            </pre>
            <p style={{ margin: 0 }}>
              {lang === "es"
                ? "Dada la inercia climática andina y las oscilaciones tipo ENSO, se emplea el kernel triangular de Bartlett con L = 2. Cada contraste incluye análisis de sensibilidad ante L = 1 y L = 3 para verificar la invariancia de conclusiones."
                : "Given Andean climate inertia and ENSO-type oscillations, Bartlett's triangular kernel with L = 2 is employed. Each contrast includes sensitivity checks at L = 1 and L = 3 to verify conclusion invariance."}
            </p>
          </div>
        </details>
      </div>

      <div className="card" style={{ lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xs)", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary-cyan)", margin: 0, fontWeight: 700 }}>
            {lang === "es" ? "Paso 5: Control de descubrimientos falsos (FDR) y limitaciones" : "Step 5: False Discovery Rate (FDR) Control & Limitations"}
          </h3>
          <span className="badge" style={{ backgroundColor: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-discrete)" }}>
            Benjamini-Hochberg (q ≤ 0.05)
          </span>
        </div>
        <p style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
          {lang === "es"
            ? "Control riguroso de tasa de falso descubrimiento (FDR q ≤ 0.05) para compensar la multiplicidad de contrastes (m = 6). Los contrastes emparejados permiten corroborar la sincronía hidrológica regional o detectar eventuales desacoples pluviométricos locales."
            : "Rigorous False Discovery Rate control (FDR q ≤ 0.05) to compensate for hypothesis multiplicity (m = 6). Paired contrasts allow corroborating regional hydrological synchrony or detecting potential local rainfall decouplings."}
        </p>
        <details
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-discrete)",
            borderRadius: "var(--border-radius-sm)",
            padding: "var(--spacing-xs) var(--spacing-sm)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.84rem",
              color: "var(--color-primary-cyan)",
              fontWeight: 600,
              padding: "4px 0",
              userSelect: "none"
            }}
          >
            {lang === "es" ? "Algoritmo FDR, matriz de decisión y límites de causalidad" : "FDR algorithm, decision matrix & causality limits"}
          </summary>
          <div style={{ paddingTop: "var(--spacing-xs)", fontSize: "0.85rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border-discrete)", marginTop: "6px" }}>
            <ul style={{ margin: "0 0 8px 0", paddingLeft: "var(--spacing-md)" }}>
              <li style={{ marginBottom: "4px" }}>
                <strong>{lang === "es" ? "Divergencia confirmada (supported):" : "Confirmed divergence (supported):"}</strong> {lang === "es" ? "p < 0.05 y q (FDR) ≤ 0.05 con signo robusto ante L=1, 2, 3." : "p < 0.05 and q (FDR) ≤ 0.05 with sign invariant across L=1, 2, 3."}
              </li>
              <li style={{ marginBottom: "4px" }}>
                <strong>{lang === "es" ? "Variabilidad local moderada (inconclusive):" : "Moderate local variability (inconclusive):"}</strong> {lang === "es" ? "p univariada < 0.05 pero q > 0.05 (fluctuación microclimática absorbida bajo control FDR)." : "univariate p < 0.05 but q > 0.05 (microclimatic fluctuation absorbed under FDR control)."}
              </li>
              <li style={{ marginBottom: "4px" }}>
                <strong>{lang === "es" ? "Evolución sincrónica regional (no_change):" : "Regional synchronous evolution (no_change):"}</strong> {lang === "es" ? "q > 0.05 y el intervalo de confianza al 95% contiene al cero, confirmando régimen climático compartido." : "q > 0.05 and 95% confidence interval contains zero, confirming shared regional climate regime."}
              </li>
            </ul>
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
              <strong>{lang === "es" ? "Principio de no causalidad:" : "Non-causality principle:"}</strong> {lang === "es" ? "Este observatorio cuantifica tendencias pluviométricas en superficie. No debe inferirse causalidad directa y exclusiva sobre el nivel del lago Titicaca, el cual responde a evaporación neta, balances térmicos y demandas hídricas." : "This observatory quantifies surface precipitation trends. Direct and exclusive causality must not be inferred regarding Lake Titicaca water levels, which depend on net evaporation, thermal energy budgets, and hydrological basin demands."}
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
