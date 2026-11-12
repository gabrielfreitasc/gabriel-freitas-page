'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { BlockRevealText } from '../ui/BlockRevealText'
import { BEE_START_ID } from './BeeFlight'
import { LaurelWreath } from '../LaurelWreath'

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
const TradingStringOperationalPlataform = dynamic(
  () =>
    import('./TradingStringOperationalPlataform').then(
      mod => mod.TradingStringOperationalPlataform
    ),
  { ssr: false, loading: SlidePlaceholder }
)
const FlyWireOnMinecraft = dynamic(
  () => import('./FlyWireOnMinecraft').then(mod => mod.FlyWireOnMinecraft),
  { ssr: false, loading: SlidePlaceholder }
)

// lazy: só monta (e baixa o chunk: recharts, leaflet, moment…) quando o slide
// chega perto da tela. O FlyWire fica de fora: o BeeFlight mora nele e precisa
// existir desde o título da seção.
const slides = [
  { id: 'consultancy', component: ConsultancyPlataform, lazy: true },
  { id: 'geomap', component: GeoMapPlataform, lazy: true },
  { id: 'trading', component: TradingPlataform, lazy: true },
  { id: 'investor', component: InvestorPlataform, lazy: true },
  {
    id: 'tradingString',
    component: TradingStringOperationalPlataform,
    lazy: true,
  },
  { id: 'flyWire', component: FlyWireOnMinecraft, lazy: false },
]

// Monta o conteúdo na primeira vez que o slide chega a 1,5 telas de distância
// e o mantém montado depois. Montar tudo no carregamento custava JS (gráficos,
// mapa, medições de layout) justo enquanto o usuário está no hero.
function LazySlide({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShow(true)
        io.disconnect()
      },
      { rootMargin: '150% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="w-full h-full">
      {show ? children : <SlidePlaceholder />}
    </div>
  )
}

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
      <div id={BEE_START_ID} className="w-full py-10 sm:py-16">
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
        {slides.map(({ id, component: Component, lazy }) => (
          <div
            key={id}
            className="w-full h-full relative odd:left-0 even:right-0 sm:odd:left-[-2.5%] sm:even:right-[-2.5%]"
          >
            {lazy ? (
              <LazySlide>
                <Component />
              </LazySlide>
            ) : (
              <Component />
            )}
          </div>
        ))}
      </div>

      {/* Crédito exigido pela licença CC BY 4.0 do modelo 3D da abelha */}
      <p className="w-full mt-6 text-right text-[10px] text-white/30">
        Modelo 3D da abelha:{' '}
        <a
          href="https://sketchfab.com/3d-models/minecraft-bee-loop-animation-0ad21f462514435ca33c8134449838d2"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/60"
        >
          Minecraft Bee - Loop Animation
        </a>{' '}
        por vipsz (CC BY 4.0)
      </p>

        <div className="flex items-center justify-center absolute right-0 left-0 bottom-0">
          <LaurelWreath containerStyle="!size-[20%] sm:!size-[10%]" />
        </div>
    </section>
  )
}
