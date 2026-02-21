import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { useEffect, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import { GoHome } from 'react-icons/go'
import { HiDocumentText } from 'react-icons/hi'
import { IoLogoNodejs } from 'react-icons/io5'
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

  const handleNavClick = (
    e: React.MouseEvent,
    link: (typeof navLinks)[number]
  ) => {
    e.preventDefault()
    setActiveLink(link.name)
    const smoother = ScrollSmoother.get()
    if (smoother) {
      smoother.scrollTo(`#${link.sectionId}`, true)
    } else {
      document
        .getElementById(link.sectionId)
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed z-[999] animate-float bottom-4 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:translate-x-0">
      <ul className="flex flex-row sm:flex-col items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800 shadow-2xl transition-all duration-300 hover:scale-105">
        {navLinks.map(link => (
          <li key={link.name} className="relative group">
            <a
              href={`#${link.sectionId}`}
              onClick={e => handleNavClick(e, link)}
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
              <link.icon className="text-xl rotate-icon" />
            </a>
            {linkHovered === link.name && (
              <span
                ref={spanRef}
                className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 w-fit rounded-full bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 text-xs text-white whitespace-nowrap backdrop-blur-sm"
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

const navLinks: { name: string; sectionId: string; icon: IconType }[] = [
  { name: 'Página Inicial', sectionId: 'hero', icon: GoHome },
  { name: 'Stacks', sectionId: 'stacks', icon: IoLogoNodejs },
  { name: 'Experiências', sectionId: 'experiences', icon: MdWork },
  { name: 'Cursos', sectionId: 'courses', icon: HiDocumentText },
]
