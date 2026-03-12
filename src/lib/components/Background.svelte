<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';

  // ─── Types ────────────────────────────────────────────────────────────────

  type ColorTheme = {
    head: string;
    body: string;
    tail: string;
  };

  // Each character slot tracks its own swap timer for staggered flipping
  interface CharSlot {
    char: string;
    swapCountdown: number; // frames until next swap
  }

  interface Stream {
    x: number;
    y: number;
    slots: CharSlot[];
    speed: number;
    fontSize: number;
    charSpacing: number;
    alpha: number;
    depth: number;
    theme: ColorTheme;
    charSet: string;
    // Glitch: occasionally a stream shifts its x for 1-3 frames
    glitchTimer: number;
    glitchOffsetX: number;
    // Flicker driven by a simple sine
    flickerPhase: number;
    flickerSpeed: number;
  }

  // ─── Canvas state ─────────────────────────────────────────────────────────

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animId: number;
  let width = 0;
  let height = 0;
  let frame = 0;
  let isMobile = false;

  // ─── Character sets ───────────────────────────────────────────────────────

  const CHAR_SETS: Record<string, string> = {
    japanese: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    chinese:  '子丑寅卯辰巳午天地人和水火木金土山川日月星云龙凤鸟鱼虎豹',
    latin:    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    digits:   '0123456789',
    symbols:  '!@#$%^&*<>{}[]|/\\~`±§€£¥₿∞∑∆√≈≠≤≥',
  };

  // Cyberpunk-biased pools: more symbols/digits/latin, less pure CJK
  const POOLS: string[] = [
    CHAR_SETS.japanese + CHAR_SETS.digits + CHAR_SETS.symbols,
    CHAR_SETS.digits   + CHAR_SETS.symbols + CHAR_SETS.latin,
    CHAR_SETS.latin    + CHAR_SETS.digits  + CHAR_SETS.symbols,
    CHAR_SETS.japanese + CHAR_SETS.chinese,
    CHAR_SETS.symbols  + CHAR_SETS.digits,
    CHAR_SETS.latin    + CHAR_SETS.symbols,
  ];

  // ─── Color themes — narrowed to hard cyberpunk palette ───────────────────
  // No warm ambers or mints; only neon cyan, magenta, green, purple, cold white

  const THEMES: ColorTheme[] = [
    { head: '#e8ffff', body: '#00e5ff', tail: '#001c22' }, // cold cyan
    { head: '#ffffff', body: '#00c8ff', tail: '#001020' }, // ice blue
    { head: '#ffe8ff', body: '#ff006e', tail: '#1a0010' }, // hot magenta
    { head: '#f0ffe8', body: '#39ff14', tail: '#001a00' }, // acid green
    { head: '#f0e8ff', body: '#bf00ff', tail: '#120018' }, // deep purple
    { head: '#ffffff', body: '#00ff9f', tail: '#001a10' }, // terminal green
    { head: '#ffeeff', body: '#ff44cc', tail: '#200015' }, // pink neon
    { head: '#e8eeff', body: '#4488ff', tail: '#000c20' }, // electric blue
  ];

  // ─── Stream pool ──────────────────────────────────────────────────────────

  let streams: Stream[] = [];

  // ─── Font cache ───────────────────────────────────────────────────────────

  const FONT_CACHE = new SvelteMap<number, string>();
  function getFont(size: number): string {
    let f = FONT_CACHE.get(size);
    if (!f) { f = `${size}px monospace`; FONT_CACHE.set(size, f); }
    return f;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  function randItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randChar(pool: string): string {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Staggered swap countdown: chars near the head swap faster (more "alive")
  function swapCountdown(i: number, len: number): number {
    const t = i / (len - 1 || 1);
    // head chars: swap every 4-8 frames; tail chars: swap every 20-60 frames
    return Math.floor(rand(4 + t * 16, 8 + t * 52));
  }

  // ─── Factory ──────────────────────────────────────────────────────────────

  function createStream(xHint?: number): Stream {
    const depth       = Math.random();
    const fontSize    = Math.round(10 + depth * (isMobile ? 12 : 30));
    const charSpacing = Math.round(fontSize * 1.4);
    const speed       = 0.5 + depth * (isMobile ? 1 : 2);
    const alpha       = 0.1 + depth * 0.3;
    const len         = Math.floor(rand(8, isMobile ? 22 : 30));
    const charSet     = randItem(POOLS);

    const slots: CharSlot[] = Array.from({ length: len }, (_, i) => ({
      char:          randChar(charSet),
      swapCountdown: swapCountdown(i, len),
    }));

    return {
      x:            xHint !== undefined ? xHint : Math.random() * width,
      y:            0,
      slots,
      speed,
      fontSize,
      charSpacing,
      alpha,
      depth,
      theme:        randItem(THEMES),
      charSet,
      glitchTimer:  0,
      glitchOffsetX: 0,
      flickerPhase: Math.random() * Math.PI * 2,
      flickerSpeed: rand(0.015, 0.04),
    };
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  function initAll(): void {
    width    = canvas.width  = window.innerWidth;
    height   = canvas.height = window.innerHeight;
    isMobile = width < 768;
    FONT_CACHE.clear();

    const density = isMobile ? 22 : 16;
    const count   = Math.floor(width / density);

    streams = Array.from({ length: count }, (_, i) => {
      const s = createStream((i / count) * width + Math.random() * (width / count));
      s.y = Math.random() * height * 1.5 - height * 0.5;
      return s;
    });
  }

  // ─── Draw ─────────────────────────────────────────────────────────────────

  function drawStreams(): void {
    if (frame % 30 === 0) streams.sort((a, b) => a.depth - b.depth);

    let currentFont = '';

    for (let si = 0; si < streams.length; si++) {
      const s = streams[si];
      const streamTop = s.y - s.slots.length * s.charSpacing;

      // Advance + respawn even when off-screen
      s.y += s.speed;
      if (streamTop > height) {
        const ns = createStream();
        ns.y = -ns.slots.length * ns.charSpacing;
        streams[si] = ns;
        continue;
      }
      if (s.y < -s.charSpacing) continue;

      // ── Staggered char swap ───────────────────────────────────────────────
      for (let i = 0; i < s.slots.length; i++) {
        const slot = s.slots[i];
        slot.swapCountdown--;
        if (slot.swapCountdown <= 0) {
          slot.char = randChar(s.charSet);
          slot.swapCountdown = swapCountdown(i, s.slots.length);
        }
      }

      // ── Stream-level glitch: rare horizontal jitter ───────────────────────
      if (s.glitchTimer > 0) {
        s.glitchTimer--;
        if (s.glitchTimer === 0) s.glitchOffsetX = 0;
      } else if (s.depth > 0.5 && Math.random() < 0.0008) {
        s.glitchTimer    = Math.floor(rand(1, 4));
        s.glitchOffsetX  = rand(-6, 6);
      }
      const drawX = s.x + s.glitchOffsetX;

      // ── Font switch ───────────────────────────────────────────────────────
      const font = getFont(s.fontSize);
      if (font !== currentFont) { ctx.font = font; currentFont = font; }

      // Subtle per-stream flicker (sine, no shadow)
      const flicker = 0.88 + Math.sin(frame * s.flickerSpeed + s.flickerPhase) * 0.12;
      const baseAlpha = s.alpha * flicker;
      const count = s.slots.length;

      // ── Per-character rendering ───────────────────────────────────────────
      for (let i = 0; i < count; i++) {
        const yy = s.y - i * s.charSpacing;
        if (yy < -s.charSpacing || yy > height + s.charSpacing) continue;

        const t = i / (count - 1 || 1); // 0 = head, 1 = tail

        // Alpha: sharp falloff — bright head, near-zero tail
        // Using a power curve gives a harder, more "digital" drop
        const charAlpha = baseAlpha * Math.pow(1 - t, 1.6);
        if (charAlpha < 0.01) continue;

        ctx.globalAlpha = charAlpha;

        if (i === 0) {
          // Head: near-white, NO shadow (glow replaced by bright fill only)
          ctx.fillStyle = s.theme.head;
        } else if (t < 0.35) {
          // Upper body: full accent color
          ctx.fillStyle = s.theme.body;
        } else {
          // Lower body → tail: linearly blend body→tail based on t
          // Cheap hex-string-free approach: just pick tail color beyond 0.65
          ctx.fillStyle = t < 0.65 ? s.theme.body : s.theme.tail;
        }

        ctx.fillText(s.slots[i].char, drawX, yy);
      }
    }

    ctx.globalAlpha = 1;
  }

  // ─── Main loop ────────────────────────────────────────────────────────────

  function draw(): void {
    // Slightly more opaque trail → sharper, less blurry feel = more cyberpunk
    ctx.fillStyle   = '#020408';
    ctx.globalAlpha = 0.22;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    drawStreams();

    frame++;
    animId = requestAnimationFrame(draw);
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  onMount(() => {
    ctx = canvas.getContext('2d', { alpha: false })!;
    initAll();
    draw();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = (): void => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAll, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  });

  onDestroy(() => {
    if (animId) cancelAnimationFrame(animId);
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    display: block;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: #020408;
    z-index: 0;
    pointer-events: none;
    will-change: transform;
  }
</style>