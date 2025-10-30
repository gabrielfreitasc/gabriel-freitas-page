import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Link from 'next/link'
import { IconBaseProps, IconType } from 'react-icons'
import { FaNodeJs } from 'react-icons/fa'
import { GoHome } from 'react-icons/go'
import { IoPerson } from 'react-icons/io5'
import { PiCertificateFill, PiProjectorScreenChartFill } from 'react-icons/pi'
import React, { useState, useRef, useEffect } from 'react'

export function NavBar() {
  const [linkHovered, setLinkHovered] = useState<string | null>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (spanRef.current) {
      if (linkHovered) {
        // Animação de entrada - vem do fundo
        gsap.fromTo(
          spanRef.current,
          {
            opacity: 0,
            scale: 0.8,
            z: -100,
            rotationX: -90,
          },
          {
            opacity: 1,
            scale: 1,
            z: 0,
            rotationX: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
          }
        )
      } else {
        // Animação de saída - vai para o fundo
        gsap.to(spanRef.current, {
          opacity: 0,
          scale: 0.8,
          z: -50,
          rotationX: 90,
          duration: 0.8,
          ease: 'power2.in',
        })
      }
    }
  }, [linkHovered])

  return (
    <nav className="flex flex-col items-center justify-center gap-4 fixed top-3 left-0 right-0 z-[999]">
      <ul className="hover:scale-105 ease-in-out duration-500 flex items-center justify-center gap-3 p-2 rounded-lg border border-white/70">
        {navLinks.map(link => (
          <div key={link.name} className="relative">
            <Link
              href={link.url}
              className="hover:scale-110 hover:bg-white/10 rounded-md border border-white/70 p-3 flex items-center justify-center text-white/70 group cursor-pointer ease-in-out duration-300"
              onMouseEnter={() => setLinkHovered(link.name)}
              onMouseLeave={() => setLinkHovered(null)}
            >
              <link.icon className="rotate-icon" />
            </Link>
            {linkHovered === link.name && (
              <span
                ref={spanRef}
                className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-fit rounded-md border border-white/70 p-1 px-2 text-[10px] text-white/90 bg-black/20 backdrop-blur-sm whitespace-nowrap"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
              >
                {link.name}
              </span>
            )}
          </div>
        ))}
      </ul>
    </nav>
  )
}

const navLinks: { name: string; url: string; icon: IconType }[] = [
  { name: 'Página Inicial', url: '/', icon: GoHome },
  { name: 'Sobre Mim', url: '/about', icon: IoPerson },
  { name: 'Cursos Relevantes', url: '/courses', icon: PiCertificateFill },
  { name: 'Tecnologias', url: '/tecnologies', icon: FaNodeJs },
  { name: 'Projetos', url: '/projects', icon: PiProjectorScreenChartFill },
]
