import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import courses from '../../mock/courses.json'
import { TweetCard } from '../GlobalComponents/TweetCard'
import ScrollFloat from '../ui/ScrollFloat'

gsap.registerPlugin(ScrollTrigger)

export function CoursesSection() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const boxes = gsap.utils.toArray<HTMLElement>('.box-c')

      boxes.forEach((box, i) => {
        gsap.fromTo(
          box,
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: box,
              start: 'top bottom-=50',
              end: 'top center+=100',
              scrub: 1,
            },
          }
        )
      })
    },
    { scope: container }
  )

  return (
    <section
      ref={container}
      className="w-full min-h-screen flex flex-col items-center justify-start bg-neutral-950 py-20 px-8"
      data-speed="1"
    >
      <div className="w-full max-w-6xl mb-16">
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="top bottom"
          scrollEnd="center top"
          stagger={0.03}
          textClassName="!text-7xl uppercase font-bold text-white"
        >
          Cursos relevantes
        </ScrollFloat>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl pb-20">
        {courses.map((course, index) => (
          <TweetCard
            key={course.name + index}
            title={course.name}
            description={course.description}
            image={course.image}
            emissionDate={course.emissionDate}
            containerStyle="bg-zinc-100"
          />
        ))}
      </div>
    </section>
  )
}
