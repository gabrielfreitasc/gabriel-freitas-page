'use client'

import React from 'react'
import './styles.css'

interface PatternTextProps {
  children: React.ReactNode
  className?: string
  speed?: number // velocidade da animação em segundos
  pattern?: 'stripes' | 'dots' | 'gradient' | 'waves'
}

export const PatternText: React.FC<PatternTextProps> = ({
  children,
  className = '',
  speed = 3,
  pattern = 'stripes',
}) => {
  return (
    <span
      className={`pattern-text pattern-text-${pattern} ${className}`}
      style={{ '--animation-speed': `${speed}s` } as React.CSSProperties}
    >
      {children}
    </span>
  )
}
