import { useEffect } from 'react'
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

function formatNumber(n: number, target: number): string {
  if (target >= 10000000) {
    const millions = n / 1000000
    return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M`
  }
  if (target >= 1000) {
    return n.toLocaleString()
  }
  return String(n)
}

interface Props {
  target: number
  suffix: string
  delay?: number
}

export function AnimatedCounter({ target, suffix, delay = 0 }: Props) {
  const { value, startAnimation } = useAnimatedCounter(target, suffix, 2500, delay)
  const { ref, inView: isVisible } = useIntersectionObserver(0.3)

  useEffect(() => {
    if (isVisible) {
      startAnimation()
    }
  }, [isVisible, startAnimation])

  return (
    <div ref={ref}>
      {formatNumber(value, target)}
      {suffix && <span>{suffix}</span>}
    </div>
  )
}
