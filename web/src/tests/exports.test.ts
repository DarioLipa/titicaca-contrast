import { describe, it, expect } from "vitest"
import { MonthlyPrecipitationRowSchema } from "../app/schemas"

describe("CSV data contract", () => {
  it("validates well-formed monthly precipitation record", () => {
    const validRow = {
      basin_id: "ramis",
      year: 2020,
      month: 1,
      precip_mm: 145.2,
      valid_area_fraction: 0.98,
      source_dataset: "GPM_3IMERGM",
      source_version: "07"
    }
    const result = MonthlyPrecipitationRowSchema.safeParse(validRow)
    expect(result.success).toBe(true)
  })

  it("permits null precip_mm for explicit missing values without fabricating zeros", () => {
    const missingRow = {
      basin_id: "coata",
      year: 2020,
      month: 5,
      precip_mm: null,
      valid_area_fraction: 0.50,
      source_dataset: "GPM_3IMERGM",
      source_version: "07"
    }
    const result = MonthlyPrecipitationRowSchema.safeParse(missingRow)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.precip_mm).toBeNull()
    }
  })

  it("rejects invalid basin id", () => {
    const invalidRow = {
      basin_id: "cuenca_desconocida",
      year: 2020,
      month: 1,
      precip_mm: 100.0,
      valid_area_fraction: 1.0,
      source_dataset: "GPM_3IMERGM",
      source_version: "07"
    }
    const result = MonthlyPrecipitationRowSchema.safeParse(invalidRow)
    expect(result.success).toBe(false)
  })
})
