'use client'

import { CoursesSection } from '@/components/CoursesSection'
import { Logo } from '@/components/GlobalComponents/Logo'
import { HeroSection } from '@/components/HeroSection'
import { NavBar } from '@/components/NavBar'
import { StacksSection } from '@/components/StacksSection'
import GradualBlurMemo from '@/components/ui/GradualBlur'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

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
      <NavBar />
      <div id="smooth-content">
        <main
          ref={containerRef}
          className="flex min-h-screen w-full flex-col items-center relative bg-background"
        >
          <Logo width={50} height={50} />
          <HeroSection containerRef={containerRef} />
          <StacksSection />
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
