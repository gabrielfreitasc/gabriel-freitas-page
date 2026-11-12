import { getPerfTier } from '@/lib/perf'

// Cavaleiro em ASCII ajoelhado na grama, sob chuva e vento, com cachecol
// vermelho tremulando. Tudo é texto em <pre>, recalculado a cada frame.

const FIG0 = [
  '                                                +;:+x                                                                 ',
  '                                               $+;;+Xxx$                                                              ',
  '                                               $;+xxXXxx$xxx;x                                                        ',
  '                                               x:;x$&&&++xxxxxxX                                                      ',
  '                         &&$X$&x;x;x          X+:;+xx+;$&X&$Xxx+xx$                                                   ',
  '                        $xx$X+XXx$$$$::+     X$;:;;;;++;x&&&&$xxxxxxxx                                                ',
  '                       x$$x$$;:;x+&$Xxx;;+;::;:;;;::::;:.:+;;x&$&Xxx;;x                                               ',
  '                      xxx+XXx:x&&&X+xxX;x::::.:;:+:.;;;;:;;xxxx;++$Xxxxxx                                             ',
  '                     xxxxxxxxxXXXx;xxXx+;:;x++::::::.;:;+;;+xx;:.:....;x+++                                           ',
  '                     +;+xxxx++x+;;++;;;;::;x+;;::::;.:;;+;;:.::::::..::+++x                                           ',
  '                    x;;;:;x;::+x;;+;;:;;;;+X;+;:::::...;:.:::+::;;::.;;;;+xX                                          ',
  '                    +;;;:;;;;;;:;;:;:;::;;;;;;:;;;::....:::;;:+x&X+;:::+;;;x                                          ',
  '                    x;:;:;;;;::;:::::::;;;;.:::;:::;:...::;;;;;;;;;;;.:;:;;:;                                         ',
  '                     ;:::::::::::::;x:;:;::;:::;:;;;:;...;;;+x;x++x;+:..;;:;;x                                        ',
  '                     ;;:::::::.:::+:::::::::::.::::;:::.::;x;;:x;..:::.:::+x;+X                                       ',
  '                      x::::::::;;x::;;::::::::.;;;::;:...::++:::;;;+;;:.::::;::;:                                     ',
  '                      ;;::::::;;;.:::::::::::.:;;;:::::..;x++;;;x+;+;;;.::;:.x;.;                                     ',
  '                      ;:.::::;;:.::.:.:::::...:;:;;;;::.:;;::;;;::+;;+;:.::;;:;.;:                                    ',
  '                      :::.:x+:..:.:::;:::::..::;::::;;::::;;:...:;;;:;x:...::.:.::+                                   ',
  '                      ;:::::::::::....::::::::::::;:::::.:::;::::::::::;::.:;:;::+                                    ',
  '                     x;+:::;:::::::.::.:::.:::;::::::::..::+;;;+X&x:;;;;:::;:::;;x;                                   ',
  '                     x;:;:::::::::..::.::..:::::;::::..+&&xxx$x;;;;.:;;;:...::...:;;                                  ',
  '                     ;;+::::;:;::::::.:;::.......::xxX;;X;;;:++;;;:;:;x;:.....;:::::                                  ',
  '                     xx+:::;:::::.:.:.....::;x+xXx$X;x;::+x;.:;;:::::::+.....:.;:::;:                                 ',
  '                     x;;::;::::::::.:+  :::;&XX+x;::::.::;;:..::::::.......::..X:;::;:         x;$X                   ',
  '                      ::;;:::;;.:::::X  +;:xx;:::.::::.:;:::....:::...........:::;:;:;        $xxx::                  ',
  '                      ;+++;;;:::::::;; x;;;:;::..::::::....;.:;;;:::.......:.:..::;;;:: x;;:;:;:;;                    ',
  '                     +:::;;xxx:;:::  ::.;:;..;:..:;;:...:;;X$XXx:;+x;;;;:::::;:++xx;++;;:::::x  x+                    ',
  '                     +:..:;:+;:::::  x...+;...:.........;x&:xx;x:::x::;:xxx:;x;$+;xx+::;::x                           ',
  '                   +;::::;;;;::.::   $;.:.:;:..::......+xxX&$;;:::+;::;;;;+x:xxx:.;x:;;;.                             ',
  '                   ;;:::::;;;::.:    ;.;;:.::.:x::....:;+;;;;:;:.;x;:::;;:;+;:xx::.;+;;:;:                            ',
  '                  x;:::::::;::.;;    ;:;;::;:.;::......;;;;;:.;;:::::::::;;++;::+:..:;;+::                            ',
  '                 x+xxx;:::::::.::    :;:+;...+;;;:....::::::;x::::::;:::::.+;;;;x+:..;+;;;x                           ',
  '                 xxXxX$;;:::::::;    :::.:::.$xx;;;::....::::::::.:;:::..:::;:::;;;:..;;+;+                           ',
  '                 x;;:Xx::::::::::     ::..:;:x+x;;:;:......:.....:..::;::+;;;:::;;:....;:;;;                          ',
  '                $::+......:::::::    $x::...::xx;;;:::...:........::...+::;;;;::x;;:.:..+;;;                          ',
  '                ;:::.;:....::::   +xx&$x:....;;;;::.:...:::...:..:.:..::::;;;:::+;;;:...:;:::                         ',
  '               x;:..;::....::   x;$&&$Xxx+..:;:;;::....::.:.....:.:.:.::::;;;:::;;;;::.::;;:;                         ',
  '               ;;;:;;;;....   xx;&$xxx++;;;;:;:;:::....;;::.;....:..::.:..;;;:::+;;;::.::.:;::                        ',
  '               ;:++;;;::... x;x;Xxx+++x;;:::::::::..;..;;:.........:.::::.+x;+:.;;;;::.::..:;;                        ',
  '              +;;;+;:::;:; +;;;x;+;;;;:;;;;::::;;;:...:;;;...::::::::::::.:;;;;.;;:;::.:::::.;+                       ',
  '              ;+x;;;::::;x;xx+;:;;:;:::;;;:::.::x.....+;;;:.::.....:::.+..::::::;+;;::::::::..:::                     ',
  '             ;;++;:;:::::;;:;;::::::;:::::::..........+:+x:.::.::...::::.:.....::x:::::::.....:;::                    ',
  '            +;xxx;:::::;:::::::::::::::::::::........:;::;:.:::.:::....x:.....;;;;+:::;x...::::;::                    ',
  '           $xxxxx;:::: ;::::::::::::....::...........;::;;:::;:.:;:;:..:::....;;;;+;::;....::::::;;;;+                ',
  '          xxxx;:;;;;:  ;:::::::::.:.................;::;;::::;:.:;:;;....;.....:;+++:::......:;:::;::;;;:;+           ',
  '      XxxXxxx;X+;::::   ::::...:.::X..;:..........:;x+;+:::::.::;:;x:...:.;......;;+;;;.......;;:.:;;:::;;;;;;;;;;    ',
  '  xx+x+xx+x$xx+X;;..     :::.......:...........::+++:...::.::;+;+;;.:..:.:...;:.:.:;:;;;;:;;;....:::::::..::;;;;;+;;::',
  'x;x;+xxx$xxx::x+;::        ::...................::.::::..x$:;;+;::::..:;::..:.....::::;;:::::...::::;;+:;;;;;;;;;;;;;;',
  ':x;;&&x;:;.....;..                   :::....::;::::;....:.:;;;;:;:...x::::.....;:...;....:;;;;;;;;;;;:.......;;:.::;; ',
  ' ;X:.:........+;                              ....:....::...::.:::...............:.........:;;;;:...                  ',
]
const FW = 118
const FH0 = 51

