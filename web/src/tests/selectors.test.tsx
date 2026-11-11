import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Compare } from "../pages/Compare"

describe("Compare selector validation", () => {
  const dummyPayload = {
    status: "unavailable" as const,
    manifest: null,
    errorMessage: null
  }

  it("shows validation alert when same basin is chosen in both selectors", () => {
    render(<Compare data={dummyPayload} />)
    const selectB = screen.getByLabelText(/Segunda cuenca/i)
    fireEvent.change(selectB, { target: { value: "ramis" } })

    expect(screen.getByRole("alert")).toHaveTextContent(/Selecciona cuencas distintas/i)
  })

  it("hides validation alert when different basins are chosen", () => {
    render(<Compare data={dummyPayload} />)
    const selectA = screen.getByLabelText(/Primera cuenca/i)
    const selectB = screen.getByLabelText(/Segunda cuenca/i)

    fireEvent.change(selectA, { target: { value: "ramis" } })
    fireEvent.change(selectB, { target: { value: "coata" } })

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
