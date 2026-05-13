export interface BlackHoleConfig {
  resolution: 0.25 | 0.5 | 1 | 2 | 4
  quality: 'low' | 'medium' | 'high'

  distance: number
  fov: number

  bloomStrength: number
  bloomRadius: number
  bloomThreshold: number

  orbit: boolean

  lorentzTransform: boolean
  dopplerShift: boolean
  beaming: boolean

  accretionDisk: boolean
  useDiskTexture: boolean
}

export interface BlackHoleProps {
  width?: string | number
  height?: string | number
  config?: Partial<BlackHoleConfig>
  className?: string
  style?: React.CSSProperties
}
