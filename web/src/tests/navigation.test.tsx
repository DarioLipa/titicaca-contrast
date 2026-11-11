import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Header } from "../components/Header"

describe("Header navigation", () => {
  it("renders all navigation options and active state", () => {
    const handleSelect = vi.fn()
    render(<Header currentTab="home" onSelectTab={handleSelect} status="unavailable" />)

    expect(screen.getByRole("heading", { name: /TITICACA CONTRAST/i })).toBeInTheDocument()
    expect(screen.getByText(/Datos pendientes de procesamiento/i)).toBeInTheDocument()

    const explorerButton = screen.getByRole("button", { name: "Explorador" })
    fireEvent.click(explorerButton)
    expect(handleSelect).toHaveBeenCalledWith("explorer")
  })
})
