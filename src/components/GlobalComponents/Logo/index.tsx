import useGlobalContext from '@/context/GlobalContext'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function Logo({
  containerStyle,
  width,
  height,
}: {
  containerStyle?: string
  width?: number
  height?: number
}) {
  const { isLoading } = useGlobalContext()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Só toca a animação da logo depois que o preloader sai da tela
  useEffect(() => {
    if (!isLoading) {
      videoRef.current?.play().catch(() => {})
    }
  }, [isLoading])

  return (
    <motion.div
      className={`absolute top-3 left-3 cursor-pointer ${containerStyle}`}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
    >
      <video
        ref={videoRef}
        src="/assets/videos/logo_reveal_160.webm"
        width={width || 120}
        height={height || 96}
        muted
        playsInline
        preload="auto"
      />
    </motion.div>
  )
}
