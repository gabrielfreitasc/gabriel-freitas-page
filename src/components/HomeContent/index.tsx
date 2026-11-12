'use client'

import { CoursesSection } from '@/components/CoursesSection'
import { ExperiencesSection } from '@/components/ExperiencesSection'
import { Logo } from '@/components/GlobalComponents/Logo'
import { HERO_PIN_SCREENS, HeroSection } from '@/components/HeroSection'
import useGlobalContext from '@/context/GlobalContext'
import { NavBar } from '@/components/NavBar'
import { StacksSection } from '@/components/StacksSection'
import LiquidEther from '@/components/ui/LiquidEtherBackground'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

gsap.registerPlugin(ScrollSmoother, ScrollTrigger)

// Barra de endereço do celular redimensionando a janela não deve refazer todos
// os cálculos de scroll (principal causa de travadas ao rolar no mobile)
ScrollTrigger.config({ ignoreMobileResize: true })

// Hoisted: arrays/objetos inline nas props re-inicializariam o WebGL a cada render
const liquidColors = ['#C7C7C7', '#B5B2B3', '#CFCFCF']

export default function HomeContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const smootherRef = useRef<ScrollSmoother | null>(null)
  const { isLoading } = useGlobalContext()
  // O fundo WebGL fica escondido atrás do hero opaco, então só é montado depois
  // do preloader (que já usa um contexto WebGL) e quando o navegador está ocioso
  const [bgReady, setBgReady] = useState(false)
  // O fundo WebGL é caro em GPU. Pausamos sua simulação assim que o hero sai
  // da tela: nas seções de baixo ele não importa visualmente e devolve todo o
  // orçamento de frame para a rolagem.
  const [bgPaused, setBgPaused] = useState(false)
  // No topo da página o hero (opaco, com o cavaleiro na chuva) cobre a tela
  // inteira, então o LiquidEther também não precisa rodar
  const [heroCovering, setHeroCovering] = useState(true)

  // Layout effect: o smoother precisa existir antes do ScrollTrigger com pin
  // criado no useEffect do hero — um pin criado antes dele usaria
  // position: fixed, que quebra dentro do conteúdo transformado do smoother
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    smootherRef.current = ScrollSmoother.create({
      smooth: reduceMotion ? 0 : 0.8,
      effects: !reduceMotion,
      smoothTouch: false,
      normalizeScroll: false,
    })

    return () => {
      smootherRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (isLoading || bgReady) return
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setBgReady(true), {
        timeout: 2500,
      })
      return () => w.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(() => setBgReady(true), 1200)
    return () => window.clearTimeout(id)
  }, [isLoading, bgReady])

  useEffect(() => {
    const bgTrigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom top', // hero totalmente fora de vista
      onEnter: () => setBgPaused(true),
      onLeaveBack: () => setBgPaused(false),
    })

    const coverTrigger = ScrollTrigger.create({
      trigger: '#hero',
      // fim do pin: o hero opaco começa a sair e a seção seguinte aparece
      start: () => `top+=${window.innerHeight * HERO_PIN_SCREENS} top`,
      invalidateOnRefresh: true,
      onEnter: () => setHeroCovering(false),
      onLeaveBack: () => setHeroCovering(true),
    })

    return () => {
      bgTrigger.kill()
      coverTrigger.kill()
    }
  }, [])

  return (
    <>
      {/* bg-[#0a0a0a]: fallback escuro — bg-neutral-950 não compila (DaisyUI
          sobrescreve a escala `neutral`), então sem isso a página fica branca
          até o canvas pintar o primeiro frame */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        {bgReady && (
          <LiquidEther
            backgroundColor="#0a0a0a"
            colors={liquidColors}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={14}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={1}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            paused={bgPaused || heroCovering}
          />
        )}
      </div>

      <div id="smooth-wrapper">
        <NavBar />
        <div id="smooth-content">
          <main
            ref={containerRef}
            className="flex min-h-screen w-full flex-col items-center relative pb-24 sm:pb-0"
          >
            <Logo width={50} height={50} />
            <section id="hero" className="w-full">
              <HeroSection containerRef={containerRef} />
            </section>

            <section id="stacks" className="w-full">
              <StacksSection />
            </section>

            <section id="experiences" className="w-full">
              <ExperiencesSection />
            </section>

            <section id="courses" className="w-full">
              <CoursesSection />
            </section>
          </main>
        </div>
      </div>
    </>
  )
}
