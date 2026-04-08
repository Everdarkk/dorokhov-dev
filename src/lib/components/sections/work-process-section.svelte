<script lang="ts">
	/**
	 * WorkProcess Component – Carousel Edition
	 *
	 * Full-screen carousel where each slide is one work-process step.
	 * Navigation: arrow buttons (prev / next) + dot pagination.
	 * Both arrows and dots are disabled / inert at the boundaries.
	 *
	 * Layout:
	 *  - Large step number (background watermark)
	 *  - Icon with glow
	 *  - Title + subtitle (monospace label)
	 *  - Description
	 *  - Tool badges
	 *  - Slide: animated enter from right (next) or left (prev)
	 *
	 * Animation starts only when section enters viewport (scrollReveal action).
	 * Slide transitions are CSS-only (no JS timers), GPU-composited.
	 * Touch / swipe supported via pointer events.
	 */

	import SectionTitle from '$lib/components/common/section-title.svelte'
	import { onDestroy } from 'svelte'
	import bg1 from '$lib/assets/images/background.svg'
	import bg2 from '$lib/assets/images/background-2.svg'
	import bg3 from '$lib/assets/images/background-3.svg'
	import bg4 from '$lib/assets/images/background-4.svg'
	import bg5 from '$lib/assets/images/background-5.svg'
	import { scrollReveal } from '$lib/actions'
	import {
		WORK_STEPS,
		WP_ANIMATION_CONFIG,
		STEP_ACCENT_COLOR_MAP,
		WORK_STEP_ICONS,
	} from '$lib/constants/work-process'
	import type { AccentColor } from '$lib/types'

	// ─── State ────────────────────────────────────────────────────────────────

	let sectionVisible = false;
	let current        = 0;
	let direction: 'next' | 'prev' = 'next';
	let animating      = false;
	let slideKey       = 0;
	let prevBgImage    = '';
	let animationTimeout: ReturnType<typeof setTimeout> | null = null;

	let touchStartX = 0;
	let touchStartY = 0;
	const SWIPE_THRESHOLD = 50;

	// ─── Backgrounds ──────────────────────────────────────────────────────────

	const BACKGROUNDS = [bg1, bg2, bg3, bg4, bg5];

	// ─── Derived ──────────────────────────────────────────────────────────────

	$: step    = WORK_STEPS[current];
	$: isFirst = current === 0;
	$: isLast  = current === WORK_STEPS.length - 1;
	$: bgImage  = BACKGROUNDS[current % BACKGROUNDS.length];

	// ─── Navigation ───────────────────────────────────────────────────────────

	function navigate(dir: 'next' | 'prev'): void {
		if (animating) return;
		if (dir === 'next' && isLast)  return;
		if (dir === 'prev' && isFirst) return;
		direction   = dir;
		animating   = true;
		prevBgImage = bgImage;
		current    += dir === 'next' ? 1 : -1;
		slideKey++;
		if (animationTimeout !== null) clearTimeout(animationTimeout);
		animationTimeout = setTimeout(() => {
			animating = false;
			animationTimeout = null;
		}, 520);
	}

	function goTo(index: number): void {
		if (index === current || animating) return;
		direction   = index > current ? 'next' : 'prev';
		animating   = true;
		prevBgImage = bgImage;
		current     = index;
		slideKey++;
		if (animationTimeout !== null) clearTimeout(animationTimeout);
		animationTimeout = setTimeout(() => {
			animating = false;
			animationTimeout = null;
		}, 520);
	}

	// ─── Keyboard ─────────────────────────────────────────────────────────────

	function onKeyDown(e: KeyboardEvent): void {
		if (e.key === 'ArrowRight') navigate('next');
		if (e.key === 'ArrowLeft')  navigate('prev');
	}

	// ─── Touch / swipe ────────────────────────────────────────────────────────

	function onTouchStart(e: TouchEvent): void {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function onTouchEnd(e: TouchEvent): void {
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
			navigate(dx < 0 ? 'next' : 'prev');
		}
	}

	// ─── Helpers ──────────────────────────────────────────────────────────────

	function colorVar(color: AccentColor): string {
		return STEP_ACCENT_COLOR_MAP[color];
	}

	function getStepIcon(name: string): string {
		return WORK_STEP_ICONS[name] ?? WORK_STEP_ICONS.code;
	}

	const handleSectionReveal = () => (sectionVisible = true);

	onDestroy(() => {
		if (animationTimeout !== null) clearTimeout(animationTimeout);
	});
