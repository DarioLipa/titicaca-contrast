import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusMessage } from "../components/StatusMessage"

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
