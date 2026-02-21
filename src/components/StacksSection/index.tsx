import gsap from 'gsap'
import type { SpringOptions } from 'motion/react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { FaAws, FaNodeJs } from 'react-icons/fa'
import {
  SiClaude,
  SiDocker,
  SiJavascript,
  SiLeaflet,
  SiMapbox,
  SiMongodb,
  SiMysql,
  SiN8N,
  SiNextdotjs,
  SiOpenai,
  SiOracle,
  SiPrisma,
  SiReact,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'
import { LaurelWreath } from '../LaurelWreath'
import { BlockRevealText } from '../ui/BlockRevealText'

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
}

const stacksIcons = [
  { node: SiReact, title: 'React' },
  { node: SiTailwindcss, title: 'Tailwind CSS' },
  { node: SiNextdotjs, title: 'Next.js' },
  { node: SiTypescript, title: 'TypeScript' },
  { node: SiJavascript, title: 'JavaScript' },
  { node: SiOpenai, title: 'OpenAI' },
  { node: SiMapbox, title: 'Mapbox' },
  { node: SiN8N, title: 'N8N' },
  { node: SiClaude, title: 'Claude' },
  { node: SiMongodb, title: 'MongoDB' },
  { node: FaNodeJs, title: 'Node.js' },
  { node: SiPrisma, title: 'Prisma' },
  { node: SiMysql, title: 'MySQL' },
  { node: FaAws, title: 'AWS' },
  { node: SiDocker, title: 'Docker' },
  { node: SiOracle, title: 'Oracle' },
  { node: SiLeaflet, title: 'Leaflet' },
  { node: SiShadcnui, title: 'Shadcn/UI' },
]

const getIndices = (center: number) => {
  const len = stacksIcons.length
  return [
    (center - 2 + len) % len,
    (center - 1 + len) % len,
    center,
    (center + 1) % len,
    (center + 2) % len,
  ]
}

// ─── IconCard ──────────────────────────────────────────────────────────────────
// O outer div é alvo do GSAP (flip rotateY).
// O inner motion.div controla o tilt por spring — os dois não conflitam.

function IconCard({
  iconIndex,
  isCenter,
  cardRef,
}: {
  iconIndex: number
  isCenter: boolean
  cardRef: (el: HTMLDivElement | null) => void
}) {
  const figureRef = useRef<HTMLDivElement>(null)
  const [lastY, setLastY] = useState(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)
  const opacity = useSpring(0)
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  })

  const rotateAmplitude = 14

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!figureRef.current) return
    const rect = figureRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
    rotateFigcaption.set(-(offsetY - lastY) * 0.6)
    setLastY(offsetY)
  }

  function handleMouseEnter() {
    scale.set(1.06)
    opacity.set(1)
  }

  function handleMouseLeave() {
    opacity.set(0)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    rotateFigcaption.set(0)
  }

  const Icon = stacksIcons[iconIndex].node
  const title = stacksIcons[iconIndex].title

  return (
    // Outer div — GSAP anima o flip neste elemento
    <div ref={cardRef} style={{ transformStyle: 'preserve-3d' }}>
      {/* Figure — gerencia os eventos de mouse para o tilt */}
      <div
        ref={figureRef}
        className={`relative flex flex-col items-center justify-center rounded-2xl border backdrop-blur-md cursor-pointer overflow-hidden ${
          isCenter
            ? 'p-5 sm:p-10 border-white/20 bg-gradient-to-br from-white/10 to-white/20 text-white shadow-2xl shadow-black/40'
            : 'p-3 sm:p-6 border-white/10 bg-gradient-to-br from-white/10 to-white/20 text-gray-300 opacity-75'
        }`}
        style={{ perspective: '800px' }}
        onMouseMove={handleMouse}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Motion div — aplica rotateX/Y/scale por spring */}
        <motion.div
          className="flex flex-col items-center gap-3 sm:gap-5 [transform-style:preserve-3d]"
          style={{ rotateX, rotateY, scale }}
        >
          {/* Ícone na camada base */}
          <div
            className={`[transform:translateZ(0px)] ${isCenter ? 'text-[60px] sm:text-[102px]' : 'text-[44px] sm:text-[74px]'}`}
          >
            <Icon />
          </div>

          {/* Título flutuando acima (translateZ) */}
          <div className="[transform:translateZ(30px)]">
            <span
              className={`font-semibold tracking-wide border border-white/30 bg-gradient-to-br from-white/20 to-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm ${
                isCenter ? 'text-base text-white' : 'text-xs text-gray-400'
              }`}
            >
              {title}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── StacksSection ─────────────────────────────────────────────────────────────

export function StacksSection() {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const currentIndexRef = useRef(0)
  const [visibleIndices, setVisibleIndices] = useState(() => getIndices(0))

  useEffect(() => {
    const interval = setInterval(() => {
      const tl = gsap.timeline()

      // Fase 1: começa devagar, termina rápido (power4.in)
      tl.to(iconRefs.current.filter(Boolean), {
        rotateY: 90,
        duration: 0.5,
        ease: 'power4.in',
        stagger: 0.06,
      })
        // Troca o conteúdo enquanto os cards estão "de costas"
        .call(() => {
          currentIndexRef.current =
            (currentIndexRef.current + 1) % stacksIcons.length
          setVisibleIndices(getIndices(currentIndexRef.current))
        })
        // Fase 2: revela rapidamente
        .to(iconRefs.current.filter(Boolean), {
          rotateY: 0,
          duration: 0.2,
          ease: 'power2.out',
          stagger: 0.06,
        })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full min-h-screen flex flex-col items-start justify-start py-12 sm:py-20 px-4 sm:px-8 relative">
      <div className="w-full mb-16">
        <BlockRevealText className="my-5" scrollStart="top 90%">
          <span className="text-4xl sm:text-7xl uppercase font-bold text-white">
            Stacks
          </span>
        </BlockRevealText>
        <BlockRevealText scrollStart="top 85%" delay={0.1}>
          <span className="text-sm text-white/70">
            Tecnologias e ferramentas que possuo experiência.
          </span>
        </BlockRevealText>

        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 mt-16">
          {visibleIndices.map((iconIndex, position) => (
            <div
              key={position}
              className={
                position === 0 || position === 4 ? 'hidden sm:block' : ''
              }
            >
              <IconCard
                iconIndex={iconIndex}
                isCenter={position === 2}
                cardRef={el => {
                  iconRefs.current[position] = el
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center absolute right-0 left-0 bottom-0">
          <LaurelWreath containerStyle="!size-[20%] sm:!size-[10%]" />
        </div>
      </div>
    </section>
  )
}
