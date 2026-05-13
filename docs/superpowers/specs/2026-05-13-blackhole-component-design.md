# BlackHole React Component — Implementation Prompt

**Date:** 2026-05-13  
**Target:** React + Next.js  
**Pattern:** Custom Hook (`useBlackHole`) + thin presentational component  
**Interaction:** Visual/decorative only (no GUI, no mouse controls)  
**Sizing:** `width` and `height` props with CSS-compatible values  

---

## Context

This component encapsulates a physically-based black hole simulation built on:

- **Schwarzschild geodesic ray tracing** — each pixel fires a ray that is curved by gravity using leapfrog numerical integration of the geodesic equations
- **GLSL fragment shader on a fullscreen plane** — Three.js renders a 2×2 `PlaneGeometry` that fills the screen; all 3D logic runs per-pixel on the GPU
- **Post-processing bloom** — `UnrealBloomPass` adds glow to the accretion disk
- **Relativistic effects** — Lorentz aberration, Doppler shift, and relativistic beaming are computed in the shader

The component is self-contained, side-effect–free (fully cleaned up on unmount), and SSR-safe via Next.js `dynamic` import with `{ ssr: false }`.

---

## Required Libraries

| Package | Role |
|---|---|
| `three` `^0.148.0` | WebGL renderer, geometry, materials, textures, camera math |
| `three/examples/jsm/postprocessing/EffectComposer` | Composites multiple render passes into final output |
| `three/examples/jsm/postprocessing/RenderPass` | First pass: renders the scene (shader plane) |
| `three/examples/jsm/postprocessing/UnrealBloomPass` | Second pass: adds bloom glow to bright pixels |
| `three/examples/jsm/postprocessing/ShaderPass` + `three/examples/jsm/shaders/CopyShader` | Final pass: copies composed result to screen |

No additional runtime dependencies are needed. `dat.gui` and `stats.js` are excluded (decorative component, no controls).

### GLSL Import Config (Next.js)

Add to `next.config.js` so `.glsl` files are imported as raw strings:

```js
// next.config.js
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.glsl$/,
      use: 'raw-loader',
    });
    return config;
  },
};
module.exports = nextConfig;
```

Install dev dependency: `npm install -D raw-loader`

Add TypeScript declaration to avoid TS errors on GLSL imports:

```ts
// src/types/glsl.d.ts
declare module '*.glsl' {
  const content: string;
  export default content;
}
```

---

## File Structure

```
src/
└── components/
    └── BlackHole/
        ├── index.ts                     # public re-export
        ├── BlackHole.tsx                # canvas element + hook wiring
        ├── useBlackHole.ts              # all Three.js logic
        ├── blackHoleDefaults.ts         # default config values
        ├── types.ts                     # BlackHoleConfig, BlackHoleProps
        └── shaders/
            └── fragmentShader.glsl      # geodesic ray tracer shader
```

---

## Types — `types.ts`

```ts
export interface BlackHoleConfig {
  // Rendering quality
  resolution: 0.25 | 0.5 | 1 | 2 | 4;   // pixel ratio multiplier
  quality: 'low' | 'medium' | 'high';     // shader step size and iteration count

  // Camera
  distance: number;  // observer distance from black hole center (Schwarzschild units)
  fov: number;       // field of view in degrees

  // Bloom post-processing
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;

  // Camera motion
  orbit: boolean;    // auto-orbit around the black hole

  // Relativistic effects (all computed in shader)
  lorentzTransform: boolean;  // light aberration from camera velocity
  dopplerShift: boolean;      // wavelength shift from relative velocity
  beaming: boolean;           // relativistic beaming (intensity change)

  // Accretion disk
  accretionDisk: boolean;     // render the disk at all
  useDiskTexture: boolean;    // use PNG texture vs blackbody color calculation
}

export interface BlackHoleProps {
  width?: string | number;           // CSS value or px number — default "100%"
  height?: string | number;          // CSS value or px number — default "100%"
  config?: Partial<BlackHoleConfig>; // overrides for any default value
  className?: string;                // applied to the wrapper <div>
  style?: React.CSSProperties;       // applied to the wrapper <div>
}
```

---

## Defaults — `blackHoleDefaults.ts`

