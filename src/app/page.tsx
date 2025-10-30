'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GradualBlurMemo from '@/components/ui/GradualBlur'
import { CoursesSection } from '@/components/CoursesSection'
import { HeroSection } from '@/components/HeroSection'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/GlobalComponents/Logo'

gsap.registerPlugin(ScrollSmoother, ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const smootherRef = useRef<ScrollSmoother | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      smootherRef.current = ScrollSmoother.create({
        smooth: 1.5,
        effects: true,
        smoothTouch: 0.1,
        normalizeScroll: true,
      })

      return () => {
        smootherRef.current?.kill()
      }
    }
  }, [])

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main
          ref={containerRef}
          className="flex min-h-screen w-full flex-col items-center relative bg-background"
        >
          <Logo />
          <NavBar />
          <HeroSection containerRef={containerRef} />
          <CoursesSection />

          <GradualBlurMemo
            target="page"
            position="bottom"
            height="6rem"
            strength={2}
            divCount={5}
            curve="bezier"
            exponential={true}
            opacity={1}
          />
        </main>
      </div>
    </div>
  )
}
