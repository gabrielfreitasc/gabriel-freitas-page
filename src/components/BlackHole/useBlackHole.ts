import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Vector2 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import fragmentShaderSource from './shaders/fragmentShader.glsl'
import { BlackHoleConfig } from './types'

const VERTEX_SHADER = `void main() { gl_Position = vec4(position, 1.0); }`

function getQualityDefines(quality: BlackHoleConfig['quality']): string {
  const map = {
    low: { STEP: 0.1, NSTEPS: 300 },
    medium: { STEP: 0.05, NSTEPS: 600 },
    high: { STEP: 0.02, NSTEPS: 1000 },
  }
  const { STEP, NSTEPS } = map[quality]
  return `#define STEP ${STEP}\n#define NSTEPS ${NSTEPS}\n`
}

export function useBlackHole(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  config: BlackHoleConfig
) {
  const configRef = useRef(config)
  configRef.current = config

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const canvas: HTMLCanvasElement = canvasEl

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
    renderer.setClearColor(0x000000, 1.0)
    renderer.autoClear = false

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    camera.position.z = 1

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(
      new Vector2(128, 128),
      configRef.current.bloomStrength,
      configRef.current.bloomRadius,
      configRef.current.bloomThreshold
    )
    composer.addPass(bloomPass)
    const copyPass = new ShaderPass(CopyShader)
    copyPass.renderToScreen = true
    composer.addPass(copyPass)

    const loader = new THREE.TextureLoader()

    function loadTex(url: string, filter: THREE.MagnificationTextureFilter) {
      const t = loader.load(url)
      t.magFilter = filter
      t.minFilter = filter
      t.wrapS = THREE.ClampToEdgeWrapping
      t.wrapT = THREE.ClampToEdgeWrapping
      return t
    }

    const bgTexture = loadTex('/textures/milkyway.jpg', THREE.NearestFilter)
    const starTexture = loadTex('/textures/star_noise.png', THREE.LinearFilter)
    const diskTexture = loadTex(
      '/textures/accretion_disk.png',
      THREE.LinearFilter
    )

    const initialCfg = configRef.current
    const uniforms: Record<string, THREE.IUniform> = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2() },
      cam_pos: { value: new THREE.Vector3() },
      cam_dir: { value: new THREE.Vector3() },
      cam_up: { value: new THREE.Vector3() },
      cam_vel: { value: new THREE.Vector3() },
      fov: { value: initialCfg.fov },
      accretion_disk: { value: initialCfg.accretionDisk },
      use_disk_texture: { value: initialCfg.useDiskTexture },
      lorentz_transform: { value: initialCfg.lorentzTransform },
      doppler_shift: { value: initialCfg.dopplerShift },
      beaming: { value: initialCfg.beaming },
      bg_texture: { value: bgTexture },
      star_texture: { value: starTexture },
      disk_texture: { value: diskTexture },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader:
        getQualityDefines(initialCfg.quality) + fragmentShaderSource,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const observer = {
      r: initialCfg.distance,
      theta: 0,
      angularVelocity: 0,
      maxAngularVelocity: 0,
      incline: (-5 * Math.PI) / 180,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      direction: new THREE.Vector3(0, 0, -1),
    }

    function setObserverDistance(r: number) {
      observer.r = r
      observer.maxAngularVelocity = 1 / Math.sqrt(2.0 * (r - 1.0)) / r
      if (observer.position.length() > 0) {
        observer.position.normalize().multiplyScalar(r)
      } else {
        observer.position.set(0, 0, r)
      }
    }

    setObserverDistance(initialCfg.distance)

    const inclineMatrix = new THREE.Matrix4().makeRotationZ(observer.incline)
    observer.up.applyMatrix4(inclineMatrix)

    function updateObserver(delta: number) {
      const cfg = configRef.current

      if (cfg.orbit) {
        if (observer.angularVelocity < observer.maxAngularVelocity)
          observer.angularVelocity += delta / observer.r
        else observer.angularVelocity = observer.maxAngularVelocity
      } else {
        if (observer.angularVelocity > 0)
          observer.angularVelocity -= delta / observer.r
        else {
          observer.angularVelocity = 0
          observer.velocity.set(0, 0, 0)
        }
      }

      observer.theta += observer.angularVelocity * delta
      const cos = Math.cos(observer.theta)
      const sin = Math.sin(observer.theta)

      observer.position.set(observer.r * sin, 0, observer.r * cos)
      observer.velocity.set(
        cos * observer.angularVelocity,
        0,
        -sin * observer.angularVelocity
      )

      const rotMatrix = new THREE.Matrix4().makeRotationX(observer.incline)
      observer.position.applyMatrix4(rotMatrix)
      observer.velocity.applyMatrix4(rotMatrix)

      observer.direction.copy(observer.position).negate().normalize()
    }

    function onResize() {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const res = configRef.current.resolution
      renderer.setPixelRatio(window.devicePixelRatio * res)
      renderer.setSize(w, h, false)
      composer.setSize(w * res, h * res)
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas)
    onResize()

    let lastFrame = performance.now()
    let time = 0
    let rafId = 0
    let currentQuality = initialCfg.quality
    let running = false
    let inViewport = true

    function tick() {
      if (!running) return
      rafId = requestAnimationFrame(tick)
      const now = performance.now()
      const delta = (now - lastFrame) / 1000
      lastFrame = now
      time += delta

      const cfg = configRef.current
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      if (observer.r !== cfg.distance) setObserverDistance(cfg.distance)

      if (cfg.quality !== currentQuality) {
        currentQuality = cfg.quality
        material.fragmentShader =
          getQualityDefines(cfg.quality) + fragmentShaderSource
        material.needsUpdate = true
      }

      updateObserver(delta)

      uniforms.time.value = time
      uniforms.resolution.value.set(w * cfg.resolution, h * cfg.resolution)
      uniforms.fov.value = cfg.fov
      uniforms.cam_pos.value.copy(observer.position)
      uniforms.cam_dir.value.copy(observer.direction)
      uniforms.cam_up.value.copy(observer.up)
      uniforms.cam_vel.value.copy(observer.velocity)
      uniforms.accretion_disk.value = cfg.accretionDisk
      uniforms.use_disk_texture.value = cfg.useDiskTexture
      uniforms.lorentz_transform.value = cfg.lorentzTransform
      uniforms.doppler_shift.value = cfg.dopplerShift
      uniforms.beaming.value = cfg.beaming

      bloomPass.strength = cfg.bloomStrength
      bloomPass.radius = cfg.bloomRadius
      bloomPass.threshold = cfg.bloomThreshold

      composer.render()
    }

    function start() {
      if (running) return
      running = true
      // Evita um delta gigante (e salto na órbita) ao retomar
      lastFrame = performance.now()
      rafId = requestAnimationFrame(tick)
    }

    function stop() {
      running = false
      cancelAnimationFrame(rafId)
    }

    // Pausa o ray-marching quando o canvas sai da viewport ou a aba fica oculta.
    // intersectionRatio > 0: caixas que apenas se tocam (ex.: seção começando
    // exatamente em 100vh) reportam isIntersecting=true com ratio 0
    const io = new IntersectionObserver(
      entries => {
        const entry = entries[entries.length - 1]
        inViewport = entry.isIntersecting && entry.intersectionRatio > 0
        if (inViewport && !document.hidden) start()
        else stop()
      },
      { threshold: [0, 0.01, 0.1] }
    )
    io.observe(canvas)

    const onVisibilityChange = () => {
      if (!document.hidden && inViewport) start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    start()

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      resizeObserver.disconnect()
      bgTexture.dispose()
      starTexture.dispose()
      diskTexture.dispose()
      material.dispose()
      mesh.geometry.dispose()
      composer.dispose()
      renderer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
