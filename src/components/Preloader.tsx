'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Logo } from './GlobalComponents/Logo'
import LiquidEther from './ui/LiquidEtherBackground'

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula o carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000) // 2 segundos de loading

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Adiciona classe ao body quando terminar o loading
      document.body.style.overflow = 'auto'
    } else {
      document.body.style.overflow = 'hidden'
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black to-gray-900 z-[999]"
        >
          <div className="text-center">
            {/* Logo/Inicial */}
            {/* <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className="mb-8"
            >
            </motion.div> */}
              <Logo containerStyle="!top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%]" />
              <LiquidEther colors={['#C7C7C7', '#B5B2B3', '#CFCFCF']} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
