import "@testing-library/jest-dom"

if (typeof window !== "undefined") {
  const mockContext = {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: new Array(4) }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {}
  }

  HTMLCanvasElement.prototype.getContext = ((type: string) => {
    if (type === "2d") return mockContext
    return null
  }) as any

  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    } as any
  }
}
