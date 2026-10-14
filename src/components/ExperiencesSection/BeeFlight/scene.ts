import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import type { FlightPoint } from './path'

const MODEL_URL = '/assets/models/minecraft_bee.glb'
const FLY_CLIP = 'L_Fly'
const CAMERA_Z = 10
const FOV = 35

// Dimensões do viewBox do PATH_RIGHT do ExperienceCard
const CARD_PATH_WIDTH = 714
const CARD_PATH_HEIGHT = 664

// Cena 3D da abelha em um canvas transparente fixo na viewport. Tudo é
// posicionado em px de tela + profundidade, e convertido para o mundo pelo
// raio da câmera, então a abelha "vive" no mesmo espaço do DOM.
export class BeeScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  private clock = new THREE.Clock(false)
  private bee = new THREE.Group()
  private occluder: THREE.Mesh | null = null
  private mixer: THREE.AnimationMixer | null = null
  private width = 1
  private height = 1
  private disposed = false

  private ray = new THREE.Vector3()
  private from = new THREE.Vector3()
  private to = new THREE.Vector3()

  constructor(canvas: HTMLCanvasElement, cardPath: string) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x000000, 0)
    this.camera.position.set(0, 0, CAMERA_Z)

    this.scene.add(new THREE.AmbientLight(0xffffff, 1.8))
    const sun = new THREE.DirectionalLight(0xffffff, 2.2)
    sun.position.set(3, 5, 8)
    this.scene.add(sun)

    this.bee.visible = false
    this.scene.add(this.bee)
    this.createOccluder(cardPath)
    this.resize()
  }

  async load() {
    const gltf = await new GLTFLoader().loadAsync(MODEL_URL)
    if (this.disposed) return

    const model = gltf.scene
    model.traverse(obj => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      // Malha com skin animada: o bounding box estático cortaria a abelha
      mesh.frustumCulled = false
      const material = mesh.material as THREE.MeshStandardMaterial
      if (material.map) {
        // Pixel art do Minecraft: sem filtro linear para não borrar a textura
        material.map.magFilter = THREE.NearestFilter
        material.map.needsUpdate = true
      }
    })

    // Normaliza: centro na origem e maior dimensão (envergadura) = 1
    const box = new THREE.Box3().setFromObject(model, true)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    model.scale.setScalar(1 / maxDim)
    model.position.copy(center).multiplyScalar(-1 / maxDim)

    // Com o esqueleto aplicado, a cabeça aponta para -Z e as costas para +Y.
    // O pivot gira 180° em Y para a cabeça ficar em +Z (eixo do lookAt).
    const pivot = new THREE.Group()
    pivot.rotation.y = Math.PI
    pivot.add(model)
    this.bee.add(pivot)

    const clip =
      THREE.AnimationClip.findByName(gltf.animations, FLY_CLIP) ??
      gltf.animations[0]
    if (clip) {
      this.mixer = new THREE.AnimationMixer(model)
      this.mixer.clipAction(clip).play()
    }
    this.bee.visible = true
  }

  // Oclusor invisível com o formato do card: escreve só profundidade, então a
  // abelha some atrás dele quando passa para z < 0 dentro da silhueta do card
  private createOccluder(cardPath: string) {
    const svg = new SVGLoader().parse(`<svg><path d="${cardPath}"/></svg>`)
    const shapes = svg.paths.flatMap(path => SVGLoader.createShapes(path))
    const material = new THREE.MeshBasicMaterial({
      colorWrite: false,
      side: THREE.DoubleSide,
    })
    this.occluder = new THREE.Mesh(new THREE.ShapeGeometry(shapes), material)
    this.occluder.renderOrder = -1
    this.scene.add(this.occluder)
  }

  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.renderer.setSize(this.width, this.height, false)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  // Unidades do mundo por px de tela no plano z = 0
  private get worldPerPx() {
    const viewHeight =
      2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z
    return viewHeight / this.height
  }

  // Ponto da tela (px) projetado no plano de profundidade z
  private screenToWorld(x: number, y: number, z: number, out: THREE.Vector3) {
    this.ray
      .set((x / this.width) * 2 - 1, -(y / this.height) * 2 + 1, 0.5)
      .unproject(this.camera)
      .sub(this.camera.position)
      .normalize()
    const distance = (z - this.camera.position.z) / this.ray.z
    return out.copy(this.camera.position).addScaledVector(this.ray, distance)
  }

  render(
    point: FlightPoint,
    ahead: FlightPoint,
    wingspanPx: number,
    cardRect: DOMRect
  ) {
    if (this.occluder) {
      const wpp = this.worldPerPx
      this.screenToWorld(cardRect.left, cardRect.top, 0, this.occluder.position)
      this.occluder.scale.set(
        (cardRect.width / CARD_PATH_WIDTH) * wpp,
        -(cardRect.height / CARD_PATH_HEIGHT) * wpp,
        1
      )
    }

    this.screenToWorld(point.x, point.y, point.z, this.from)
    this.screenToWorld(ahead.x, ahead.y, ahead.z, this.to)
    this.bee.position.copy(this.from)
    this.bee.scale.setScalar(Math.max(wingspanPx, 1e-3) * this.worldPerPx)
    this.bee.visible = wingspanPx > 0
    if (this.to.distanceToSquared(this.from) > 1e-8) this.bee.lookAt(this.to)

    if (!this.clock.running) this.clock.start()
    this.mixer?.update(Math.min(this.clock.getDelta(), 0.1))
    this.renderer.render(this.scene, this.camera)
  }

  // Ao retomar depois de uma pausa, não avança as asas pelo tempo parado
  pause() {
    this.clock.stop()
  }

  dispose() {
    this.disposed = true
    this.mixer?.stopAllAction()
    this.scene.traverse(obj => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.geometry.dispose()
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]
      materials.forEach(m => {
        ;(m as THREE.MeshStandardMaterial).map?.dispose()
        m.dispose()
      })
    })
    this.renderer.dispose()
  }
}
