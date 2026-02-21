'use client'

import { CoursesSection } from '@/components/CoursesSection'
import { ExperiencesSection } from '@/components/ExperiencesSection'
import { Logo } from '@/components/GlobalComponents/Logo'
import { HeroSection } from '@/components/HeroSection'
import { NavBar } from '@/components/NavBar'
import { StacksSection } from '@/components/StacksSection'
import LiquidEther from '@/components/ui/LiquidEtherBackground'
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
    <>
      {/* LiquidEther fixo em todo o background da página */}
      <div className="fixed inset-0 -z-10">
        <LiquidEther
          backgroundColor="#0a0a0a"
          colors={['#C7C7C7', '#B5B2B3', '#CFCFCF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={1}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <div id="smooth-wrapper">
        <NavBar />
        <div id="smooth-content">
          <main
            ref={containerRef}
            className="flex min-h-screen w-full flex-col items-center relative"
          >
            <Logo width={50} height={50} />
            <section id="hero" className="w-full">
              <HeroSection containerRef={containerRef} />
            </section>

            <section id="stacks" className="w-full">
              <StacksSection />
            </section>

            <section id="experiences" className="w-full">
              <ExperiencesSection />
            </section>

            <section id="courses" className="w-full">
              <CoursesSection />
            </section>
          </main>
        </div>
      </div>
    </>
  )
}
