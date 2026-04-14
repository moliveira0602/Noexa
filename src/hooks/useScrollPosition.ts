import { useState, useEffect } from 'react'

export function useScrollPosition(breakpoint = 60) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > breakpoint)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [breakpoint])

  return scrolled
}
