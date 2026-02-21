'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface BlockRevealTextProps {
  children: React.ReactNode
  /** Classes aplicadas no wrapper externo (margin, padding, etc.) */
  className?: string
  delay?: number
  duration?: number
  scrollStart?: string
  /**
   * true (default) → o bloco tem a largura do texto (inline-block)
   * false          → o bloco ocupa a largura total do container
   */
  fitContent?: boolean
}

export function BlockRevealText({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  scrollStart = 'top 88%',
  fitContent = true,
}: BlockRevealTextProps) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const block = blockRef.current
      const content = contentRef.current
      if (!block || !content) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: scrollStart,
          toggleActions: 'play none none none',
        },
        delay,
      })

      tl
        // Fase 1: bloco entra pela esquerda + texto revela por baixo em sincronia
        .fromTo(block, { x: '-101%' }, { x: '0%', duration, ease: 'power3.inOut' })
        .fromTo(
          content,
          { clipPath: 'inset(0 101% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration, ease: 'power3.inOut' },
          '<',
        )
        // Fase 2: bloco sai pela direita, texto permanece visível
        .to(block, { x: '101%', duration: duration * 0.7, ease: 'power3.in' })
    },
    { scope: triggerRef, dependencies: [delay, duration, scrollStart] },
  )

  return (
    <div ref={triggerRef} className={className}>
      <div
        className={`relative overflow-hidden ${fitContent ? 'inline-block' : 'block w-full'}`}
      >
        <div
          ref={contentRef}
          className={fitContent ? 'inline-block' : 'block'}
        >
          {children}
        </div>

        <div
          ref={blockRef}
          className="absolute inset-0 bg-zinc-300 z-10 pointer-events-none"
        />
      </div>
    </div>
  )
}
