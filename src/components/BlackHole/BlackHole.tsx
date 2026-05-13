'use client'

import React, { useRef } from 'react'
import { useBlackHole } from './useBlackHole'
import { BLACK_HOLE_DEFAULTS } from './blackHoleDefaults'
import { BlackHoleProps } from './types'

export function BlackHole({
  width = '100%',
  height = '100%',
  config,
  className,
  style,
}: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const mergedConfig = {
    ...BLACK_HOLE_DEFAULTS,
    ...config,
  }

  useBlackHole(canvasRef, mergedConfig)

  const w = typeof width === 'number' ? `${width}px` : width
  const h = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      style={{ width: w, height: h, overflow: 'hidden', ...style }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
