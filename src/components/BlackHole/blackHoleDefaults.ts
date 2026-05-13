import { BlackHoleConfig } from './types'

export const BLACK_HOLE_DEFAULTS: BlackHoleConfig = {
  resolution: 1,
  quality: 'low',
  distance: 10,
  fov: 90,
  bloomStrength: 1,
  bloomRadius: 0.5,
  bloomThreshold: 0.6,
  orbit: true,
  lorentzTransform: true,
  dopplerShift: true,
  beaming: true,
  accretionDisk: true,
  useDiskTexture: true,
}
