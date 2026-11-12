import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Compare } from "../pages/Compare"
import { PeriodSelector } from "../components/PeriodSelector"
import { BasinMap } from "../components/BasinMap"

describe("Compare selector validation", () => {
  const dummyPayload = {
    status: "unavailable" as const,
    manifest: null,
    errorMessage: null,
    basins: [],
    geoJson: null,
    monthly: [],
    annual: [],
    trends: [],
    contrasts: [],
    evidence: []
  }

  it("shows validation alert when same basin is chosen in both selectors", () => {
    render(<Compare data={dummyPayload} />)
    const selectB = screen.getByLabelText(/Second watershed|Segunda cuenca/i)
    fireEvent.change(selectB, { target: { value: "ramis" } })

    expect(screen.getByRole("alert")).toHaveTextContent(/Select different watersheds|Selecciona cuencas distintas/i)
  })

  it("hides validation alert when different basins are chosen", () => {
    render(<Compare data={dummyPayload} />)
    const selectA = screen.getByLabelText(/First watershed|Primera cuenca/i)
    const selectB = screen.getByLabelText(/Second watershed|Segunda cuenca/i)

    fireEvent.change(selectA, { target: { value: "ramis" } })
    fireEvent.change(selectB, { target: { value: "coata" } })

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})

describe("PeriodSelector component", () => {
  it("changes period when clicking preset buttons", () => {
    const handleChange = vi.fn()
    render(
      <PeriodSelector
        startYear={2001}
        endYear={2024}
        onPeriodChange={handleChange}
      />
    )

    const presetBtn = screen.getByRole("button", { name: /2001–2020/i })
    fireEvent.click(presetBtn)
    expect(handleChange).toHaveBeenCalledWith(2001, 2020)
  })
})

describe("BasinMap component", () => {
  it("renders accessible fallback basin buttons", () => {
    const handleSelect = vi.fn()
    render(
      <BasinMap
        selectedBasin="ramis"
        onSelectBasin={handleSelect}
      />
    )

    const coataBtn = screen.getByRole("button", { name: /Coata/i })
    expect(coataBtn).toBeInTheDocument()
    fireEvent.click(coataBtn)
    expect(handleSelect).toHaveBeenCalledWith("coata")
  })
})
