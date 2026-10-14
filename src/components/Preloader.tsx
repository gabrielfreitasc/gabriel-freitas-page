'use client'

import { AnimatePresence, motion } from 'framer-motion'
import useGlobalContext from '@/context/GlobalContext'
import { useEffect, useRef } from 'react'
import LiquidEther from './ui/LiquidEtherBackground'

// Duração máxima do loading, mesmo que o vídeo não termine/não carregue
const MAX_LOADING_MS = 7000

export default function Preloader() {
  const { isLoading, setIsLoading } = useGlobalContext()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsLoading(false)
    }, MAX_LOADING_MS)

    // Garante o autoplay mesmo se o atributo for ignorado pelo navegador
    videoRef.current?.play().catch(() => {})

    return () => clearTimeout(exitTimer)
  }, [setIsLoading])

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto'
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 bg-gradient-to-br from-black to-gray-900 z-[999]"
        >
          {/* Background — permanece visível durante a animação da logo */}
          <LiquidEther colors={['#C7C7C7', '#B5B2B3', '#CFCFCF']} />

          {/* Animação da logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <video
              ref={videoRef}
              src="/assets/videos/logo_reveal_600.webm"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={() => setIsLoading(false)}
              className="w-[42vw] max-w-[288px] h-auto"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
