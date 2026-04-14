import { useEffect, useRef, useState } from 'react'

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkTouch = () => {
      const isTouch = 
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      setIsMobile(isTouch)
      return isTouch
    }

    const isTouch = checkTouch()
    if (isTouch) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let rafId: number

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    document.addEventListener('mousemove', handleMouseMove)

    function animCursor() {
      if (cursorRef.current && ringRef.current) {
        rx += (mx - rx) * 0.15
        ry += (my - ry) * 0.15
        cursorRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`
        ringRef.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`
      }
      rafId = requestAnimationFrame(animCursor)
    }
    animCursor()

    const interactables = document.querySelectorAll('a, button, .service-card, .job-item, .tech-tag, .quote-card, .contact-method')
    const listeners: { el: Element; enter: () => void; leave: () => void }[] = []

    interactables.forEach((el) => {
      const element = el as HTMLElement
      const onEnter = () => {
        if (ringRef.current) {
          ringRef.current.style.width = '50px'
          ringRef.current.style.height = '50px'
          ringRef.current.style.borderColor = 'rgba(140,38,133,0.7)'
        }
      }
      const onLeave = () => {
        if (ringRef.current) {
          ringRef.current.style.width = '32px'
          ringRef.current.style.height = '32px'
          ringRef.current.style.borderColor = 'rgba(140,38,133,0.4)'
        }
      }
      element.addEventListener('mouseenter', onEnter)
      element.addEventListener('mouseleave', onLeave)
      listeners.push({ el, enter: onEnter, leave: onLeave })
    })

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', handleMouseMove)
      listeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [])

  return { cursorRef, ringRef, isMobile }
}