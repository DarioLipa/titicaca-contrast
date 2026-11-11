import { ManifestSchema, type Manifest } from "./schemas"

export type DataStatus = "loading" | "ready" | "partial" | "unavailable" | "error"

export interface DataPayload {
  status: DataStatus
  manifest: Manifest | null
  errorMessage: string | null
}

export async function loadManifest(basePath: string = "./data/manifest.json"): Promise<DataPayload> {
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