export interface KnightRainElements {
  scene: HTMLElement
  // Camada que contém toda a cena (chuva, grama, cavaleiro) e recebe o zoom
  world: HTMLElement
  fig: HTMLElement
  halo: HTMLElement
  // Chuva: tela inteira, atrás do cavaleiro (no espaço da tela, com zoom no JS)
  rainCanvas: HTMLCanvasElement
  // Cachecol e grama: dentro de `world`, na frente do cavaleiro. Vivem no
  // espaço do mundo, então o zoom do scroll é feito pelo compositor (CSS).
  scarfCanvas: HTMLCanvasElement
  grassCanvas: HTMLCanvasElement
}

interface Drop {
  li: number
  vy: number
  len: number
  y: number
  x: number
  depth: number
}

interface Splash {
  x: number
  y: number
  life: number
  big: boolean
}

interface Frag {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  n: number
  salt: number
}

// Monta a cena no tamanho atual de `els.scene` e inicia a animação.
// `minScale` é o menor zoom que o container aplicará à cena (via CSS, em
// `world`): a grade é montada grande o bastante para ainda cobrir a tela
// nesse zoom, então chuva, grama e cavaleiro escalam juntos.
// Retorna uma função que para o loop.
export function startKnightRain(
  els: KnightRainElements,
  minScale = 1
): () => void {
  const CELL = 0.64 // largura da célula ≈ 0.64 × altura
  const FH = FH0
  let frameCost = 4
  let raf = 0
  let lastG = -1
  let lastB = NaN
  let lastHalo = ''
  let lastGrass = -1
  // aparelhos fracos começam em ~30fps; os demais só caem para isso se precisar
  const low = getPerfTier() === 'low'
  const baseGap = low ? 32 : 0
  // intervalo entre ticks da grama; sobe sozinho se o aparelho demora para
  // desenhá-la e volta ao normal quando sobra folga
  const GRASS_EVERY = low ? 0.09 : 0.05
  let grassEvery = GRASS_EVERY
  let grassCost = 0
  let grassStart = 0
  let minGap = baseGap
  let gapEma = 16.7
  let prevRaf = 0
  let slowCount = 0
  let fastCount = 0
  const dirty = new Uint8Array(FH0).fill(1)

  const {
    scene,
    world,
    fig: figEl,
    halo,
    rainCanvas,
    scarfCanvas,
    grassCanvas,
  } = els
  figEl.textContent = ''

  // mede a fonte e monta uma grade que cobre o container inteiro
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'
  probe.textContent = 'M'.repeat(1000)
  figEl.style.fontSize = '20px'
  figEl.appendChild(probe)
  // offsetWidth (e não getBoundingClientRect): ignora transforms, então a
  // medição não muda quando o cavaleiro está encolhido pelo scroll
  const gw = probe.offsetWidth / 1000 / 20
  figEl.removeChild(probe)
  const lhr = gw / CELL
  const vw = scene.clientWidth || window.innerWidth
  const vh = scene.clientHeight || window.innerHeight
  // o cavaleiro ocupa ~60% da altura (ou 82% da largura em telas estreitas)
  const fs = Math.max(
    4,
    Math.min((vh * 0.6) / (FH * lhr), (vw * 0.82) / (FW * gw))
  )
  const cw = gw * fs
  const lh = lhr * fs
  // grade maior que a tela, ancorada embaixo e centralizada (o zoom usa o
  // centro da base como origem)
  const zoom = 1 / Math.min(1, Math.max(0.2, minScale))
  const VROWS = Math.ceil(vh / lh) + 1
  const COLS = Math.ceil((vw * zoom) / cw) + 1
  const ROWS = Math.ceil((vh * zoom) / lh) + 1
  const B = Math.max(7, Math.round(VROWS * 0.13)) // faixa de chão abaixo do cavaleiro
  const TOP = Math.max(2, ROWS - B - FH)
  const OX = Math.max(0, Math.round((COLS - FW) / 2))
  const CX = OX + FW / 2
  const LEAD = ' '.repeat(OX)
  const FIG = FIG0.map(l => LEAD + l)

  figEl.style.fontSize = fs.toFixed(2) + 'px'
  figEl.style.lineHeight = lh.toFixed(3) + 'px'
  figEl.style.top = (TOP * lh).toFixed(2) + 'px'
  const worldW = COLS * cw
  const worldH = ROWS * lh
  world.style.width = worldW.toFixed(1) + 'px'
  world.style.height = worldH.toFixed(1) + 'px'
  world.style.left = ((vw - worldW) / 2).toFixed(1) + 'px'
  world.style.top = (vh - worldH).toFixed(1) + 'px'
  world.style.transformOrigin =
    (worldW / 2).toFixed(1) + 'px ' + worldH.toFixed(1) + 'px'
  halo.style.left = (OX - 12) * cw + 'px'
  halo.style.width = (FW + 24) * cw + 'px'
  halo.style.top = (TOP - 8) * lh + 'px'
  halo.style.height = (FH + 10) * lh + 'px'

  const rows = FIG.map(t => {
    const s = document.createElement('span')
    s.textContent = t
    figEl.appendChild(s)
    return s
  })
  rows.forEach(
    s => (s.style.transformOrigin = (CX * cw).toFixed(1) + 'px 100%')
  )
  const mask = new Uint8Array(COLS * ROWS)
  FIG.forEach((line, i) => {
    for (let x = 0; x < line.length && x < COLS; x++)
      if (line[x] !== ' ') mask[(TOP + i) * COLS + x] = 1
  })
  const occ = (x: number, y: number) =>
    x >= 0 && x < COLS && y >= 0 && y < ROWS && mask[y * COLS + x] === 1

  // aleatório determinístico
  let seed = 11
  const rnd = () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const N = COLS * ROWS
  const hA = new Float32Array(N)
  const hB = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    hA[i] = rnd()
    hB[i] = rnd()
  }

  // ---------- campo de grama ----------
  const GBASE = TOP + FH - 10 // a grama cobre a base do cavaleiro
  const edge = new Int16Array(COLS) // borda superior irregular
  for (let x = 0; x < COLS; x++) {
    const e =
      1.6 * Math.sin(x * 0.09 + 1.3) +
      1.1 * Math.sin(x * 0.23 + 0.4) +
      (rnd() - 0.5) * 1.4
    edge[x] = Math.round(GBASE + e)
  }
  const gChar = new Uint8Array(N) // códigos ASCII; só vale onde gCls != 0
  const gCls = new Uint8Array(N) // 0 = vazio

  // Tabelas: a grama calculava 3 sin + 1 pow por célula a cada tick (~25 mil
  // células). As ondas viram produtos de senos por coluna e por linha
  // (sin(a+b) = sin a cos b + cos a sin b) e o pow vira consulta.
  const POW_N = 1024
  const POW07 = new Float32Array(POW_N + 1)
  for (let k = 0; k <= POW_N; k++) POW07[k] = Math.pow(k / POW_N, 0.7)
  const sinY = new Float32Array(ROWS)
  const cosY = new Float32Array(ROWS)
  for (let y = 0; y < ROWS; y++) {
    sinY[y] = Math.sin(y * 0.21)
    cosY[y] = Math.cos(y * 0.21)
  }
  const sa1 = new Float32Array(COLS)
  const ca1 = new Float32Array(COLS)
  const sa2 = new Float32Array(COLS)
  const ca2 = new Float32Array(COLS)
  const sinC = new Float32Array(ROWS)
  const cosC = new Float32Array(ROWS)
  const CH_SLASH = 47
  const CH_BACK = 92
  const CH_BAR = 124
  const CH_APOS = 39
  const CH_DOT = 46
  let minEdge0 = ROWS
  for (let x = 0; x < COLS; x++) if (edge[x] < minEdge0) minEdge0 = edge[x]
  // faixa de colunas simulada no último tick
  let simX0 = 1
  let simX1 = 0

  function updateGrass(t: number, x0: number, x1: number) {
    simX0 = x0
    simX1 = x1
    gCls.fill(0)
    for (let x = x0; x < x1; x++) {
      const a1 = x * 0.065 - t * 1.25
      sa1[x] = Math.sin(a1)
      ca1[x] = Math.cos(a1)
      const a2 = x * 0.14 - t * 2.05
      sa2[x] = Math.sin(a2)
      ca2[x] = Math.cos(a2)
    }
    for (let y = Math.max(0, minEdge0 - 5); y < ROWS; y++) {
      const c = 0.9 * Math.sin(y * 0.17 + t * 0.3)
      sinC[y] = Math.sin(c)
      cosC[y] = Math.cos(c)
    }
    for (let x = x0; x < x1; x++) {
      const top = edge[x]
      const span = ROWS - top
      const idxScale = POW_N / span
      // sementes / pontinhos acima da borda
      for (let y = top - 4; y < top; y++) {
        if (y < 0) continue
        const i = y * COLS + x
        if (hA[i] < 0.035 && mask[i] !== 1) {
          gChar[i] = hB[i] < 0.5 ? CH_DOT : CH_APOS
          gCls[i] = hB[i] < 0.3 ? 5 : 4
        }
      }
      const s1 = sa1[x]
      const c1 = ca1[x]
      const s2 = sa2[x]
      const c2 = ca2[x]
      for (let y = Math.max(0, top); y < ROWS; y++) {
        const i = y * COLS + x
        const k = y - top + 1
        // rajadas de vento correndo para a direita
        const g1 = 0.5 + 0.5 * (s1 * cosC[y] + c1 * sinC[y])
        const g2 = 0.5 + 0.5 * (s2 * cosY[y] + c2 * sinY[y])
        const g = 0.65 * g1 + 0.35 * g2
        let p =
          (0.14 + 0.72 * POW07[(k * idxScale) | 0]) * (0.82 + 0.36 * (g - 0.5))
        if (mask[i] === 1) p *= 0.72
        if (hA[i] > p) continue
        const lean = 0.3 + 0.6 * g + (hB[i] - 0.5) * 0.5
        let ch = lean > 0.5 ? CH_SLASH : lean < 0.06 ? CH_BACK : CH_BAR
        if (y === top && hB[i] < 0.25) ch = CH_APOS
        gChar[i] = ch
        if (hB[i] > 0.93) {
          gCls[i] = 6
          continue
        }
        const v = 0.55 * g + 0.45 * hB[i] - 0.15 * (k / span)
        gCls[i] = v < 0.22 ? 1 : v < 0.42 ? 2 : v < 0.6 ? 3 : v < 0.76 ? 4 : 5
      }
    }
  }

  // ---------- chuva diagonal com vento ----------
  const LAYERS = [
    { n: 70, vy: [13, 17], len: [1, 2], cls: 1 }, // longe
    { n: 55, vy: [20, 26], len: [2, 3], cls: 2 }, // meio
    { n: 22, vy: [30, 38], len: [3, 5], cls: 3 }, // perto
  ]
  const drops: Drop[] = []
  function reset(d: Drop, scatter: boolean): Drop {
    const L = LAYERS[d.li]
    d.vy = L.vy[0] + rnd() * (L.vy[1] - L.vy[0])
    d.len = L.len[0] + Math.floor(rnd() * (L.len[1] - L.len[0] + 1))
    d.y = scatter ? rnd() * ROWS : -rnd() * 10 - d.len
    d.x = rnd() * (COLS + 60) - 60 // começa mais à esquerda: o vento empurra para a direita
    d.depth = rnd() // ponto de impacto dentro do campo de grama (dá profundidade)
    return d
  }
  const AREA = Math.max(0.5, (COLS * ROWS) / 10508) * (low ? 0.55 : 1)
  LAYERS.forEach((L, li) => {
    for (let k = 0; k < Math.round(L.n * AREA); k++)
      drops.push(reset({ li, vy: 0, len: 0, y: 0, x: 0, depth: 0 }, true))
  })
  const splashes: Splash[] = []
  const rChar = new Uint8Array(N)
  const rCls = new Uint8Array(N)

  // vento: inclinação base com rajadas
  const windAt = (t: number) =>
    0.75 + 0.22 * Math.sin(t * 0.45) + 0.12 * Math.sin(t * 1.3 + 1.7)

  // ---------- cachecol (declarado antes da chuva usar sCls) ----------
  const sChar = new Uint8Array(N)
  const sCls = new Uint8Array(N)

  function put(x: number, y: number, ch: string, c: number) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return
    const i = y * COLS + x
    if (mask[i] || gCls[i] || sCls[i]) return // atrás do cavaleiro e da grama
    if (rCls[i] >= c && c !== 4) return
    rChar[i] = ch.charCodeAt(0)
    rCls[i] = c
  }

  function updateRain(t: number, dt: number) {
    rCls.fill(0)
    const w = windAt(t)
    const ch = w > 0.5 ? '\\' : '|'
    for (const d of drops) {
      const L = LAYERS[d.li]
      const slope = w * (0.85 + 0.15 * d.li) // gotas próximas sentem mais o vento
      d.y += d.vy * dt
      d.x += d.vy * slope * dt
      const cx = Math.round(d.x)
      const cy = Math.floor(d.y)
      let hit = cy >= ROWS
      if (!hit && cx >= 0 && cx < COLS && cy >= 0) {
        const groundY =
          edge[cx] + Math.floor(d.depth * (ROWS - edge[cx]) * 0.75)
        if (cy >= groundY) hit = true
        else if (occ(cx, cy) && d.li > 0) hit = true
      }
      if (hit) {
        if (cx >= 0 && cx < COLS && cy > 0 && cy < ROWS)
          splashes.push({ x: cx, y: cy - 1, life: 0.26, big: d.li === 2 })
        reset(d, false)
        continue
      }
      if (cx > COLS + 2) {
        reset(d, false)
        continue
      }
      for (let k = 0; k < d.len; k++) {
        const yy = cy - k
        const xx = Math.round(d.x - k * slope)
        const c = k === 0 ? L.cls : Math.max(1, L.cls - 1)
        put(xx, yy, k === d.len - 1 && d.len > 1 ? "'" : ch, c)
      }
    }
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i]
      s.life -= dt
      if (s.life <= 0) {
        splashes.splice(i, 1)
        continue
      }
      const a = s.life / 0.26
      if (a > 0.6) {
        put(s.x, s.y, 'o', 4)
        put(s.x + 1, s.y, "'", 4)
        put(s.x - 1, s.y, '`', 2)
        if (s.big) put(s.x + 2, s.y - 1, '.', 2)
      } else if (a > 0.3) {
        put(s.x, s.y, '.', 2)
        put(s.x + 1, s.y - 1, "'", 2)
        put(s.x + 2, s.y - 1, '.', 1)
      } else {
        put(s.x + 2, s.y - 1, '.', 1)
      }
    }
  }

  // ---------- cachecol ----------
  // coordenadas em células da cena; o nó fica na nuca, abaixo do capacete
  const OY = TOP
  const DENSE = '&&8&%&$&8&@&%8'
  const EDGE = 'xX+x;X'
  const frags: Frag[] = []
  const fragAcc = [0, 0]

  function plot(
    cx: number,
    cy: number,
    shade: number,
    edgeT: number,
    salt: number
  ) {
    if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return
    const i = cy * COLS + cx
    const lvl = Math.max(1, Math.min(5, 1 + Math.floor(shade * 5)))
    if (sCls[i] && sCls[i] >= lvl) return
    const h = hA[(i + salt) % N]
    sChar[i] = (
      edgeT > 0.78
        ? EDGE[Math.floor(h * EDGE.length)]
        : DENSE[Math.floor(h * DENSE.length)]
    ).charCodeAt(0)
    sCls[i] = lvl
  }

  // carimba um disco do tecido (preenchimento sólido, sem buracos)
  function stamp(
    cx: number,
    cy: number,
    half: number,
    nvx: number,
    nvy: number,
    shadeFn: (u: number, e: number) => number,
    salt: number,
    gapFn?: ((x: number, y: number) => boolean) | null
  ) {
    const rxc = half / CELL
    for (let y = Math.floor(cy - half); y <= Math.ceil(cy + half); y++)
      for (let x = Math.floor(cx - rxc); x <= Math.ceil(cx + rxc); x++) {
        const vx = (x - cx) * CELL
        const vy = y - cy
        if (vx * vx + vy * vy > half * half) continue
        if (gapFn && gapFn(x, y)) continue
        const u = vx * nvx + vy * nvy
        const edgeT = Math.min(1, Math.abs(u) / half)
        plot(x, y, shadeFn(u, edgeT), edgeT, salt)
      }
  }

  // faixa em ")" envolvendo o pescoço: bezier quadrática (coords da arte)
  const BAND = [
    [38.6, 23.2],
    [52.5, 13.0],
    [43.6, 4.6],
  ]
  function drawBand(t: number) {
    const [p0, p1, p2] = BAND
    const steps = 90
    for (let j = 0; j <= steps; j++) {
      const s = j / steps
      const m = 1 - s
      const cx = OX + m * m * p0[0] + 2 * m * s * p1[0] + s * s * p2[0]
      const cy = OY + m * m * p0[1] + 2 * m * s * p1[1] + s * s * p2[1]
      // tangente → normal (para o sombreamento das dobras)
      const tx = (2 * m * (p1[0] - p0[0]) + 2 * s * (p2[0] - p1[0])) * CELL
      const ty = 2 * m * (p1[1] - p0[1]) + 2 * s * (p2[1] - p1[1])
      const tl = Math.hypot(tx, ty) || 1
      const nvx = -ty / tl
      const nvy = tx / tl
      // mais larga e clara no meio, mais fina e escura nas pontas
      const front = Math.sin(Math.PI * s)
      const half = 1.25 + 0.75 * front
      const fold = 0.5 + 0.5 * Math.sin(s * 13 - t * 1.6)
      stamp(
        cx,
        cy,
        half,
        nvx,
        nvy,
        (u, e) =>
          0.3 +
          0.28 * fold * (0.6 + 0.4 * Math.sin(u * 2.2 + s * 7)) +
          0.24 * front +
          0.2 * (1 - e) -
          0.18 * e,
        17
      )
    }
  }

  // nó pequeno na nuca, onde a faixa se abre nas duas pontas
  const KX = OX + 44.2
  const KY = OY + 4.4
  function drawKnot(t: number) {
    const rx = 3.2
    const ry = 2.1
    const pulse = 1 + 0.04 * Math.sin(t * 6.5)
    for (let y = Math.floor(KY - ry - 1); y <= Math.ceil(KY + ry + 1); y++)
      for (let x = Math.floor(KX - rx - 1); x <= Math.ceil(KX + rx + 1); x++) {
        const d = Math.hypot((x - KX) / (rx * pulse), (y - KY) / (ry * pulse))
        if (d > 1) continue
        const ring = Math.exp(-Math.pow((d - 0.6) / 0.15, 2))
        const shade =
          0.82 - 0.6 * ring + 0.12 * (1 - d) + 0.06 * Math.sin(t * 3 + x)
        plot(x, y, shade, d > 0.92 ? 0.8 : 0, 29)
      }
  }

  // pontas: saem da nuca e curvam para a direita
  const TAILS = [
    {
      a0: -0.75,
      a1: 0.02,
      len: 30,
      rx: 0.8,
      ry: -0.6,
      w0: 4.0,
      w1: 2.0,
      amp: 1.7,
      k: 1.3,
      sp: 6.8,
      ph: 0.0,
      salt: 41,
    }, // de cima
    {
      a0: -0.32,
      a1: 0.06,
      len: 40,
      rx: 1.2,
      ry: 0.3,
      w0: 4.4,
      w1: 2.2,
      amp: 1.6,
      k: 1.25,
      sp: 5.9,
      ph: 1.9,
      salt: 73,
    }, // de baixo
  ]
  type Tail = (typeof TAILS)[number]
  function drawTail(T: Tail, ti: number, t: number, wind: number, dt: number) {
    const flap =
      0.06 * Math.sin(t * 0.9 + T.ph) + 0.035 * Math.sin(t * 2.3 + T.ph * 2)
    const L = T.len * (0.9 + 0.14 * wind) * CELL // comprimento em unidades visuais
    const straighten = 1.08 - 0.16 * wind // vento forte: menos curva
    const bucket = Math.floor(t * 12)
    let bx = (KX + T.rx) * CELL
    let by = KY + T.ry
    let tipX = KX
    let tipY = KY
    let tipHalf = 1
    const steps = Math.ceil(T.len * 2.4)
    const ds = L / steps
    for (let j = 0; j <= steps; j++) {
      const s = j / steps
      const ang =
        (T.a0 + (T.a1 - T.a0) * Math.pow(s, 0.8)) * straighten + flap * s
      const dvx = Math.cos(ang)
      const dvy = Math.sin(ang)
      const nvx = -dvy
      const nvy = dvx
      if (j > 0) {
        bx += dvx * ds
        by += dvy * ds
      }
      const env = Math.pow(s, 1.25)
      const phase = T.k * s * 6.283 - t * T.sp + T.ph
      const wave =
        T.amp * env * Math.sin(phase) + 0.45 * env * Math.sin(phase * 2.1 + 1.3)
      const slope = Math.cos(phase)
      const cx = (bx + wave * nvx) / CELL
      const cy = by + wave * nvy
      const half =
        ((T.w0 + (T.w1 - T.w0) * s) / 2) * (0.8 + 0.2 * Math.abs(slope))
      if (j === steps) {
        tipX = cx
        tipY = cy
        tipHalf = half
      }
      const fr = s > 0.78 ? (s - 0.78) / 0.22 : 0
      const gap = fr
        ? (x: number, y: number) =>
            hB[Math.abs(((y * COLS + x) * 7 + bucket * 131 + T.salt) % N)] <
            fr * 0.8
        : null
      stamp(
        cx,
        cy,
        half,
        nvx,
        nvy,
        (u, e) =>
          0.44 +
          0.3 * slope * (0.35 + 0.65 * env) +
          0.08 * Math.sin(u * 2.2 - t * 4 + s * 9) +
          0.18 * (1 - e) -
          0.12 * e -
          0.12 * s,
        T.salt,
        gap
      )
    }
    // pedaços que se soltam da ponta e voam com o vento
    fragAcc[ti] += dt * (5 + 6 * wind)
    while (fragAcc[ti] >= 1) {
      fragAcc[ti] -= 1
      frags.push({
        x: tipX + (rnd() - 0.3) * 4,
        y: tipY + (rnd() - 0.5) * tipHalf * 2,
        vx: 9 + rnd() * 10 * wind,
        vy: (rnd() - 0.6) * 3,
        life: 0.4 + rnd() * 0.55,
        n: 1 + Math.floor(rnd() * 4),
        salt: Math.floor(rnd() * 999),
      })
    }
  }
  function drawFrags(dt: number) {
    for (let i = frags.length - 1; i >= 0; i--) {
      const f = frags[i]
      f.life -= dt
      f.x += f.vx * dt
      f.y += f.vy * dt
      f.vy += 1.5 * dt
      if (f.life <= 0 || f.x > COLS) {
        frags.splice(i, 1)
        continue
      }
      const sh = Math.min(0.55, f.life * 0.6)
      for (let k = 0; k < f.n; k++)
        plot(
          Math.round(f.x) + k,
          Math.round(f.y),
          sh,
          k === f.n - 1 ? 0.8 : 0,
          f.salt
        )
    }
  }
  function updateScarf(t: number, dt: number, wind: number) {
    sCls.fill(0)
    TAILS.forEach((T, i) => drawTail(T, i, t, wind, dt))
    drawFrags(dt)
    drawBand(t)
    drawKnot(t)
  }

  // ---------- renderização em canvas ----------
  // Chuva, grama e cachecol saem em <canvas> com sprites pré-renderizados por
  // (caractere, cor): reescrever dezenas de milhares de caracteres de texto no
  // DOM a cada frame era o que travava a rolagem do hero.
  const dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5)
  const fontFamily =
    getComputedStyle(scene).getPropertyValue('--knight-font').trim() ||
    'monospace'

  interface GlyphStyle {
    color: string
    weight: number
    glow?: [number, string]
  }
  const plain = (color: string, weight = 700): GlyphStyle => ({ color, weight })
  const RAIN_STYLES: (GlyphStyle | null)[] = [
    null,
    plain('rgba(170,190,225,.28)', 400),
    {
      color: 'rgba(195,214,245,.5)',
      weight: 400,
      glow: [3, 'rgba(195,214,245,.25)'],
    },
    {
      color: 'rgba(225,236,255,.8)',
      weight: 400,
      glow: [5, 'rgba(215,230,255,.45)'],
    },
    {
      color: 'rgba(230,240,255,.75)',
      weight: 400,
      glow: [4, 'rgba(230,240,255,.5)'],
    },
  ]
  const GRASS_STYLES: (GlyphStyle | null)[] = [
    null,
    plain('#2c4630'),
    plain('#43613d'),
    plain('#66703f'),
    plain('#96944f'),
    { color: '#c2bb6a', weight: 700, glow: [4, 'rgba(194,187,106,.5)'] },
    plain('#4c7870'),
  ]
  const SCARF_GLOW: [number, string] = [3, 'rgba(200,20,30,.35)']
  const SCARF_STYLES: (GlyphStyle | null)[] = [
    null,
    { color: '#560a12', weight: 700, glow: SCARF_GLOW },
    { color: '#780f17', weight: 700, glow: SCARF_GLOW },
    { color: '#98141b', weight: 700, glow: SCARF_GLOW },
    { color: '#b51b20', weight: 700, glow: SCARF_GLOW },
    { color: '#d02a2b', weight: 700, glow: [5, 'rgba(230,50,50,.45)'] },
  ]
  const STYLE_SETS = [RAIN_STYLES, GRASS_STYLES, SCARF_STYLES]
  const RAIN = 0
  const GRASS = 1
  const SCARF = 2

  const PAD = 8 // margem do sprite para o brilho não ser cortado
  const spriteW = Math.ceil((cw + 2 * PAD) * dpr)
  const spriteH = Math.ceil((lh + 2 * PAD) * dpr)
  const drawW = spriteW / dpr
  const drawH = spriteH / dpr
  // linha de base do texto: centralizada na altura da linha, como o DOM faz
  const baseline = (() => {
    const c = document.createElement('canvas').getContext('2d')!
    c.font = `700 ${fs}px ${fontFamily}`
    const m = c.measureText('M')
    const asc = m.fontBoundingBoxAscent ?? 1.02 * fs
    const desc = m.fontBoundingBoxDescent ?? 0.3 * fs
    return lh / 2 + (asc - desc) / 2
  })()

  // Sprites por (conjunto, cor, caractere, nível de zoom). O zoom é quantizado
  // em QMAX passos: a chuva usa sprites já no tamanho do zoom atual, o que
  // permite copiá-los sem redimensionar (caminho rápido do drawImage).
  const QMAX = 20
  const sprites = new Map<number, HTMLCanvasElement>()
  function sprite(set: number, cls: number, code: number, qk = QMAX) {
    const key = (qk << 24) | (set << 16) | (cls << 8) | code
    let cv = sprites.get(key)
    if (cv) return cv
    const q = qk / QMAX
    const st = STYLE_SETS[set][cls]!
    cv = document.createElement('canvas')
    cv.width = Math.max(1, Math.ceil(spriteW * q))
    cv.height = Math.max(1, Math.ceil(spriteH * q))
    const c = cv.getContext('2d')!
    c.scale(dpr * q, dpr * q)
    c.font = `${st.weight} ${fs}px ${fontFamily}`
    c.textBaseline = 'alphabetic'
    c.fillStyle = st.color
    if (st.glow) {
      c.shadowBlur = st.glow[0] * dpr * q
      c.shadowColor = st.glow[1]
    }
    c.fillText(String.fromCharCode(code), PAD, PAD + baseline)
    sprites.set(key, cv)
    return cv
  }
  // Gera de antemão os sprites do tamanho normal: criar sprite no meio da
  // animação (fillText com brilho) causava travadas pontuais.
  const WARM: [number, string][] = [
    [RAIN, "\\|'`o."],
    [GRASS, ".'/\\|"],
    [SCARF, '&8%$@xX+;'],
  ]
  for (const [set, chars] of WARM)
    for (let cls = 1; cls < STYLE_SETS[set].length; cls++)
      for (const ch of chars) sprite(set, cls, ch.charCodeAt(0))

  // chuva: canvas do tamanho da tela; o zoom é aplicado na transformação
  rainCanvas.width = Math.round(vw * dpr)
  rainCanvas.height = Math.round(vh * dpr)
  const rctx = rainCanvas.getContext('2d')!

  // canvas no espaço do mundo (cachecol/grama): cobre só a região necessária
  function setupWorldCanvas(
    cv: HTMLCanvasElement,
    c0: number,
    c1: number,
    r0: number,
    r1: number
  ) {
    cv.style.left = (c0 * cw).toFixed(1) + 'px'
    cv.style.top = (r0 * lh).toFixed(2) + 'px'
    cv.style.width = ((c1 - c0) * cw).toFixed(1) + 'px'
    cv.style.height = ((r1 - r0) * lh).toFixed(2) + 'px'
    cv.width = Math.ceil((c1 - c0) * cw * dpr)
    cv.height = Math.ceil((r1 - r0) * lh * dpr)
    return cv.getContext('2d')!
  }
  // cachecol: do capacete até a ponta mais longa das fitas e fragmentos
  const SC0 = Math.max(0, OX - 6)
  const SC1 = Math.min(COLS, OX + FW + 44)
  const SR0 = Math.max(0, TOP - 12)
  const SR1 = Math.min(ROWS, TOP + 40)
  const sctx = setupWorldCanvas(scarfCanvas, SC0, SC1, SR0, SR1)
  // grama: da borda superior mais alta até o chão, na largura inteira
  const GR0 = Math.max(0, minEdge0 - 6)
  const gctx = setupWorldCanvas(grassCanvas, 0, COLS, GR0, ROWS)

  // Zoom atual, escrito pelo hero em data-attributes (mudar variável CSS no
  // elemento raiz invalidaria o estilo de todos os descendentes)
  let curScale = 1
  let curDrop = 0
  let worldKey = ''
  function readZoom() {
    const sc = parseFloat(scene.dataset.knightScale || '')
    const dr = parseFloat(scene.dataset.knightDrop || '')
    const ns = Number.isFinite(sc) ? Math.min(1, Math.max(minScale, sc)) : 1
    const nd = Number.isFinite(dr) ? Math.max(0, dr) : 0
    const changed = ns !== curScale || nd !== curDrop
    curScale = ns
    curDrop = nd
    return changed
  }
  function applyWorldTransform() {
    const key = curScale + ',' + curDrop
    if (key === worldKey) return
    worldKey = key
    world.style.transform =
      'translateY(' + curDrop.toFixed(2) + 'px) scale(' + curScale + ')'
  }

  // Janela visível da grade no zoom atual: a grade é maior que a tela (para
  // cobrir o zoom mínimo), mas só essa parte precisa ser desenhada.
  const WIN_MARGIN = 8
  let wx0 = 0
  let wx1 = COLS
  let wy0 = 0
  function updateWindow() {
    const visCols = Math.ceil(vw / curScale / cw) + 2 * WIN_MARGIN
    wx0 = Math.max(0, Math.floor((COLS - visCols) / 2))
    wx1 = COLS - wx0
    wy0 = Math.max(
      0,
      ROWS - Math.ceil((vh + curDrop) / curScale / lh) - WIN_MARGIN
    )
  }

  // Os sprites são copiados em coordenadas inteiras do dispositivo, sem
  // redimensionar (exceto a chuva enquanto há zoom): é o caminho mais rápido
  // do drawImage, tanto na GPU quanto no raster em CPU.
  function drawRain() {
    rctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height)
    const sc = curScale
    const ox = vw / 2 - (worldW / 2) * sc
    const oy = vh + curDrop - worldH * sc
    const qk = Math.max(1, Math.round(sc * QMAX))
    for (let y = wy0; y < ROWS; y++) {
      const base = y * COLS
      const sy = Math.round((oy + (y * lh - PAD) * sc) * dpr)
      for (let x = wx0; x < wx1; x++) {
        const c = rCls[base + x]
        if (!c) continue
        const sx = Math.round((ox + (x * cw - PAD) * sc) * dpr)
        rctx.drawImage(sprite(RAIN, c, rChar[base + x], qk), sx, sy)
      }
    }
  }

  function drawScarf() {
    sctx.clearRect(0, 0, scarfCanvas.width, scarfCanvas.height)
    const ox = SC0 * cw + PAD
    const oy = SR0 * lh + PAD
    for (let y = SR0; y < SR1; y++) {
      const base = y * COLS
      const dy = Math.round((y * lh - oy + dyRow[y]) * dpr)
      for (let x = SC0; x < SC1; x++) {
        const c = sCls[base + x]
        if (c)
          sctx.drawImage(
            sprite(SCARF, c, sChar[base + x]),
            Math.round((x * cw - ox) * dpr),
            dy
          )
      }
    }
  }

  // A grama é redesenhada só quando a simulação dela roda (tick ou zoom que
  // revela colunas novas); entre um tick e outro o canvas fica como está.
  function drawGrass() {
    gctx.clearRect(0, 0, grassCanvas.width, grassCanvas.height)
    const oy = GR0 * lh + PAD
    for (let y = GR0; y < ROWS; y++) {
      const base = y * COLS
      const dy = Math.round((y * lh - oy) * dpr)
      for (let x = simX0; x < simX1; x++) {
        const c = gCls[base + x]
        if (c)
          gctx.drawImage(
            sprite(GRASS, c, gChar[base + x]),
            Math.round((x * cw - PAD) * dpr),
            dy
          )
      }
    }
  }

  // respiração forte
  const P = 3.1
  const ease = (u: number) =>
    u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2
  function breath(t: number) {
    const p = (t % P) / P
    if (p < 0.34) return 1 - Math.pow(1 - p / 0.34, 3)
    if (p < 0.42) return 1
    const u = (p - 0.42) / 0.58
    return 1 - ease(u) + 0.025 * Math.sin(t * 38) * (1 - u) * u * 4
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const t0 = performance.now()
  let last = t0
  const dyRow = new Float32Array(ROWS)

  function frame(now: number) {
    if (prevRaf) {
      const g = now - prevRaf
      if (g < 200) gapEma = gapEma * 0.92 + g * 0.08 // ignora pausas (aba em segundo plano)
    }
    prevRaf = now
    // máquinas lentas: cai para ~33fps e volta quando sobra folga
    if (minGap === baseGap && baseGap === 0 && gapEma > 21) {
      if (++slowCount > 45) {
        minGap = 30
        slowCount = 0
      }
    } else slowCount = 0
    if (minGap > baseGap && frameCost < 5) {
      if (++fastCount > 240) {
        minGap = baseGap
        fastCount = 0
        gapEma = 16.7
      }
    } else fastCount = 0
    // enquanto o zoom do scroll muda, não pula frames (o cavaleiro e o canvas
    // precisam andar juntos)
    const zoomChanged = readZoom()
    if (!reduce && !zoomChanged && now - last < minGap) {
      raf = requestAnimationFrame(frame)
      return
    }
    const frameStart = performance.now()
    applyWorldTransform()
    updateWindow()
    const t = (now - t0) / 1000
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now

    const b = reduce ? 0 : breath(t)
    const A = lh * 0.85
    if (b !== lastB)
      for (let i = 0; i < FH; i++) {
        const k = i / (FH - 1)
        const w = Math.max(0, (0.9 - k) / 0.9)
        const y = -b * A * Math.pow(w, 1.15)
        const sx = 1 + b * 0.02 * Math.exp(-Math.pow((k - 0.4) / 0.22, 2))
        rows[i].style.transform =
          'translateY(' + y.toFixed(2) + 'px) scaleX(' + sx.toFixed(4) + ')'
        dyRow[TOP + i] = y
      }
    if (b !== lastB) {
      for (let y = 0; y < TOP; y++) dyRow[y] = dyRow[TOP]
      lastB = b
    }
    const gq = Math.round(b * 8) / 8
    if (gq !== lastG) {
      figEl.style.setProperty('--g', String(gq))
      lastG = gq
    }
    const haloOpacity = (0.75 + 0.25 * b).toFixed(2)
    if (haloOpacity !== lastHalo) {
      halo.style.opacity = haloOpacity
      lastHalo = haloOpacity
    }

    // simula/desenha a grama no tick dela ou quando o zoom ultrapassa as
    // colunas já simuladas
    const grassTick =
      reduce || t - lastGrass > grassEvery || wx0 < simX0 || wx1 > simX1
    if (grassTick) {
      grassStart = performance.now()
      updateGrass(
        reduce ? 0 : t,
        Math.max(0, wx0 - 32),
        Math.min(COLS, wx1 + 32)
      )
      lastGrass = t
    }
    updateScarf(reduce ? 0 : t, reduce ? 0 : dt, windAt(reduce ? 0 : t))
    // grama e cachecol ficam na frente do cavaleiro
    for (let i = 0; i < FH; i++) {
      const y = TOP + i
      const src = FIG[i]
      let hit = false
      for (let x = OX, j = y * COLS + OX; x < src.length; x++, j++)
        if (gCls[j] || sCls[j]) {
          hit = true
          break
        }
      if (!hit && !dirty[i]) continue
      dirty[i] = hit ? 1 : 0
      let s = LEAD
      for (let x = OX; x < src.length; x++) {
        const j = y * COLS + x
        s += gCls[j] || sCls[j] ? ' ' : src[x]
      }
      if (rows[i].textContent !== s) rows[i].textContent = s
    }
    drawScarf()
    if (grassTick) {
      drawGrass()
      grassCost = grassCost * 0.7 + (performance.now() - grassStart) * 0.3
      if (grassCost > 6) grassEvery = Math.min(0.14, grassEvery * 1.15)
      else if (grassCost < 3)
        grassEvery = Math.max(GRASS_EVERY, grassEvery * 0.92)
    }

    if (!reduce) updateRain(t, dt)
    else rCls.fill(0)
    drawRain()

    frameCost = frameCost * 0.9 + (performance.now() - frameStart) * 0.1
    if (!reduce) raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(raf)
}
