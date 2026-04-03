<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { SvelteMap } from 'svelte/reactivity';

  // ─── Types ────────────────────────────────────────────────────────────────

  type ColorTheme = {
    head: string;
    body: string;
    tail: string;
  };

  interface CharSlot {
    char: string;
    swapCountdown: number;
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
    glitchTimer: number;
    glitchOffsetX: number;
    flickerPhase: number;
    flickerSpeed: number;
  }

  // ─── Props ────────────────────────────────────────────────────────────────

  /** Set true if you want the canvas to cover the viewport instead of its container */
  let { fixed = false }: { fixed?: boolean } = $props();

  // ─── State ────────────────────────────────────────────────────────────────

  let wrapper: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animId: number;
  let width = 0;
  let height = 0;
  let frame = 0;
  let isMobile = false;
  let streams: Stream[] = [];

  // Font string cache — avoids repeated string allocations
  const fontCache = new SvelteMap<number, string>();
  function getFont(size: number): string {
    let f = fontCache.get(size);
    if (!f) { f = `${size}px monospace`; fontCache.set(size, f); }
    return f;
  }

  // ─── Character sets ───────────────────────────────────────────────────────

  const CHAR_SETS: Record<string, string> = {
    japanese: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    chinese:  '子丑寅卯辰巳午天地人和水火木金土山川日月星云龙凤鸟鱼虎豹',
    latin:    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    digits:   '0123456789',
    symbols:  '!@#$%^&*<>{}[]|/\\~`±§€£¥₿∞∑∆√≈≠≤≥',
  };

  const POOLS: string[] = [
    CHAR_SETS.japanese + CHAR_SETS.digits + CHAR_SETS.symbols,
    CHAR_SETS.digits   + CHAR_SETS.symbols + CHAR_SETS.latin,
    CHAR_SETS.latin    + CHAR_SETS.digits  + CHAR_SETS.symbols,
    CHAR_SETS.japanese + CHAR_SETS.chinese,
    CHAR_SETS.symbols  + CHAR_SETS.digits,
    CHAR_SETS.latin    + CHAR_SETS.symbols,
  ];

  // ─── Color themes ─────────────────────────────────────────────────────────

  const THEMES: ColorTheme[] = [
    { head: '#e8ffff', body: '#00e5ff', tail: '#001c22' },
    { head: '#ffffff', body: '#00c8ff', tail: '#001020' },
    { head: '#ffe8ff', body: '#ff006e', tail: '#1a0010' },
    { head: '#f0ffe8', body: '#39ff14', tail: '#001a00' },
    { head: '#f0e8ff', body: '#bf00ff', tail: '#120018' },
    { head: '#ffffff', body: '#00ff9f', tail: '#001a10' },
    { head: '#ffeeff', body: '#ff44cc', tail: '#200015' },
    { head: '#e8eeff', body: '#4488ff', tail: '#000c20' },
  ];

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

  function swapCountdown(i: number, len: number): number {
    const t = i / (len - 1 || 1);
    return Math.floor(rand(4 + t * 16, 8 + t * 52));
  }

  // ─── Stream factory ───────────────────────────────────────────────────────

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
      x:             xHint !== undefined ? xHint : Math.random() * width,
      y:             0,
      slots,
      speed,
      fontSize,
      charSpacing,
      alpha,
      depth,
      theme:         randItem(THEMES),
      charSet,
      glitchTimer:   0,
      glitchOffsetX: 0,
      flickerPhase:  Math.random() * Math.PI * 2,
      flickerSpeed:  rand(0.015, 0.04),
    };
  }

  // ─── Resize & init ────────────────────────────────────────────────────────

  function initAll(): void {
    // Use the wrapper element's size, not window
    const rect = wrapper.getBoundingClientRect();
    width  = Math.round(rect.width)  || wrapper.offsetWidth;
    height = Math.round(rect.height) || wrapper.offsetHeight;

    // Sync canvas resolution to real pixels (sharp on HiDPI)
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    isMobile = width < 768;
    fontCache.clear();

    const density = isMobile ? 22 : 16;
    const count   = Math.max(1, Math.floor(width / density));

    streams = Array.from({ length: count }, (_, i) => {
      const s = createStream((i / count) * width + Math.random() * (width / count));
      s.y = Math.random() * height * 1.5 - height * 0.5;
      return s;
    });
  }

  // ─── Draw ─────────────────────────────────────────────────────────────────

  function drawStreams(): void {
    // Re-sort by depth every 30 frames (cheap painter's-algorithm depth order)
    if (frame % 30 === 0) streams.sort((a, b) => a.depth - b.depth);

    let currentFont = '';

    for (let si = 0; si < streams.length; si++) {
      const s = streams[si];
      const streamTop = s.y - s.slots.length * s.charSpacing;

      s.y += s.speed;

      // Respawn when fully off the bottom
      if (streamTop > height) {
        const ns = createStream();
        ns.y = -ns.slots.length * ns.charSpacing;
        streams[si] = ns;
        continue;
      }

      // Skip if not yet in view
      if (s.y < -s.charSpacing) continue;

      // Staggered char swap
      for (let i = 0; i < s.slots.length; i++) {
        const slot = s.slots[i];
        if (--slot.swapCountdown <= 0) {
          slot.char = randChar(s.charSet);
          slot.swapCountdown = swapCountdown(i, s.slots.length);
        }
      }

      // Rare horizontal glitch jitter
      if (s.glitchTimer > 0) {
        if (--s.glitchTimer === 0) s.glitchOffsetX = 0;
      } else if (s.depth > 0.5 && Math.random() < 0.0008) {
        s.glitchTimer    = Math.floor(rand(1, 4));
        s.glitchOffsetX  = rand(-6, 6);
      }
      const drawX = s.x + s.glitchOffsetX;

      const font = getFont(s.fontSize);
      if (font !== currentFont) { ctx.font = font; currentFont = font; }

      const flicker   = 0.88 + Math.sin(frame * s.flickerSpeed + s.flickerPhase) * 0.12;
      const baseAlpha = s.alpha * flicker;
      const count     = s.slots.length;

      for (let i = 0; i < count; i++) {
        const yy = s.y - i * s.charSpacing;
        if (yy < -s.charSpacing || yy > height + s.charSpacing) continue;

        const t         = i / (count - 1 || 1);
        const charAlpha = baseAlpha * Math.pow(1 - t, 1.6);
        if (charAlpha < 0.01) continue;

        ctx.globalAlpha = charAlpha;
        ctx.fillStyle   = i === 0
          ? s.theme.head
          : t < 0.35
            ? s.theme.body
            : t < 0.65 ? s.theme.body : s.theme.tail;

        ctx.fillText(s.slots[i].char, drawX, yy);
      }
    }

    ctx.globalAlpha = 1;
  }

  // ─── Main loop ────────────────────────────────────────────────────────────

  let running = true;

  function draw(): void {
    if (!running) return;

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

    // ResizeObserver watches the wrapper — works for any container, not just window
    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAll, 150);
    });
    ro.observe(wrapper);

    // Page visibility: pause animation when tab is hidden
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animId);
      } else {
        running = true;
        draw();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });

  onDestroy(() => {
    if (!browser) return;
    running = false;
    cancelAnimationFrame(animId);
  });
</script>

<!--
  Wrapper fills its parent. Make sure the parent has explicit dimensions
  (e.g. height: 100vh, or a fixed height). For full-page use set fixed={true}.
-->
<div bind:this={wrapper} class="bg-wrapper" class:fixed>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .bg-wrapper {
    /* Fill whatever container this lives in */
    display: block;
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    background: #020408;
    /* Hint to the compositor to keep this on its own layer */
    will-change: transform;
    z-index: 0;
  }

  /* Optional: cover the full viewport instead */
  .bg-wrapper.fixed {
    position: fixed;
  }

  canvas {
    display: block;
    /* CSS size = container size; actual resolution set via JS (HiDPI-aware) */
    width: 100%;
    height: 100%;
  }
</style>