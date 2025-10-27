'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import moment from 'moment'
import { toast } from 'react-toastify'
import LiquidEther from '@/components/ui/LiquidEtherBackground'
import ShuffleText from '@/components/ui/TextUI/ShuffleText'
import RotatingText from '@/components/ui/TextUI/RotatingText'
import { PatternText } from '@/components/ui/TextUI/PatternText'
import ShinyText from '@/components/ui/TextUI/ShinyText'
import {
  FilePdfIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react'
import GradualBlurMemo from '@/components/ui/GradualBlur'
import ScrollFloat from '@/components/ui/ScrollFloat'

export default function Home() {
  const boxRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 40,
    restDelta: 0.001,
  })

  useEffect(() => {
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'linear',
      })
    }
  }, [])

  const handleDownloadPDF = () => {
    const link = document.createElement('a')
    link.href = '/assets/Gabriel_Freitas_Coelho_Currículo.pdf'
    link.download = 'Gabriel_Freitas_Coelho_Currículo.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main
      ref={containerRef}
      className="flex min-h-screen w-full flex-col items-center justify-center relative bg-background"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-2">
        <div className="absolute inset-0 z-0 w-[100vw] h-[100vh]">
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
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
              mainClassName="px-2 sm:px-2 md:px-3 background-animated text-white font-extrabold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
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
                data-tip={link.name}
                whileTap={{ scale: 0.8 }}
                className="tooltip text-white hover:text-white/60 transition-colors p-2 rounded-md bg-metallic-purple bg-metallic-noise group"
              >
                {link.icon}
              </motion.button>
            ))}
          </div>

          {/* // Cursos relevantes */}
        </motion.div>
      </div>

      <div className="w-[100vw] h-[100vh] flex flex-col items-center gap-2 bg-neutral-950 p-2">
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
          textClassName="!text-7xl uppercase font-bold text-white"
        >
          Cursos relevantes
        </ScrollFloat>

        {courses.map(course => (
          <div key={course.name}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>

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

const courses = [
  {
    name: 'React Bits',
    description: 'React Bits',
  },
  {
    name: 'React Bits',
    description: 'React Bits',
  },
  {
    name: 'React Bits',
    description: 'React Bits',
  },
]
