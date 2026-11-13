import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Header } from "../components/Header"
import { App } from "../App"

describe("Header navigation", () => {
  it("renders all navigation options and active state", () => {
    const handleSelect = vi.fn()
    render(<Header currentTab="home" onSelectTab={handleSelect} status="unavailable" />)

    expect(screen.getByRole("heading", { name: /TITICACA CONTRAST/i })).toBeInTheDocument()
    expect(screen.getByText(/Data pending|Datos pendientes/i)).toBeInTheDocument()

    const explorerButton = screen.getByRole("button", { name: /Explorer|Explorador/i })
    fireEvent.click(explorerButton)
    expect(handleSelect).toHaveBeenCalledWith("explorer")
  })

  it("navigates across pages in the full App component", async () => {
    await act(async () => {
      render(<App />)
    })

    expect(screen.getByRole("heading", { name: /One lake|Un mismo lago/i })).toBeInTheDocument()

    const navButtons = screen.getAllByRole("button", { name: /Methodology|Metodología/i })
    await act(async () => {
      fireEvent.click(navButtons[0])
    })
    expect(screen.getByRole("heading", { name: /Methodology|Metodología/i })).toBeInTheDocument()

    const sourcesButtons = screen.getAllByRole("button", { name: /Sources|Fuentes/i })
    await act(async () => {
      fireEvent.click(sourcesButtons[0])
    })
    expect(screen.getByRole("heading", { name: /Sources|Fuentes/i })).toBeInTheDocument()
  })

  it("navigates directly to a selected basin in Explorer when clicking its card", async () => {
    await act(async () => {
      render(<App />)
    })

    const huancaneButtons = screen.getAllByRole("button", { name: /Huancané/i })
    await act(async () => {
      fireEvent.click(huancaneButtons[0])
    })

    expect(screen.getByRole("heading", { name: /Explorador|Explorer/i })).toBeInTheDocument()
    expect(screen.getAllByText(/3,611\.92/i).length).toBeGreaterThanOrEqual(1)
  })
})
