import {
  FilePdfIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react'
import { varnyx } from '@/fonts'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInView } from '@/hooks/useInView'
import { RefObject, useEffect, useRef } from 'react'
import { KnightRainBackground } from '../KnightRainBackground'
import RotatingText from '../ui/TextUI/RotatingText'
import { Dock, DockIcon } from '../ui/dock'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

gsap.registerPlugin(ScrollTrigger)

// Scroll (em alturas de tela) em que o nome sai de trás do cavaleiro
const ANIMATION_SCREENS = 1.5
// Scroll extra com tudo já no lugar: o usuário precisa de mais um gesto de
// rolagem antes de o hero soltar e a próxima seção subir
const HOLD_SCREENS = 0.5
// Total que o hero fica preso. Usado também pelo HomeContent.
export const HERO_PIN_SCREENS = ANIMATION_SCREENS + HOLD_SCREENS
// Tamanho final do cavaleiro (1 = tamanho inicial)
const KNIGHT_END_SCALE = 0.55
// Desfoque (px) do nome enquanto ainda está atrás do cavaleiro; some conforme
// ele sai de trás e fica nítido
const TITLE_BLUR = 10
// Fração da animação em que o nome termina de sair de trás do cavaleiro
const TITLE_CLEAR_AT = 0.8
// Quanto o cavaleiro desce (fração da altura da tela) enquanto encolhe
const KNIGHT_END_DROP = 0.06

interface HeroSectionProps {
  containerRef: RefObject<HTMLDivElement | null>
}

export function HeroSection({ containerRef }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // O cargo que alterna só roda enquanto o hero está na tela
  const heroInView = useInView(sectionRef)

  // Ao rolar: o hero fica preso, o cavaleiro encolhe e o nome cresce e sobe de
  // trás dele; por fim o restante do conteúdo aparece.
  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const content = contentRef.current
    const knightRoot = section?.querySelector<HTMLElement>('[data-knight-root]')
    if (!section || !title || !content || !knightRoot) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Um refresh do ScrollTrigger (altura do conteúdo abaixo mudando, como os
    // slides carregados sob demanda) reverte a timeline por causa do
    // invalidateOnRefresh. Se o scroll já estava no fim do pin ela não é
    // renderizada de novo e o cavaleiro/nome voltavam ao estado inicial.
    // Ao fim de cada refresh, reaplica o progresso real do scroll.
    let tlRef: gsap.core.Timeline | null = null
    const resync = () => {
      const st = tlRef?.scrollTrigger
      if (tlRef && st) tlRef.progress(0, true).progress(st.progress)
    }
    ScrollTrigger.addEventListener('refresh', resync)

    const ctx = gsap.context(() => {
      gsap.set(title, {
        scale: 0.3,
        autoAlpha: 0,
        y: () => window.innerHeight * 0.12,
      })
      gsap.set(content, { autoAlpha: 0 })
      // O estado do cavaleiro vai para data-attributes, lidos pela cena a cada
      // frame. Variáveis CSS no elemento raiz invalidariam o estilo de toda a
      // subárvore a cada tick do scroll.
      const knight = { scale: 1, drop: 0 }
      const applyKnight = () => {
        knightRoot.dataset.knightScale = String(knight.scale)
        knightRoot.dataset.knightDrop = String(knight.drop * window.innerHeight)
      }
      applyKnight()
      // Desfoque do nome via objeto auxiliar: 'none' quando nítido, para não
      // manter o filtro (e a camada extra) ativo sem necessidade
      const blur = { v: TITLE_BLUR }
      const applyBlur = () => {
        const v = Math.round(blur.v * 2) / 2
        title.style.filter = v > 0 ? `blur(${v}px)` : 'none'
      }
      applyBlur()

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * HERO_PIN_SCREENS}`,
          pin: true,
          // scrub direto: o ScrollSmoother já suaviza, e somar um atraso
          // de scrub deixa o scroll com cara de lento
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tlRef = tl
      tl.to(
        knight,
        {
          scale: KNIGHT_END_SCALE,
          drop: KNIGHT_END_DROP,
          duration: 1,
          onUpdate: applyKnight,
        },
        0
      )
        .to(title, { autoAlpha: 1, duration: 0.2 }, 0)
        .to(
          blur,
          {
            v: 0,
            duration: TITLE_CLEAR_AT,
            ease: 'power1.in',
            onUpdate: applyBlur,
          },
          0
        )
        .to(title, { scale: 1, y: 0, duration: 0.85, ease: 'power2.out' }, 0)
        .to(content, { autoAlpha: 1, duration: 0.3 }, 0.7)
        // pausa: a timeline segue por mais um trecho sem nada animando
        .to({}, { duration: HOLD_SCREENS / ANIMATION_SCREENS }, 1)
    }, section)

    return () => {
      ScrollTrigger.removeEventListener('refresh', resync)
      ctx.revert()
      title.style.filter = ''
      delete knightRoot.dataset.knightScale
      delete knightRoot.dataset.knightDrop
    }
  }, [])

  const handleDownloadPDF = () => {
    const link = document.createElement('a')
    link.href = '/assets/CV_GabrielFreitas.pdf'
    link.download = 'CV_GabrielFreitas.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <section
      ref={sectionRef}
      className="w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-2 relative bg-neutral-950"
    >
      <KnightRainBackground minScale={KNIGHT_END_SCALE} />
      {/* Fora do motion.div (que cria contexto de empilhamento próprio): assim
          o nome fica entre o céu e o cavaleiro (z-20 no KnightRainBackground),
          enquanto o resto do conteúdo continua na frente */}
      <h1
        ref={titleRef}
        className={`${varnyx.className} relative z-10 text-center text-5xl sm:text-7xl lg:text-9xl leading-tight mb-2 sm:mb-6 uppercase font-normal text-white`}
      >
        Gabriel Freitas
      </h1>
      {/* Wrapper só com opacidade (sem transform, para não mudar o
          posicionamento da coroa de louros); a entrada do Framer Motion fica
          no filho */}
      <div ref={contentRef} className="z-50">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div
            className={`${varnyx.className} flex items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-20`}
          >
            <p className="text-base sm:text-xl text-white">Desenvolvedor</p>
            <RotatingText
              auto={heroInView}
              texts={['Front-end', 'Back-end', 'Full Stack']}
              mainClassName="px-2 sm:px-2 md:px-3 liquid-background-blur text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={'last'}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>

          <div className="relative">
            <TooltipProvider>
              <Dock direction="middle">
                {socialMediaLinks.map(link => (
                  <DockIcon
                    onClick={() =>
                      link.name === 'Curriculo'
                        ? handleDownloadPDF()
                        : window.open(link.url, '_blank')
                    }
                    key={link.name}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="size-10 p-3 flex items-center justify-center rounded-lg hover:bg-white/10 ease-in-out duration-300">
                          {link.icon}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="!bg-white !text-black">
                        {link.name}
                      </TooltipContent>
                    </Tooltip>
                  </DockIcon>
                ))}
              </Dock>
            </TooltipProvider>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const socialMediaLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/gabrielfreitasc',
    icon: <GithubLogoIcon weight="fill" className="rotate-icon" />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/gabriel-freitasdev/',
    icon: <LinkedinLogoIcon weight="fill" className="rotate-icon" />,
  },
  {
    name: 'Curriculo',
    // url: 'https://www.instagram.com/gabrielfreitas/',
    icon: <FilePdfIcon weight="fill" className="rotate-icon" />,
  },
]
