import {
  FilePdfIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { RefObject } from 'react'
import LiquidEther from '../ui/LiquidEtherBackground'
import RotatingText from '../ui/TextUI/RotatingText'
import ShuffleText from '../ui/TextUI/ShuffleText'

interface HeroSectionProps {
  containerRef: RefObject<HTMLDivElement | null>
}

export function HeroSection({ containerRef }: HeroSectionProps) {
  const handleDownloadPDF = () => {
    const link = document.createElement('a')
    link.href = '/assets/Gabriel_Freitas_Coelho_Currículo.pdf'
    link.download = 'Gabriel_Freitas_Coelho_Currículo.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <section className="w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-2 relative">
      <div className="absolute inset-0 z-0 w-full h-full" data-speed="0.5">
        <LiquidEther
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
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-50"
        data-speed="0.8"
      >
        {/* <h1 className="text-9xl uppercase font-sans font-bold text-white mb-4">
            Gabriel Freitas
          </h1> */}
        <ShuffleText
          text="Gabriel Freitas"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={false}
          triggerOnHover={false}
          respectReducedMotion={true}
          loop={true}
          loopDelay={1.5}
          className="!text-9xl uppercase font-bold text-white"
        />
        <div className="flex items-center justify-center gap-3 mb-20">
          <p className="text-xl text-white font-bold">Desenvolvedor</p>
          <RotatingText
            texts={['Front-end', 'Back-end', 'Full Stack']}
            mainClassName="px-2 sm:px-2 md:px-3 liquid-background-blur text-white font-extrabold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
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

        <div className="flex items-center gap-3 w-full justify-center">
          {socialMediaLinks.map(link => (
            <motion.button
              key={link.name}
              onClick={() =>
                link.name === 'Curriculo'
                  ? handleDownloadPDF()
                  : window.open(link.url, '_blank')
              }
              title={link.name}
              whileTap={{ scale: 0.8 }}
              className="tooltip hover:scale-110 ease-in-out duration-300 text-white hover:text-white/60 p-2 rounded-md liquid-background-blur group"
            >
              {link.icon}
            </motion.button>
          ))}
        </div>

        {/* // Cursos relevantes */}
      </motion.div>
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
