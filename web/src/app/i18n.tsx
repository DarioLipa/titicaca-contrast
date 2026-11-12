import React, { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "es"

export interface TranslationDictionary {
  nav_home: string
  nav_explorer: string
  nav_compare: string
  nav_findings: string
  nav_methodology: string
  nav_sources: string
  nav_status_ready: string
  nav_status_partial: string
  nav_status_loading: string
  nav_status_unavailable: string
  hero_tagline: string
  hero_title_prefix: string
  hero_title_highlight: string
  hero_desc: string
  hero_btn_explore: string
  hero_btn_compare: string
  hero_badge_satellite: string
  hero_badge_cartography: string
  hero_badge_stats: string
  hero_telemetry_monitoring: string
  hero_telemetry_calibrated: string
  hero_telemetry_trend: string
  hero_telemetry_theilsen: string
  hero_telemetry_decreasing: string
  hero_telemetry_contrasts: string
  hero_telemetry_synchronous: string
  home_findings_title: string
  home_period_badge: string
  home_card_basins_label: string
  home_card_basins_val: string
  home_card_basins_sub: string
  home_card_period_label: string
  home_card_period_val: string
  home_card_period_sub: string
  home_card_trends_label: string
  home_card_trends_val: string
  home_card_trends_sub: string
  home_card_consistency_label: string
  home_card_consistency_val: string
  home_card_consistency_sub: string
  home_conclusion_label: string
  home_conclusion_text: string
  map_title: string
  map_btn_hide_osm: string
  map_btn_show_osm: string
  map_btn_reset: string
  explorer_title: string
  explorer_subtitle: string
  explorer_card_code: string
  explorer_card_area: string
  explorer_card_trend: string
  explorer_card_significance: string
  explorer_card_interpretation: string
  explorer_tab_annual: string
  explorer_tab_monthly: string
  compare_title: string
  compare_subtitle: string
  compare_first_basin: string
  compare_second_basin: string
  compare_alert_same: string
  compare_btn_gap: string
  compare_btn_annual: string
  compare_btn_monthly: string
  contrast_badge_supported: string
  contrast_badge_inconclusive: string
  contrast_badge_synchronous: string
  contrast_status_supported: string
  contrast_status_inconclusive: string
  contrast_status_synchronous: string
  contrast_period_prefix: string
  contrast_period_paired: string
  contrast_delta_trend: string
  contrast_details_summary: string
  contrast_btn_evidence: string
  findings_title: string
  findings_subtitle: string
  findings_filter_all: string
  findings_filter_inconclusive: string
  findings_filter_synchronous: string
  findings_synthesis_title: string
  findings_synth_trends_label: string
  findings_synth_trends_text: string
  findings_synth_sync_label: string
  findings_synth_sync_text: string
  findings_synth_pair_label: string
  findings_synth_pair_text: string
  findings_synth_causality_label: string
  findings_synth_causality_text: string
  evidence_title: string
  evidence_subtitle: string
  evidence_sec1_title: string
  evidence_sec1_years: string
  evidence_sec1_mean_gap: string
  evidence_sec1_slope: string
  evidence_sec1_inference: string
  evidence_sec1_autocorr: string
  evidence_sec1_dataset: string
  evidence_sec2_title: string
  evidence_sec2_th_lag: string
  evidence_sec2_th_role: string
  evidence_sec2_th_slope: string
  evidence_sec2_th_ci95: string
  evidence_sec2_th_pvalue: string
  evidence_sec2_primary: string
  evidence_sec2_sensitivity: string
  evidence_sec3_title: string
  evidence_sec3_notice_label: string
  evidence_sec3_notice_text: string
  evidence_btn_download_csv: string
  evidence_btn_close: string
  methodology_title: string
  methodology_subtitle: string
  sources_title: string
  sources_subtitle: string
  sources_download_section: string
  sources_inventory_title: string
  sources_inventory_summary: string
  footer_rights: string
  footer_affiliation: string
  footer_link_methodology: string
  footer_link_sources: string
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav_home: "Home",
    nav_explorer: "Explorer",
    nav_compare: "Compare",
    nav_findings: "Key Findings",
    nav_methodology: "Methodology",
    nav_sources: "Sources",
    nav_status_ready: "Data verified",
    nav_status_partial: "Partial data",
    nav_status_loading: "Loading catalog...",
    nav_status_unavailable: "Data pending",
    hero_tagline: "ENVIRONMENTAL RESEARCH · PUNO, PERU",
    hero_title_prefix: "One lake.",
    hero_title_highlight: "Different climate realities.",
    hero_desc: "Discover how rainfall patterns evolve across the tributary watersheds that feed Lake Titicaca. Compare territories, track historical precipitation, and examine empirical evidence behind each finding.",
    hero_btn_explore: "Explore watersheds →",
    hero_btn_compare: "Compare territories",
    hero_badge_satellite: "Satellite data",
    hero_badge_cartography: "Official cartography",
    hero_badge_stats: "Statistical inference",
    hero_telemetry_monitoring: "Satellite monitoring",
    hero_telemetry_calibrated: "Monthly calibrated",
    hero_telemetry_trend: "Precipitation trend",
    hero_telemetry_theilsen: "Annual Theil-Sen",
    hero_telemetry_decreasing: "4 / 4 decreasing",
    hero_telemetry_contrasts: "Inter-basin differences",
    hero_telemetry_synchronous: "6 contrasts · Synchronous dynamics",
    home_findings_title: "Key Findings",
    home_period_badge: "2001 – 2024 · 24 validated years",
    home_card_basins_label: "Monitored watersheds:",
    home_card_basins_val: "4 official basins",
    home_card_basins_sub: "Ramis, Coata, Ilave and Huancané",
    home_card_period_label: "Validated period:",
    home_card_period_val: "2001 – 2024",
    home_card_period_sub: "24 complete years (1,152 observations)",
    home_card_trends_label: "Verified trends:",
    home_card_trends_val: "4 / 4 decreasing",
    home_card_trends_sub: "Theil-Sen · -8.2 mm/yr average",
    home_card_consistency_label: "Inter-basin consistency:",
    home_card_consistency_val: "4 of 4 in synchrony",
    home_card_consistency_sub: "Synchronous regional regime (q > 0.05)",
    home_conclusion_label: "Conclusion:",
    home_conclusion_text: "The four tributary watersheds of Lake Titicaca share a decreasing precipitation trajectory during the 2001–2024 period, responding jointly to a shared Andean regional climate regime without anomalous territorial divergences among them.",
    map_title: "Official hydrographic map (click a polygon to select)",
    map_btn_hide_osm: "Hide OSM basemap",
    map_btn_show_osm: "Show OSM basemap",
    map_btn_reset: "Reset view",
    explorer_title: "Tributary Watershed Explorer",
    explorer_subtitle: "Visualization of official ANA cartography and historical NASA IMERG V07 satellite precipitation series (2001–2024).",
    explorer_card_code: "Official ANA code",
    explorer_card_area: "Surface area",
    explorer_card_trend: "Estimated annual trend (Theil-Sen)",
    explorer_card_significance: "Mann-Kendall statistical significance",
    explorer_card_interpretation: "Scientific interpretation",
    explorer_tab_annual: "Annual series & trend",
    explorer_tab_monthly: "Seasonal cycle (monthly)",
    compare_title: "Paired Inter-basin Comparison",
    compare_subtitle: "Selection and pairwise analysis of tributary watersheds with econometric HAC and FDR estimation.",
    compare_first_basin: "First watershed",
    compare_second_basin: "Second watershed",
    compare_alert_same: "Select different watersheds to perform paired comparison.",
    compare_btn_gap: "Annual gap D(t)",
    compare_btn_annual: "Superimposed annual",
    compare_btn_monthly: "Seasonal cycles",
    contrast_badge_supported: "Confirmed divergence",
    contrast_badge_inconclusive: "Moderate local variability (inconclusive post-FDR)",
    contrast_badge_synchronous: "Synchronous regime",
    contrast_status_supported: "Systematic divergence confirmed in precipitation time evolution between both basins after FDR control (q ≤ 0.05).",
    contrast_status_inconclusive: "Local variation observed at nominal level (p < 0.05) moderated under FDR control (q > 0.05), reflecting microclimatic fluctuation within the shared regional regime.",
    contrast_status_synchronous: "Synchronous climate evolution: both watersheds share the same regional rainfall regime without significant territorial divergences (q > 0.05).",
    contrast_period_prefix: "Validated period:",
    contrast_period_paired: "paired years",
    contrast_delta_trend: "Estimated trend difference (ΔTrend):",
    contrast_details_summary: "Statistical inference details (HAC / FDR)",
    contrast_btn_evidence: "View complete evidence sheet",
    findings_title: "Scientific Findings & Paired Contrasts",
    findings_subtitle: "Confirmatory matrix of all 6 inter-basin combinations (n = 24 validated years), with Newey–West estimator (HAC L=2) and FDR control (q ≤ 0.05).",
    findings_filter_all: "All pairs (6)",
    findings_filter_inconclusive: "Evaluated local variation (1)",
    findings_filter_synchronous: "Regional synchronous evolution (5)",
    findings_synthesis_title: "Rigorous scientific synthesis & interpretation",
    findings_synth_trends_label: "Estimated univariate trends:",
    findings_synth_trends_text: "All 4 official basins present negative Theil-Sen coefficients in their 2001–2024 annual sums (Ramis: -11.45 mm/yr, Huancané: -10.68 mm/yr, Coata: -8.13 mm/yr, Ilave: -4.88 mm/yr).",
    findings_synth_sync_label: "Inter-basin synchronous regional dynamics:",
    findings_synth_sync_text: "When evaluating paired series between basins, all 6 contrasts confirm that the hydrographic network responds synchronously to the same regional Andean climate regime, without breaks or anomalous territorial divergences after FDR control (q > 0.05).",
    findings_synth_pair_label: "Methodological treatment of Coata ↔ Ilave pair:",
    findings_synth_pair_text: "Registers a nominal microclimatic fluctuation of -2.07 mm/yr (p = 0.0443); under Benjamini–Hochberg multiplicity control (m = 6, q = 0.2659 > 0.05), this variation is classified as moderate natural variability within the shared altiplanic dynamics.",
    findings_synth_causality_label: "Principle of hydrological non-causality:",
    findings_synth_causality_text: "Results describe exclusively surface satellite precipitation dynamics. They do not constitute proof of climate stability nor do they solely explain Lake Titicaca water level fluctuations, which depend on the complete water balance.",
    evidence_title: "Evidence Sheet:",
    evidence_subtitle: "Reproducible statistical evaluation of climate contrast",
    evidence_sec1_title: "1. Primary confirmatory specification",
    evidence_sec1_years: "Analyzed years:",
    evidence_sec1_mean_gap: "Mean annual gap D(t):",
    evidence_sec1_slope: "OLS gap slope (HAC L=2):",
    evidence_sec1_inference: "Inference & FDR control:",
    evidence_sec1_autocorr: "Serial autocorrelation lag-1 (r):",
    evidence_sec1_dataset: "Official satellite dataset:",
    evidence_sec2_title: "2. Sensitivity & lag robustness analysis (HAC / Newey–West)",
    evidence_sec2_th_lag: "Lag (L)",
    evidence_sec2_th_role: "Methodological role",
    evidence_sec2_th_slope: "Slope (mm/yr)",
    evidence_sec2_th_ci95: "95% CI",
    evidence_sec2_th_pvalue: "p-value",
    evidence_sec2_primary: "Primary confirmatory specification",
    evidence_sec2_sensitivity: "Sensitivity verification",
    evidence_sec3_title: "3. Scientific interpretation & limits",
    evidence_sec3_notice_label: "Non-causality notice:",
    evidence_sec3_notice_text: "This result describes the empirical linear relationship between satellite estimated precipitation. It does not demonstrate hydrological causality or water level fluctuations in Lake Titicaca.",
    evidence_btn_download_csv: "Download time series (CSV)",
    evidence_btn_close: "Close sheet",
    methodology_title: "Scientific Methodology & Inferential Protocol",
    methodology_subtitle: "Full technical specification: ANA cartography, NASA IMERG processing, Theil-Sen estimators, Newey-West HAC variance, and Benjamini-Hochberg FDR control.",
    sources_title: "Official Sources, Metadata & Open Data",
    sources_subtitle: "Complete repository of official datasets, institutional citations, hashes, and download access points.",
    sources_download_section: "Primary Research Downloads",
    sources_inventory_title: "Data Inventory & SHA-256 Cryptographic Verification",
    sources_inventory_summary: "Detailed file catalog, records count, and SHA-256 signatures",
    footer_rights: "All rights reserved.",
    footer_affiliation: "Academic affiliation: UPRIT",
    footer_link_methodology: "Methodology",
    footer_link_sources: "Official Sources"
  },
  es: {
    nav_home: "Inicio",
    nav_explorer: "Explorador",
    nav_compare: "Comparar",
    nav_findings: "Hallazgos",
    nav_methodology: "Metodología",
    nav_sources: "Fuentes",
    nav_status_ready: "Datos disponibles",
    nav_status_partial: "Datos parciales",
    nav_status_loading: "Cargando catálogo...",
    nav_status_unavailable: "Datos pendientes de procesamiento",
    hero_tagline: "INVESTIGACIÓN AMBIENTAL · PUNO, PERÚ",
    hero_title_prefix: "Un mismo lago.",
    hero_title_highlight: "Diferentes realidades climáticas.",
    hero_desc: "Descubre cómo evolucionan las precipitaciones en las cuencas que alimentan el lago Titicaca. Contrasta territorios, observa sus historias y examina la evidencia detrás de cada hallazgo.",
    hero_btn_explore: "Explorar las cuencas →",
    hero_btn_compare: "Comparar territorios",
    hero_badge_satellite: "Datos satelitales",
    hero_badge_cartography: "Cartografía oficial",
    hero_badge_stats: "Inferencia estadística",
    hero_telemetry_monitoring: "Monitoreo satelital",
    hero_telemetry_calibrated: "Actualización mensual",
    hero_telemetry_trend: "Precipitación (tendencia)",
    hero_telemetry_theilsen: "Theil-Sen anual",
    hero_telemetry_decreasing: "4 / 4 decrecientes",
    hero_telemetry_contrasts: "Diferencias intercuenca",
    hero_telemetry_synchronous: "6 contrastes · Dinámica regional sincrónica",
    home_findings_title: "Hallazgos clave",
    home_period_badge: "2001 – 2024 · 24 años validados",
    home_card_basins_label: "Cuencas monitoreadas:",
    home_card_basins_val: "4 cuencas oficiales",
    home_card_basins_sub: "Ramis, Coata, Ilave y Huancané",
    home_card_period_label: "Período validado:",
    home_card_period_val: "2001 – 2024",
    home_card_period_sub: "24 años completos (1,152 observaciones)",
    home_card_trends_label: "Tendencias verificadas:",
    home_card_trends_val: "4 / 4 decrecientes",
    home_card_trends_sub: "Theil-Sen · -8.2 mm/año promedio",
    home_card_consistency_label: "Consistencia intercuenca:",
    home_card_consistency_val: "4 de 4 en sincronía",
    home_card_consistency_sub: "Régimen regional sincrónico (q > 0.05)",
    home_conclusion_label: "Conclusión:",
    home_conclusion_text: "Las cuatro cuencas tributarias del Lago Titicaca comparten una trayectoria de precipitación decreciente durante el período 2001–2024, respondiendo conjuntamente a un mismo régimen climático regional andino sin divergencias territoriales anómalas entre ellas.",
    map_title: "Mapa hidrográfico oficial (clic en un polígono para seleccionar)",
    map_btn_hide_osm: "Ocultar mapa OSM",
    map_btn_show_osm: "Mostrar mapa OSM",
    map_btn_reset: "Restablecer vista",
    explorer_title: "Explorador de cuencas tributarias",
    explorer_subtitle: "Visualización de cartografía oficial ANA, series históricas de precipitación NASA IMERG V07 (2001–2024).",
    explorer_card_code: "Código oficial ANA",
    explorer_card_area: "Superficie de cuenca",
    explorer_card_trend: "Tendencia anual estimada (Theil-Sen)",
    explorer_card_significance: "Significancia estadística Mann-Kendall",
    explorer_card_interpretation: "Interpretación científica",
    explorer_tab_annual: "Serie anual y tendencia",
    explorer_tab_monthly: "Ciclo estacional (mensual)",
    compare_title: "Comparación emparejada entre cuencas",
    compare_subtitle: "Selección y contraste pairwise de cuencas tributarias con estimación econométrica HAC y FDR.",
    compare_first_basin: "Primera cuenca",
    compare_second_basin: "Segunda cuenca",
    compare_alert_same: "Selecciona cuencas distintas para realizar la comparación emparejada.",
    compare_btn_gap: "Brecha D(t)",
    compare_btn_annual: "Superpuesta anual",
    compare_btn_monthly: "Ciclos estacionales",
    contrast_badge_supported: "Divergencia confirmada",
    contrast_badge_inconclusive: "Variabilidad local moderada (inconcluso tras FDR)",
    contrast_badge_synchronous: "Régimen sincrónico",
    contrast_status_supported: "Se confirma divergencia sistemática en la evolución temporal de precipitaciones entre ambas cuencas tras control FDR (q ≤ 0.05).",
    contrast_status_inconclusive: "Variación local observada a nivel nominal (p < 0.05) que modera su significancia bajo control FDR (q > 0.05), reflejando fluctuación microclimática dentro del mismo régimen regional.",
    contrast_status_synchronous: "Evolución climática sincrónica: las cuencas comparten el mismo régimen pluviométrico regional sin divergencias territoriales significativas (q > 0.05).",
    contrast_period_prefix: "Período validado:",
    contrast_period_paired: "años emparejados",
    contrast_delta_trend: "Diferencia de tendencia estimada (ΔTrend):",
    contrast_details_summary: "Detalles de inferencia estadística (HAC / FDR)",
    contrast_btn_evidence: "Ver ficha de evidencia completa",
    findings_title: "Hallazgos científicos y contrastes emparejados",
    findings_subtitle: "Matriz confirmatoria de las 6 combinaciones intercuenca (n = 24 años validados), con estimador Newey–West (HAC L=2) y control FDR (q ≤ 0.05).",
    findings_filter_all: "Todas las parejas (6)",
    findings_filter_inconclusive: "Variación local evaluada (1)",
    findings_filter_synchronous: "Evolución sincrónica regional (5)",
    findings_synthesis_title: "Síntesis e interpretación científica rigurosa",
    findings_synth_trends_label: "Tendencias univariadas estimadas:",
    findings_synth_trends_text: "Las 4 cuencas oficiales presentan coeficientes Theil-Sen negativos en sus acumulados anuales 2001–2024 (Ramis: -11.45 mm/año, Huancané: -10.68 mm/año, Coata: -8.13 mm/año, Ilave: -4.88 mm/año).",
    findings_synth_sync_label: "Dinámica regional sincrónica intercuenca:",
    findings_synth_sync_text: "Al evaluar las series emparejadas entre cuencas, los 6 contrastes confirman que el sistema hidrográfico responde de manera acoplada al mismo régimen climático regional andino, sin quiebres ni divergencias territoriales anómalas tras control FDR (q > 0.05).",
    findings_synth_pair_label: "Tratamiento metodológico del par Coata ↔ Ilave:",
    findings_synth_pair_text: "Registra una fluctuación microclimática nominal de -2.07 mm/año (p = 0.0443); bajo el control múltiple FDR de Benjamini–Hochberg (m = 6, q = 0.2659 > 0.05), esta variación se clasifica como variabilidad natural moderada dentro de la dinámica altiplánica compartida.",
    findings_synth_causality_label: "Principio de no causalidad hidrológica:",
    findings_synth_causality_text: "Los resultados describen exclusivamente dinámicas de precipitación superficial satelital. No constituyen demostración de estabilidad climática ni explican de forma aislada las fluctuaciones del nivel del Lago Titicaca, las cuales están sujetas al balance hídrico completo.",
    evidence_title: "Ficha de Evidencia:",
    evidence_subtitle: "Evaluación estadística reproducible de contraste climático",
    evidence_sec1_title: "1. Especificación confirmatoria principal",
    evidence_sec1_years: "Años analizados:",
    evidence_sec1_mean_gap: "Brecha anual media D(t):",
    evidence_sec1_slope: "Pendiente brecha OLS (HAC L=2):",
    evidence_sec1_inference: "Inferencia y control FDR:",
    evidence_sec1_autocorr: "Autocorrelación serial lag-1 (r):",
    evidence_sec1_dataset: "Conjunto satelital oficial:",
    evidence_sec2_title: "2. Análisis de robustez y sensibilidad a rezagos temporales (HAC / Newey–West)",
    evidence_sec2_th_lag: "Rezago (L)",
    evidence_sec2_th_role: "Rol en metodología",
    evidence_sec2_th_slope: "Pendiente (mm/año)",
    evidence_sec2_th_ci95: "IC 95%",
    evidence_sec2_th_pvalue: "Valor p",
    evidence_sec2_primary: "Especificación primaria confirmatoria",
    evidence_sec2_sensitivity: "Comprobación de sensibilidad",
    evidence_sec3_title: "3. Interpretación y límites científicos",
    evidence_sec3_notice_label: "Aviso de no causalidad:",
    evidence_sec3_notice_text: "Este resultado describe la relación lineal empírica entre las precipitaciones satelitales estimadas. No demuestra causalidad hidrológica ni fluctuaciones en el nivel del Lago Titicaca.",
    evidence_btn_download_csv: "Descargar serie temporal (CSV)",
    evidence_btn_close: "Cerrar ficha",
    methodology_title: "Metodología científica y protocolo inferencial",
    methodology_subtitle: "Especificación técnica completa: cartografía ANA, procesamiento NASA IMERG, estimadores Theil-Sen, varianza HAC Newey-West y control FDR Benjamini-Hochberg.",
    sources_title: "Fuentes oficiales, metadatos y descargas",
    sources_subtitle: "Repositorio exhaustivo de datos de investigación oficiales, citación institucional, hashes y accesos de descarga.",
    sources_download_section: "Descargas principales de datos",
    sources_inventory_title: "Datos de investigación: Inventario técnico completo e integridad SHA-256",
    sources_inventory_summary: "Inventario de archivos, registros e integridad criptográfica SHA-256",
    footer_rights: "All rights reserved.",
    footer_affiliation: "Academic affiliation: UPRIT",
    footer_link_methodology: "Metodología",
    footer_link_sources: "Fuentes oficiales"
  }
}

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: keyof TranslationDictionary) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations.en[key] || ""
})

export const LanguageProvider: React.FC<{ children: React.ReactNode; defaultLang?: Language }> = ({
  children,
  defaultLang
}) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (defaultLang) return defaultLang
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("titicaca_lang") as Language | null
      if (stored === "en" || stored === "es") return stored
    }
    return "en"
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("titicaca_lang", lang)
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
  }

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[lang] || translations.en
    return dict[key] || translations.en[key] || String(key)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

