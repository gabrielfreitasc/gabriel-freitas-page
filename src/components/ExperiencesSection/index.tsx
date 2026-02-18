import ScrollFloat from '../ui/ScrollFloat'
import { ConsultancyPlataform } from './ConsultancyPlataform'

export function ExperiencesSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start bg-neutral-950 py-20 px-8">
      <div className="w-full mb-16">
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="top bottom"
          scrollEnd="center top"
          stagger={0.03}
          textClassName="!text-7xl uppercase font-bold text-white"
        >
          Experiências
        </ScrollFloat>
      </div>
      <ConsultancyPlataform />
    </section>
  )
}
