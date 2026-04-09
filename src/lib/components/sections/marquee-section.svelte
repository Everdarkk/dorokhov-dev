<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { MarqueeItem } from '$lib/types';
	import { DEFAULT_MARQUEE_ITEMS } from '$lib/constants/marquee';
	import IconGlyph from '$lib/components/common/icon-glyph.svelte';

	// ─── Props ────────────────────────────────────────────────────────────────

	export let items:        MarqueeItem[] = [];
	export let speed:        number        = 80;
	export let pauseOnHover: boolean       = true;
	export let direction:    'left'|'right'= 'left';

	// ─── State ────────────────────────────────────────────────────────────────

	$: resolvedItems = items.length > 0 ? items : DEFAULT_MARQUEE_ITEMS;

	let rootEl: HTMLDivElement;
	let tapeEl: HTMLDivElement;
	let setAEl: HTMLDivElement;

	let pos       = 0;
	let loopWidth = 0;
	let rafId     = 0;
	let prevTs    = 0;
	let hovering  = false;
	let dragging  = false;
	let dragStartX   = 0;
	let dragStartPos = 0;

	// Number of cloned sets rendered. Recalculated after mount so the tape
	// always overflows the viewport — guarantees no visible gap on any screen.
	let setCopies = 4;

	// ─── rAF loop ─────────────────────────────────────────────────────────────

	function loop(ts: number): void {
		const dt = prevTs ? ts - prevTs : 0;
		prevTs = ts;

		if (!dragging && !(pauseOnHover && hovering) && loopWidth > 0) {
			pos += (direction === 'left' ? -speed : speed) * (dt / 1000);
			// Seamless wrap — modulo keeps pos inside (-loopWidth, 0]
			if (pos <= -loopWidth) pos += loopWidth;
			if (pos >   0)         pos -= loopWidth;
		}

		// matrix3d avoids string parsing overhead vs translate3d(${n}px,0,0)
		// and is the same GPU instruction under the hood
		tapeEl.style.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,${pos},0,0,1)`;
		rafId = requestAnimationFrame(loop);
	}

	// ─── Drag ─────────────────────────────────────────────────────────────────

	function onPointerDown(e: PointerEvent): void {
		if (e.button > 0) return;
		dragging     = true;
		dragStartX   = e.clientX;
		dragStartPos = pos;
		prevTs       = 0;
		rootEl.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent): void {
		if (!dragging) return;
		e.preventDefault();
		pos = dragStartPos + (e.clientX - dragStartX);
		if (loopWidth > 0) {
			while (pos <= -loopWidth) pos += loopWidth;
			while (pos >   0)         pos -= loopWidth;
		}
		// Write is handled by the rAF loop already running — no double write needed
	}

	function onPointerUp(): void {
		dragging = false;
		prevTs   = 0;
	}

	// ─── Lifecycle ────────────────────────────────────────────────────────────

	onMount((): (() => void) => {
		rafId = requestAnimationFrame(() => {
			// Measure one set's pixel width
			loopWidth = setAEl.offsetWidth;

			// We need enough copies so the tape (= setCopies × loopWidth)
			// is wider than the viewport even when pos wraps back to 0.
			// Formula: copies needed = ceil(viewportWidth / loopWidth) + 2
			// The +2 ensures one full set overflows on each side at all times.
			if (loopWidth > 0) {
				setCopies = Math.ceil(window.innerWidth / loopWidth) + 2;
			}

			if (direction === 'right') pos = -loopWidth;

			// Wait one more frame so Svelte has re-rendered the new setCopies
			rafId = requestAnimationFrame(loop);
		});

		rootEl.addEventListener('pointermove', onPointerMove, { passive: false });

		// Recalculate on resize so wide/narrow windows always stay seamless
		function onResize(): void {
			if (!setAEl) return;
			loopWidth = setAEl.offsetWidth;
			if (loopWidth > 0) {
				setCopies = Math.ceil(window.innerWidth / loopWidth) + 2;
			}
		}
		window.addEventListener('resize', onResize);

		return (): void => {
			cancelAnimationFrame(rafId);
			rootEl.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('resize', onResize);
		};
	});

	onDestroy((): void => {
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
	});
</script>

<!-- ─── Markup ──────────────────────────────────────────────────────────── -->
<div
	class="mq-root"
	aria-label="Skills marquee"
	aria-live="off"
	role="region"
	bind:this={rootEl}
	on:mouseenter={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:pointerdown={onPointerDown}
	on:pointerup={onPointerUp}
	on:pointercancel={onPointerUp}
>
	<div class="mq-fade mq-fade--left"  aria-hidden="true"></div>
	<div class="mq-fade mq-fade--right" aria-hidden="true"></div>

	<div class="mq-clip" aria-hidden="true">
		<div class="mq-tape" bind:this={tapeEl}>

			<!-- Set 0 — bound for measuring loopWidth -->
			<div class="mq-set" bind:this={setAEl}>
				{#each resolvedItems as item (item.id + '-0')}
					<div class="mq-card mq-card--{item.color}">
						<div class="mq-card__icon"><IconGlyph name={item.icon} size={24} /></div>
						<span class="mq-card__label">{item.label}</span>
					</div>
				{/each}
			</div>

			<!--
				Extra copies — enough to always overflow the viewport.
				setCopies is calculated after mount: ceil(vw / loopWidth) + 2.
				The wrap logic only ever jumps back by exactly loopWidth,
				so the visible area always contains at least one full set
				with more sets extending to the right — no gap, no flicker.
			-->
			{#each Array.from({ length: setCopies - 1 }, (_, index) => index) as i (i)}
				<div class="mq-set" aria-hidden="true">
					{#each resolvedItems as item (item.id + '-' + (i + 1))}
						<div class="mq-card mq-card--{item.color}">
							<div class="mq-card__icon"><IconGlyph name={item.icon} size={24} /></div>
							<span class="mq-card__label">{item.label}</span>
						</div>
					{/each}
				</div>
			{/each}

		</div>
	</div>

	<div class="mq-scanlines" aria-hidden="true"></div>
</div>

<!-- ─── Styles ─────────────────────────────────────────────────────────── -->
<style>
	/* ── Root ── */
	.mq-root {
		position: relative;
		width: 100%;
		height: clamp(8rem, 16vw, 11rem);
		background: rgba(6, 6, 10, 0.92);
		border-top:    1px solid rgba(0, 245, 255, 0.2);
		border-bottom: 1px solid rgba(0, 245, 255, 0.2);
		overflow: hidden;
		/*
		 * NO isolation: isolate — it forces a new stacking context that
		 * makes the browser composite all children together on every frame.
		 */
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
		touch-action: pan-y;
	}

	.mq-root:active { cursor: grabbing; }

	/* ── Clip ── */
	.mq-clip {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	/* ── Tape ── */
	.mq-tape {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		height: 100%;
		/*
		 * Only will-change: transform — no translateZ(0) alongside it.
		 * Having both creates two conflicting compositor hints on WebKit,
		 * causing the layer to be re-uploaded on every frame → jank.
		 */
		will-change: transform;
	}

	/* ── Set ── */
	.mq-set {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: clamp(0.6rem, 1.5vw, 1rem);
		padding: 0 clamp(0.6rem, 1.5vw, 1rem);
		padding-right: 0;
		flex-shrink: 0;
	}

	/* ── Card ── */
	.mq-card {
		width: clamp(8rem, 15vw, 11rem);
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: clamp(0.35rem, 0.8vw, 0.55rem);
		padding: clamp(0.7rem, 1.4vw, 1rem) clamp(0.5rem, 1vw, 0.75rem);
		background: linear-gradient(135deg, rgba(16, 66, 233, 0.1) 0%, rgba(16, 66, 233, 0.04) 100%);
		border: 1px solid rgba(0, 245, 255, 0.18);
		position: relative;
		overflow: hidden;
		pointer-events: auto;
		transition: border-color 0.25s ease;
	}

	/* Glow via ::before opacity — GPU composited, zero repaint */
	.mq-card::before {
		content: '';
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.25s ease;
		pointer-events: none;
		background: radial-gradient(ellipse at center, rgba(0, 245, 255, 0.15) 0%, transparent 70%);
		z-index: 0;
	}

	.mq-card--pink::before   { background: radial-gradient(ellipse at center, rgba(255, 0,   85,  0.15) 0%, transparent 70%); }
	.mq-card--purple::before { background: radial-gradient(ellipse at center, rgba(179, 0,   255, 0.15) 0%, transparent 70%); }
	.mq-card--yellow::before { background: radial-gradient(ellipse at center, rgba(255, 230, 0,   0.15) 0%, transparent 70%); }
	.mq-card--green::before  { background: radial-gradient(ellipse at center, rgba(0,   255, 136, 0.15) 0%, transparent 70%); }

	.mq-card:hover::before         { opacity: 1; }
	.mq-card:hover                 { border-color: rgba(0,   245, 255, 0.5); }
	.mq-card--pink:hover           { border-color: rgba(255, 0,   85,  0.5); }
	.mq-card--purple:hover         { border-color: rgba(179, 0,   255, 0.5); }
	.mq-card--yellow:hover         { border-color: rgba(255, 230, 0,   0.5); }
	.mq-card--green:hover          { border-color: rgba(0,   255, 136, 0.5); }

	/* ── Icon ── */
	.mq-card__icon {
		width:  clamp(1.5rem, 3.2vw, 2.1rem);
		height: clamp(1.5rem, 3.2vw, 2.1rem);
		display: flex;
		align-items: center;
		justify-content: center;
		/*
		 * drop-shadow lives here, NOT on the tape or a parent of the
		 * animating element. SVG filter effects on a will-change:transform
		 * ancestor force the GPU to re-rasterize the entire layer every frame.
		 * On the icon element itself it is painted once and cached.
		 */
		filter: drop-shadow(0 0 5px currentColor);
		position: relative;
		z-index: 1;
	}

	.mq-card__icon :global(svg) { width: 100%; height: 100%; }

	/* ── Label ── */
	.mq-card__label {
		font-family: var(--font-logo, 'Share Tech Mono', monospace);
		font-size:   clamp(0.52rem, 1.1vw, 0.7rem);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	/* ── Color variants ── */
	.mq-card--cyan   { color: var(--cp-cyan,   #00f5ff); }
	.mq-card--pink   { color: var(--cp-pink,   #ff0055); }
	.mq-card--purple { color: var(--cp-purple, #b300ff); }
	.mq-card--yellow { color: var(--cp-yellow, #ffe600); }
	.mq-card--green  { color: var(--cp-green,  #00ff88); }

	/* ── Edge fades ── */
	.mq-fade {
		position: absolute;
		top: 0; bottom: 0;
		width: clamp(3rem, 8vw, 7rem);
		z-index: 2;
		pointer-events: none;
	}
	.mq-fade--left  { left:  0; background: linear-gradient(to right, rgba(6,6,10,0.96), transparent); }
	.mq-fade--right { right: 0; background: linear-gradient(to left,  rgba(6,6,10,0.96), transparent); }

	/* ── Scanlines ── */
	.mq-scanlines {
		position: absolute;
		inset: 0;
		z-index: 3;
		pointer-events: none;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.06) 3px,
			rgba(0, 0, 0, 0.06) 4px
		);
	}

	/* ── Reduce motion ── */
	@media (prefers-reduced-motion: reduce) {
		.mq-card__icon   { filter: none; }
		.mq-card,
		.mq-card::before { transition: none; }
	}
</style>