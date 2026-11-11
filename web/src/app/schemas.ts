import { z } from "zod"

export const ManifestSchema = z.object({
  schema_version: z.string(),
  generated_at_utc: z.string(),
  data_status: z.enum(["ready", "partial", "unavailable"]),
  dataset_id: z.string(),
  dataset_doi: z.string(),
  dataset_version: z.string(),
  dataset_processing_level: z.string(),
  dataset_run: z.string(),
  start_month: z.string(),
  end_month: z.string(),
  source_downloaded_at_utc: z.string().nullable().optional(),
  boundary_source: z.string(),
  boundary_downloaded_at_utc: z.string().nullable().optional(),
  boundary_hash_sha256: z.string().nullable().optional(),
  processing_version: z.string(),
  method_version: z.string(),
  notes: z.string(),
  integrity: z.record(z.string()).default({})
})

export type Manifest = z.infer<typeof ManifestSchema>

export const BasinSchema = z.object({
  id: z.enum(["ramis", "coata", "ilave", "huancane"]),
  name: z.string(),
  official_code: z.string(),
  area_km2: z.number().positive(),
  source: z.string(),
  hierarchical_level: z.string().optional(),
  calculated_area_km2: z.number().optional(),
  crs_original: z.string().optional(),
  source_url: z.string().optional(),
  download_hash_sha256: z.string().optional()
})

export type Basin = z.infer<typeof BasinSchema>

export const MonthlyPrecipitationRowSchema = z.object({
  basin_id: z.enum(["ramis", "coata", "ilave", "huancane"]),
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  precip_mm: z.number().nullable(),
  valid_area_fraction: z.number().min(0).max(1),
  source_dataset: z.string(),
  source_version: z.string()
})

export type MonthlyPrecipitationRow = z.infer<typeof MonthlyPrecipitationRowSchema>

export const AnnualPrecipitationItemSchema = z.object({
  year: z.number().int(),
  basin_id: z.enum(["ramis", "coata", "ilave", "huancane"]),
  annual_precip_mm: z.number().nullable(),
  complete_months: z.number().int().min(0).max(12),
  valid_year: z.boolean(),
  source_version: z.string()
})

export type AnnualPrecipitationItem = z.infer<typeof AnnualPrecipitationItemSchema>

export const TrendItemSchema = z.object({
  basin_id: z.enum(["ramis", "coata", "ilave", "huancane"]),
  start_year: z.number().int(),
  end_year: z.number().int(),
  n_years: z.number().int(),
  sen_slope_mm_per_year: z.number(),
  mann_kendall_p: z.number(),
  trend_direction: z.enum(["increasing", "decreasing", "no_trend"]),
  data_quality: z.string(),
  method_version: z.string()
})

export type TrendItem = z.infer<typeof TrendItemSchema>

export const ContrastItemSchema = z.object({
  basin_a: z.enum(["ramis", "coata", "ilave", "huancane"]),
  basin_b: z.enum(["ramis", "coata", "ilave", "huancane"]),
  start_year: z.number().int(),
  end_year: z.number().int(),
  n_paired_years: z.number().int(),
  gap_slope_mm_per_year: z.number(),
  gap_slope_ci95: z.tuple([z.number(), z.number()]),
  p_value: z.number(),
  q_value_fdr: z.number(),
  evidence_status: z.enum(["supported", "inconclusive", "no_change", "insufficient_data"]),
  method_version: z.string()
})

export type ContrastItem = z.infer<typeof ContrastItemSchema>

