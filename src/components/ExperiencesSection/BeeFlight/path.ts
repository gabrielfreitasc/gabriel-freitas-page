// Trajetória da abelha como função pura do progresso do scroll: a pose nunca é
// acumulada frame a frame, então subir o scroll ou pular para outra seção
// sempre devolve a abelha à posição exata daquele ponto do trajeto.

export interface ScreenPoint {
  x: number
  y: number
}

// Ponto na tela (px) + profundidade no mundo (z; o card fica em z = 0)
export interface FlightPoint extends ScreenPoint {
  z: number
}

export interface SpiralConfig {
  radius: number // px
  turns: number
  depth: number // amplitude em z (unidades do mundo)
}

// Profundidade final: atrás do plano do card (oclusor em z = 0)
export const Z_BEHIND = -2.5
// Profundidade de cruzeiro: na frente do card durante o voo
const Z_CRUISE = 1

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export function flightPoint(
  t: number,
  start: ScreenPoint,
  target: ScreenPoint,
  { radius, turns, depth }: SpiralConfig
): FlightPoint {
  const p = clamp01(t)
  // Eixo da espiral: do ponto de partida até o centro do card
  const w = smoothstep(0, 1, p)
  const axisX = start.x + (target.x - start.x) * w
  const axisY = start.y + (target.y - start.y) * w

  // Raio nasce e morre em 0, então o início e o fim do voo são contínuos
  const r = Math.sin(Math.PI * p)
  const theta = Math.PI * 2 * turns * p

  // Mergulho para trás do card só no trecho final
  const dive = smoothstep(0.72, 0.96, p)
  const zBase = Z_CRUISE + (Z_BEHIND - Z_CRUISE) * dive

  return {
    x: axisX + radius * r * Math.sin(theta),
    y: axisY - radius * 0.35 * r * Math.sin(theta * 2),
    z: zBase + depth * r * Math.cos(theta) * (1 - dive),
  }
}
