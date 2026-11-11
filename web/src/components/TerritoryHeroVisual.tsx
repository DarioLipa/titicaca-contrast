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
  const baseRotation = useRef<{ x: number; y: number }>({ x: 0.12, y: -0.08 })
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.12, y: -0.08 })
  const pointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const cameraDistance = useRef<number>(7.6)
  const targetCameraDistance = useRef<number>(7.6)
  const resetTrigger = useRef<number>(0)

  const basinMeshes = useRef<Map<string, { mesh: THREE.Mesh; topMat: THREE.MeshStandardMaterial }>>(new Map())

  const handleResetView = useCallback(() => {
    targetRotation.current = { x: 0.12, y: -0.08 }
    targetCameraDistance.current = 7.6
    resetTrigger.current += 1
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

    let width = container.clientWidth || 580
    let height = container.clientHeight || 520

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000)
    camera.position.set(0, 5.6, cameraDistance.current)
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
      renderer.toneMappingExposure = 1.15
      container.appendChild(renderer.domElement)
    } catch {
      setWebGlSupported(false)
      return
    }

    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.25)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xf8fafc, 2.6)
    mainLight.position.set(6, 11, 5)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x23d7e5, 1.4)
    fillLight.position.set(-6, 5, -4)
    scene.add(fillLight)

    const backRimLight = new THREE.DirectionalLight(0xdca86f, 0.9)
    backRimLight.position.set(0, 2, -7)
    scene.add(backRimLight)

    const territoryGroup = new THREE.Group()
    territoryGroup.rotation.x = baseRotation.current.x
    territoryGroup.rotation.y = baseRotation.current.y
    scene.add(territoryGroup)

    const orbitalRingGroup = new THREE.Group()
    orbitalRingGroup.position.y = -0.06
    territoryGroup.add(orbitalRingGroup)

    const primaryRingGeo = new THREE.RingGeometry(3.18, 3.22, 96)
    const primaryRingMat = new THREE.MeshBasicMaterial({
      color: 0x23d7e5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    })
    const primaryRingMesh = new THREE.Mesh(primaryRingGeo, primaryRingMat)
    primaryRingMesh.rotation.x = Math.PI / 2
    orbitalRingGroup.add(primaryRingMesh)

    const innerRingGeo = new THREE.RingGeometry(2.55, 2.58, 64)
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x70dcd8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28
    })
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat)
    innerRingMesh.rotation.x = Math.PI / 2
    orbitalRingGroup.add(innerRingMesh)

    const outerRingGeo = new THREE.RingGeometry(3.68, 3.7, 64)
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18
    })
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat)
    outerRingMesh.rotation.x = Math.PI / 2
    orbitalRingGroup.add(outerRingMesh)

    const tickMat = new THREE.LineBasicMaterial({ color: 0x23d7e5, transparent: true, opacity: 0.5 })
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2
      const isMajor = i % 6 === 0
      const r1 = isMajor ? 3.08 : 3.14
      const r2 = isMajor ? 3.32 : 3.26
      const tickGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(angle) * r1, 0, Math.sin(angle) * r1),
        new THREE.Vector3(Math.cos(angle) * r2, 0, Math.sin(angle) * r2)
      ])
      orbitalRingGroup.add(new THREE.Line(tickGeo, tickMat))
    }

    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x23d7e5 })
    const nodeGeo = new THREE.SphereGeometry(0.04, 12, 12)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.position.set(Math.cos(angle) * 3.2, 0, Math.sin(angle) * 3.2)
      orbitalRingGroup.add(node)
    }

    const gridHelper = new THREE.GridHelper(6.6, 22, 0x0e4a6f, 0x061c30)
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

    const ramisMesh = createBasinExtrusion("ramis", BASIN_POLYGONS.ramis, 0.38, 0x0284c7, 0x073b64, 0x23d7e5)
    territoryGroup.add(ramisMesh)

    const huancaneMesh = createBasinExtrusion("huancane", BASIN_POLYGONS.huancane, 0.32, 0x38bdf8, 0x0c4a6e, 0x70dcd8)
    territoryGroup.add(huancaneMesh)

    const coataMesh = createBasinExtrusion("coata", BASIN_POLYGONS.coata, 0.34, 0x10b981, 0x064e3b, 0x20d8a1)
    territoryGroup.add(coataMesh)

    const ilaveMesh = createBasinExtrusion("ilave", BASIN_POLYGONS.ilave, 0.28, 0x8b5cf6, 0x3b0764, 0xc084fc)
    territoryGroup.add(ilaveMesh)

    const lakeShape = new THREE.Shape()
    BASIN_POLYGONS.titicaca.forEach(([x, y], idx) => {
      if (idx === 0) lakeShape.moveTo(x, y)
      else lakeShape.lineTo(x, y)
    })
    lakeShape.closePath()

    const lakeGeo = new THREE.ExtrudeGeometry(lakeShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02
    })
    lakeGeo.rotateX(-Math.PI / 2)

    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.12,
      metalness: 0.88,
      emissive: 0x0b3b64,
      emissiveIntensity: 0.35
    })
    const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat)
    lakeMesh.position.y = 0.04
    territoryGroup.add(lakeMesh)

    const lakeEdgeGeo = new THREE.EdgesGeometry(lakeGeo, 25)
    const lakeEdgeMat = new THREE.LineBasicMaterial({
      color: 0x23d7e5,
      transparent: true,
      opacity: 0.55
    })
    lakeMesh.add(new THREE.LineSegments(lakeEdgeGeo, lakeEdgeMat))

    const satGroup = new THREE.Group()
    satGroup.position.set(1.5, 3.3, 0.8)
    satGroup.rotation.z = -0.15
    scene.add(satGroup)

    const satBusGeo = new THREE.BoxGeometry(0.38, 0.42, 0.46)
    const satBusMat = new THREE.MeshStandardMaterial({
      color: 0xdca86f,
      metalness: 0.85,
      roughness: 0.22,
      emissive: 0x7c4f1c,
      emissiveIntensity: 0.12
    })
    const satBus = new THREE.Mesh(satBusGeo, satBusMat)
    satGroup.add(satBus)

    const avionicsGeo = new THREE.BoxGeometry(0.39, 0.24, 0.47)
    const avionicsMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.75,
      roughness: 0.28
    })
    const avionics = new THREE.Mesh(avionicsGeo, avionicsMat)
    avionics.position.y = 0.12
    satGroup.add(avionics)

    const panelWingGeo = new THREE.BoxGeometry(1.35, 0.025, 0.48)
    const panelWingMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.18,
      metalness: 0.85,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35
    })

    const panelL = new THREE.Mesh(panelWingGeo, panelWingMat)
    panelL.position.set(-1.05, 0, 0)
    satGroup.add(panelL)

    const panelR = new THREE.Mesh(panelWingGeo, panelWingMat)
    panelR.position.set(1.05, 0, 0)
    satGroup.add(panelR)

    const strutMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
    const strutGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.38, 8)
    strutGeo.rotateZ(Math.PI / 2)
    const strutL = new THREE.Mesh(strutGeo, strutMat)
    strutL.position.set(-0.35, 0, 0)
    satGroup.add(strutL)
    const strutR = new THREE.Mesh(strutGeo, strutMat)
    strutR.position.set(0.35, 0, 0)
    satGroup.add(strutR)

    const dishGeo = new THREE.CylinderGeometry(0.2, 0.03, 0.14, 24)
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15
    })
    const dish = new THREE.Mesh(dishGeo, dishMat)
    dish.rotation.x = Math.PI / 3.5
    dish.position.set(0, -0.22, 0.16)
    satGroup.add(dish)

    const coneGeo = new THREE.ConeGeometry(2.1, 3.6, 48, 1, true)
    coneGeo.translate(0, -1.8, 0)
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x23d7e5,
      transparent: true,
      opacity: 0.17,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    const scanCone = new THREE.Mesh(coneGeo, coneMat)
    satGroup.add(scanCone)

    const scanGroundRingGeo = new THREE.RingGeometry(2.0, 2.08, 48)
    const scanGroundRingMat = new THREE.LineBasicMaterial({
      color: 0x23d7e5,
      transparent: true,
      opacity: 0.65
    })
    const scanGroundRing = new THREE.LineSegments(new THREE.EdgesGeometry(scanGroundRingGeo), scanGroundRingMat)
    scanGroundRing.rotation.x = Math.PI / 2
    scanGroundRing.position.y = -3.6
    satGroup.add(scanGroundRing)

    const telemetryCount = 55
    const telemetryGeo = new THREE.BufferGeometry()
    const telemetryPositions = new Float32Array(telemetryCount * 3)
    for (let i = 0; i < telemetryCount; i++) {
      telemetryPositions[i * 3] = (Math.random() - 0.5) * 2.8
      telemetryPositions[i * 3 + 1] = Math.random() * 3.2
      telemetryPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.8
    }
    telemetryGeo.setAttribute("position", new THREE.BufferAttribute(telemetryPositions, 3))
    const telemetryMat = new THREE.PointsMaterial({
      color: 0x23d7e5,
      size: 0.045,
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
        orbitalRingGroup.rotation.y = elapsedTime * 0.07

        satGroup.position.y = 3.3 + Math.sin(elapsedTime * 0.85) * 0.14
        satGroup.position.x = 1.5 + Math.cos(elapsedTime * 0.42) * 0.28
        satGroup.position.z = 0.8 + Math.sin(elapsedTime * 0.35) * 0.18
        satGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.12

        const conePulse = 0.15 + Math.sin(elapsedTime * 2.5) * 0.05
        coneMat.opacity = conePulse
        scanGroundRingMat.opacity = 0.45 + Math.sin(elapsedTime * 3) * 0.25

        const positions = telemetryGeo.attributes.position.array as Float32Array
        for (let i = 0; i < telemetryCount; i++) {
          positions[i * 3 + 1] += 0.016
          if (positions[i * 3 + 1] > 3.4) {
            positions[i * 3 + 1] = 0.1
            positions[i * 3] = (Math.random() - 0.5) * 2.6
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2.6
          }
        }
        telemetryGeo.attributes.position.needsUpdate = true
      }

      cameraDistance.current += (targetCameraDistance.current - cameraDistance.current) * 0.1
      camera.position.z = cameraDistance.current

      const targetX = targetRotation.current.x + pointerPos.current.y * 0.08
      const targetY = targetRotation.current.y + pointerPos.current.x * 0.12
      territoryGroup.rotation.x += (targetX - territoryGroup.rotation.x) * 0.08
      territoryGroup.rotation.y += (targetY - territoryGroup.rotation.y) * 0.08

      renderer?.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container || !renderer) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
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
        targetRotation.current.y = baseRotation.current.y + deltaX * 0.008
        targetRotation.current.x = Math.max(-0.35, Math.min(0.55, baseRotation.current.x + deltaY * 0.008))
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || !container) return
      isDragging.current = true
      const rect = container.getBoundingClientRect()
      dragStart.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      baseRotation.current = { ...targetRotation.current }
      container.style.cursor = "grabbing"
    }

    const handleMouseUp = () => {
      isDragging.current = false
      if (container) container.style.cursor = "grab"
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetCameraDistance.current = Math.max(5.6, Math.min(10.2, targetCameraDistance.current + e.deltaY * 0.004))
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !container) return
      isDragging.current = true
      const rect = container.getBoundingClientRect()
      dragStart.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
      baseRotation.current = { ...targetRotation.current }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1 || !container) return
      const rect = container.getBoundingClientRect()
      const clientX = e.touches[0].clientX - rect.left
      const clientY = e.touches[0].clientY - rect.top
      const deltaX = clientX - dragStart.current.x
      const deltaY = clientY - dragStart.current.y
      targetRotation.current.y = baseRotation.current.y + deltaX * 0.01
      targetRotation.current.x = Math.max(-0.35, Math.min(0.55, baseRotation.current.x + deltaY * 0.01))
    }

    const handleTouchEnd = () => {
      isDragging.current = false
    }

    window.addEventListener("resize", handleResize)
    container.addEventListener("mousemove", handlePointerMove)
    container.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      container?.removeEventListener("mousemove", handlePointerMove)
      container?.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      container?.removeEventListener("wheel", handleWheel)
      container?.removeEventListener("touchstart", handleTouchStart)
      container?.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)

      basinMeshes.current.clear()
      if (renderer && renderer.domElement) {
        container?.removeChild(renderer.domElement)
        renderer.dispose()
      }
    }
  }, [isPaused, reducedMotion])

  useEffect(() => {
    basinMeshes.current.forEach((val, id) => {
      if (id === activeBasin) {
        val.topMat.emissiveIntensity = 0.52
      } else {
        val.topMat.emissiveIntensity = 0.16
      }
    })
  }, [activeBasin])

  return (
    <div className="hero-visual-wrapper">
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "540px",
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
            padding: "20px",
            background: "radial-gradient(circle at 50% 50%, rgba(11, 43, 64, 0.4) 0%, transparent 70%)"
          }}
        >
          <svg viewBox="-2.5 -2.5 5 5" style={{ width: "90%", maxWidth: "460px", height: "auto" }}>
            <circle cx="0" cy="0" r="2.1" fill="none" stroke="rgba(35, 215, 229, 0.3)" strokeWidth="0.02" strokeDasharray="0.08 0.05" />
            <circle cx="0" cy="0" r="1.6" fill="none" stroke="rgba(35, 215, 229, 0.18)" strokeWidth="0.015" />

            <polygon
              points={BASIN_POLYGONS.ramis.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill={activeBasin === "ramis" ? "#0284C7" : "#0A3B66"}
              stroke="#23D7E5"
              strokeWidth="0.02"
              onClick={() => handleSelectBasin("ramis")}
              style={{ cursor: "pointer", transition: "fill 0.2s" }}
            />
            <polygon
              points={BASIN_POLYGONS.huancane.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill={activeBasin === "huancane" ? "#38BDF8" : "#0C4A6E"}
              stroke="#70DCD8"
              strokeWidth="0.02"
              onClick={() => handleSelectBasin("huancane")}
              style={{ cursor: "pointer", transition: "fill 0.2s" }}
            />
            <polygon
              points={BASIN_POLYGONS.coata.map(([x, y]) => `${x},${-y}`).join(" ")}
              fill={activeBasin === "coata" ? "#10B981" : "#064E3B"}
              stroke="#20D8A1"
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
              fill="#0369A1"
              stroke="#23D7E5"
              strokeWidth="0.025"
            />
          </svg>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          display: "flex",
          gap: "8px",
          zIndex: 20
        }}
      >
        <button
          type="button"
          onClick={handleResetView}
          title="Restablecer ángulo de vista"
          style={{
            padding: "5px 12px",
            borderRadius: "9999px",
            background: "rgba(11, 43, 64, 0.75)",
            border: "1px solid rgba(35, 215, 229, 0.25)",
            backdropFilter: "blur(10px)",
            color: "var(--color-text-hero-secondary, #BCD0DC)",
            fontSize: "0.72rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          ↺ Vista
        </button>

        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? "Reanudar animación" : "Pausar animación"}
          style={{
            padding: "5px 12px",
            borderRadius: "9999px",
            background: "rgba(11, 43, 64, 0.75)",
            border: "1px solid rgba(35, 215, 229, 0.25)",
            backdropFilter: "blur(10px)",
            color: "var(--color-text-hero-secondary, #BCD0DC)",
            fontSize: "0.72rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          {isPaused ? "▶ Reanudar" : "⏸ Pausa"}
        </button>
      </div>

      <div className="hero-basin-controls">
        <button
          type="button"
          onClick={() => handleSelectBasin("ramis")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "9999px",
            background: activeBasin === "ramis" ? "rgba(2, 132, 199, 0.35)" : "rgba(11, 43, 64, 0.75)",
            border: activeBasin === "ramis" ? "1px solid #23D7E5" : "1px solid rgba(35, 215, 229, 0.25)",
            backdropFilter: "blur(12px)",
            color: "#F7FAFC",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: activeBasin === "ramis" ? "0 0 16px rgba(35, 215, 229, 0.45)" : "none",
            transition: "all 0.18s ease"
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#0284C7", boxShadow: "0 0 6px #23D7E5" }} />
          Cuenca Ramis
        </button>

        <button
          type="button"
          onClick={() => handleSelectBasin("coata")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "9999px",
            background: activeBasin === "coata" ? "rgba(16, 185, 129, 0.35)" : "rgba(11, 43, 64, 0.75)",
            border: activeBasin === "coata" ? "1px solid #20D8A1" : "1px solid rgba(35, 215, 229, 0.25)",
            backdropFilter: "blur(12px)",
            color: "#F7FAFC",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: activeBasin === "coata" ? "0 0 16px rgba(32, 216, 161, 0.45)" : "none",
            transition: "all 0.18s ease"
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 6px #20D8A1" }} />
          Cuenca Coata
        </button>

        <button
          type="button"
          onClick={() => handleSelectBasin("ilave")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "9999px",
            background: activeBasin === "ilave" ? "rgba(139, 92, 246, 0.35)" : "rgba(11, 43, 64, 0.75)",
            border: activeBasin === "ilave" ? "1px solid #C084FC" : "1px solid rgba(35, 215, 229, 0.25)",
            backdropFilter: "blur(12px)",
            color: "#F7FAFC",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: activeBasin === "ilave" ? "0 0 16px rgba(192, 132, 252, 0.45)" : "none",
            transition: "all 0.18s ease"
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#8B5CF6", boxShadow: "0 0 6px #C084FC" }} />
          Cuenca Ilave
        </button>

        <button
          type="button"
          onClick={() => handleSelectBasin("huancane")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "9999px",
            background: activeBasin === "huancane" ? "rgba(56, 189, 248, 0.35)" : "rgba(11, 43, 64, 0.75)",
            border: activeBasin === "huancane" ? "1px solid #70DCD8" : "1px solid rgba(35, 215, 229, 0.25)",
            backdropFilter: "blur(12px)",
            color: "#F7FAFC",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: activeBasin === "huancane" ? "0 0 16px rgba(112, 220, 216, 0.45)" : "none",
            transition: "all 0.18s ease"
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#38BDF8", boxShadow: "0 0 6px #70DCD8" }} />
          Cuenca Huancané
        </button>
      </div>

      <div className="hero-hud-panel">
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            background: "rgba(11, 43, 64, 0.8)",
            border: "1px solid rgba(35, 215, 229, 0.3)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 10px 30px rgba(6, 24, 39, 0.7)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(35, 215, 229, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#23D7E5"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#23D7E5", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Monitoreo satelital
              </span>
            </div>
          </div>
          <strong style={{ fontSize: "0.88rem", color: "#F7FAFC", display: "block", marginTop: "2px" }}>
            NASA IMERG V07
          </strong>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#20D8A1", boxShadow: "0 0 6px #20D8A1" }} />
            <span style={{ fontSize: "0.72rem", color: "#BCD0DC" }}>
              Actualización mensual
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            background: "rgba(11, 43, 64, 0.8)",
            border: "1px solid rgba(35, 215, 229, 0.3)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 10px 30px rgba(6, 24, 39, 0.7)"
          }}
        >
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#BCD0DC", display: "block", marginBottom: "6px" }}>
            Precipitación (tendencia)
          </span>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "32px", marginBottom: "6px" }}>
            {[14, 18, 16, 22, 20, 25, 23, 28].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}px`,
                  borderRadius: "2px 2px 0 0",
                  background: i >= 5 ? "linear-gradient(to top, #0284C7, #23D7E5)" : "linear-gradient(to top, #0C4A6E, #0284C7)",
                  boxShadow: i >= 5 ? "0 0 8px rgba(35, 215, 229, 0.4)" : "none"
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "#23D7E5", fontWeight: 700 }}>
              -8.2 mm/año promedio
            </span>
            <span style={{ fontSize: "0.66rem", color: "#94A3B8" }}>
              2000-2024
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px"
          }}
        >
          <div
            style={{
              padding: "10px 10px",
              borderRadius: "10px",
              background: "rgba(11, 43, 64, 0.8)",
              border: "1px solid rgba(35, 215, 229, 0.25)",
              backdropFilter: "blur(16px)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#70DCD8" strokeWidth="2.2">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
              <strong style={{ fontSize: "0.78rem", color: "#F7FAFC" }}>Altiplano</strong>
            </div>
            <span style={{ fontSize: "0.66rem", color: "#BCD0DC", display: "block" }}>Cuencas Titicaca</span>
          </div>

          <div
            style={{
              padding: "10px 10px",
              borderRadius: "10px",
              background: "rgba(11, 43, 64, 0.8)",
              border: "1px solid rgba(35, 215, 229, 0.25)",
              backdropFilter: "blur(16px)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#23D7E5" strokeWidth="2.2">
                <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
              </svg>
              <strong style={{ fontSize: "0.78rem", color: "#23D7E5" }}>Contrastes</strong>
            </div>
            <span style={{ fontSize: "0.66rem", color: "#BCD0DC", display: "block" }}>Territorio + evidencia</span>
          </div>
        </div>
      </div>
    </div>
  )
}
