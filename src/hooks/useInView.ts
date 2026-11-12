import { type RefObject, useEffect, useState } from 'react'

// true enquanto o elemento intersecta a tela. Serve para suspender timers e
// animações contínuas de quem está fora da área visível.
export function useInView(
  ref: RefObject<Element | null>,
  rootMargin = '0px'
): boolean {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])

  return inView
}