```ts
import { BlackHoleConfig } from './types';

export const BLACK_HOLE_DEFAULTS: BlackHoleConfig = {
  resolution:       1,
  quality:          'low',
  distance:         14,
  fov:              90,
  bloomStrength:    1,
  bloomRadius:      0.5,
  bloomThreshold:   0.6,
  orbit:            true,
  lorentzTransform: true,
  dopplerShift:     true,
  beaming:          true,
  accretionDisk:    true,
  useDiskTexture:   true,
};
```

---

## The Shader — `shaders/fragmentShader.glsl`

Copy the full GLSL file from the original project (`src/graphics/fragmentShader.glsl`). Do **not** modify it — it is correct as-is.

The shader defines constants `STEP` and `NSTEPS` via `#define` prepended at runtime (not in the file itself), so the file should NOT include those two defines. The quality system works by prepending the correct values before passing `fragmentShader` string to `ShaderMaterial`.

Quality levels map to:

| Quality | STEP | NSTEPS | Meaning |
|---|---|---|---|
| `low` | `0.1` | `300` | Fast, coarser geodesic curves |
| `medium` | `0.05` | `600` | Balanced |
| `high` | `0.02` | `1000` | Highest accuracy, more GPU load |

The vertex shader is trivial and can be defined inline as a string:

```glsl
void main() {
  gl_Position = vec4(position, 1.0);
}
```

---

## Textures

The three textures must be accessible in the Next.js project. Place them in `public/textures/`:

```
public/
└── textures/
    ├── milkyway.jpg        # equirectangular panorama of the Milky Way
    ├── star_noise.png      # per-star physical data: R=temperature, G=luminosity, B=radial velocity
    └── accretion_disk.png  # disk texture in polar coordinates (φ, r)
```

All three files are in the `assets/` folder of the source project.

---

## The Hook — `useBlackHole.ts`

This hook receives a `RefObject<HTMLCanvasElement>` and the merged config, initializes Three.js, runs the animation loop, and returns cleanup on unmount.

### Full implementation spec:

```ts
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { Vector2 } from 'three';
import fragmentShaderSource from './shaders/fragmentShader.glsl';
import { BlackHoleConfig } from './types';

const VERTEX_SHADER = `void main() { gl_Position = vec4(position, 1.0); }`;

function getQualityDefines(quality: BlackHoleConfig['quality']): string {
  const map = {
    low:    { STEP: 0.1,  NSTEPS: 300  },
    medium: { STEP: 0.05, NSTEPS: 600  },
    high:   { STEP: 0.02, NSTEPS: 1000 },
  };
  const { STEP, NSTEPS } = map[quality];
  return `#define STEP ${STEP}\n#define NSTEPS ${NSTEPS}\n`;
}

