import { motion } from 'framer-motion'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/all'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(DrawSVGPlugin)

export function Logo({ containerStyle, width, height }: { containerStyle?: string, width?: number, height?: number }) {
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logoRef.current) {
      // Timeline para sequenciar as animações
      const tl = gsap.timeline({ delay: 0.5 })

      // Animação do primeiro path (letra principal)
      tl.fromTo(
        '#path-main',
        {
          drawSVG: '0%',
          stroke: 'white',
          strokeWidth: 2,
          fill: 'transparent',
        },
        {
          drawSVG: '100%',
          duration: 2.5,
          ease: 'power2.inOut',
        }
      )
        // Preenche o primeiro path
        .to(
          '#path-main',
          {
            fill: 'white',
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5'
        )

        // Animação do segundo path (parte superior)
        .fromTo(
          '#path-top',
          {
            drawSVG: '0%',
            stroke: 'white',
            strokeWidth: 2,
            fill: 'transparent',
          },
          {
            drawSVG: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
          },
          '-=1'
        )
        // Preenche o segundo path
        .to(
          '#path-top',
          {
            fill: 'white',
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3'
        )

      // Animação de entrada do container
      gsap.fromTo(
        logoRef.current,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'back.out(1.7)',
        }
      )
    }
  }, [])

  return (
    <motion.div
      ref={logoRef}
      className={`absolute top-3 left-3 cursor-pointer ${containerStyle}`}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
    >
      <svg
        width={width || 120}
        height={height || 96}
        viewBox="0 0 589 472"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="path-main"
          d="M293.886 141L301.386 67.5L190.386 92.5C164.574 99.7224 149.024 101.35 124.886 113C106.394 121.925 96.2245 127.935 80.3856 141C54.4381 162.404 42.5353 178.726 26.8856 208.5C8.35198 243.76 2.08775 267.202 0.385578 307C-1.23029 344.78 1.88565 370.5 16.3856 402.5C31.5652 436 63.8854 463.5 106.886 470C127.737 473.152 160.886 470 160.886 470L258.886 448L277.886 287L300.886 283L283.886 442.5L355.886 426L373.886 266L562.885 223L570.385 147L358.136 196.25C358.136 196.25 147.317 242.636 145.886 245.5C144.386 248.5 135.886 320.625 137.386 321C138.886 321.375 203.386 307 203.386 307L194.886 390.5C175.711 396.665 164.202 398.717 142.386 400L141.807 399.914C128.623 397.962 119.624 396.629 110.886 392C81.7295 376.555 71.6191 349.712 70.3856 307C70.3856 275 78.8856 245.5 95.3856 224C109.386 202 125.386 183.5 160.886 172.5L293.886 141Z"
          fill="transparent"
          stroke="transparent"
        />
        <path
          id="path-top"
          d="M311.385 184.5L324.885 60.5L588.385 0L579.385 74.5L389.885 118L384.885 168.5L311.385 184.5Z"
          fill="transparent"
          stroke="transparent"
        />
      </svg>
    </motion.div>
  )
}
