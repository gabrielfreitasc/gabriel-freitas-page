'use client'

import { PATH_RIGHT } from '@/components/ExperienceCard'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { flightPoint, type SpiralConfig } from './path'
import { BeeScene } from './scene'

gsap.registerPlugin(ScrollTrigger)

// Título "Experiências": ponto de partida do voo
export const BEE_START_ID = 'experiences-title'

const AHEAD = 0.02 // passo de progresso usado para orientar a abelha
const START_Y = 0.3 // altura (fração da viewport) em que a espiral começa

interface FlightConfig extends SpiralConfig {
  wingspan: number
  startX: number
  // Progresso em que a abelha termina de surgir (0 = já visível parada)
  appearUntil: number
}

function getConfig(): FlightConfig {
  const w = window.innerWidth
  // No celular a abelha parada sobreporia o título: ela fica invisível e
  // cresce do zero no começo do voo, enquanto o título sai da tela
  return w < 640
    ? {
        radius: w * 0.2,
        turns: 2,
        depth: 1.2,
        wingspan: 80,
        startX: 0.5,
        appearUntil: 0.06,
      }
    : {
        radius: w * 0.22,
        turns: 3,
        depth: 2,
        wingspan: 150,
        startX: 0.6,
        appearUntil: 0,
      }
}

// Abelha 3D que espirala do título de Experiências até entrar atrás do card do
// FlyWire. Só renderiza enquanto o trecho está na tela: antes e depois dele o
// ticker é removido e o canvas fica oculto, sem consumo de CPU/GPU.
export function BeeFlight({
  targetRef,
}: {
  targetRef: RefObject<HTMLDivElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  useEffect(() => {
    const canvas = canvasRef.current
    const target = targetRef.current
    const startEl = document.getElementById(BEE_START_ID)
    if (!canvas || !target || !startEl) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bee = new BeeScene(canvas, PATH_RIGHT)
    let config = getConfig()
    let loaded = false
    let active = false

    // Progresso do voo: começa quando o título chega a START_Y da tela e
    // termina com o card do FlyWire centralizado
    const flight = ScrollTrigger.create({
      trigger: startEl,
      start: `center ${START_Y * 100}%`,
      endTrigger: target,
      end: 'center center',
    })

    const render = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const titleRect = startEl.getBoundingClientRect()
      const cardRect = target.getBoundingClientRect()

      // Antes do voo a abelha acompanha o título (parada na página); a partir
      // de START_Y ela fica nessa altura e a espiral assume
      const start = {
        x: vw * config.startX,
        y: Math.max(titleRect.top + titleRect.height / 2, vh * START_Y),
      }
      // Card abaixo da tela: o alvo fica a 80% da altura, então a abelha
      // continua visível e entra pelo topo do card conforme ele sobe
      const end = {
        x: cardRect.left + cardRect.width / 2,
        y: Math.min(
          Math.max(cardRect.top + cardRect.height / 2, -vh * 0.2),
          vh * 0.8
        ),
      }

      const t = flight.progress
      const point = flightPoint(t, start, end, config)
      const ahead =
        t + AHEAD <= 1 ? flightPoint(t + AHEAD, start, end, config) : point
      const behind =
        t + AHEAD > 1 ? flightPoint(t - AHEAD, start, end, config) : null
      // No fim do trajeto orienta pela direção de chegada
      const look = behind
        ? {
            x: point.x * 2 - behind.x,
            y: point.y * 2 - behind.y,
            z: point.z * 2 - behind.z,
          }
        : ahead

      const appear =
        config.appearUntil > 0 ? Math.min(1, t / config.appearUntil) : 1

      bee.render(point, look, config.wingspan * appear, cardRect)
    }

    const setActive = (value: boolean) => {
      if (value === active) return
      active = value
      if (active && loaded) {
        canvas.style.visibility = 'visible'
        gsap.ticker.add(render)
      } else {
        gsap.ticker.remove(render)
        bee.pause()
        canvas.style.visibility = 'hidden'
      }
    }

    // Janela de renderização: do título entrando na tela até a abelha estar
    // atrás do card
    const visibility = ScrollTrigger.create({
      trigger: startEl,
      start: 'top bottom',
      endTrigger: target,
      end: 'center center',
      onToggle: self => setActive(self.isActive),
    })

    bee
      .load()
      .then(() => {
        loaded = true
        if (visibility.isActive) {
          active = false
          setActive(true)
        }
      })
      .catch(err => console.error('BeeFlight: falha ao carregar o modelo', err))

    const onResize = () => {
      config = getConfig()
      bee.resize()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(render)
      flight.kill()
      visibility.kill()
      bee.dispose()
    }
  }, [isMounted, targetRef])

  if (!isMounted) return null

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[998]"
      style={{ visibility: 'hidden' }}
    />,
    document.body
  )
}
