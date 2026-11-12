'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { BlockRevealText } from '../ui/BlockRevealText'
import { BEE_START_ID } from './BeeFlight'
import { LaurelWreath } from '../LaurelWreath'

// Enquanto o chunk de uma plataforma carrega, quem reserva o espaço é o
// LazySlide (altura aproximada de cada slide); este fallback não ocupa nada
const SlidePlaceholder = () => null

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
  {
    id: 'consultancy',
    component: ConsultancyPlataform,
    lazy: true,
    reserve: 'min-h-[1350px] md:min-h-[1320px] lg:min-h-[630px]',
  },
  {
    id: 'geomap',
    component: GeoMapPlataform,
    lazy: true,
    reserve: 'min-h-[1210px] md:min-h-[1090px] lg:min-h-[610px]',
  },
  {
    id: 'trading',
    component: TradingPlataform,
    lazy: true,
    reserve: 'min-h-[1720px] md:min-h-[1760px] lg:min-h-[750px]',
  },
  {
    id: 'investor',
    component: InvestorPlataform,
    lazy: true,
    reserve: 'min-h-[1300px] md:min-h-[1120px] lg:min-h-[590px]',
  },
  {
    id: 'tradingString',
    component: TradingStringOperationalPlataform,
    lazy: true,
    reserve: 'min-h-[1320px] md:min-h-[1110px] lg:min-h-[590px]',
  },
  { id: 'flyWire', component: FlyWireOnMinecraft, lazy: false, reserve: '' },
]

// Monta o conteúdo na primeira vez que o slide chega a 1,5 telas de distância
// e o mantém montado depois. Montar tudo no carregamento custava JS (gráficos,
// mapa, medições de layout) justo enquanto o usuário está no hero.
// `reserve` guarda a altura aproximada do slide (por largura de tela) até o
// conteúdo real existir: sem isso a página cresce milhares de pixels no meio
// da rolagem, o que no celular dá saltos e refreshes do ScrollTrigger.
function LazySlide({
  children,
  reserve,
}: {
  children: ReactNode
  reserve: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const [ready, setReady] = useState(false)

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

  // Solta a altura reservada quando o conteúdo real aparece
  useEffect(() => {
    const inner = innerRef.current
    if (!show || !inner) return
    const ro = new ResizeObserver(() => {
      if (inner.offsetHeight > 120) {
        setReady(true)
        ro.disconnect()
      }
    })
    ro.observe(inner)
    return () => ro.disconnect()
  }, [show])

  return (
    <div ref={ref} className={`w-full h-full ${ready ? '' : reserve}`}>
      <div ref={innerRef} className="w-full h-full">
        {show ? children : null}
      </div>
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
    // Só refaz os cálculos depois que o scroll para: refresh no meio de um
    // gesto de toque faz a página saltar
    let timer: ReturnType<typeof setTimeout>
    let lastScroll = 0
    const onScroll = () => {
      lastScroll = performance.now()
    }
    const tryRefresh = () => {
      if (performance.now() - lastScroll < 250) {
        timer = setTimeout(tryRefresh, 250)
        return
      }
      ScrollTrigger.refresh()
    }
    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(tryRefresh, 250)
    })
    ro.observe(stack)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
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
        {slides.map(({ id, component: Component, lazy, reserve }) => (
          <div
            key={id}
            className="w-full h-full relative odd:left-0 even:right-0 sm:odd:left-[-2.5%] sm:even:right-[-2.5%]"
          >
            {lazy ? (
              <LazySlide reserve={reserve}>
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
