import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { StatusMessage } from "../components/StatusMessage"
import { ContrastCard } from "../components/ContrastCard"
import { EvidencePanel } from "../components/EvidencePanel"
import type { ContrastItem, EvidenceItem } from "../app/schemas"

describe("StatusMessage component", () => {
  it("renders honest unavailable state message", () => {
    render(<StatusMessage status="unavailable" message="Prueba de datos pendientes" />)
    expect(screen.getByRole("status")).toHaveTextContent(/Datos pendientes de procesamiento/i)
    expect(screen.getByText("Prueba de datos pendientes")).toBeInTheDocument()
  })

  it("does not render when status is ready", () => {
    const { container } = render(<StatusMessage status="ready" />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe("ContrastCard and EvidencePanel components", () => {
  const dummyContrast: ContrastItem = {
    basin_a: "coata",
    basin_b: "ilave",
    start_year: 2001,
    end_year: 2024,
    n_paired_years: 24,
    gap_slope_mm_per_year: -2.07,
    gap_slope_ci95: [-4.07, -0.06],
    p_value: 0.0443,
    q_value_fdr: 0.2659,
    evidence_status: "inconclusive",
    method_version: "1.0.0"
  }

  const dummyEvidence: EvidenceItem = {
    basin_a: "coata",
    basin_b: "ilave",
    basin_a_name: "Coata",
    basin_b_name: "Ilave",
    start_year: 2001,
    end_year: 2024,
    n_paired_years: 24,
    mean_basin_a_mm: 620.67,
    mean_basin_b_mm: 673.85,
    mean_gap_mm: -53.18,
    gap_slope_mm_per_year: -2.07,
    gap_slope_ci95: [-4.07, -0.06],
    p_value: 0.0443,
    q_value_fdr: 0.2659,
    evidence_status: "inconclusive",
    sensitivity_lags: {
      "1": { slope: -2.07, ci95: [-3.84, -0.3], p_value: 0.0219 },
      "2": { slope: -2.07, ci95: [-4.07, -0.06], p_value: 0.0443 },
      "3": { slope: -2.07, ci95: [-4.05, -0.08], p_value: 0.042 }
    },
    autocorrelation_lag1: 0.4326,
    interpretation: "Evidencia inconclusa para Coata e Ilave tras control FDR.",
    method_version: "1.0.0",
    dataset_version: "07",
    dataset_doi: "10.5067/GPM/IMERG/3B-MONTH/07"
  }

  it("renders ContrastCard with inconclusive badge and triggers evidence callback", () => {
    const handleOpen = vi.fn()
    render(
      <ContrastCard
        contrast={dummyContrast}
        basinAName="Coata"
        basinBName="Ilave"
        onOpenEvidence={handleOpen}
      />
    )

    expect(screen.getByText("Coata ↔ Ilave")).toBeInTheDocument()
    expect(screen.getByText(/Inconcluso/i)).toBeInTheDocument()
    expect(screen.getByText("-2.07 mm/año")).toBeInTheDocument()

    const btn = screen.getByRole("button", { name: /Ver ficha de evidencia completa/i })
    fireEvent.click(btn)
    expect(handleOpen).toHaveBeenCalledWith("coata", "ilave")
  })

  it("renders EvidencePanel with sensitivity analysis and closes on Escape", () => {
    const handleClose = vi.fn()
    render(
      <EvidencePanel
        evidence={dummyEvidence}
        onClose={handleClose}
      />
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText(/Ficha de Evidencia: Coata ↔ Ilave/i)).toBeInTheDocument()
    expect(screen.getByText("L = 1")).toBeInTheDocument()
    expect(screen.getByText("L = 2")).toBeInTheDocument()
    expect(screen.getByText("L = 3")).toBeInTheDocument()

    fireEvent.keyDown(window, { key: "Escape" })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
