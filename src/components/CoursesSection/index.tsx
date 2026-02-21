import { useGSAP } from '@gsap/react'
import { EnvelopeIcon } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'
import courses from '../../mock/courses.json'
import { TweetCard } from '../GlobalComponents/TweetCard'
import { BlockRevealText } from '../ui/BlockRevealText'

gsap.registerPlugin(ScrollTrigger)

export function CoursesSection() {
  const container = useRef<HTMLDivElement>(null)
  const fanRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
      if (!cards.length) return

      const totalScrollHeight = window.innerHeight * 3
      const positions = [10, 30, 50, 70, 90]
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
      className="w-full min-h-screen flex flex-col items-start justify-start py-20 px-8"
      data-speed="1"
    >
      <div className="w-full mb-5">
        <BlockRevealText className="my-5" scrollStart="top bottom">
          <span className="text-7xl uppercase font-bold text-white mr-auto">
            Cursos relevantes
          </span>
        </BlockRevealText>
      </div>

      <div
        ref={fanRef}
        className="w-full h-[600px] flex items-center justify-center overflow-visible relative"
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
    </section>
  )
}
