import { useEffect, useRef, useState } from "react"
import createGlobe from "cobe"

interface Marker {
  location: [number, number]
  size: number
}

interface GlobeProps {
  className?: string
  markers?: Marker[]
}

const defaultMarkers: Marker[] = [
  { location: [38.72, -9.14], size: 0.1 },
  { location: [51.51, -0.13], size: 0.08 },
  { location: [52.52, 13.41], size: 0.08 },
  { location: [48.86, 2.35], size: 0.08 },
  { location: [40.42, -3.70], size: 0.08 },
  { location: [59.33, 18.07], size: 0.08 },
  { location: [60.17, 24.94], size: 0.08 },
  { location: [59.91, 10.75], size: 0.08 },
  { location: [40.71, -74.01], size: 0.08 },
  { location: [35.68, 139.69], size: 0.08 },
  { location: [1.35, 103.82], size: 0.08 },
  { location: [-33.87, 151.21], size: 0.08 },
  { location: [25.20, 55.27], size: 0.08 },
  { location: [-23.55, -46.63], size: 0.08 },
]

export function Globe({
  className = "",
  markers = defaultMarkers,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState(300)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const animationRef = useRef<number>(0)
  const phiRef = useRef(0)
  const r = useRef(0)
  const pointerInteracting = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newSize = Math.floor(entry.contentRect.width)
        if (newSize > 0) {
          setSize(newSize)
        }
      }
    })

    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (size < 50) return

    const canvas = canvasRef.current
    if (!canvas || globeRef.current) return

    const globe = createGlobe(canvas, {
      width: size,
      height: size,
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [0.55, 0.15, 0.52],
      glowColor: [1, 1, 1],
      markers: markers,
    })

    globeRef.current = globe

    const animate = () => {
      if (!pointerInteracting.current) phiRef.current += 0.005
      globe.update({
        phi: phiRef.current + r.current,
        theta: 0.3,
        width: size,
        height: size,
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    requestAnimationFrame(() => {
      if (canvas) canvas.style.opacity = "1"
    })

    return () => {
      cancelAnimationFrame(animationRef.current)
      globe.destroy()
      globeRef.current = null
    }
  }, [size, markers])

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
  }

  const handlePointerUp = () => {
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current
      r.current = r.current + delta / 1400
    }
  }

  return (
    <div className={`relative w-full aspect-square ${className}`} style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{
          width: '100%',
          height: '100%',
          opacity: 0,
          transition: 'opacity 0.5s',
          cursor: 'grab',
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
      />
    </div>
  )
}