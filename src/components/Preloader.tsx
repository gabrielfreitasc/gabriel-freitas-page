'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Logo } from './GlobalComponents/Logo'
import LiquidEther from './ui/LiquidEtherBackground'

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [logoExiting, setLogoExiting] = useState(false)

  useEffect(() => {
    // Inicia o zoom+fade da logo
    const logoTimer = setTimeout(() => {
      setLogoExiting(true)
    }, 5000)

    // Após a animação da logo (700ms), some o background
    const exitTimer = setTimeout(() => {
      setIsLoading(false)
    }, 5700)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(exitTimer)
    }
  }, [])

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
          {/* Background — permanece visível enquanto a logo some */}
          <LiquidEther colors={['#C7C7C7', '#B5B2B3', '#CFCFCF']} />

          {/* Layer da logo — zoom + fade independente do background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 1, opacity: 1 }}
            animate={
              logoExiting ? { scale: 7, opacity: 0 } : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.7, ease: [0.4, 0, 1, 1] }}
          >
            <Logo containerStyle="!top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
