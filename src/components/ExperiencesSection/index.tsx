'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { BlockRevealText } from '../ui/BlockRevealText'

// Placeholder com a mesma altura do ExperienceCard (aspect 714/800) para evitar layout shift
const SlidePlaceholder = () => (
  <div className="w-full flex items-center justify-center">
    <div className="w-[900px] max-w-[95vw] aspect-[714/800]" />
  </div>
)

// Carregadas sob demanda: recharts, moment e leaflet ficam fora do bundle inicial
const ConsultancyPlataform = dynamic(
  () => import('./ConsultancyPlataform').then(mod => mod.ConsultancyPlataform),
  { ssr: false, loading: SlidePlaceholder }
)
const GeoMapPlataform = dynamic(
  () => import('./GeoMapPlataform').then(mod => mod.GeoMapPlataform),
  { ssr: false, loading: SlidePlaceholder }
)
const TradingPlataform = dynamic(
  () => import('./TradingPlataform').then(mod => mod.TradingPlataform),
  { ssr: false, loading: SlidePlaceholder }
)
const InvestorPlataform = dynamic(
  () => import('./InvestorPlataform').then(mod => mod.InvestorPlataform),
  { ssr: false, loading: SlidePlaceholder }
)

const slides = [
  { id: 'consultancy', component: ConsultancyPlataform },
  { id: 'geomap',      component: GeoMapPlataform },
  { id: 'trading',     component: TradingPlataform },
  { id: 'investor',    component: InvestorPlataform },
]

gsap.registerPlugin(ScrollTrigger)

export function ExperiencesSection() {
  const stackRef = useRef<HTMLDivElement>(null)

  // Recalcula os ScrollTriggers (pin da CoursesSection etc.) quando os chunks
  // das plataformas chegam e a altura real substitui os placeholders
  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    ro.observe(stack)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <section className="relative w-full flex flex-col items-start px-4 sm:px-8">
      {/* Title scrolls away naturally — no pin until the card stack is in view */}
      <div className="w-full py-10 sm:py-16">
        <BlockRevealText className="my-5" scrollStart="top 90%">
          <span className="text-4xl sm:text-7xl uppercase font-bold text-white">
            Experiências
          </span>
        </BlockRevealText>
      </div>

      {/* Card stack — fills the full viewport once pinned */}
      <div
        ref={stackRef}
        className="relative w-full min-h-screen flex flex-col gap-16 sm:gap-32"
      >
        {slides.map(({ id, component: Component }) => (
          <div
            key={id}
            className="w-full h-full relative odd:left-0 even:right-0 sm:odd:left-[-2.5%] sm:even:right-[-2.5%]"
          >
            <Component />
          </div>
        ))}
      </div>
    </section>
  )
}
