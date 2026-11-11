import { describe, it, expect, vi, beforeEach } from "vitest"
import { loadManifest } from "../app/dataLoader"

describe("loadManifest", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("handles unavailable HTTP response gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404
    } as Response)

    const result = await loadManifest("./nonexistent.json")
    expect(result.status).toBe("unavailable")
    expect(result.manifest).toBeNull()
  })

  it("successfully parses valid manifest payload", async () => {
    const validManifest = {
      schema_version: "1.0",
      generated_at_utc: "2026-11-10T12:00:00Z",
      data_status: "unavailable",
      dataset_id: "GPM_3IMERGM",
      dataset_doi: "10.5067/GPM/IMERG/3B-MONTH/07",
      dataset_version: "07",
      dataset_processing_level: "L3",
      dataset_run: "Final",
      start_month: "2001-01",
      end_month: "2025-12",
      source_downloaded_at_utc: null,
      boundary_source: "ANA GeoIDEP",
      boundary_downloaded_at_utc: null,
      boundary_hash_sha256: null,
      processing_version: "0.1.0",
      method_version: "1.0.0",
      notes: "Test notes",
      integrity: {}
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => validManifest
    } as Response)

    const result = await loadManifest("./manifest.json")
    expect(result.status).toBe("unavailable")
    expect(result.manifest?.dataset_id).toBe("GPM_3IMERGM")
    expect(result.errorMessage).toBeNull()
  })

  it("returns error status on schema mismatch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ invalid_key: 123 })
    } as Response)

    const result = await loadManifest("./bad.json")
    expect(result.status).toBe("error")
    expect(result.manifest).toBeNull()
    expect(result.errorMessage).toContain("esquema")
  })
})