export function useBlackHole(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: BlackHoleConfig
) {
  // Store mutable values in a ref so the animation loop closure always reads latest config
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setClearColor(0x000000, 1.0);
    renderer.autoClear = false;

    // ── Scene + fixed camera ──────────────────────────────────────────────────
    // The Three.js camera never moves — all camera logic lives in the shader uniforms.
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    // ── Post-processing pipeline ──────────────────────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new Vector2(128, 128),
      config.bloomStrength,
      config.bloomRadius,
      config.bloomThreshold
    );
    composer.addPass(bloomPass);
    const copyPass = new ShaderPass(CopyShader);
    copyPass.renderToScreen = true;
    composer.addPass(copyPass);

    // ── Textures ──────────────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();

    function loadTex(url: string, filter: THREE.TextureFilter) {
      const t = loader.load(url);
      t.magFilter = filter;
      t.minFilter = filter;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      return t;
    }

    const bgTexture   = loadTex('/textures/milkyway.jpg',      THREE.NearestFilter);
    const starTexture = loadTex('/textures/star_noise.png',    THREE.LinearFilter);
    const diskTexture = loadTex('/textures/accretion_disk.png', THREE.LinearFilter);

    // ── Uniforms ──────────────────────────────────────────────────────────────
    const uniforms: Record<string, THREE.IUniform> = {
      time:             { value: 0.0 },
      resolution:       { value: new THREE.Vector2() },
      cam_pos:          { value: new THREE.Vector3() },
      cam_dir:          { value: new THREE.Vector3() },
      cam_up:           { value: new THREE.Vector3() },
      cam_vel:          { value: new THREE.Vector3() },
      fov:              { value: config.fov },
      accretion_disk:   { value: config.accretionDisk },
      use_disk_texture: { value: config.useDiskTexture },
      lorentz_transform:{ value: config.lorentzTransform },
      doppler_shift:    { value: config.dopplerShift },
      beaming:          { value: config.beaming },
      bg_texture:       { value: bgTexture },
      star_texture:     { value: starTexture },
      disk_texture:     { value: diskTexture },
    };

    // ── Shader material + fullscreen plane ────────────────────────────────────
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: getQualityDefines(config.quality) + fragmentShaderSource,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // ── Observer (camera orbit state) ─────────────────────────────────────────
    // Mirrors the Observer class from the original project, inlined here
    // to avoid dependency on the source project's module.
    const observer = {
      r: config.distance,
      theta: 0,
      angularVelocity: 0,
      maxAngularVelocity: 0,
      incline: -5 * Math.PI / 180,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      direction: new THREE.Vector3(0, 0, -1),
    };

    function setObserverDistance(r: number) {
      observer.r = r;
      observer.maxAngularVelocity = 1 / Math.sqrt(2.0 * (r - 1.0)) / r;
      // normalize position to new radius
      if (observer.position.length() > 0) {
        observer.position.normalize().multiplyScalar(r);
      } else {
        observer.position.set(0, 0, r);
      }
    }

    setObserverDistance(config.distance);

    // Apply initial incline to up vector
    const inclineMatrix = new THREE.Matrix4().makeRotationZ(observer.incline);
    observer.up.applyMatrix4(inclineMatrix);

    function updateObserver(delta: number) {
      const cfg = configRef.current;

      if (cfg.orbit) {
        if (observer.angularVelocity < observer.maxAngularVelocity)
          observer.angularVelocity += delta / observer.r;
        else
          observer.angularVelocity = observer.maxAngularVelocity;
      } else {
        if (observer.angularVelocity > 0)
          observer.angularVelocity -= delta / observer.r;
        else {
          observer.angularVelocity = 0;
          observer.velocity.set(0, 0, 0);
        }
      }

      observer.theta += observer.angularVelocity * delta;
      const cos = Math.cos(observer.theta);
      const sin = Math.sin(observer.theta);

      observer.position.set(observer.r * sin, 0, observer.r * cos);
      observer.velocity.set(cos * observer.angularVelocity, 0, -sin * observer.angularVelocity);

      const rotMatrix = new THREE.Matrix4().makeRotationX(observer.incline);
      observer.position.applyMatrix4(rotMatrix);
      observer.velocity.applyMatrix4(rotMatrix);

      // direction always points toward origin from observer position
      observer.direction.copy(observer.position).negate().normalize();
    }

    // ── Resize handler ────────────────────────────────────────────────────────
    function onResize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const res = configRef.current.resolution;
      renderer.setPixelRatio(window.devicePixelRatio * res);
      renderer.setSize(w, h, false);
      composer.setSize(w * res, h * res);
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);
    onResize();

    // ── Animation loop ────────────────────────────────────────────────────────
    let lastFrame = performance.now();
    let time = 0;
    let rafId = 0;

    function tick() {
      rafId = requestAnimationFrame(tick);
      const now = performance.now();
      const delta = (now - lastFrame) / 1000;
      lastFrame = now;
      time += delta;

      const cfg = configRef.current;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Sync observer distance if config changed at runtime
      if (observer.r !== cfg.distance) setObserverDistance(cfg.distance);

      updateObserver(delta);

      // Update uniforms from latest config + observer state
      uniforms.time.value           = time;
      uniforms.resolution.value.set(w * cfg.resolution, h * cfg.resolution);
      uniforms.fov.value            = cfg.fov;
      uniforms.cam_pos.value.copy(observer.position);
      uniforms.cam_dir.value.copy(observer.direction);
      uniforms.cam_up.value.copy(observer.up);
      uniforms.cam_vel.value.copy(observer.velocity);
      uniforms.accretion_disk.value    = cfg.accretionDisk;
      uniforms.use_disk_texture.value  = cfg.useDiskTexture;
      uniforms.lorentz_transform.value = cfg.lorentzTransform;
      uniforms.doppler_shift.value     = cfg.dopplerShift;
      uniforms.beaming.value           = cfg.beaming;

      bloomPass.strength  = cfg.bloomStrength;
      bloomPass.radius    = cfg.bloomRadius;
      bloomPass.threshold = cfg.bloomThreshold;

      // Recompile shader only if quality changed (expensive — only on user change)
      // Track this via a ref outside this closure if runtime quality switching is needed.

      composer.render();
    }

    tick();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      bgTexture.dispose();
      starTexture.dispose();
      diskTexture.dispose();
      material.dispose();
      mesh.geometry.dispose();
      composer.dispose();
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once — config updates flow through configRef
}
```

**Key design decisions in the hook:**
- `configRef.current = config` at the top of the hook keeps the animation loop reading the latest props without re-running the effect.
- `ResizeObserver` handles canvas resizing reactively without polling.
- Cleanup disposes every GPU resource to prevent memory leaks when the component unmounts.
- The animation loop uses `performance.now()` (not `Date.now()`) for sub-millisecond precision.
- Observer direction is derived by negating the position vector — since the black hole is at the origin, `cam_dir = normalize(-position)` always points toward it.

---

## The Component — `BlackHole.tsx`

```tsx
'use client'; // Next.js App Router: this component uses browser APIs

