import React, { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { BASIN_POLYGONS } from "../data/basinPolygons"

export interface TerritoryHeroVisualProps {
  onSelectBasin?: (basinId: string) => void
}

export const TerritoryHeroVisual: React.FC<TerritoryHeroVisualProps> = ({ onSelectBasin }) => {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [activeBasin, setActiveBasin] = useState<string>("ramis")
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [reducedMotion, setReducedMotion] = useState<boolean>(false)

  const isDragging = useRef<boolean>(false)
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const baseRotation = useRef<{ x: number; y: number }>({ x: 0.16, y: -0.08 })
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.16, y: -0.08 })
  const pointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const cameraDistance = useRef<number>(6.2)
  const targetCameraDistance = useRef<number>(6.2)

  const basinMeshes = useRef<Map<string, { mesh: THREE.Mesh; topMat: THREE.MeshStandardMaterial }>>(new Map())

  const handleResetView = useCallback(() => {
    targetRotation.current = { x: 0.16, y: -0.08 }
    targetCameraDistance.current = 6.2
  }, [])

  const handleSelectBasin = useCallback((basinId: string) => {
    setActiveBasin(basinId)
    onSelectBasin?.(basinId)
  }, [onSelectBasin])

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) {
      setWebGlSupported(false)
      return
    }

    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth || 560
    let height = container.clientHeight || 520
    let aspect = width / height

    const getOptimalDistance = (asp: number) => {
      return asp < 1.15 ? 6.2 * (1.15 / Math.max(asp, 0.52)) : 6.2
    }

    const baseDist = getOptimalDistance(aspect)
    cameraDistance.current = baseDist
    targetCameraDistance.current = baseDist

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 1000)
    camera.position.set(0, 3.6, cameraDistance.current)
    camera.lookAt(0, 0.1, 0)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.18
      container.appendChild(renderer.domElement)
    } catch {
      setWebGlSupported(false)
      return
    }

    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.3)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xf8fafc, 2.6)
    mainLight.position.set(5.5, 9.5, 5.0)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x20d7df, 1.4)
    fillLight.position.set(-5.5, 4.5, -3.5)
    scene.add(fillLight)

    const backRimLight = new THREE.DirectionalLight(0xd6a461, 0.9)
    backRimLight.position.set(0, 2, -6.5)
    scene.add(backRimLight)

    const territoryGroup = new THREE.Group()
    territoryGroup.rotation.x = baseRotation.current.x
    territoryGroup.rotation.y = baseRotation.current.y
    scene.add(territoryGroup)

    const orbitalRingGroup = new THREE.Group()
    orbitalRingGroup.position.y = -0.06
    territoryGroup.add(orbitalRingGroup)

    const primaryRingGeo = new THREE.RingGeometry(3.32, 3.36, 96)
    const primaryRingMat = new THREE.MeshBasicMaterial({
      color: 0x20d7df,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    })
    const primaryRingMesh = new THREE.Mesh(primaryRingGeo, primaryRingMat)
    primaryRingMesh.rotation.x = Math.PI / 2
    orbitalRingGroup.add(primaryRingMesh)

    const innerRingGeo = new THREE.RingGeometry(2.70, 2.73, 64)
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x69dad6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28
    })
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat)
    innerRingMesh.rotation.x = Math.PI / 2
    orbitalRingGroup.add(innerRingMesh)

    const outerRingGeo = new THREE.RingGeometry(3.85, 3.88, 64)
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x1177a7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18
    })
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat)
    outerRingMesh.rotation.x = Math.PI / 2
    orbitalRingGroup.add(outerRingMesh)

    const tickMat = new THREE.LineBasicMaterial({ color: 0x20d7df, transparent: true, opacity: 0.5 })
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2
      const isMajor = i % 6 === 0
      const r1 = isMajor ? 3.22 : 3.28
      const r2 = isMajor ? 3.46 : 3.40
      const tickGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(angle) * r1, 0, Math.sin(angle) * r1),
        new THREE.Vector3(Math.cos(angle) * r2, 0, Math.sin(angle) * r2)
      ])
      orbitalRingGroup.add(new THREE.Line(tickGeo, tickMat))
    }

    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x20d7df })
    const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.position.set(Math.cos(angle) * 3.34, 0, Math.sin(angle) * 3.34)
      orbitalRingGroup.add(node)
    }

    const gridHelper = new THREE.GridHelper(7.0, 24, 0x0b2b40, 0x061827)
    gridHelper.position.y = -0.09
    orbitalRingGroup.add(gridHelper)

    const createBasinExtrusion = (
      id: string,
      pts: [number, number][],
      depth: number,
      topColor: number,
      sideColor: number,
      edgeColor: number
    ) => {
      const shape = new THREE.Shape()
      pts.forEach(([x, y], idx) => {
        if (idx === 0) shape.moveTo(x, y)
        else shape.lineTo(x, y)
      })
      shape.closePath()

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.035,
        bevelThickness: 0.035
      }

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      geometry.rotateX(-Math.PI / 2)

      const sideMaterial = new THREE.MeshStandardMaterial({
        color: sideColor,
        roughness: 0.65,
        metalness: 0.25
      })

      const topMaterial = new THREE.MeshStandardMaterial({
        color: topColor,
        roughness: 0.35,
        metalness: 0.4,
        emissive: topColor,
        emissiveIntensity: 0.16
      })

      const mesh = new THREE.Mesh(geometry, [sideMaterial, topMaterial])
      mesh.name = id

      const edgesGeo = new THREE.EdgesGeometry(geometry, 35)
      const edgesMat = new THREE.LineBasicMaterial({
        color: edgeColor,
        transparent: true,
        opacity: 0.8
      })
      const edges = new THREE.LineSegments(edgesGeo, edgesMat)
      mesh.add(edges)

      basinMeshes.current.set(id, { mesh, topMat: topMaterial })
      return mesh
    }

    const ramisMesh = createBasinExtrusion("ramis", BASIN_POLYGONS.ramis, 0.38, 0x0284c7, 0x073b64, 0x20d7df)
    territoryGroup.add(ramisMesh)

    const huancaneMesh = createBasinExtrusion("huancane", BASIN_POLYGONS.huancane, 0.32, 0x38bdf8, 0x0c4a6e, 0x69dad6)
    territoryGroup.add(huancaneMesh)

    const coataMesh = createBasinExtrusion("coata", BASIN_POLYGONS.coata, 0.34, 0x10b981, 0x064e3b, 0x20d6a0)
    territoryGroup.add(coataMesh)

    const ilaveMesh = createBasinExtrusion("ilave", BASIN_POLYGONS.ilave, 0.30, 0x8b5cf6, 0x3b0764, 0xc084fc)
    territoryGroup.add(ilaveMesh)

    const createLakeMesh = (pts: [number, number][]) => {
      const shape = new THREE.Shape()
      pts.forEach(([x, y], idx) => {
        if (idx === 0) shape.moveTo(x, y)
        else shape.lineTo(x, y)
      })
      shape.closePath()

      const lakeGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.10,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.02,
        bevelThickness: 0.02
      })
      lakeGeo.rotateX(-Math.PI / 2)

      const lakeMat = new THREE.MeshStandardMaterial({
        color: 0x073f69,
        roughness: 0.20,
        metalness: 0.65,
        emissive: 0x052844,
        emissiveIntensity: 0.30
      })

      const mesh = new THREE.Mesh(lakeGeo, lakeMat)
      mesh.position.y = 0.02

      const lakeEdgeGeo = new THREE.EdgesGeometry(lakeGeo, 28)
      const lakeEdgeMat = new THREE.LineBasicMaterial({
        color: 0x20d7df,
        transparent: true,
        opacity: 0.6
      })
      mesh.add(new THREE.LineSegments(lakeEdgeGeo, lakeEdgeMat))
      return mesh
    }

    const lakeMayorMesh = createLakeMesh(BASIN_POLYGONS.titicaca)
    territoryGroup.add(lakeMayorMesh)

    const lakeMenorMesh = createLakeMesh(BASIN_POLYGONS.titicaca_menor)
    territoryGroup.add(lakeMenorMesh)

    const satGroup = new THREE.Group()
    satGroup.position.set(1.35, 2.05, 0.95)
    satGroup.rotation.z = -0.15
    scene.add(satGroup)

    const satBusGeo = new THREE.CylinderGeometry(0.20, 0.23, 0.42, 8)
    const satBusMat = new THREE.MeshStandardMaterial({
      color: 0xd6a461,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x7c4f1c,
      emissiveIntensity: 0.12
    })
    const satBus = new THREE.Mesh(satBusGeo, satBusMat)
    satGroup.add(satBus)

    const avionicsGeo = new THREE.BoxGeometry(0.36, 0.20, 0.36)
    const avionicsMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.75,
      roughness: 0.28
    })
    const avionics = new THREE.Mesh(avionicsGeo, avionicsMat)
    avionics.position.y = 0.14
    satGroup.add(avionics)

    const panelWingGeo = new THREE.BoxGeometry(1.20, 0.02, 0.42)
    const panelWingMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.18,
      metalness: 0.85,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35
    })

    const panelL = new THREE.Mesh(panelWingGeo, panelWingMat)
    panelL.position.set(-0.95, 0, 0)
    satGroup.add(panelL)

    const panelR = new THREE.Mesh(panelWingGeo, panelWingMat)
    panelR.position.set(0.95, 0, 0)
    satGroup.add(panelR)

    const strutMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
    const strutGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.34, 8)
    strutGeo.rotateZ(Math.PI / 2)
    const strutL = new THREE.Mesh(strutGeo, strutMat)
    strutL.position.set(-0.34, 0, 0)
    satGroup.add(strutL)
    const strutR = new THREE.Mesh(strutGeo, strutMat)
    strutR.position.set(0.34, 0, 0)
    satGroup.add(strutR)

    const dishGeo = new THREE.CylinderGeometry(0.20, 0.03, 0.12, 24)
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15
    })
    const dish = new THREE.Mesh(dishGeo, dishMat)
    dish.rotation.x = Math.PI / 3.4
    dish.position.set(0, -0.20, 0.14)
    satGroup.add(dish)

    const coneGeo = new THREE.ConeGeometry(1.75, 2.7, 48, 1, true)
    coneGeo.translate(0, -1.35, 0)
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x20d7df,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    const scanCone = new THREE.Mesh(coneGeo, coneMat)
    satGroup.add(scanCone)

    const scanGroundRingGeo = new THREE.RingGeometry(1.70, 1.76, 48)
    const scanGroundRingMat = new THREE.LineBasicMaterial({
      color: 0x20d7df,
      transparent: true,
      opacity: 0.65
    })
    const scanGroundRing = new THREE.LineSegments(new THREE.EdgesGeometry(scanGroundRingGeo), scanGroundRingMat)
    scanGroundRing.rotation.x = Math.PI / 2
    scanGroundRing.position.y = -2.7
    satGroup.add(scanGroundRing)

    const telemetryCount = 45
    const telemetryGeo = new THREE.BufferGeometry()
    const telemetryPositions = new Float32Array(telemetryCount * 3)
    for (let i = 0; i < telemetryCount; i++) {
      telemetryPositions[i * 3] = (Math.random() - 0.5) * 2.6
      telemetryPositions[i * 3 + 1] = Math.random() * 3.0
      telemetryPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.6
    }
    telemetryGeo.setAttribute("position", new THREE.BufferAttribute(telemetryPositions, 3))
    const telemetryMat = new THREE.PointsMaterial({
      color: 0x20d7df,
      size: 0.042,
      transparent: true,
      opacity: 0.75
    })
    const telemetryPoints = new THREE.Points(telemetryGeo, telemetryMat)
    scene.add(telemetryPoints)

    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      if (!isPaused && !reducedMotion) {
        orbitalRingGroup.rotation.y = elapsedTime * 0.05

        satGroup.position.y = 2.05 + Math.sin(elapsedTime * 0.8) * 0.08
        satGroup.position.x = 1.35 + Math.cos(elapsedTime * 0.4) * 0.16
        satGroup.position.z = 0.95 + Math.sin(elapsedTime * 0.35) * 0.10
        satGroup.rotation.y = Math.sin(elapsedTime * 0.28) * 0.1

        const conePulse = 0.16 + Math.sin(elapsedTime * 2.2) * 0.05
        coneMat.opacity = conePulse
        scanGroundRingMat.opacity = 0.45 + Math.sin(elapsedTime * 2.6) * 0.22

        const positions = telemetryGeo.attributes.position.array as Float32Array
        for (let i = 0; i < telemetryCount; i++) {
          positions[i * 3 + 1] += 0.015
          if (positions[i * 3 + 1] > 3.0) {
            positions[i * 3 + 1] = 0.1
            positions[i * 3] = (Math.random() - 0.5) * 2.4
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2.4
          }
        }
        telemetryGeo.attributes.position.needsUpdate = true
      }

      cameraDistance.current += (targetCameraDistance.current - cameraDistance.current) * 0.1
      camera.position.z = cameraDistance.current

      const targetX = targetRotation.current.x + pointerPos.current.y * 0.05
      const targetY = targetRotation.current.y + pointerPos.current.x * 0.08
      territoryGroup.rotation.x += (targetX - territoryGroup.rotation.x) * 0.08
      territoryGroup.rotation.y += (targetY - territoryGroup.rotation.y) * 0.08

      renderer?.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container || !renderer) return
      width = container.clientWidth
      height = container.clientHeight
      aspect = width / height
      camera.aspect = aspect
      const optimalDist = getOptimalDistance(aspect)
      targetCameraDistance.current = optimalDist
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top
      pointerPos.current.x = (clientX / rect.width) * 2 - 1
      pointerPos.current.y = -((clientY / rect.height) * 2 - 1)

      if (isDragging.current) {
        const deltaX = clientX - dragStart.current.x
        const deltaY = clientY - dragStart.current.y
        targetRotation.current.y = baseRotation.current.y + deltaX * 0.007
        targetRotation.current.x = Math.max(-0.15, Math.min(0.45, baseRotation.current.x + deltaY * 0.007))
      }
    }

    const handlePointerDown = (e: MouseEvent) => {
      isDragging.current = true
      dragStart.current = { x: e.clientX, y: e.clientY }
      baseRotation.current = { ...targetRotation.current }
    }

    const handlePointerUp = () => {
      isDragging.current = false
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomDelta = e.deltaY * 0.003
      const minDist = 4.8
      const maxDist = 9.8
      targetCameraDistance.current = Math.max(minDist, Math.min(maxDist, targetCameraDistance.current + zoomDelta))
    }

    window.addEventListener("resize", handleResize)
    container.addEventListener("mousemove", handlePointerMove)
    container.addEventListener("mousedown", handlePointerDown)
    window.addEventListener("mouseup", handlePointerUp)
    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      container.removeEventListener("mousemove", handlePointerMove)
      container.removeEventListener("mousedown", handlePointerDown)
      window.removeEventListener("mouseup", handlePointerUp)
      container.removeEventListener("wheel", handleWheel)

      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }
  }, [isPaused, reducedMotion])

  useEffect(() => {
    basinMeshes.current.forEach((data, id) => {
      const isSelected = id === activeBasin
      if (isSelected) {
        data.topMat.emissiveIntensity = 0.45
      } else {
        data.topMat.emissiveIntensity = 0.16
      }
      data.topMat.needsUpdate = true
    })
  }, [activeBasin])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative"
      }}
    >
      <div
        ref={mountRef}
        className="hero-visual-canvas"
        style={{
          cursor: "grab",
          userSelect: "none"
        }}
      />

      {!webGlSupported && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <svg viewBox="-2.2 -2.6 4.4 5.2" style={{ width: "90%", maxWidth: "440px", height: "auto" }}>
            <circle cx="0" cy="0" r="2.2" fill="none" stroke="rgba(32, 215, 223, 0.3)" strokeWidth="0.02" strokeDasharray="0.08 0.05" />
            <circle cx="0" cy="0" r="1.7" fill="none" stroke="rgba(32, 215, 223, 0.18)" strokeWidth="0.015" />

            <polygon
              points={BASIN_POLYGONS.ramis.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill={activeBasin === "ramis" ? "#0284C7" : "#0A3B66"}
              stroke="#20D7DF"
              strokeWidth="0.02"
              onClick={() => handleSelectBasin("ramis")}
              style={{ cursor: "pointer", transition: "fill 0.2s" }}
            />
            <polygon
              points={BASIN_POLYGONS.huancane.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill={activeBasin === "huancane" ? "#38BDF8" : "#0C4A6E"}
              stroke="#69DAD6"
              strokeWidth="0.02"
              onClick={() => handleSelectBasin("huancane")}
              style={{ cursor: "pointer", transition: "fill 0.2s" }}
            />
            <polygon
              points={BASIN_POLYGONS.coata.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill={activeBasin === "coata" ? "#10B981" : "#064E3B"}
              stroke="#20D6A0"
              strokeWidth="0.02"
              onClick={() => handleSelectBasin("coata")}
              style={{ cursor: "pointer", transition: "fill 0.2s" }}
            />
            <polygon
              points={BASIN_POLYGONS.ilave.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill={activeBasin === "ilave" ? "#8B5CF6" : "#3B0764"}
              stroke="#C084FC"
              strokeWidth="0.02"
              onClick={() => handleSelectBasin("ilave")}
              style={{ cursor: "pointer", transition: "fill 0.2s" }}
            />
            <polygon
              points={BASIN_POLYGONS.titicaca.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill="#073F69"
              stroke="#20D7DF"
              strokeWidth="0.02"
            />
            <polygon
              points={BASIN_POLYGONS.titicaca_menor.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill="#073F69"
              stroke="#20D7DF"
              strokeWidth="0.02"
            />
          </svg>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          display: "flex",
          gap: "8px",
          zIndex: 20
        }}
      >
        <button
          type="button"
          onClick={handleResetView}
          title="Restablecer ángulo"
          style={{
            padding: "5px 12px",
            borderRadius: "9999px",
            background: "rgba(16, 46, 67, 0.75)",
            border: "1px solid var(--color-border-discrete)",
            backdropFilter: "blur(10px)",
            color: "var(--color-text-secondary)",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          ↺ Vista
        </button>

        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? "Reanudar" : "Pausar"}
          style={{
            padding: "5px 12px",
            borderRadius: "9999px",
            background: "rgba(16, 46, 67, 0.75)",
            border: "1px solid var(--color-border-discrete)",
            backdropFilter: "blur(10px)",
            color: "var(--color-text-secondary)",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          {isPaused ? "▶" : "⏸"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginTop: "6px",
          zIndex: 20
        }}
      >
        <button
          type="button"
          onClick={() => handleSelectBasin("ramis")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "5px 12px",
            borderRadius: "9999px",
            background: activeBasin === "ramis" ? "rgba(32, 215, 223, 0.25)" : "rgba(16, 46, 67, 0.75)",
            border: activeBasin === "ramis" ? "1px solid var(--color-primary-cyan)" : "1px solid var(--color-border-discrete)",
            backdropFilter: "blur(12px)",
            color: "#F7FAFC",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--basin-ramis)" }} />
          Cuenca Ramis
        </button>

        <button
          type="button"
          onClick={() => handleSelectBasin("coata")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "5px 12px",
            borderRadius: "9999px",
            background: activeBasin === "coata" ? "rgba(32, 214, 160, 0.25)" : "rgba(16, 46, 67, 0.75)",
            border: activeBasin === "coata" ? "1px solid var(--color-status-positive)" : "1px solid var(--color-border-discrete)",
            backdropFilter: "blur(12px)",
            color: "#F7FAFC",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--basin-coata)" }} />
          Cuenca Coata
        </button>

        <button
          type="button"
          onClick={() => handleSelectBasin("ilave")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "5px 12px",
            borderRadius: "9999px",
            background: activeBasin === "ilave" ? "rgba(192, 132, 252, 0.25)" : "rgba(16, 46, 67, 0.75)",
            border: activeBasin === "ilave" ? "1px solid var(--basin-ilave)" : "1px solid var(--color-border-discrete)",
            backdropFilter: "blur(12px)",
            color: "#F7FAFC",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--basin-ilave)" }} />
          Cuenca Ilave
        </button>

        <button
          type="button"
          onClick={() => handleSelectBasin("huancane")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "5px 12px",
            borderRadius: "9999px",
            background: activeBasin === "huancane" ? "rgba(105, 218, 214, 0.25)" : "rgba(16, 46, 67, 0.75)",
            border: activeBasin === "huancane" ? "1px solid var(--color-secondary-turquoise)" : "1px solid var(--color-border-discrete)",
            backdropFilter: "blur(12px)",
            color: "#F7FAFC",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--basin-huancane)" }} />
          Cuenca Huancané
        </button>
      </div>
    </div>
  )
}