</script>

<!-- ─── Section ──────────────────────────────────────────────────────────── -->
<section
	class="wp-section"
	class:is-visible={sectionVisible}
	use:scrollReveal={{ threshold: WP_ANIMATION_CONFIG.revealThreshold, onReveal: handleSectionReveal }}
	aria-label="How I Work – process carousel"
	tabindex="-1"
>

	<!-- ── Background crossfade layers ───────────────────────────────────── -->
	{#if prevBgImage}
		{#key prevBgImage}
			<div class="wp-bg wp-bg--out" style="background-image: url({prevBgImage})" aria-hidden="true"></div>
		{/key}
	{/if}
	{#key bgImage}
		<div class="wp-bg wp-bg--in" style="background-image: url({bgImage})" aria-hidden="true"></div>
	{/key}

	<!-- ── Content wrapper ────────────────────────────────────────────────── -->
	<div class="wp-inner">

		<SectionTitle
			title="Process Protocol"
			variant="elaborate"
			label="HOW_I_WORK.exe"
			isVisible={sectionVisible}
		/>

		<!-- ── Carousel shell ────────────────────────────────────────────── -->
		<div
			class="wp-carousel"
			on:touchstart={onTouchStart}
			on:touchend={onTouchEnd}
			aria-roledescription="carousel"
			aria-label="Work process steps"
            role="region"
		>

			<!-- Prev arrow -->
			<button
				class="wp-arrow wp-arrow--prev"
				class:is-disabled={isFirst}
				disabled={isFirst}
				aria-label="Previous step"
				on:click={() => navigate('prev')}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<polyline points="15 18 9 12 15 6"/>
				</svg>
			</button>

			<!-- Slide viewport -->
			<div class="wp-viewport" aria-live="polite" aria-atomic="true">
				{#key slideKey}
					<div
						class="wp-slide"
						class:dir-next={direction === 'next'}
						class:dir-prev={direction === 'prev'}
						style="--accent: {colorVar(step.accentColor)}"
						aria-label="Step {step.index} of {WORK_STEPS.length}: {step.title}"
					>
						<!-- Corner brackets -->
						<span class="wp-slide__corner wp-slide__corner--tl" aria-hidden="true"></span>
						<span class="wp-slide__corner wp-slide__corner--tr" aria-hidden="true"></span>
						<span class="wp-slide__corner wp-slide__corner--bl" aria-hidden="true"></span>
						<span class="wp-slide__corner wp-slide__corner--br" aria-hidden="true"></span>

						<!-- Watermark -->
						<span class="wp-slide__watermark" aria-hidden="true">
							{String(step.index).padStart(2, '0')}
						</span>

						<!-- Process code badge -->
						<span class="wp-slide__badge" aria-hidden="true">{step.processCode}</span>

						<!-- Icon -->
						<div class="wp-slide__icon" aria-hidden="true">
							{@html getStepIcon(step.icon)}
						</div>

						<!-- Title & subtitle -->
						<div class="wp-slide__head">
							<h3 class="wp-slide__title">{step.title}</h3>
							<p class="wp-slide__subtitle">{step.subtitle}</p>
						</div>

						<!-- Description -->
						<p class="wp-slide__desc">{step.description}</p>

						<!-- Tool badges -->
						<ul class="wp-slide__tools" aria-label="Tools">
							{#each step.tools as tool, ti (tool)}
								<li class="wp-slide__tool" style="--ti: {ti}">{tool}</li>
							{/each}
						</ul>

						<!-- Step counter -->
						<div class="wp-slide__counter" aria-hidden="true">
							<span class="wp-slide__counter-cur">{String(step.index).padStart(2, '0')}</span>
							<span class="wp-slide__counter-sep">/</span>
							<span class="wp-slide__counter-tot">{String(WORK_STEPS.length).padStart(2, '0')}</span>
						</div>
					</div>
				{/key}
			</div>

			<!-- Next arrow -->
			<button
				class="wp-arrow wp-arrow--next"
				class:is-disabled={isLast}
				disabled={isLast}
				aria-label="Next step"
				on:click={() => navigate('next')}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<polyline points="9 18 15 12 9 6"/>
				</svg>
			</button>

		</div><!-- /wp-carousel -->

		<!-- ── Dot pagination ─────────────────────────────────────────────── -->
		<nav class="wp-dots" aria-label="Step navigation">
			{#each WORK_STEPS as s, i (s.id)}
				<button
					class="wp-dot"
					class:is-active={i === current}
					style="--dot-accent: {colorVar(s.accentColor)}"
					aria-label="Go to step {i + 1}: {s.title}"
					aria-current={i === current ? 'true' : 'false'}
					on:click={() => goTo(i)}
				>
					<span class="wp-dot__fill"></span>
					<span class="wp-dot__label">{s.title}</span>
				</button>
			{/each}
		</nav>

	</div><!-- /wp-inner -->
</section>

<style>
	/* SECTION */
	.wp-section {
		position: relative;
		width: 100%;
		min-height: 100dvh;
		background: var(--cp-bg, #06060a);
		overflow: hidden;
		display: flex;
		align-items: stretch;
		outline: none;
	}

	/* ─── Background crossfade layers ── */
	.wp-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		pointer-events: none;
	}

	.wp-bg--in {
		animation: bgFadeIn 0.6s ease forwards;
	}

	.wp-bg--out {
		animation: bgFadeOut 0.6s ease forwards;
	}

	@keyframes bgFadeIn {
		from { opacity: 0; }
		to   { opacity: 1; }
	}

	@keyframes bgFadeOut {
		from { opacity: 1; }
		to   { opacity: 0; }
	}

	.wp-inner {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: var(--max-w, 1400px);
		margin: 0 auto;
		padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 3rem);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 3.5rem);
		justify-content: center;
	}

	/* ─── Reveal animation gates ── */
	.wp-carousel,
	.wp-dots {
		opacity: 0;
		transform: translateY(28px);
		transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
	}

	.is-visible .wp-carousel,
	.is-visible .wp-dots {
		opacity: 1;
		transform: translateY(0);
	}

	.is-visible .wp-dots { transition-delay: 0.35s; }

	/* ═══════════════════════════════════════════════════════════════════════
	   CAROUSEL SHELL  —  arrows · viewport · arrows
	══════════════════════════════════════════════════════════════════════ */
	.wp-carousel {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: clamp(0.75rem, 2vw, 2rem);
	}

	/* ─── Viewport ── */
	.wp-viewport {
		position: relative;
		overflow: hidden;
		min-height: clamp(22rem, 40vw, 32rem);
		display: flex;
		align-items: stretch;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   SLIDE
	══════════════════════════════════════════════════════════════════════ */
	.wp-slide {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		gap: clamp(0.75rem, 1.5vw, 1.25rem);
		padding: clamp(1.5rem, 3vw, 3rem) clamp(1.5rem, 3vw, 2.5rem);
		border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--accent) 6%, transparent) 0%,
			rgba(255,255,255,0.02) 100%
		);
		overflow: hidden;
	}

	.wp-slide.dir-next {
		animation: slideEnterNext 0.48s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.wp-slide.dir-prev {
		animation: slideEnterPrev 0.48s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes slideEnterNext {
		from { opacity: 0; transform: translateX(6%) scale(0.98); }
		to   { opacity: 1; transform: translateX(0)  scale(1);    }
	}

	@keyframes slideEnterPrev {
		from { opacity: 0; transform: translateX(-6%) scale(0.98); }
		to   { opacity: 1; transform: translateX(0)   scale(1);    }
	}

	/* ─── Corner brackets ── */
	.wp-slide__corner {
		position: absolute;
		width: 16px;
		height: 16px;
		border-color: var(--accent);
		border-style: solid;
		opacity: 0.55;
		pointer-events: none;
	}

	.wp-slide__corner--tl { top: 0; left: 0;  border-width: 2px 0 0 2px; }
	.wp-slide__corner--tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
	.wp-slide__corner--bl { bottom: 0; left: 0;  border-width: 0 0 2px 2px; }
	.wp-slide__corner--br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

	/* ─── Watermark ── */
	.wp-slide__watermark {
		position: absolute;
		right: -0.05em;
		bottom: -0.15em;
		font-family: var(--font-bionical, var(--font-logo, monospace));
		font-size: clamp(7rem, 18vw, 14rem);
		font-weight: 700;
		line-height: 1;
		color: var(--accent);
		opacity: 0.05;
		letter-spacing: -0.05em;
		user-select: none;
		pointer-events: none;
	}

	/* ─── Process badge ── */
	.wp-slide__badge {
		font-family: var(--font-mono, monospace);
		font-size: 0.58rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
		opacity: 0.55;
		align-self: flex-start;
	}

	/* ─── Icon ── */
	.wp-slide__icon {
		width: clamp(2.5rem, 5vw, 4rem);
		height: clamp(2.5rem, 5vw, 4rem);
		color: var(--accent);
		flex-shrink: 0;
	}

	.wp-slide__icon :global(svg) {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 10px var(--accent));
	}

	/* ─── Head ── */
	.wp-slide__head {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.wp-slide__title {
		font-family: var(--font-bionical, var(--font-logo, monospace));
		font-size: clamp(1.5rem, 4vw, 2.8rem);
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		margin: 0;
		text-shadow: 0 0 28px color-mix(in srgb, var(--accent) 45%, transparent);
		line-height: 1.1;
	}

	.wp-slide__subtitle {
		font-family: var(--font-mono, monospace);
		font-size: clamp(0.6rem, 1.2vw, 0.72rem);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5568);
		margin: 0;
	}

	/* ─── Description ── */
	.wp-slide__desc {
		font-family: var(--font-ui, sans-serif);
		font-size: clamp(0.82rem, 1.5vw, 0.96rem);
		line-height: 1.8;
		color: rgba(226, 232, 240, 0.72);
		margin: 0;
		max-width: 62ch;
		border-left: 2px solid color-mix(in srgb, var(--accent) 35%, transparent);
		padding-left: 1rem;
	}

	/* ─── Tools ── */
	.wp-slide__tools {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.wp-slide__tool {
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent);
		padding: 0.2rem 0.55rem;
		background: color-mix(in srgb, var(--accent) 8%, transparent);
		animation: toolIn 0.3s ease both;
		animation-delay: calc(0.1s + var(--ti, 0) * 0.05s);
	}

	@keyframes toolIn {
		from { opacity: 0; transform: translateY(6px); }
		to   { opacity: 1; transform: translateY(0);   }
	}

	/* ─── Counter ── */
	.wp-slide__counter {
		position: absolute;
		bottom: 1rem;
		right: 1.25rem;
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		font-family: var(--font-mono, monospace);
		pointer-events: none;
	}

	.wp-slide__counter-cur {
		font-size: clamp(1rem, 2.5vw, 1.4rem);
		font-weight: 700;
		color: var(--accent);
		opacity: 0.85;
		letter-spacing: -0.02em;
	}

	.wp-slide__counter-sep,
	.wp-slide__counter-tot {
		font-size: 0.65rem;
		color: var(--cp-muted, #4a5568);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   ARROWS
	══════════════════════════════════════════════════════════════════════ */
	.wp-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(2.5rem, 5vw, 3.5rem);
		height: clamp(2.5rem, 5vw, 3.5rem);
		flex-shrink: 0;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(0,245,255,0.2);
		color: var(--cp-cyan, #00f5ff);
		cursor: pointer;
		position: relative;
		outline: none;
		transition:
			background   0.2s ease,
			border-color 0.2s ease,
			transform    0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow   0.2s ease,
			opacity      0.2s ease;
	}

	.wp-arrow:hover:not(.is-disabled) {
		background: rgba(0,245,255,0.1);
		border-color: rgba(0,245,255,0.6);
		transform: scale(1.08);
		box-shadow: 0 0 18px rgba(0,245,255,0.25);
	}

	.wp-arrow:active:not(.is-disabled) {
		transform: scale(0.95);
	}

	.wp-arrow:focus-visible {
		outline: 2px solid var(--cp-cyan, #00f5ff);
		outline-offset: 3px;
	}

	.wp-arrow.is-disabled {
		opacity: 0.18;
		cursor: not-allowed;
		pointer-events: none;
	}

	.wp-arrow svg {
		width: 55%;
		height: 55%;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   DOTS
	══════════════════════════════════════════════════════════════════════ */
	.wp-dots {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.wp-dot {
		position: relative;
		background: transparent;
		border: none;
		padding: 0.4rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none;
	}

	.wp-dot__fill {
		display: block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255,255,255,0.18);
		border: 1px solid rgba(255,255,255,0.15);
		transition:
			background   0.25s ease,
			border-color 0.25s ease,
			transform    0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow   0.25s ease,
			width        0.3s ease,
			border-radius 0.3s ease;
	}

	.wp-dot.is-active .wp-dot__fill {
		background: var(--dot-accent);
		border-color: var(--dot-accent);
		box-shadow: 0 0 10px var(--dot-accent), 0 0 24px color-mix(in srgb, var(--dot-accent) 30%, transparent);
		transform: scale(1.2);
		width: 24px;
		border-radius: 4px;
	}

	.wp-dot:hover:not(.is-active) .wp-dot__fill {
		background: rgba(255,255,255,0.38);
		transform: scale(1.15);
	}

	.wp-dot:focus-visible { outline: none; }
	.wp-dot:focus-visible .wp-dot__fill {
		box-shadow: 0 0 0 2px var(--dot-accent);
	}

	/* Tooltip label above each dot */
	.wp-dot__label {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%) translateY(4px);
		font-family: var(--font-mono, monospace);
		font-size: 0.58rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--dot-accent);
		background: rgba(6,6,10,0.9);
		border: 1px solid color-mix(in srgb, var(--dot-accent) 40%, transparent);
		padding: 0.2rem 0.5rem;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	.wp-dot:hover .wp-dot__label,
	.wp-dot:focus-visible .wp-dot__label {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   RESPONSIVE
	══════════════════════════════════════════════════════════════════════ */
	@media (max-width: 768px) {
		.wp-carousel { gap: 0.5rem; }

		.wp-viewport { min-height: clamp(26rem, 60vw, 34rem); }
	}

	@media (max-width: 480px) {
		.wp-inner {
			padding-inline: 0.75rem;
			gap: 1.5rem;
		}

		.wp-arrow {
			width: 2.2rem;
			height: 2.2rem;
		}

		.wp-viewport { min-height: clamp(28rem, 78vw, 38rem); }

		.wp-slide { padding: 1.25rem 1rem; }

		.wp-slide__title { font-size: clamp(1.3rem, 6vw, 1.8rem); }

		/* Hide tooltip labels on very small screens – not enough space */
		.wp-dot__label { display: none; }
	}

	/* ─── Reduce motion ── */
	@media (prefers-reduced-motion: reduce) {
		.wp-slide,
		.wp-slide__tool,
		.wp-arrow,
		.wp-dot__fill,
		.wp-carousel,
		.wp-dots,
		.wp-bg {
			animation: none !important;
			transition: none !important;
		}

		.wp-carousel,
		.wp-dots { opacity: 1; transform: none; }
		.wp-slide { opacity: 1; transform: none; }
	}
</style>