import React, { useRef } from 'react';
import { useBlackHole } from './useBlackHole';
import { BLACK_HOLE_DEFAULTS } from './blackHoleDefaults';
import { BlackHoleProps } from './types';

export function BlackHole({
  width = '100%',
  height = '100%',
  config,
  className,
  style,
}: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mergedConfig = {
    ...BLACK_HOLE_DEFAULTS,
    ...config,
  };

  useBlackHole(canvasRef, mergedConfig);

  const w = typeof width === 'number' ? `${width}px` : width;
  const h = typeof height === 'number' ? `${height}px` : height;

  return (
    <div style={{ width: w, height: h, overflow: 'hidden', ...style }} className={className}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
```

The `<div>` wrapper is necessary because `ResizeObserver` on the canvas itself tracks the CSS size. The canvas `width`/`height` attributes are managed by Three.js `renderer.setSize()`.

---

## Public Export — `index.ts`

```ts
export { BlackHole } from './BlackHole';
export type { BlackHoleProps, BlackHoleConfig } from './types';
```

---

## Next.js SSR Integration

Because `three` and `WebGLRenderer` access `window` and `document`, the component must be dynamically imported with SSR disabled wherever it is used:

```tsx
// In any page or layout
import dynamic from 'next/dynamic';

const BlackHole = dynamic(
  () => import('@/components/BlackHole').then(m => m.BlackHole),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <section style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <BlackHole
        width="100vw"
        height="100vh"
        style={{ position: 'absolute', inset: 0 }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* content on top */}
      </div>
    </section>
  );
}
```

---

## Usage Examples

```tsx
// 1. Fullscreen hero background
<BlackHole width="100vw" height="100vh" />

// 2. Fixed card
<BlackHole width={600} height={400} />

// 3. Override specific defaults, keep the rest
<BlackHole
  width="100%"
  height="500px"
  config={{ orbit: false, accretionDisk: false, quality: 'high' }}
/>

// 4. High quality scientific view
<BlackHole
  width={800}
  height={800}
  config={{
    quality: 'high',
    distance: 6,
    fov: 60,
    bloomStrength: 0.5,
    bloomThreshold: 0.8,
  }}
/>
```

---

## Implementation Checklist

- [ ] `npm install three` (if not already installed)
- [ ] `npm install -D raw-loader`
- [ ] Add `raw-loader` rule to `next.config.js`
- [ ] Add `src/types/glsl.d.ts` TypeScript declaration
- [ ] Copy `milkyway.jpg`, `star_noise.png`, `accretion_disk.png` to `public/textures/`
- [ ] Copy `fragmentShader.glsl` to `src/components/BlackHole/shaders/`
- [ ] Create `types.ts`
- [ ] Create `blackHoleDefaults.ts`
- [ ] Create `useBlackHole.ts`
- [ ] Create `BlackHole.tsx`
- [ ] Create `index.ts`
- [ ] Import with `dynamic({ ssr: false })` at every usage site

---

## Physics Notes (for understanding the shader)

The simulation uses **Schwarzschild units** where `G = c = 1` and the black hole mass `M = 0.5`, placing the event horizon at `r = 1`. The geodesic equation integrated per step is:

```
acceleration = -1.5 * h² * point / |point|⁵
```

Where `h² = |position × velocity|²` is the conserved squared angular momentum. This approximation is valid for photon paths (null geodesics) in the Schwarzschild metric.

The accretion disk sits in the `y = 0` plane, from `r = 2` to `r = 6` (ISCO is at `r = 3` for Schwarzschild). Disk material orbits with velocity `v = (-x, 0, z) / sqrt(2*(r-1)) / r²`, which is the Keplerian circular velocity in Schwarzschild coordinates.
