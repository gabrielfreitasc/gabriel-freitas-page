'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BlockRevealText } from '../ui/BlockRevealText'
import { ConsultancyPlataform } from './ConsultancyPlataform'
import { GeoMapPlataform } from './GeoMapPlataform'
import { TradingPlataform } from './TradingPlataform'

const slides = [
  { id: 'consultancy', component: ConsultancyPlataform },
  { id: 'geomap', component: GeoMapPlataform },
  { id: 'trading', component: TradingPlataform },
]

gsap.registerPlugin(ScrollTrigger)

export function ExperiencesSection() {
  return (
    <section className="relative w-full flex flex-col items-start px-4 sm:px-8">
      {/* Title scrolls away naturally — no pin until the card stack is in view */}
      <div className="w-full py-10 sm:py-16">
        <BlockRevealText className="my-5" scrollStart="top 90%">
          <span className="text-4xl sm:text-7xl uppercase font-bold text-white">
            Experiências
          </span>
        </BlockRevealText>
      </div>

      {/* Card stack — fills the full viewport once pinned */}
      <div className="relative w-full min-h-screen flex flex-col gap-16 sm:gap-32">
        {slides.map(({ id, component: Component }, index) => (
          <div
            key={id}
            className="w-full h-full relative odd:left-0 even:right-0 sm:odd:left-[-2.5%] sm:even:right-[-2.5%]"
          >
            <Component />
          </div>
        ))}
      </div>
    </section>
  )
}
