'use client'

import { JetBrains_Mono } from 'next/font/google'
import { type CSSProperties, useEffect, useRef } from 'react'
import { startKnightRain } from './scene'
import styles from './styles.module.css'

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'block',
  // A grade assume largura fixa por caractere: o fallback padrão do next/font
  // é Arial ajustada (proporcional) e encolhe a cena. Cai para monoespaçadas.
  adjustFontFallback: false,
  fallback: ['Consolas', 'Menlo', 'Liberation Mono', 'monospace'],
})

// Fundo animado em ASCII: cavaleiro ajoelhado na grama, sob chuva e vento,
// com cachecol vermelho tremulando. Preenche o elemento pai (position: relative)
// e só roda enquanto está visível na tela.
export function KnightRainBackground({
  minScale = 1,
}: {
  // Menor zoom que o hero aplicará à cena (var CSS --knight-scale)
  minScale?: number
}) {
  const minScaleRef = useRef(minScale)
  const rootRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const figRef = useRef<HTMLPreElement>(null)
  const rainCanvasRef = useRef<HTMLCanvasElement>(null)
  const scarfCanvasRef = useRef<HTMLCanvasElement>(null)
  const grassCanvasRef = useRef<HTMLCanvasElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = rootRef.current
    const world = worldRef.current
    const fig = figRef.current
    const rainCanvas = rainCanvasRef.current
    const scarfCanvas = scarfCanvasRef.current
    const grassCanvas = grassCanvasRef.current
    const halo = haloRef.current
    if (
      !scene ||
      !world ||
      !fig ||
      !rainCanvas ||
      !scarfCanvas ||
      !grassCanvas ||
      !halo
    )
      return

    let stop: (() => void) | null = null
    let visible = false
    let fontReady = false
    let disposed = false

    const run = () => {
      stop?.()
      stop = null
      if (disposed || !visible || !fontReady) return
      stop = startKnightRain(
        { scene, world, fig, halo, rainCanvas, scarfCanvas, grassCanvas },
        minScaleRef.current
      )
    }

    // a grade é medida com a fonte: espera ela carregar (com limite de tempo)
    const family = mono.style.fontFamily
    Promise.race([
      document.fonts?.load(`700 20px ${family}`) ?? Promise.resolve(),
      new Promise(r => setTimeout(r, 1500)),
    ])
      .catch(() => {})
      .then(() => {
        fontReady = true
        run()
      })

    // se a fonte chegar depois do limite, remede a grade com ela
    const onFontsLoaded = () => {
      if (fontReady) run()
    }
    document.fonts?.addEventListener('loadingdone', onFontsLoaded)

    // pausa quando o hero sai da tela
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === visible) return
      visible = entry.isIntersecting
      if (visible) run()
      else {
        stop?.()
        stop = null
      }
    })
    io.observe(scene)

    // remonta a grade quando o tamanho muda
    let rt: ReturnType<typeof setTimeout>
    let lastW = scene.clientWidth
    let lastH = scene.clientHeight
    const ro = new ResizeObserver(() => {
      if (scene.clientWidth === lastW && scene.clientHeight === lastH) return
      lastW = scene.clientWidth
      lastH = scene.clientHeight
      clearTimeout(rt)
      rt = setTimeout(run, 150)
    })
    ro.observe(scene)

    return () => {
      disposed = true
      document.fonts?.removeEventListener('loadingdone', onFontsLoaded)
      clearTimeout(rt)
      io.disconnect()
      ro.disconnect()
      stop?.()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={styles.root}
      data-knight-root
      style={{ '--knight-font': mono.style.fontFamily } as CSSProperties}
    >
      {/* Chuva em canvas, atrás do cavaleiro */}
      <canvas ref={rainCanvasRef} className={styles.rainCanvas} />
      {/* Mundo: cavaleiro (texto), cachecol e grama (canvas) no mesmo espaço,
          com o zoom do scroll aplicado nele a partir do centro da base. */}
      <div ref={worldRef} className={styles.world}>
        <div ref={haloRef} className={styles.halo} />
        <pre ref={figRef} className={styles.fig} />
        <canvas ref={scarfCanvasRef} className={styles.worldCanvas} />
        <canvas ref={grassCanvasRef} className={styles.worldCanvas} />
      </div>
    </div>
  )
}
