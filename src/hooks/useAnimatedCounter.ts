import { useState, useEffect, useRef, useCallback } from 'react'

export function useAnimatedCounter(
  target: number,
  suffix: string = '',
  duration: number = 2000,
  startDelay: number = 0
) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  const rafId = useRef<number>(0)

  const startAnimation = useCallback(() => {
    if (started.current) return
    started.current = true

    const startTime = performance.now() + startDelay

    function animate(currentTime: number) {
      if (currentTime < startTime) {
        rafId.current = requestAnimationFrame(animate)
        return
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(eased * target)

      setValue(currentValue)

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate)
      } else {
        setValue(target)
      }
    }

    rafId.current = requestAnimationFrame(animate)
  }, [target, duration, startDelay])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return { value, suffix, startAnimation }
}
