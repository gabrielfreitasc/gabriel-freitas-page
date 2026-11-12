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
  rain: HTMLElement
  grass: HTMLElement
  scarf: HTMLElement
  halo: HTMLElement
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
  let lastGrass = -1
  // aparelhos fracos começam em ~30fps; os demais só caem para isso se precisar
  const low = getPerfTier() === 'low'
  const baseGap = low ? 32 : 0
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
    rain: rainEl,
    grass: grassEl,
    scarf: scarfEl,
    halo,
  } = els
  const pres = [rainEl, figEl, scarfEl, grassEl]
  pres.forEach(p => (p.textContent = ''))

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
  const FIG = FIG0.map(l => ' '.repeat(OX) + l)

  pres.forEach(p => {
    p.style.fontSize = fs.toFixed(2) + 'px'
    p.style.lineHeight = lh.toFixed(3) + 'px'
  })
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
  const gChar: string[] = new Array(N).fill(' ')
  const gCls = new Uint8Array(N) // 0 = vazio
  const CLS = ['', 'g0', 'g1', 'g2', 'g3', 'g4', 'gt']

  function updateGrass(t: number) {
    gChar.fill(' ')
    gCls.fill(0)
    for (let x = 0; x < COLS; x++) {
      const top = edge[x]
      const span = ROWS - top
      // sementes / pontinhos acima da borda
      for (let y = top - 4; y < top; y++) {
        if (y < 0) continue
        const i = y * COLS + x
        if (hA[i] < 0.035 && !occ(x, y)) {
          gChar[i] = hB[i] < 0.5 ? '.' : "'"
          gCls[i] = hB[i] < 0.3 ? 5 : 4
        }
      }
      for (let y = Math.max(0, top); y < ROWS; y++) {
        const i = y * COLS + x
        const d = (y - top + 1) / span
        // rajadas de vento correndo para a direita
        const g1 =
          0.5 +
          0.5 *
            Math.sin(x * 0.065 - t * 1.25 + 0.9 * Math.sin(y * 0.17 + t * 0.3))
        const g2 = 0.5 + 0.5 * Math.sin(x * 0.14 + y * 0.21 - t * 2.05)
        const g = 0.65 * g1 + 0.35 * g2
        let p = (0.14 + 0.72 * Math.pow(d, 0.7)) * (0.82 + 0.36 * (g - 0.5))
        if (occ(x, y)) p *= 0.72
        if (hA[i] > p) continue
        const lean = 0.3 + 0.6 * g + (hB[i] - 0.5) * 0.5
        let ch = lean > 0.5 ? '/' : lean < 0.06 ? '\\' : '|'
        if (y === top && hB[i] < 0.25) ch = "'"
        gChar[i] = ch
        if (hB[i] > 0.93) {
          gCls[i] = 6
          continue
        }
        const v = 0.55 * g + 0.45 * hB[i] - 0.15 * d
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
  const rChar: string[] = new Array(N).fill(' ')
  const rCls = new Uint8Array(N)
  const RCLS = ['', 'r1', 'r2', 'r3', 'rs']

  // vento: inclinação base com rajadas
  const windAt = (t: number) =>
    0.75 + 0.22 * Math.sin(t * 0.45) + 0.12 * Math.sin(t * 1.3 + 1.7)

  // ---------- cachecol (declarado antes da chuva usar sCls) ----------
  const sChar: string[] = new Array(N).fill(' ')
  const sCls = new Uint8Array(N)
  const SCLS = ['', 's1', 's2', 's3', 's4', 's5']

  function put(x: number, y: number, ch: string, c: number) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return
    const i = y * COLS + x
    if (mask[i] || gCls[i] || sCls[i]) return // atrás do cavaleiro e da grama
    if (rCls[i] >= c && c !== 4) return
    rChar[i] = ch
    rCls[i] = c
  }

  function updateRain(t: number, dt: number) {
    rChar.fill(' ')
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
    sChar[i] =
      edgeT > 0.78
        ? EDGE[Math.floor(h * EDGE.length)]
        : DENSE[Math.floor(h * DENSE.length)]
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
    sChar.fill(' ')
    sCls.fill(0)
    TAILS.forEach((T, i) => drawTail(T, i, t, wind, dt))
    drawFrags(dt)
    drawBand(t)
    drawKnot(t)
  }

  // Janela visível da grade. A grade é maior que a tela (para cobrir o zoom
  // mínimo), mas só as células que aparecem no zoom atual viram HTML — sem isso
  // o custo por frame seria o da grade inteira mesmo sem zoom.
  const WIN_MARGIN = 8
  let wx0 = 0
  let wx1 = COLS
  let wy0 = 0
  function updateWindow() {
    const s = Math.min(
      1,
      Math.max(
        minScale,
        parseFloat(scene.style.getPropertyValue('--knight-scale')) || 1
      )
    )
    const drop = Math.max(
      0,
      parseFloat(scene.style.getPropertyValue('--knight-y')) || 0
    )
    const visCols = Math.ceil(vw / s / cw) + 2 * WIN_MARGIN
    wx0 = Math.max(0, Math.floor((COLS - visCols) / 2))
    wx1 = COLS - wx0
    wy0 = Math.max(0, ROWS - Math.ceil((vh + drop) / s / lh) - WIN_MARGIN)
  }
  // posiciona um <pre> da grade na janela atual (só mexe no DOM se mudou)
  const placed = new Map<HTMLElement, string>()
  function place(el: HTMLElement, y0: number) {
    const key = wx0 + ',' + y0
    if (placed.get(el) === key) return
    placed.set(el, key)
    el.style.left = (wx0 * cw).toFixed(1) + 'px'
    el.style.top = (y0 * lh).toFixed(2) + 'px'
  }

  // linhas de y0 até o fim, só de wx0..wx1 e sem espaços sobrando no fim
  function toHTML(
    chars: string[],
    cls: Uint8Array,
    names: string[],
    y0: number
  ) {
    const out: string[] = []
    for (let y = y0; y < ROWS; y++) {
      const base = y * COLS
      let first = -1
      let lastX = -1
      for (let x = wx0; x < wx1; x++)
        if (cls[base + x]) {
          if (first < 0) first = x
          lastX = x
        }
      if (first < 0) {
        out.push('')
        continue
      }
      let line = ' '.repeat(first - wx0)
      let cur = -1
      let buf = ''
      for (let x = first; x <= lastX; x++) {
        const i = base + x
        const c = cls[i]
        if (c !== cur) {
          if (buf)
            line +=
              cur > 0
                ? '<span class="' + names[cur] + '">' + buf + '</span>'
                : buf
          buf = ''
          cur = c
        }
        buf += c ? chars[i] : ' '
      }
      if (buf && cur > 0)
        line += '<span class="' + names[cur] + '">' + buf + '</span>'
      out.push(line)
    }
    return out.join('\n')
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
    // janela grande (zoom afastado) = muito mais HTML por frame: 30fps basta
    const heavy = (wx1 - wx0) * (ROWS - wy0) > 45000
    if (!reduce && now - last < (heavy ? Math.max(minGap, 32) : minGap)) {
      raf = requestAnimationFrame(frame)
      return
    }
    const frameStart = performance.now()
    updateWindow()
    const t = (now - t0) / 1000
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now

    const b = reduce ? 0 : breath(t)
    const A = lh * 0.85
    for (let i = 0; i < FH; i++) {
      const k = i / (FH - 1)
      const w = Math.max(0, (0.9 - k) / 0.9)
      const y = -b * A * Math.pow(w, 1.15)
      const sx = 1 + b * 0.02 * Math.exp(-Math.pow((k - 0.4) / 0.22, 2))
      rows[i].style.transform =
        'translateY(' + y.toFixed(2) + 'px) scaleX(' + sx.toFixed(4) + ')'
      dyRow[TOP + i] = y
    }
    for (let y = 0; y < TOP; y++) dyRow[y] = dyRow[TOP]
    const gq = Math.round(b * 8) / 8
    if (gq !== lastG) {
      figEl.style.setProperty('--g', String(gq))
      lastG = gq
    }
    halo.style.opacity = (0.75 + 0.25 * b).toFixed(3)

    const grassTick = reduce || t - lastGrass > (low ? 0.09 : 0.045)
    if (grassTick) {
      updateGrass(reduce ? 0 : t)
      lastGrass = t
    }
    updateScarf(reduce ? 0 : t, reduce ? 0 : dt, windAt(reduce ? 0 : t))
    // grama e cachecol ficam na frente do cavaleiro
    for (let i = 0; i < FH; i++) {
      const y = TOP + i
      const src = FIG[i]
      let hit = false
      for (let x = 0, j = y * COLS; x < src.length; x++, j++)
        if (gCls[j] || sCls[j]) {
          hit = true
          break
        }
      if (!hit && !dirty[i]) continue
      dirty[i] = hit ? 1 : 0
      let s = ''
      for (let x = 0; x < src.length; x++) {
        const j = y * COLS + x
        s += gCls[j] || sCls[j] ? ' ' : src[x]
      }
      if (rows[i].textContent !== s) rows[i].textContent = s
    }
    {
      const html = toHTML(sChar, sCls, SCLS, wy0).split('\n')
      let out = ''
      for (let y = wy0; y < ROWS; y++)
        out +=
          '<span class="sr" style="transform:translateY(' +
          dyRow[y].toFixed(2) +
          'px)">' +
          (html[y - wy0] || ' ') +
          '</span>'
      place(scarfEl, wy0)
      scarfEl.innerHTML = out
    }
    if (grassTick) {
      place(grassEl, wy0)
      grassEl.innerHTML = toHTML(gChar, gCls, CLS, wy0)
    }

    if (!reduce) updateRain(t, dt)
    else {
      rChar.fill(' ')
      rCls.fill(0)
    }
    place(rainEl, wy0)
    rainEl.innerHTML = toHTML(rChar, rCls, RCLS, wy0)

    frameCost = frameCost * 0.9 + (performance.now() - frameStart) * 0.1
    if (!reduce) raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(raf)
}
