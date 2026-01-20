import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import { GoHome } from 'react-icons/go'
import { HiDocumentText } from 'react-icons/hi'
import { IoMail, IoPerson } from 'react-icons/io5'
import { MdWork } from 'react-icons/md'

export function NavBar() {
  const [linkHovered, setLinkHovered] = useState<string | null>(null)
  const [activeLink, setActiveLink] = useState<string>('Página Inicial')
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (spanRef.current) {
      if (linkHovered) {
        gsap.fromTo(
          spanRef.current,
          {
            opacity: 0,
            x: 10,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: 'power2.out',
          }
        )
      }
    }
  }, [linkHovered])

  return (
    <nav className="fixed right-6 top-1/2 z-[999] animate-float">
      <ul className="flex flex-col items-center gap-6 p-4 rounded-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800 shadow-2xl transition-all duration-300 hover:scale-105">
        {navLinks.map((link, index) => (
          <li key={link.name} className="relative">
            <Link
              href={link.url}
              onClick={() => setActiveLink(link.name)}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                transition-all duration-300 ease-out
                ${
                  activeLink === link.name
                    ? 'bg-white/80 text-zinc-800 scale-110'
                    : 'bg-transparent text-white/60 p-0.5 hover:text-white hover:bg-white/10'
                }
              `}
              onMouseEnter={() => setLinkHovered(link.name)}
              onMouseLeave={() => setLinkHovered(null)}
            >
              <link.icon className="text-xl" />
            </Link>
            {linkHovered === link.name && (
              <span
                ref={spanRef}
                className="absolute right-16 top-1/2 -translate-y-1/2 w-fit rounded-full bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 text-xs text-white whitespace-nowrap backdrop-blur-sm"
              >
                {link.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

const navLinks: { name: string; url: string; icon: IconType }[] = [
  { name: 'Página Inicial', url: '/', icon: GoHome },
  { name: 'Sobre Mim', url: '/about', icon: IoPerson },
  { name: 'Projetos', url: '/projects', icon: MdWork },
  { name: 'Cursos', url: '/courses', icon: HiDocumentText },
  { name: 'Contato', url: '/contact', icon: IoMail },
]
