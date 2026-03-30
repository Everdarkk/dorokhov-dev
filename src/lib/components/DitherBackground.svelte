<script lang="ts">
  /**
   * SwirlDitherBackground.svelte — v2
   *
   * Zero-dependency WebGL2 fragment shader background.
   * Swirl (domain-warped fBm) + proper ordered dithering overlay.
   *
   * ── How the dither actually works ──────────────────────────────────────
   *
   * The dither is NOT a post-process blend on a float value.
   * It is a BINARY per-pixel decision:
   *
   *   threshold = pattern(pixel_coords)   // 0..1 from the chosen matrix/noise
   *   show_dot  = (swirl_luminance > threshold)
   *   pixel     = show_dot ? colorB : colorA
   *
   * This produces the hard pixel-grid snap that makes dithering look
   * like dithering — exactly like shaders.com/docs/components/dither.
   * The swirl flows underneath and the dither pixels snap on/off as
   * luminance crosses thresholds, creating the "animated cyber grid" effect.
   *
   * ── Patterns ───────────────────────────────────────────────────────────
   *   bayer2       — 2×2 Bayer matrix  (coarsest, very retro)
   *   bayer4       — 4×4 Bayer matrix  (classic ordered dither)
   *   bayer8       — 8×8 Bayer matrix  (fine, smooth gradients)
   *   clusteredDot — 4×4 clustered-dot screen (halftone-like)
   *   blueNoise    — interleaved-gradient noise (smooth, filmgrain-like)
   *   whiteNoise   — per-pixel random (raw noise grain)
   *
   * ── Props ───────────────────────────────────────────────────────────────
   *   speed          float   Animation speed               0.18
   *   swirlScale     float   Noise zoom                    1.6
   *   octaves        int     fBm layers 1–6                5
   *   ditherPattern  string  Pattern name (see above)      'bayer4'
   *   pixelSize      float   Pixel block size (1 = native) 3.0
   *   threshold      float   Luminance cut-off 0–1         0.5
   *   spread         float   How wide a luminance band dithers (0–1) 1.0
   *   colorA         string  Dark dither colour (hex)      '#050608'
   *   colorB         string  Light dither colour (hex)     '#1a2744'
   */

  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  // ── Props ─────────────────────────────────────────────────────────────────

  export let speed:         number = 0.18;
  export let swirlScale:    number = 1.6;
  export let octaves:       number = 5;

  /** Which dither pattern to use. */
  export let ditherPattern: 'bayer2' | 'bayer4' | 'bayer8' | 'clusteredDot' | 'blueNoise' | 'whiteNoise' = 'bayer4';

  /** Pixel block size in screen pixels. 1 = every pixel, 4 = chunky retro blocks. */
  export let pixelSize:     number = 3;

  /** Luminance threshold: pixels below this are always colorA. 0–1. */
  export let threshold:     number = 0.5;

  /**
   * How wide a luminance band participates in dithering.
   * 1.0 = full range dithers. 0.3 = only a narrow band around threshold dithers,
   * rest becomes solid colorA or colorB.
   */
  export let spread:        number = 1.0;

  /** Dark dither colour — shown on "off" pixels. */
  export let colorA:        string = '#050608';

  /** Light dither colour — shown on "on" pixels. */
  export let colorB:        string = '#1a2744';

  // ── Internals ─────────────────────────────────────────────────────────────

  let canvas: HTMLCanvasElement;
  let rafId:  number;
  let destroyed = false;
  let startTime  = 0;

  // Pattern name → integer ID sent as uniform (GLSL can't receive strings)
  const PATTERN_ID: Record<string, number> = {
    bayer2:       0,
    bayer4:       1,
    bayer8:       2,
    clusteredDot: 3,
    blueNoise:    4,
    whiteNoise:   5,
  };

  function hexToRGB(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
    ];
  }

  $: rgbA = hexToRGB(colorA);
  $: rgbB = hexToRGB(colorB);

  // ── GLSL ──────────────────────────────────────────────────────────────────

  const VERT = /* glsl */`#version 300 es
    void main() {
      // Full-screen triangle from gl_VertexID, no buffers needed
      vec2 v[3];
      v[0] = vec2(-1,-1); v[1] = vec2(3,-1); v[2] = vec2(-1,3);
      gl_Position = vec4(v[gl_VertexID], 0, 1);
    }
  `;

  const FRAG = /* glsl */`#version 300 es
    precision highp float;

    uniform vec2  u_res;
    uniform float u_time;
    uniform float u_scale;
    uniform int   u_octaves;
    uniform int   u_pattern;    // 0=bayer2 1=bayer4 2=bayer8 3=clustered 4=blue 5=white
    uniform float u_pixelSize;  // block size in screen pixels
    uniform float u_threshold;  // luminance cut-off
    uniform float u_spread;     // dither band width
    uniform vec3  u_colorA;     // dark / off pixel colour
    uniform vec3  u_colorB;     // light / on pixel colour

    out vec4 fragColor;

    // ════════════════════════════════════════════════════════════════════
    // SWIRL — domain-warped fBm
    // ════════════════════════════════════════════════════════════════════

    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453123);
    }

    float vnoise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0); // quintic C2
      float a = hash2(i             ).x;
      float b = hash2(i+vec2(1,0)   ).x;
      float c = hash2(i+vec2(0,1)   ).x;
      float d = hash2(i+vec2(1,1)   ).x;
      return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
    }

    mat2 rot2(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }

    float fbm(vec2 p) {
      float v=0., amp=.5;
      mat2 r = rot2(0.81);
      for(int i=0;i<8;i++){
        if(i>=u_octaves) break;
        v   += amp * vnoise(p);
        p    = r * p * 2.02;
        amp *= .5;
      }
      return v;
    }

    // Two-pass Quilez domain warp → vortex swirl
    float swirl(vec2 p) {
      vec2 q = vec2(
        fbm(p + vec2(0.00,0.00) + u_time*0.37),
        fbm(p + vec2(5.20,1.30) + u_time*0.29)
      );
      vec2 r = vec2(
        fbm(p + 4.*q + vec2(1.7,9.2) + u_time*0.52),
        fbm(p + 4.*q + vec2(8.3,2.8) + u_time*0.41)
      );
      return fbm(p + 4.*r);
    }

    // ════════════════════════════════════════════════════════════════════
    // DITHER PATTERNS — each returns a threshold in [0, 1]
    // ════════════════════════════════════════════════════════════════════

    // ── Bayer 2×2 ──────────────────────────────────────────────────────
    float bayer2(ivec2 px) {
      const float M[4] = float[4](
        0./4., 2./4.,
        3./4., 1./4.
      );
      return M[(px.y&1)*2 + (px.x&1)];
    }

    // ── Bayer 4×4 ──────────────────────────────────────────────────────
    float bayer4(ivec2 px) {
      const float M[16] = float[16](
         0./16.,  8./16.,  2./16., 10./16.,
        12./16.,  4./16., 14./16.,  6./16.,
         3./16., 11./16.,  1./16.,  9./16.,
        15./16.,  7./16., 13./16.,  5./16.
      );
      return M[(px.y&3)*4 + (px.x&3)];
    }

    // ── Bayer 8×8 ──────────────────────────────────────────────────────
    float bayer8(ivec2 px) {
      const float M[64] = float[64](
         0./64., 32./64.,  8./64., 40./64.,  2./64., 34./64., 10./64., 42./64.,
        48./64., 16./64., 56./64., 24./64., 50./64., 18./64., 58./64., 26./64.,
        12./64., 44./64.,  4./64., 36./64., 14./64., 46./64.,  6./64., 38./64.,
        60./64., 28./64., 52./64., 20./64., 62./64., 30./64., 54./64., 22./64.,
         3./64., 35./64., 11./64., 43./64.,  1./64., 33./64.,  9./64., 41./64.,
        51./64., 19./64., 59./64., 27./64., 49./64., 17./64., 57./64., 25./64.,
        15./64., 47./64.,  7./64., 39./64., 13./64., 45./64.,  5./64., 37./64.,
        63./64., 31./64., 55./64., 23./64., 61./64., 29./64., 53./64., 21./64.
      );
      return M[(px.y&7)*8 + (px.x&7)];
    }

    // ── Clustered dot (4×4 halftone screen) ────────────────────────────
    // Dots grow from the centre of each cell — classic halftone look.
    float clusteredDot(ivec2 px) {
      const float M[16] = float[16](
        12./16., 5./16., 6./16., 13./16.,
         4./16., 0./16., 1./16.,  7./16.,
        11./16., 3./16., 2./16.,  8./16.,
        15./16., 10./16., 9./16., 14./16.
      );
      return M[(px.y&3)*4 + (px.x&3)];
    }

    // ── Blue-noise approximation (interleaved gradient noise) ───────────
    // R. Jimenez 2014 — smooth, non-repetitive, film-grain-like.
    float blueNoise(ivec2 px) {
      vec2 fp = vec2(px);
      return fract(52.9829189 * fract(dot(fp, vec2(0.06711056, 0.00583715))));
    }

    // ── White noise (per-pixel random) ─────────────────────────────────
    float whiteNoise(ivec2 px) {
      vec2 fp = vec2(px);
      return fract(sin(dot(fp, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // ── Dispatcher ─────────────────────────────────────────────────────
    float ditherThreshold(ivec2 px) {
      if (u_pattern == 0) return bayer2(px);
      if (u_pattern == 1) return bayer4(px);
      if (u_pattern == 2) return bayer8(px);
      if (u_pattern == 3) return clusteredDot(px);
      if (u_pattern == 4) return blueNoise(px);
      return whiteNoise(px);    // pattern == 5
    }

    // ════════════════════════════════════════════════════════════════════
    // MAIN
    // ════════════════════════════════════════════════════════════════════
    void main() {
      // ── 1. Block the pixel coords so dither has pixel-size scale ─────
      //    Floor to block grid → every pixel in a block shares its threshold
      float ps       = max(u_pixelSize, 1.0);
      ivec2 blockPx  = ivec2(floor(gl_FragCoord.xy / ps) * ps);

      // ── 2. Sample the swirl at the (continuous) UV ───────────────────
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 p  = (uv - 0.5) * vec2(u_res.x / u_res.y, 1.0) * u_scale;

      float lum = swirl(p);

      // Radial vignette — darkens the edges
      float vig = 1.0 - smoothstep(0.3, 0.85, length(uv - 0.5));
      lum *= vig;

      // ── 3. Remap luminance with threshold + spread ────────────────────
      //    threshold shifts the 50% point; spread controls the dither band.
      //    lum < (threshold - spread/2) → always colorA (solid dark)
      //    lum > (threshold + spread/2) → always colorB (solid light)
      //    in between                   → dithered
      float half_spread = u_spread * 0.5;
      float lo = u_threshold - half_spread;
      float hi = u_threshold + half_spread;

      // Normalise lum into [0,1] within the spread band
      float t = clamp((lum - lo) / max(hi - lo, 0.0001), 0.0, 1.0);

      // ── 4. Binary dither decision ─────────────────────────────────────
      //    Get the pattern threshold for this pixel block, compare with t.
      float dt  = ditherThreshold(blockPx);
      bool  dot = (t > dt);

      // ── 5. Output ─────────────────────────────────────────────────────
      vec3 col = dot ? u_colorB : u_colorA;

      fragColor = vec4(col, 1.0);
    }
  `;

  // ── WebGL setup ───────────────────────────────────────────────────────────

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
    }) as WebGL2RenderingContext | null;

    if (!gl) {
      console.warn('SwirlDitherBackground: WebGL2 not available.');
      return;
    }

    let prog: WebGLProgram;
    try { prog = buildProgram(gl); }
    catch (e) { console.error('Shader error:', e); return; }

    gl.useProgram(prog);

    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    // Cache all uniform locations once
    const U = {
      res:        gl.getUniformLocation(prog, 'u_res'),
      time:       gl.getUniformLocation(prog, 'u_time'),
      scale:      gl.getUniformLocation(prog, 'u_scale'),
      octaves:    gl.getUniformLocation(prog, 'u_octaves'),
      pattern:    gl.getUniformLocation(prog, 'u_pattern'),
      pixelSize:  gl.getUniformLocation(prog, 'u_pixelSize'),
      threshold:  gl.getUniformLocation(prog, 'u_threshold'),
      spread:     gl.getUniformLocation(prog, 'u_spread'),
      colorA:     gl.getUniformLocation(prog, 'u_colorA'),
      colorB:     gl.getUniformLocation(prog, 'u_colorB'),
    };

    const dpr = Math.min(devicePixelRatio, 2);
    const ro  = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width  * dpr);
      const h = Math.round(e.contentRect.height * dpr);
      if (w && h) { canvas.width = w; canvas.height = h; gl.viewport(0,0,w,h); }
    });
    ro.observe(canvas);

    function tick() {
      if (destroyed) return;
      rafId = requestAnimationFrame(tick);

      const t  = ((performance.now() - startTime) / 1000) * speed;

      gl?.uniform2f(U.res,       canvas.width, canvas.height);
      gl?.uniform1f(U.time,      t);
      gl?.uniform1f(U.scale,     swirlScale);
      gl?.uniform1i(U.octaves,   octaves);
      gl?.uniform1i(U.pattern,   PATTERN_ID[ditherPattern] ?? 1);
      gl?.uniform1f(U.pixelSize, pixelSize);
      gl?.uniform1f(U.threshold, threshold);
      gl?.uniform1f(U.spread,    spread);
      gl?.uniform3f(U.colorA,    ...rgbA);
      gl?.uniform3f(U.colorB,    ...rgbB);

      gl?.drawArrays(gl.TRIANGLES, 0, 3);
    }

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        tick();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    if (!document.hidden) rafId = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
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

<div class="swirl-bg" aria-hidden="true" role="presentation">
  <canvas bind:this={canvas} class="swirl-canvas"></canvas>/>
</div>

<style>
  .swirl-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    will-change: transform;
    isolation: isolate;
  }

  .swirl-canvas {
    display: block;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
</style>