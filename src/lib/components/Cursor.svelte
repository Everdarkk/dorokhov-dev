<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // ── Raw mouse position (instant) ──────────────────────────────────────────
  let mouseX: number = -200;
  let mouseY: number = -200;

  // ── Trail position (lerped) ────────────────────────────────────────────────
  let trailX: number = -200;
  let trailY: number = -200;

  // ── Display coords (rounded, updated from RAF) ────────────────────────────
  let displayX: number = 0;
  let displayY: number = 0;

  // ── State ──────────────────────────────────────────────────────────────────
  let isVisible: boolean = false;
  let isHovering: boolean = false;
  let isPressed: boolean = false;

  // ── Line coords (SVG overlay: dot → trail center) ─────────────────────────
  let lineX1: number = 0;
  let lineY1: number = 0;
  let lineX2: number = 0;
  let lineY2: number = 0;

  // ── DOM refs ───────────────────────────────────────────────────────────────
  let dotEl: HTMLDivElement;
  let trailEl: HTMLDivElement;

  // ── Constants ──────────────────────────────────────────────────────────────
  const LERP: number = 0.10;
  const HOVER_SELECTOR: string =
    'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';

  let rafId: number;

  // ── Helpers ────────────────────────────────────────────────────────────────
  function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  // ── Event handlers ─────────────────────────────────────────────────────────
  function onMouseMove(e: MouseEvent): void {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) isVisible = true;
  }

  function onMouseLeave(): void {
    isVisible = false;
  }

  function onMouseEnter(): void {
    isVisible = true;
  }

  function onMouseDown(): void {
    isPressed = true;
  }

  function onMouseUp(): void {
    isPressed = false;
  }

  function checkHover(e: MouseEvent): void {
    const el = e.target as Element | null;
    isHovering = !!el?.closest(HOVER_SELECTOR);
  }

  // ── Animation loop ─────────────────────────────────────────────────────────
  function animate(): void {
    trailX = lerp(trailX, mouseX, LERP);
    trailY = lerp(trailY, mouseY, LERP);

    // Coords shown in labels follow the lerped trail, not the raw mouse
    displayX = Math.round(trailX);
    displayY = Math.round(trailY);

    // SVG line: from dot (mouseX, mouseY) to trail center (trailX, trailY)
    lineX1 = mouseX;
    lineY1 = mouseY;
    lineX2 = trailX;
    lineY2 = trailY;

    if (dotEl) {
      dotEl.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
    if (trailEl) {
      trailEl.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
    }

    rafId = requestAnimationFrame(animate);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  onMount((): (() => void) => {
    document.documentElement.style.cursor = 'none';

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousemove', checkHover, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    rafId = requestAnimationFrame(animate);

    return (): void => {
      document.documentElement.style.cursor = '';
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', checkHover);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });
</script>

{#if browser}
  <!-- Full-screen SVG overlay: draws the line from dot to trail center -->
  <svg
    class="cursor-svg"
    class:visible={isVisible}
    aria-hidden="true"
  >
    <line
      class="connector-line"
      x1={lineX1} y1={lineY1}
      x2={lineX2} y2={lineY2}
    />
  </svg>

  <!-- Dot: instant, tiny center point -->
  <div
    bind:this={dotEl}
    class="cursor-dot"
    class:visible={isVisible}
    class:pressed={isPressed}
    aria-hidden="true"
  ></div>

  <!-- Trail: lagging square with corner brackets + coordinate labels -->
  <div
    bind:this={trailEl}
    class="cursor-trail"
    class:visible={isVisible}
    class:hovering={isHovering}
    class:pressed={isPressed}
    aria-hidden="true"
  >
    <div class="corner corner--tl" ></div>
    <div class="corner corner--tr" ></div>
    <div class="corner corner--bl" ></div>
    <div class="corner corner--br" ></div>

    <!-- Press diamond: fills & expands on mousedown -->
    <div class="press-diamond"></div>

    <!-- "X" axis label: above top-left corner -->
    <span class="label label--x-name">X</span>
    <!-- X coordinate value: above top-right corner -->
    <span class="label label--x-val">{displayX}</span>
    <!-- "Y" axis label: left of top-left corner -->
    <span class="label label--y-name">Y</span>
    <!-- Y coordinate value: left of bottom-left corner -->
    <span class="label label--y-val">{displayY}</span>
  </div>
{/if}

<style>
  /* ── Full-screen SVG overlay (connector line) ─────────────────────────── */
  .cursor-svg {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9998; /* below dot and trail */
    opacity: 0;
    transition: opacity 0.25s ease;
    overflow: visible;
  }

  .cursor-svg.visible {
    opacity: 1;
  }

  .connector-line {
    stroke: #39ff14;
    stroke-width: 0.75px;
    stroke-opacity: 0.45;
    /* Dashed so it feels like a targeting reticle thread */
    stroke-dasharray: 3 4;
  }

  /* ── Press diamond ─────────────────────────────────────────────────────── */
  /*
    Sits at the center of the trail square.
    Normally: tiny (2px), just a neon dot.
    On press:  expands to fill ~80% of the square, fills with neon,
               then quickly fades back — giving a "pulse" feel.
  */
  .press-diamond {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: transparent;
    border: var(--stroke) solid transparent;
    transform: translate(-50%, -50%) rotate(45deg) scale(1);
    transition:
      width    0.35s cubic-bezier(0.2, 0, 0.1, 1),
      height   0.35s cubic-bezier(0.2, 0, 0.1, 1),
      background 0.25s ease,
      border-color 0.25s ease,
      box-shadow 0.25s ease,
      opacity  0.35s ease;
    opacity: 0;
  }

  /* Pressed state: expand, fill, glow */
  .cursor-trail.pressed .press-diamond {
    /* 80% of --size (3rem = 48px → ~38px diagonal → ~27px side) */
    width: 22px;
    height: 22px;
    background: rgba(57, 255, 20, 0.18);
    border-color: #39ff14;
    box-shadow: 0 0 8px #39ff14, 0 0 20px rgba(57, 255, 20, 0.45), inset 0 0 10px rgba(57, 255, 20, 0.15);
    opacity: 1;
    transition:
      width    0.18s cubic-bezier(0.2, 0, 0.1, 1),
      height   0.18s cubic-bezier(0.2, 0, 0.1, 1),
      background 0.18s ease,
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      opacity  0.12s ease;
  }

  /* While hovering + pressed: diamond is already formed by corners,
     so make the fill even more visible */
  .cursor-trail.hovering.pressed .press-diamond {
    width: 16px;
    height: 16px;
    background: rgba(57, 255, 20, 0.30);
    box-shadow: 0 0 12px #39ff14, 0 0 28px rgba(57, 255, 20, 0.5), inset 0 0 14px rgba(57, 255, 20, 0.2);
  }

  /* Dot pulse on press */
  .cursor-dot.pressed {
    box-shadow: 0 0 0 4px rgba(57, 255, 20, 0.25), 0 0 10px #39ff14;
    transition: box-shadow 0.15s ease, opacity 0.2s ease;
  }


  .cursor-dot,
  .cursor-trail {
    --neon: #39ff14;
    --neon-glow: 0 0 5px #39ff14, 0 0 12px rgba(57, 255, 20, 0.35);
    --size: 3rem;
    --arm: 10px;      /* bracket arm length */
    --stroke: 1.5px;  /* bracket line thickness */
    --lf: 'Courier New', Courier, monospace;
    --ls: 9px;
  }

  /* ── Dot ───────────────────────────────────────────────────────────────── */
  .cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #39ff14;
    pointer-events: none;
    z-index: 10000;
    will-change: transform;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .cursor-dot.visible {
    opacity: 1;
  }

  /* ── Trail wrapper ─────────────────────────────────────────────────────── */
  .cursor-trail {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--size);
    height: var(--size);
    pointer-events: none;
    z-index: 9999;
    will-change: transform;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .cursor-trail.visible {
    opacity: 1;
  }

  /* ── Corner brackets ───────────────────────────────────────────────────── */
  .corner {
    position: absolute;
    background-color: transparent;
    width: var(--arm);
    height: var(--arm);
    transition:
      top    0.38s cubic-bezier(0.4, 0, 0.2, 1),
      left   0.38s cubic-bezier(0.4, 0, 0.2, 1),
      right  0.38s cubic-bezier(0.4, 0, 0.2, 1),
      bottom 0.38s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.38s cubic-bezier(0.4, 0, 0.2, 1),
      width  0.38s cubic-bezier(0.4, 0, 0.2, 1),
      height 0.38s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .corner--tl {
    top: 0; left: 0;
    border: none;
    border-top:  var(--stroke) solid #39ff14;
    border-left: var(--stroke) solid #39ff14;
  }
  .corner--tr {
    top: 0; right: 0;
    border-top:   var(--stroke) solid #39ff14;
    border-right: var(--stroke) solid #39ff14;
  }
  .corner--bl {
    bottom: 0; left: 0;
    border-bottom: var(--stroke) solid #39ff14;
    border-left:   var(--stroke) solid #39ff14;
  }
  .corner--br {
    bottom: 0; right: 0;
    border-bottom: var(--stroke) solid #39ff14;
    border-right:  var(--stroke) solid #39ff14;
  }

  /* ── Labels ────────────────────────────────────────────────────────────── */
  .label {
    position: absolute;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    color: #39ff14;
    line-height: 1;
    white-space: nowrap;
    opacity: 1;
    /* Fade out on hover */
    transition: opacity 0.25s ease;
    pointer-events: none;
    user-select: none;
  }

  /* "X" —  */
  .label--x-name {
    top: 0px;
    left: 51px;
  }

  /* X value  */
  .label--x-val {
    top: -13px;
    right: 0;
    text-align: right;
  }

  /* "Y" —  */
  .label--y-name {
    left: -10px;
    top: 37px;
  }

  /* Y value —  */
  .label--y-val {
    left: 0px;
    bottom: -14px;
  
  }

  /* Hide labels when hovering interactive elements */
  .cursor-trail.hovering .label {
    opacity: 0;
  }

  /* ── Hover: corners converge to a diamond in the center ───────────────── */
  /*
    Each corner shrinks and translates to the center of the 54×54 box,
    then rotates 45° so its two border-lines form a diamond tip.
    All four tips together create a ◇ shape.
  */
  .cursor-trail.hovering .corner {
    width: 9px;
    height: 9px;
  }

  .cursor-trail.hovering .corner--tl {
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(225deg);
  }

  .cursor-trail.hovering .corner--tr {
    top: 50%; right: 50%;
    transform: translate(50%, -50%) rotate(315deg);
  }

  .cursor-trail.hovering .corner--bl {
    bottom: 50%; left: 50%;
    transform: translate(-50%, 50%) rotate(135deg);
  }

  .cursor-trail.hovering .corner--br {
    bottom: 50%; right: 50%;
    transform: translate(50%, 50%) rotate(45deg);
  }
</style>