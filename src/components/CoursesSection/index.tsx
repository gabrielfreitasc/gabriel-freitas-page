import { useGSAP } from '@gsap/react'
import { EnvelopeIcon } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import courses from '../../mock/courses.json'
import { TweetCard } from '../GlobalComponents/TweetCard'
import { BlockRevealText } from '../ui/BlockRevealText'

gsap.registerPlugin(ScrollTrigger)

// Posição/rotação/escala da carta original, relativas ao centro da viewport
interface CardOrigin {
  x: number
  y: number
  rotation: number
  scale: number
}

interface SelectedCard {
  index: number
  origin: CardOrigin
  targetScale: number
}

const FOCUS_DURATION = 0.6

export function CoursesSection() {
  const container = useRef<HTMLDivElement>(null)
  const fanRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)
  const focusedCardRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const [selected, setSelected] = useState<SelectedCard | null>(null)
  const [showContent, setShowContent] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  // A carta focada é uma cópia renderizada no body (fora do #smooth-content,
  // que usa transform e quebraria o position: fixed). A original fica oculta
  // enquanto a cópia anima da posição dela até o centro e de volta.
  const openCard = (index: number) => {
    const card = cardRefs.current[index]
    if (!card || selected || isAnimatingRef.current) return

    const rect = card.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = card.offsetWidth
    const height = card.offsetHeight

    isAnimatingRef.current = true
    ScrollSmoother.get()?.paused(true)
    // No desktop a carta já está virada pelo hover: a cópia começa igual a ela
    setShowContent(card.matches(':hover'))
    setSelected({
      index,
      origin: {
        x: rect.left + rect.width / 2 - vw / 2,
        y: rect.top + rect.height / 2 - vh / 2,
        rotation: Number(gsap.getProperty(card, 'rotation')),
        scale: Number(gsap.getProperty(card, 'scale')),
      },
      targetScale: Math.min(1.4, (vh * 0.85) / height, (vw * 0.9) / width),
    })
  }

  useLayoutEffect(() => {
    if (!selected) return
    const focused = focusedCardRef.current
    const original = cardRefs.current[selected.index]
    if (!focused || !original) return

    const { origin, targetScale } = selected
    gsap.set(original, { autoAlpha: 0 })
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    )
    gsap.fromTo(
      focused,
      { xPercent: -50, yPercent: -50, ...origin },
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: targetScale,
        duration: FOCUS_DURATION,
        ease: 'power3.inOut',
        onComplete: () => {
          isAnimatingRef.current = false
        },
      }
    )
    // Próximo frame: a cópia já montou mostrando a frente, então o flip anima
    const raf = requestAnimationFrame(() => setShowContent(true))
    return () => cancelAnimationFrame(raf)
  }, [selected])

  const closeCard = useCallback(() => {
    const focused = focusedCardRef.current
    if (!selected || !focused || isAnimatingRef.current) return

    isAnimatingRef.current = true
    setShowContent(false)
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      delay: FOCUS_DURATION - 0.4,
    })
    gsap.to(focused, {
      ...selected.origin,
      duration: FOCUS_DURATION,
      ease: 'power3.inOut',
      onComplete: () => {
        const original = cardRefs.current[selected.index]
        if (original) gsap.set(original, { autoAlpha: 1 })
        setSelected(null)
        ScrollSmoother.get()?.paused(false)
        isAnimatingRef.current = false
      },
    })
  }, [selected])

  useEffect(() => {
    if (!selected) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCard()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, closeCard])

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
      if (!cards.length) return

      const totalScrollHeight = window.innerHeight * 3
      const isMobile = window.innerWidth < 640
      const positions = isMobile ? [22, 36, 50, 64, 78] : [10, 30, 50, 70, 90]
      const rotations = [-15, -7.5, 0, 7.5, 15]
      const scales = [0.8, 0.9, 1, 0.9, 0.8]
      const zIndexes = [1, 2, 3, 2, 1]

      ScrollTrigger.create({
        trigger: container.current,
        start: 'top top',
        end: () => `+=${totalScrollHeight}`,
        pin: true,
        pinSpacing: true,
      })

      cards.forEach((card, index) => {
        gsap.to(card, {
          left: `${positions[index]}%`,
          xPercent: -50,
          yPercent: -50,
          rotation: rotations[index],
          scale: scales[index],
          zIndex: zIndexes[index],
          ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top top',
            end: () => `+=${window.innerHeight}`,
            scrub: 0.5,
            id: `spread-${index}`,
          },
        })
      })
    },
    { scope: container, dependencies: [courses.length] }
  )

  return (
    <section
      ref={container}
      className="w-full min-h-screen flex flex-col items-start justify-start py-12 sm:py-20 px-4 sm:px-8"
      data-speed="1"
    >
      <div className="w-full mb-5">
        <BlockRevealText className="my-5" scrollStart="top bottom">
          <span className="text-4xl sm:text-7xl uppercase font-bold text-white mr-auto">
            Cursos relevantes
          </span>
        </BlockRevealText>
      </div>

      <div
        ref={fanRef}
        className="w-full h-[380px] sm:h-[600px] flex items-center justify-center overflow-visible relative"
      >
        {courses.map((course: any, index) => (
          <TweetCard
            index={index}
            disableFloat
            key={course.name + index}
            title={course.name}
            description={course.description}
            image={course.image}
            emissionDate={course.emissionDate}
            containerStyle="bg-zinc-100"
            onClick={() => openCard(index)}
            ref={el => {
              cardRefs.current[index] = el
            }}
          />
        ))}
      </div>

      <div className="w-full flex items-center gap-2 justify-center mt-2">
        <BlockRevealText>
          <span className="text-white/70 flex items-center gap-2 group">
            <EnvelopeIcon weight="fill" className="rotate-icon" />
            gabrielfcoelho3030@gmail.com
          </span>
        </BlockRevealText>
      </div>

      {isMounted &&
        selected &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000]"
            onClick={closeCard}
            role="dialog"
            aria-modal="true"
            aria-label={courses[selected.index].name}
          >
            <div
              ref={overlayRef}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0"
            />
            <div
              ref={focusedCardRef}
              className="fixed left-1/2 top-1/2"
              onClick={e => e.stopPropagation()}
            >
              <TweetCard
                index={selected.index}
                disableFloat
                flipped={showContent}
                className="relative"
                title={courses[selected.index].name}
                description={courses[selected.index].description}
                image={courses[selected.index].image}
                emissionDate={courses[selected.index].emissionDate}
                containerStyle="bg-zinc-100"
              />
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}
