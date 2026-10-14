'use client'

import { GithubLogoIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose } from 'react-icons/io5'

const VIDEO_SRC = '/assets/videos/FlyWireProject.mp4'

// Só baixa/decodifica o vídeo quando o card entra na viewport e pausa ao sair,
// para não consumir CPU com o vídeo fora da tela
export function DashboardContent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isModalOpenRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true)
          if (!isModalOpenRef.current) video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  // Quando o src é definido após o primeiro play(), retoma assim que carregar
  useEffect(() => {
    if (hasEnteredView) videoRef.current?.play().catch(() => {})
  }, [hasEnteredView])

  // Com o modal aberto: pausa o vídeo do card, trava o scroll suave e fecha com Esc
  useEffect(() => {
    isModalOpenRef.current = isModalOpen
    if (!isModalOpen) {
      if (hasEnteredView) videoRef.current?.play().catch(() => {})
      return
    }

    videoRef.current?.pause()
    const smoother = ScrollSmoother.get()
    smoother?.paused(true)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      smoother?.paused(false)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isModalOpen, hasEnteredView])

  return (
    <div className="w-full h-full bg-black relative">
      <video
        ref={videoRef}
        src={hasEnteredView ? VIDEO_SRC : undefined}
        className="w-full h-full object-cover cursor-pointer"
        preload="none"
        muted
        loop
        playsInline
        onClick={() => setIsModalOpen(true)}
        aria-label="Abelha no Minecraft controlada pelo conectoma simulado da Drosophila"
      />

      {/* Portal no body: o #smooth-content do ScrollSmoother usa transform, o que
          quebraria o position: fixed do modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsModalOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label="Vídeo do projeto FlyWire on Minecraft"
              >
                <motion.div
                  className="relative w-full max-w-6xl"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Fechar vídeo"
                  >
                    <IoClose className="text-2xl" />
                  </button>
                  <video
                    src={VIDEO_SRC}
                    className="w-full max-h-[85vh] rounded-xl bg-black"
                    autoPlay
                    controls
                    loop
                    playsInline
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}
