export type PerfTier = 'low' | 'high'

let cached: PerfTier | null = null

type NavigatorWithHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

// Estimativa grosseira da capacidade do aparelho, usada para reduzir a
// qualidade das animações pesadas (densidade de chuva, resolução do WebGL,
// taxa de atualização) em máquinas fracas, celulares e modo economia de dados.
export function getPerfTier(): PerfTier {
  if (cached) return cached
  if (typeof window === 'undefined') return 'high'

  const nav = navigator as NavigatorWithHints
  const cores = nav.hardwareConcurrency || 8
  const memory = nav.deviceMemory ?? 8
  const saveData = Boolean(nav.connection?.saveData)
  const smallTouch =
    window.matchMedia('(pointer: coarse)').matches &&
    Math.min(window.screen.width, window.screen.height) < 820

  cached = saveData || cores <= 4 || memory <= 4 || smallTouch ? 'low' : 'high'
  return cached
}
