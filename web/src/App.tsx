import React, { useEffect, useState } from "react"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Home } from "./pages/Home"
import { Explorer } from "./pages/Explorer"
import { Compare } from "./pages/Compare"
import { Findings } from "./pages/Findings"
import { Methodology } from "./pages/Methodology"
import { Sources } from "./pages/Sources"
import { loadAllHydrologyData, type HydrologyData } from "./app/dataLoader"

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("home")
  const [dataPayload, setDataPayload] = useState<HydrologyData>({
    status: "loading",
    manifest: null,
    basins: [],
    geoJson: null,
    monthly: [],
    annual: [],
    trends: [],
    contrasts: [],
    evidence: [],
    errorMessage: null
  })

  useEffect(() => {
    let isMounted = true
    loadAllHydrologyData().then((result) => {
      if (isMounted) {
        setDataPayload(result)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return <Home data={dataPayload} onNavigate={setCurrentTab} />
      case "explorer":
        return <Explorer data={dataPayload} />
      case "compare":
        return <Compare data={dataPayload} />
      case "findings":
        return <Findings data={dataPayload} />
      case "methodology":
        return <Methodology />
      case "sources":
        return <Sources data={dataPayload} />
      default:
        return <Home data={dataPayload} onNavigate={setCurrentTab} />
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} status={dataPayload.status} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <Footer onSelectTab={setCurrentTab} />
    </div>
  )
}
