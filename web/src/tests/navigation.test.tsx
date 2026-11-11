import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Header } from "../components/Header"
import { App } from "../App"

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

  it("navigates across pages in the full App component", async () => {
    await act(async () => {
      render(<App />)
    })

    expect(screen.getByRole("heading", { name: /Un mismo lago/i })).toBeInTheDocument()

    const navButtons = screen.getAllByRole("button", { name: /Metodología/i })
    await act(async () => {
      fireEvent.click(navButtons[0])
    })
    expect(screen.getByRole("heading", { name: /Metodología científica y protocolo inferencial/i })).toBeInTheDocument()

    const sourcesButtons = screen.getAllByRole("button", { name: /Fuentes/i })
    await act(async () => {
      fireEvent.click(sourcesButtons[0])
    })
    expect(screen.getByRole("heading", { name: /Fuentes oficiales, metadatos y descargas/i })).toBeInTheDocument()
  })
})
