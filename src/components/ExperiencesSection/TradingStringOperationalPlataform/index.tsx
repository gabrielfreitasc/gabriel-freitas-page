'use client'

import { ExperienceCard } from '@/components/ExperienceCard'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import projectData from '../../../mock/experiences.json'
import { ProjectDetailsCard } from '../ProjectDetailsCard'
import { DashboardContent } from './DashboardContent'

export function TradingStringOperationalPlataform() {
  const tradingStringData = projectData.find(
    project => project.type === 'tradingString',
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    const distance = inner.scrollHeight - container.clientHeight
    if (distance <= 0) return

    tweenRef.current = gsap.to(inner, {
      y: -distance,
      duration: 25,
      ease: 'none',
      repeat: -1,
      yoyo: true,
      repeatDelay: 1,
    })

    const pause = () => tweenRef.current?.pause()
    const resume = () => tweenRef.current?.resume()
    container.addEventListener('mouseenter', pause)
    container.addEventListener('mouseleave', resume)

    return () => {
      tweenRef.current?.kill()
      container.removeEventListener('mouseenter', pause)
      container.removeEventListener('mouseleave', resume)
    }
  }, [])

  if (!tradingStringData) return null

  return (
    <div className="w-full h-auto flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-2">
      <ExperienceCard direction="left">
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-gray-50">
          <div ref={innerRef}>
            <DashboardContent />
          </div>
        </div>
      </ExperienceCard>
      <ProjectDetailsCard
        className="!pt-0"
        title={tradingStringData.title}
        description={tradingStringData.description}
        achievements={tradingStringData.achievements}
        techStack={tradingStringData.techStack}
      />
    </div>
  )
}
