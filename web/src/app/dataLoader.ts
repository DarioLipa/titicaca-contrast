import Papa from "papaparse"
import {
  ManifestSchema,
  BasinSchema,
  MonthlyPrecipitationRowSchema,
  AnnualPrecipitationItemSchema,
  TrendItemSchema,
  ContrastItemSchema,
  EvidenceItemSchema,
  type Manifest,
  type Basin,
  type MonthlyPrecipitationRow,
  type AnnualPrecipitationItem,
  type TrendItem,
  type ContrastItem,
  type EvidenceItem
} from "./schemas"

export type DataStatus = "loading" | "ready" | "partial" | "unavailable" | "error"

export interface HydrologyData {
  status: DataStatus
  manifest: Manifest | null
  basins: Basin[]
  geoJson: any | null
  monthly: MonthlyPrecipitationRow[]
  annual: AnnualPrecipitationItem[]
  trends: TrendItem[]
  contrasts: ContrastItem[]
  evidence: EvidenceItem[]
  errorMessage: string | null
}

export type DataPayload = HydrologyData

export async function loadManifest(basePath: string = "./data/manifest.json"): Promise<{
  status: DataStatus
  manifest: Manifest | null
  errorMessage: string | null
}> {
  try {
    const response = await fetch(basePath)
    if (!response.ok) {
      return {
        status: "unavailable",
        manifest: null,
        errorMessage: `No se pudo obtener el manifiesto (HTTP ${response.status})`
      }
    }
    const rawData = await response.json()
    const parsed = ManifestSchema.safeParse(rawData)
    if (!parsed.success) {
      return {
        status: "error",
        manifest: null,
        errorMessage: `El manifiesto no cumple con el esquema establecido: ${parsed.error.message}`
      }
    }
    return {
      status: parsed.data.data_status,
      manifest: parsed.data,
      errorMessage: null
    }
  } catch (err) {
    return {
      status: "unavailable",
      manifest: null,
      errorMessage: err instanceof Error ? err.message : "Error desconocido al cargar datos"
    }
  }
}

export async function loadBasins(basePath: string = "./data/basins.json"): Promise<Basin[]> {
  const res = await fetch(basePath)
  if (!res.ok) return []
  const data = await res.json()
  const result: Basin[] = []
  if (Array.isArray(data)) {
    for (const item of data) {
      const parsed = BasinSchema.safeParse(item)
      if (parsed.success) {
        result.push(parsed.data)
      }
    }
  }
  return result
}

export async function loadGeoJSON(basePath: string = "./data/basins.geojson"): Promise<any | null> {
  try {
    const res = await fetch(basePath)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function loadMonthlyPrecipitation(basePath: string = "./data/precipitation-monthly.csv"): Promise<MonthlyPrecipitationRow[]> {
  try {
    const res = await fetch(basePath)
    if (!res.ok) return []
    const text = await res.text()
    const parsedCsv = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true
    })
    const rows: MonthlyPrecipitationRow[] = []
    for (const row of parsedCsv.data) {
      const rawRow = {
        basin_id: row.basin_id,
        year: parseInt(row.year, 10),
        month: parseInt(row.month, 10),
        precip_mm: row.precip_mm !== "" && row.precip_mm !== undefined && row.precip_mm !== null ? parseFloat(row.precip_mm) : null,
        valid_area_fraction: parseFloat(row.valid_area_fraction || "0"),
        source_dataset: row.source_dataset || "GPM_3IMERGM",
        source_version: row.source_version || "07"
      }
      const parsed = MonthlyPrecipitationRowSchema.safeParse(rawRow)
      if (parsed.success) {
        rows.push(parsed.data)
      }
    }
    return rows
  } catch {
    return []
  }
}

export async function loadAnnualPrecipitation(basePath: string = "./data/precipitation-annual.json"): Promise<AnnualPrecipitationItem[]> {
  try {
    const res = await fetch(basePath)
    if (!res.ok) return []
    const data = await res.json()
    const items: AnnualPrecipitationItem[] = []
    if (Array.isArray(data)) {
      for (const item of data) {
        const parsed = AnnualPrecipitationItemSchema.safeParse(item)
        if (parsed.success) {
          items.push(parsed.data)
        }
      }
    }
    return items
  } catch {
    return []
  }
}

export async function loadTrends(basePath: string = "./data/trends.json"): Promise<TrendItem[]> {
  try {
    const res = await fetch(basePath)
    if (!res.ok) return []
    const data = await res.json()
    const items: TrendItem[] = []
    if (Array.isArray(data)) {
      for (const item of data) {
        const parsed = TrendItemSchema.safeParse(item)
        if (parsed.success) {
          items.push(parsed.data)
        }
      }
    }
    return items
  } catch {
    return []
  }
}

export async function loadContrasts(basePath: string = "./data/contrasts.json"): Promise<ContrastItem[]> {
  try {
    const res = await fetch(basePath)
    if (!res.ok) return []
    const data = await res.json()
    const items: ContrastItem[] = []
    if (Array.isArray(data)) {
      for (const item of data) {
        const parsed = ContrastItemSchema.safeParse(item)
        if (parsed.success) {
          items.push(parsed.data)
        }
      }
    }
    return items
  } catch {
    return []
  }
}

export async function loadEvidence(basePath: string = "./data/evidence.json"): Promise<EvidenceItem[]> {
  try {
    const res = await fetch(basePath)
    if (!res.ok) return []
    const data = await res.json()
    const items: EvidenceItem[] = []
    if (Array.isArray(data)) {
      for (const item of data) {
        const parsed = EvidenceItemSchema.safeParse(item)
        if (parsed.success) {
          items.push(parsed.data)
        }
      }
    }
    return items
  } catch {
    return []
  }
}

export async function loadAllHydrologyData(dataDir: string = "./data"): Promise<HydrologyData> {
  const manifestRes = await loadManifest(`${dataDir}/manifest.json`)
  if (manifestRes.status === "unavailable" || manifestRes.status === "error") {
    return {
      status: manifestRes.status,
      manifest: manifestRes.manifest,
      basins: [],
      geoJson: null,
      monthly: [],
      annual: [],
      trends: [],
      contrasts: [],
      evidence: [],
      errorMessage: manifestRes.errorMessage
    }
  }

  const [basins, geoJson, monthly, annual, trends, contrasts, evidence] = await Promise.all([
    loadBasins(`${dataDir}/basins.json`),
    loadGeoJSON(`${dataDir}/basins.geojson`),
    loadMonthlyPrecipitation(`${dataDir}/precipitation-monthly.csv`),
    loadAnnualPrecipitation(`${dataDir}/precipitation-annual.json`),
    loadTrends(`${dataDir}/trends.json`),
    loadContrasts(`${dataDir}/contrasts.json`),
    loadEvidence(`${dataDir}/evidence.json`)
  ])

  return {
    status: manifestRes.status,
    manifest: manifestRes.manifest,
    basins,
    geoJson,
    monthly,
    annual,
    trends,
    contrasts,
    evidence,
    errorMessage: null
  }
}
