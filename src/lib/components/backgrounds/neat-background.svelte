<script lang="ts">
  /**
   * NeatBackground.svelte — v1
   *
   * Zero-dependency WebGL2 mesh-gradient background.
   * Inspired by FireCMS/neat — swirling multi-colour flow field
   * rendered entirely in a fragment shader. No animation libraries,
   * no canvas 2D, no external assets.
   *
   * ── How it works ─────────────────────────────────────────────────────
   *
   * A Quilez two-pass domain warp distorts UV space.  Inside that
   * warped space, up to 5 colours are blended with 3-D value noise
   * (spatial x/y + temporal z so each colour evolves independently).
   * A thin animated film-grain layer (fBm) adds micro-texture.
   *
   * ── Performance ───────────────────────────────────────────────────────
   *   • Full-screen triangle from gl_VertexID — zero VBOs
   *   • DPR clamped to 2 → max 4× pixel budget
   *   • Pauses automatically when the tab is hidden
   *   • ResizeObserver (container-aware, not window-aware)
   *   • prefers-reduced-motion: one static frame rendered, loop stops
   *
   * ── Props ─────────────────────────────────────────────────────────────
   *   speed          number    Animation speed multiplier        0.25
   *   flowScale      number    Domain-warp zoom                  1.5
   *   colorPressure  number    Blob spread (higher = sharper)    1.2
   *   grain          number    Film-grain intensity 0–1          0.035
   *   colors         string[]  2–5 hex colours (dark palette)
   */

  import { onMount, onDestroy } from 'svelte';
  import { get }                from 'svelte/store';
  import { browser }            from '$app/environment';
  import { reducedMotion }      from '$lib/stores/motion';

  // ── Props ─────────────────────────────────────────────────────────────────

  /** Animation speed multiplier. */
  export let speed:         number   = 0.25;

  /** Domain-warp zoom — larger compresses the gradient pattern. */
  export let flowScale:     number   = 1.5;

  /**
   * Colour blob spread.  Higher values create sharper, more distinct
   * colour regions; lower values produce softer, more diffuse blends.
   */
  export let colorPressure: number   = 1.2;

  /** Film-grain intensity 0–1. */
  export let grain:         number   = 0.035;

  /**
   * 2–5 hex colours to blend.
   * Defaults are very dark variants of the app palette so content
   * stays readable and the animation stays subtle in dark mode.
   */
  export let colors: string[] = [
    '#06060a',  // base — --cp-bg near-black
    '#010b10',  // deep teal hint
    '#09000f',  // deep purple hint
    '#0d0003',  // deep magenta hint
    '#010a03',  // deep green hint
  ];

  // ── Internals ─────────────────────────────────────────────────────────────

  let canvas:    HTMLCanvasElement;
  let rafId:     number;
  let destroyed  = false;
  let startTime  = 0;

  const MAX_COLORS = 5 as const;

  function hexToRGB(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
    ];
  }

  function buildColorFlat(): Float32Array {
    const src = colors.slice(0, MAX_COLORS);
    const out  = new Float32Array(MAX_COLORS * 3);
    src.forEach((hex, i) => {
      const [r, g, b] = hexToRGB(hex);
      out[i * 3]     = r;
      out[i * 3 + 1] = g;
      out[i * 3 + 2] = b;
    });
    return out;
  }

  // ── GLSL ──────────────────────────────────────────────────────────────────

  const VERT = /* glsl */`#version 300 es
    void main() {
      // Full-screen triangle — no vertex buffers needed
      vec2 v[3];
      v[0] = vec2(-1.0, -1.0);
      v[1] = vec2( 3.0, -1.0);
      v[2] = vec2(-1.0,  3.0);
      gl_Position = vec4(v[gl_VertexID], 0.0, 1.0);
    }
  `;

  // language=glsl
  const FRAG = /* glsl */`#version 300 es
    precision highp float;

    uniform vec2  u_res;
    uniform float u_time;
    uniform float u_flow_scale;
    uniform float u_color_pressure;
    uniform float u_grain;
    uniform vec3  u_colors[5];
    uniform int   u_color_count;

    out vec4 fragColor;

    // ════════════════════════════════════════════════════════════════════
    // HASH — Inigo Quilez, fast and bias-free
    // ════════════════════════════════════════════════════════════════════
    float hash(vec3 p) {
      p  = 17.0 * fract(p * 0.3183099 + vec3(0.11, 0.17, 0.13));
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    // ════════════════════════════════════════════════════════════════════
    // 3-D VALUE NOISE — quintic C2 interpolation
    // Used for colour blending (spatial xy + temporal z)
    // ════════════════════════════════════════════════════════════════════
    float vnoise3(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);   // smoothstep (C1); swap for quintic if needed
      return mix(
        mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
            mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
            mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y),
        f.z
      );
    }

    // ════════════════════════════════════════════════════════════════════
    // 2-D VALUE NOISE — quintic C2 interpolation
    // Used for domain-warp fBm and film grain
    // ════════════════════════════════════════════════════════════════════
    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453123);
    }

    float vnoise2(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);  // quintic C2
      float a = hash2(i             ).x;
      float b = hash2(i + vec2(1,0) ).x;
      float c = hash2(i + vec2(0,1) ).x;
      float d = hash2(i + vec2(1,1) ).x;
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // ── 4-octave fBm (2-D) used by domain warp ─────────────────────────
    float fbm(vec2 p) {
      float v = 0.0, amp = 0.5;
      // Rotation-scale matrix: det = 2, rotates ~36.87°
      mat2 r = mat2(1.6, 1.2, -1.2, 1.6);
      for (int i = 0; i < 4; i++) {
        v   += amp * vnoise2(p);
        p    = r * p;
        amp *= 0.5;
      }
      return v;
    }

    // ── 3-octave fBm (2-D) used by film grain ──────────────────────────
    float fbmGrain(vec2 p) {
      float v = 0.0, amp = 0.5;
      for (int i = 0; i < 3; i++) {
        v   += amp * vnoise2(p);
        p   *= 2.07;
        amp *= 0.5;
      }
      return v;
    }

    // ════════════════════════════════════════════════════════════════════
    // QUILEZ TWO-PASS DOMAIN WARP
    // Produces the flowing, vortex-like organic distortion.
    // Reference: iquilezles.org/articles/warp/
    // ════════════════════════════════════════════════════════════════════
    vec2 domainWarp(vec2 p) {
      // First warp layer
      vec2 q = vec2(
        fbm(p                    + u_time * 0.30),
        fbm(p + vec2(5.2, 1.3)  + u_time * 0.25)
      );
      // Second warp layer — uses first warp output
      vec2 r = vec2(
        fbm(p + 3.5 * q + vec2(1.7, 9.2) + u_time * 0.45),
        fbm(p + 3.5 * q + vec2(8.3, 2.8) + u_time * 0.38)
      );
      return r;
    }

    // ════════════════════════════════════════════════════════════════════
    // MAIN
    // ════════════════════════════════════════════════════════════════════
    void main() {
      vec2  uv     = gl_FragCoord.xy / u_res;
      float aspect = u_res.x / u_res.y;

      // Aspect-correct, centred coordinates
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * u_flow_scale;

      // Domain warp at half scale for smooth broad flows
      vec2 warp = domainWarp(p * 0.5);
      vec2 wp   = p + warp * 0.45;

      // ── Colour blending ─────────────────────────────────────────────
      // Start with base colour; blend each additional colour using
      // independent 3-D noise samples so they never lock-step.
      vec3 col = u_colors[0];

      for (int i = 1; i < 5; i++) {
        if (i >= u_color_count) break;

        // Unique phase / speed / seed per colour — prevents synchronisation
        float phase = float(i) * 0.031;
        float spd   = float(i) * 0.11;
        float seed  = 13.0 + float(i) * 7.0;

        float n = vnoise3(vec3(
          wp.x * u_color_pressure + u_time * phase * 2.2,
          wp.y * u_color_pressure,
          u_time * spd
        ) + seed);

        // smoothstep blend: soft transition centred at 0.5
        col = mix(col, u_colors[i], smoothstep(0.28, 0.72, n));
      }

      // ── Film grain ─────────────────────────────────────────────────
      // Animated, temporally drifting grain so it doesn't tile visibly
      vec2 grainUv = gl_FragCoord.xy / u_res * 5.5
                   + u_time * 0.13 * vec2(1.3, 0.71);
      float gr     = fbmGrain(grainUv);
      col = clamp(col + (gr - 0.5) * u_grain, 0.0, 1.0);

      // ── Edge vignette — mild darkening toward corners ───────────────
      float vig = 1.0 - smoothstep(0.35, 0.92, length(uv - 0.5) * 1.65);
      col *= 0.86 + 0.14 * vig;

      fragColor = vec4(col, 1.0);
    }
  `;

  // ── WebGL helpers ─────────────────────────────────────────────────────────

  function compile(gl: WebGL2RenderingContext, type: GLenum, src: string): WebGLShader {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(s) ?? 'Shader compile failed');
    return s;
  }

  function buildProgram(gl: WebGL2RenderingContext): WebGLProgram {
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(p) ?? 'Link failed');
    return p;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  onMount(() => {
    startTime = performance.now();

    const gl = canvas.getContext('webgl2', {
      alpha:     false,
      antialias: false,
      depth:     false,
      stencil:   false,
      powerPreference: 'low-power',
    }) as WebGL2RenderingContext | null;

    if (!gl) {
      console.warn('NeatBackground: WebGL2 not available — background disabled.');
      return;
    }

    let prog: WebGLProgram;
    try {
      prog = buildProgram(gl);
    } catch (e) {
      console.error('NeatBackground shader error:', e);
      return;
    }

    gl.useProgram(prog);

    // VAO required by WebGL2 spec even when no attributes are used
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    // Cache uniform locations once — avoids repeated hash-map lookups per frame
    const U = {
      res:           gl.getUniformLocation(prog, 'u_res'),
      time:          gl.getUniformLocation(prog, 'u_time'),
      flowScale:     gl.getUniformLocation(prog, 'u_flow_scale'),
      colorPressure: gl.getUniformLocation(prog, 'u_color_pressure'),
      grain:         gl.getUniformLocation(prog, 'u_grain'),
      colors:        gl.getUniformLocation(prog, 'u_colors'),
      colorCount:    gl.getUniformLocation(prog, 'u_color_count'),
    } as const;

    // DPR clamped to 2 — prevents excessive fragment load on hi-DPI displays
    const dpr = Math.min(devicePixelRatio, 2);

    // Pending canvas dimensions from ResizeObserver.
    // We intentionally do NOT resize the canvas inside the ResizeObserver
    // callback. Resizing canvas.width/height clears the WebGL surface
    // synchronously; if the draw call hasn't happened yet that produces a
    // single blank/black frame (the flicker seen when section height grows).
    // By staging the new size here and applying it at the TOP of the next
    // RAF tick — right before the draw — the clear and the redraw happen in
    // the same composited frame and the flicker disappears.
    let pendingW = 0;
    let pendingH = 0;

    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width  * dpr);
      const h = Math.round(entry.contentRect.height * dpr);
      if (w > 0 && h > 0) {
        pendingW = w;
        pendingH = h;
        // If the loop is paused (reduced-motion or hidden tab), apply
        // immediately — there is no upcoming tick to pick it up.
        if (!shouldAnimate || document.hidden) {
          canvas.width  = w;
          canvas.height = h;
          gl?.viewport(0, 0, w, h);
        }
      }
    });
    ro.observe(canvas);

    // Reduced-motion: animate by default; stop loop when user prefers no motion
    let shouldAnimate = !get(reducedMotion);

    const unsubRM = reducedMotion.subscribe((val) => {
      shouldAnimate = !val;
      // If motion was re-enabled and tab is visible, restart the loop
      if (!val && !document.hidden && !destroyed) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
      }
    });

    function tick(): void {
      if (destroyed) return;

      // Apply any staged resize at the start of the frame so the canvas
      // clear and the subsequent draw call are submitted together — no
      // blank-frame gap visible to the compositor.
      if (pendingW > 0 && pendingH > 0) {
        if (canvas.width !== pendingW || canvas.height !== pendingH) {
          canvas.width  = pendingW;
          canvas.height = pendingH;
          gl?.viewport(0, 0, pendingW, pendingH);
        }
        pendingW = 0;
        pendingH = 0;
      }

      const t = ((performance.now() - startTime) / 1000) * speed;

      gl?.uniform2f( U.res,           canvas.width, canvas.height);
      gl?.uniform1f( U.time,          t);
      gl?.uniform1f( U.flowScale,     flowScale);
      gl?.uniform1f( U.colorPressure, colorPressure);
      gl?.uniform1f( U.grain,         grain);
      gl?.uniform3fv(U.colors,        buildColorFlat());
      gl?.uniform1i( U.colorCount,    Math.min(colors.length, MAX_COLORS));

      gl?.drawArrays(gl.TRIANGLES, 0, 3);

      // Continue loop only when motion is desired
      if (shouldAnimate) {
        rafId = requestAnimationFrame(tick);
      }
    }

    const onVis = (): void => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else if (shouldAnimate && !destroyed) {
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    // Always draw the first frame (static fallback for reduced-motion)
    rafId = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
      unsubRM();
      ro.disconnect();
      gl.deleteVertexArray(vao);
      gl.deleteProgram(prog);
    };
  });

  onDestroy(() => {
    if (!browser) return;
    destroyed = true;
    cancelAnimationFrame(rafId);
  });
</script>

<div class="neat-bg" aria-hidden="true" role="presentation">
  <canvas bind:this={canvas} class="neat-canvas"></canvas>
</div>

<style>
  .neat-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    will-change: transform;
    isolation: isolate;
    z-index: 0;
  }

  .neat-canvas {
    display: block;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
</style>
