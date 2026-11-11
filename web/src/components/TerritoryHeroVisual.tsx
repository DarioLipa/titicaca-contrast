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

  const baseFittedDistance = useRef<number>(12.5)
  const cameraDistance = useRef<number>(12.5)
  const targetCameraDistance = useRef<number>(12.5)
  const minCameraDistance = useRef<number>(10.0)
  const maxCameraDistance = useRef<number>(16.0)

  const basinMeshes = useRef<Map<string, { mesh: THREE.Mesh; topMat: THREE.MeshStandardMaterial }>>(new Map())

  const handleResetView = useCallback(() => {
    targetRotation.current = { x: 0.16, y: -0.08 }
    targetCameraDistance.current = baseFittedDistance.current
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
    const canvasTest = document.createElement("canvas")
    const gl = canvasTest.getContext("webgl") || canvasTest.getContext("experimental-webgl")
    if (!gl) {
      setWebGlSupported(false)
      return
    }

    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth || 640
    let height = container.clientHeight || 560
    let aspect = width / height

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 1000)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      })
      renderer.setClearColor(0x000000, 0)
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.15
      container.appendChild(renderer.domElement)
    } catch {
      setWebGlSupported(false)
      return
    }

    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.35)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xf8fafc, 2.5)
    mainLight.position.set(5.0, 9.0, 5.0)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x20d7df, 1.4)
    fillLight.position.set(-5.0, 4.0, -3.0)
    scene.add(fillLight)

    const backRimLight = new THREE.DirectionalLight(0xd6a461, 0.9)
    backRimLight.position.set(0, 2.0, -6.0)
    scene.add(backRimLight)

    const territoryGroup = new THREE.Group()
    territoryGroup.rotation.x = baseRotation.current.x
    territoryGroup.rotation.y = baseRotation.current.y
    scene.add(territoryGroup)

    const orbitalRingGroup = new THREE.Group()
    orbitalRingGroup.position.y = -0.06
    territoryGroup.add(orbitalRingGroup)

    const primaryRingGeo = new THREE.RingGeometry(2.82, 2.86, 96)
    const primaryRingMat = new THREE.MeshBasicMaterial({
      color: 0x20d7df,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    })
    const primaryRingMesh = new THREE.Mesh(primaryRingGeo, primaryRingMat)
    primaryRingMesh.rotation.x = Math.PI / 2
    orbitalRingGroup.add(primaryRingMesh)

    const innerRingGeo = new THREE.RingGeometry(2.36, 2.39, 64)
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x69dad6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22
    })
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat)
    innerRingMesh.rotation.x = Math.PI / 2
    orbitalRingGroup.add(innerRingMesh)

    const tickMat = new THREE.LineBasicMaterial({ color: 0x20d7df, transparent: true, opacity: 0.55 })
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2
      const isMajor = i % 6 === 0
      const r1 = isMajor ? 2.76 : 2.80
      const r2 = isMajor ? 2.92 : 2.88
      const tickGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(angle) * r1, 0, Math.sin(angle) * r1),
        new THREE.Vector3(Math.cos(angle) * r2, 0, Math.sin(angle) * r2)
      ])
      orbitalRingGroup.add(new THREE.Line(tickGeo, tickMat))
    }

    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x20d7df })
    const nodeGeo = new THREE.SphereGeometry(0.04, 12, 12)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.position.set(Math.cos(angle) * 2.84, 0, Math.sin(angle) * 2.84)
      orbitalRingGroup.add(node)
    }

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
    satGroup.position.set(0.90, 1.90, 0.85)
    satGroup.rotation.z = -0.15
    scene.add(satGroup)

    const satBusGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.28, 8)
    const satBusMat = new THREE.MeshStandardMaterial({
      color: 0xd6a461,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x7c4f1c,
      emissiveIntensity: 0.12
    })
    const satBus = new THREE.Mesh(satBusGeo, satBusMat)
    satGroup.add(satBus)

    const avionicsGeo = new THREE.BoxGeometry(0.24, 0.14, 0.24)
    const avionicsMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.75,
      roughness: 0.28
    })
    const avionics = new THREE.Mesh(avionicsGeo, avionicsMat)
    avionics.position.y = 0.10
    satGroup.add(avionics)

    const panelWingGeo = new THREE.BoxGeometry(0.75, 0.016, 0.26)
    const panelWingMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.18,
      metalness: 0.85,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35
    })

    const panelL = new THREE.Mesh(panelWingGeo, panelWingMat)
    panelL.position.set(-0.58, 0, 0)
    satGroup.add(panelL)

    const panelR = new THREE.Mesh(panelWingGeo, panelWingMat)
    panelR.position.set(0.58, 0, 0)
    satGroup.add(panelR)

    const strutMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
    const strutGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8)
    strutGeo.rotateZ(Math.PI / 2)
    const strutL = new THREE.Mesh(strutGeo, strutMat)
    strutL.position.set(-0.21, 0, 0)
    satGroup.add(strutL)
    const strutR = new THREE.Mesh(strutGeo, strutMat)
    strutR.position.set(0.21, 0, 0)
    satGroup.add(strutR)

    const dishGeo = new THREE.CylinderGeometry(0.14, 0.02, 0.08, 20)
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15
    })
    const dish = new THREE.Mesh(dishGeo, dishMat)
    dish.rotation.x = Math.PI / 3.4
    dish.position.set(0, -0.15, 0.10)
    satGroup.add(dish)

    const coneGeo = new THREE.ConeGeometry(1.40, 2.2, 36, 1, true)
    coneGeo.translate(0, -1.10, 0)
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x20d7df,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    const scanCone = new THREE.Mesh(coneGeo, coneMat)
    satGroup.add(scanCone)

    const scanGroundRingGeo = new THREE.RingGeometry(1.36, 1.42, 36)
    const scanGroundRingMat = new THREE.LineBasicMaterial({
      color: 0x20d7df,
      transparent: true,
      opacity: 0.65
    })
    const scanGroundRing = new THREE.LineSegments(new THREE.EdgesGeometry(scanGroundRingGeo), scanGroundRingMat)
    scanGroundRing.rotation.x = Math.PI / 2
    scanGroundRing.position.y = -2.2
    satGroup.add(scanGroundRing)

    const telemetryCount = 35
    const telemetryGeo = new THREE.BufferGeometry()
    const telemetryPositions = new Float32Array(telemetryCount * 3)
    for (let i = 0; i < telemetryCount; i++) {
      telemetryPositions[i * 3] = (Math.random() - 0.5) * 2.2
      telemetryPositions[i * 3 + 1] = Math.random() * 2.4
      telemetryPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.2
    }
    telemetryGeo.setAttribute("position", new THREE.BufferAttribute(telemetryPositions, 3))
    const telemetryMat = new THREE.PointsMaterial({
      color: 0x20d7df,
      size: 0.038,
      transparent: true,
      opacity: 0.70
    })
    const telemetryPoints = new THREE.Points(telemetryGeo, telemetryMat)
    scene.add(telemetryPoints)

    const fitCameraToScene = (cam: THREE.PerspectiveCamera, asp: number) => {
      const projWidth = 5.76
      const projHeight = 3.72

      const vFovRad = (cam.fov * Math.PI) / 180
      const tanHalf = Math.tan(vFovRad / 2)

      const distForW = projWidth / (2 * tanHalf * Math.max(asp, 0.45) * 0.80)
      const distForH = projHeight / (2 * tanHalf * 0.78)
      const targetDist = Math.max(distForW, distForH)

      return {
        target: new THREE.Vector3(0, 0.45, 0),
        distance: targetDist,
        minDistance: targetDist * 0.82,
        maxDistance: targetDist * 1.25
      }
    }

    const fit = fitCameraToScene(camera, aspect)
    baseFittedDistance.current = fit.distance
    cameraDistance.current = fit.distance
    targetCameraDistance.current = fit.distance
    minCameraDistance.current = fit.minDistance
    maxCameraDistance.current = fit.maxDistance

    const elevationAngle = Math.PI * 0.166
    camera.position.set(
      fit.target.x,
      fit.target.y + fit.distance * Math.sin(elevationAngle),
      fit.target.z + fit.distance * Math.cos(elevationAngle)
    )
    camera.lookAt(fit.target)

    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      if (!isPaused && !reducedMotion) {
        orbitalRingGroup.rotation.y = elapsedTime * 0.04

        satGroup.position.y = 1.90 + Math.sin(elapsedTime * 0.6) * 0.06
        satGroup.position.x = 0.90 + Math.cos(elapsedTime * 0.3) * 0.10
        satGroup.position.z = 0.85 + Math.sin(elapsedTime * 0.25) * 0.08
        satGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.06

        const conePulse = 0.15 + Math.sin(elapsedTime * 2.0) * 0.04
        coneMat.opacity = conePulse
        scanGroundRingMat.opacity = 0.40 + Math.sin(elapsedTime * 2.4) * 0.20

        const positions = telemetryGeo.attributes.position.array as Float32Array
        for (let i = 0; i < telemetryCount; i++) {
          positions[i * 3 + 1] += 0.012
          if (positions[i * 3 + 1] > 2.4) {
            positions[i * 3 + 1] = 0.08
            positions[i * 3] = (Math.random() - 0.5) * 2.0
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0
          }
        }
        telemetryGeo.attributes.position.needsUpdate = true
      }

      cameraDistance.current += (targetCameraDistance.current - cameraDistance.current) * 0.1
      camera.position.set(
        fit.target.x,
        fit.target.y + cameraDistance.current * Math.sin(elevationAngle),
        fit.target.z + cameraDistance.current * Math.cos(elevationAngle)
      )
      camera.lookAt(fit.target)

      const targetX = targetRotation.current.x + pointerPos.current.y * 0.03
      const targetY = targetRotation.current.y + pointerPos.current.x * 0.05
      territoryGroup.rotation.x += (targetX - territoryGroup.rotation.x) * 0.08
      territoryGroup.rotation.y += (targetY - territoryGroup.rotation.y) * 0.08

      renderer?.render(scene, camera)
    }

    animate()

    const updateDimensions = (newWidth: number, newHeight: number) => {
      if (!renderer || newWidth <= 0 || newHeight <= 0) return
      width = newWidth
      height = newHeight
      aspect = width / height
      camera.aspect = aspect

      const newFit = fitCameraToScene(camera, aspect)
      baseFittedDistance.current = newFit.distance
      minCameraDistance.current = newFit.minDistance
      maxCameraDistance.current = newFit.maxDistance
      targetCameraDistance.current = newFit.distance

      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect
        if (w > 0 && h > 0) {
          updateDimensions(w, h)
        }
      }
    })
    resizeObserver.observe(container)

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
        targetRotation.current.y = Math.max(-0.45, Math.min(0.45, baseRotation.current.y + deltaX * 0.005))
        targetRotation.current.x = Math.max(0.04, Math.min(0.32, baseRotation.current.x + deltaY * 0.005))
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
      const zoomDelta = e.deltaY * 0.004
      targetCameraDistance.current = Math.max(
        minCameraDistance.current,
        Math.min(maxCameraDistance.current, targetCameraDistance.current + zoomDelta)
      )
    }

    container.addEventListener("mousemove", handlePointerMove)
    container.addEventListener("mousedown", handlePointerDown)
    window.addEventListener("mouseup", handlePointerUp)
    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
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
            <circle cx="0" cy="0" r="2.0" fill="none" stroke="rgba(32, 215, 223, 0.3)" strokeWidth="0.02" strokeDasharray="0.08 0.05" />
            <circle cx="0" cy="0" r="1.6" fill="none" stroke="rgba(32, 215, 223, 0.18)" strokeWidth="0.015" />

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
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginTop: "10px",
          zIndex: 10
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

      <div
        className="hero-visual-toolbar"
        role="toolbar"
        aria-label="Opciones de visualización"
      >
        <button
          type="button"
          onClick={handleResetView}
          className="visual-tool-btn"
          aria-label="Restablecer encuadre geográfico inicial"
        >
          ↺ Restablecer vista
        </button>

        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="visual-tool-btn"
          aria-label={isPaused ? "Reanudar animación orbital" : "Pausar animación orbital"}
        >
          {isPaused ? "▶ Reanudar animación" : "⏸ Pausar animación"}
        </button>
      </div>
    </div>
  )
}
