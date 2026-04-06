<script lang="ts">
	/**
	 * DeploysHeroSection — "DEPLOY_LOG"
	 *
	 * Full-viewport (min-height: 100dvh) welcome section for the /deploys route.
	 * Introduces the project archive, sets context for what the visitor will see,
	 * and presents three quick stats derived from the live PROJECTS dataset.
	 *
	 * Entrance animations match the hero-section.svelte pattern exactly:
	 *   • .is-mounted class added on the first RAF after mount
	 *   • @keyframes dhEnter (translateY + opacity) with explicit delays per element
	 *   • prefers-reduced-motion: all elements shown immediately, no animation
	 *
	 * Background: DitherBackground (lazy — mounted after first paint)
	 *   Same component as key-services but tuned to a darker, cooler palette
	 *   to feel distinct from the main page.
	 */

	import { onMount } from 'svelte';
	import DitherBackground from '$lib/components/backgrounds/dither-background.svelte';
	import { DEPLOYS_HERO_STATS, DEPLOYS_HERO_TAGS } from '$lib/constants/deploys-hero';

	let mounted          = false;
	let showBackground   = false;

	onMount((): (() => void) => {
		// First RAF — triggers CSS entrance sequence
		const rafId = requestAnimationFrame(() => { mounted = true; });

		// Defer background to idle / short timeout — same pattern as hero-section
		let idleId: number | null = null;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let disposed = false;

		const revealBg = () => { if (!disposed) showBackground = true; };

		if ('requestIdleCallback' in window) {
			idleId = (window as Window).requestIdleCallback(revealBg, { timeout: 500 });
		} else {
			timeoutId = setTimeout(revealBg, 200);
		}

		return () => {
			disposed = true;
			cancelAnimationFrame(rafId);
			if (idleId !== null && 'cancelIdleCallback' in window) {
				(window as Window).cancelIdleCallback(idleId);
			}
			if (timeoutId !== null) clearTimeout(timeoutId);
		};
	});
</script>

<!-- ── Section ──────────────────────────────────────────────────────────── -->
<section
	class="dh"
	class:is-mounted={mounted}
	aria-labelledby="dh-heading"
>
	<!-- Deferred dither background (cool dark-teal, distinct from key-services) -->
	{#if showBackground}
		<DitherBackground
			speed={0.28}
			swirlScale={5}
			ditherPattern="bayer8"
			pixelSize={3}
			spread={0.04}
			colorA="#06060a"
			colorB="#050d10"
		/>
	{/if}

	<!-- CRT scanlines -->
	<div class="dh__scanlines" aria-hidden="true"></div>

	<!-- Centre spotlight — draws focus inward -->
	<div class="dh__spotlight" aria-hidden="true"></div>

	<!-- ── Main content ────────────────────────────────────────────────────── -->
	<div class="dh__inner">

		<!-- Eyebrow label -->
		<div class="dh__label" aria-hidden="true">
			<span class="dh__label-slash">// </span>DEPLOY_LOG
		</div>

		<!-- ── Page heading (h1 — top of content hierarchy for /deploys) ── -->
		<h1 class="dh__heading" id="dh-heading">
			<span class="dh__heading-line dh__heading-line--1">Project</span>
			<span class="dh__heading-line dh__heading-line--2">Archive</span>
		</h1>

		<!-- Gradient rule — matches SectionTitle elaborate variant -->
		<div class="dh__rule" aria-hidden="true"></div>

		<!-- SEO-rich description -->
		<p class="dh__desc">
			A curated log of real-world shipped&nbsp;applications — personal brand sites,
			artist portfolios, full-stack social platforms, AI-powered tools, and live
			client&nbsp;projects. Every entry is deployed, measurable, and&nbsp;battle-tested.
		</p>

		<!-- Stats row -->
		<ul class="dh__stats" aria-label="Project statistics">
			{#each DEPLOYS_HERO_STATS as stat, i (stat.label)}
				<li class="dh__stat" style="--si: {i}">
					<strong class="dh__stat-value">{stat.value}</strong>
					<span  class="dh__stat-label">{stat.label}</span>
				</li>
			{/each}
		</ul>

		<!-- Project-type tags — colours mirror the project accent colours -->
		<ul class="dh__tags" aria-label="Project types covered">
			{#each DEPLOYS_HERO_TAGS as tag, i (tag.label)}
				<li
					class="dh__tag dh__tag--{tag.accent}"
					style="--ti: {i}"
					aria-label="{tag.label} project"
				>
					{tag.label}
				</li>
			{/each}
		</ul>

	</div><!-- /.dh__inner -->

	<!-- Scroll indicator — absolute within section -->
	<div class="dh__scroll" aria-hidden="true">
		<span class="dh__scroll-text">VIEW_PROJECTS</span>
		<div class="dh__scroll-track">
			<div class="dh__scroll-dot"></div>
		</div>
	</div>

</section>


<style>
/* ═══════════════════════════════════════════════════════════════════════════
   SECTION SHELL
   ═══════════════════════════════════════════════════════════════════════════ */

.dh {
	position: relative;
	width: 100%;
	min-height: 100dvh;
	display: flex;
	align-items: center;
	background: var(--cp-bg, #06060a);
	overflow: hidden;
}

/* CRT scanlines — same recipe used across all sections */
.dh__scanlines {
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		to bottom,
		transparent         0px,
		transparent         3px,
		rgba(0, 0, 0, 0.07) 3px,
		rgba(0, 0, 0, 0.07) 4px
	);
	pointer-events: none;
	z-index: 1;
}

/* Radial spotlight — same as CTA section */
.dh__spotlight {
	position: absolute;
	inset: 0;
	background: radial-gradient(
		ellipse 65% 50% at 50% 45%,
		rgba(0, 245, 255, 0.055) 0%,
		transparent 70%
	);
	pointer-events: none;
	z-index: 1;
}

/* ═══════════════════════════════════════════════════════════════════════════
   INNER LAYOUT
   ═══════════════════════════════════════════════════════════════════════════ */

.dh__inner {
	position: relative;
	z-index: 2;
	width: 100%;
	max-width: var(--max-w, 1400px);
	margin: 0 auto;
	padding:
		/* top: nav-height + breathing room */
		calc(var(--nav-h, 5rem) + clamp(3rem, 7vw, 5.5rem))
		clamp(1rem, 4vw, 3rem)
		/* bottom: leave room for scroll indicator */
		clamp(5rem, 10vw, 7rem);
	display: flex;
	flex-direction: column;
	gap: clamp(1.25rem, 3vw, 2rem);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENTRANCE ANIMATIONS
   Same @keyframes + .is-mounted pattern as hero-section.svelte
   ═══════════════════════════════════════════════════════════════════════════ */

.dh__label,
.dh__heading-line,
.dh__rule,
.dh__desc,
.dh__stats,
.dh__tags,
.dh__scroll {
	opacity: 0;
	transform: translateY(24px);
}

.is-mounted .dh__label          { animation: dhEnter 0.6s ease forwards 0.04s; }
.is-mounted .dh__heading-line--1{ animation: dhEnter 0.6s ease forwards 0.12s; }
.is-mounted .dh__heading-line--2{ animation: dhEnter 0.6s ease forwards 0.20s; }
.is-mounted .dh__rule           { animation: dhEnter 0.5s ease forwards 0.28s; }
.is-mounted .dh__desc           { animation: dhEnter 0.55s ease forwards 0.36s; }
.is-mounted .dh__stats          { animation: dhEnter 0.55s ease forwards 0.46s; }
.is-mounted .dh__tags           { animation: dhEnter 0.55s ease forwards 0.56s; }
.is-mounted .dh__scroll         { animation: dhEnter 0.5s ease forwards 0.70s; }

@keyframes dhEnter {
	from { opacity: 0; transform: translateY(24px); }
	to   { opacity: 1; transform: translateY(0);    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   EYEBROW LABEL
   ═══════════════════════════════════════════════════════════════════════════ */

.dh__label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 1.2vw, 0.75rem);
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	display: flex;
	align-items: center;
	gap: 0.3em;
}

.dh__label-slash {
	color: var(--cp-cyan, #00f5ff);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADING
   ═══════════════════════════════════════════════════════════════════════════ */

.dh__heading {
	margin: 0;
	display: flex;
	flex-direction: column;
	line-height: var(--line-heading, 1.12);
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-weight: 400;
	text-transform: uppercase;
}

.dh__heading-line {
	display: block;
	font-size: var(--font-display, clamp(2.5rem, 5vw, 3.5rem));
}

.dh__heading-line--1 {
	font-size: clamp(2.8rem, 8vw, 6rem);
	color: var(--cp-cyan, #00f5ff);
	text-shadow:
		0 0 24px rgba(0, 245, 255, 0.5),
		0 0 60px rgba(0, 245, 255, 0.18);
	animation: dhGlow 4s ease-in-out infinite;
	/* animation-play-state toggled by .is-mounted; glow can start immediately */
}

.dh__heading-line--2 {
	font-size: clamp(2.8rem, 8vw, 6rem);
	color: azure;
	letter-spacing: -0.01em;
}

@keyframes dhGlow {
	0%, 100% { text-shadow: 0 0 24px rgba(0, 245, 255, 0.5),  0 0 60px rgba(0, 245, 255, 0.18); }
	50%       { text-shadow: 0 0 40px rgba(0, 245, 255, 0.75), 0 0 90px rgba(0, 245, 255, 0.28); }
}

/* ── Gradient rule — mirrors SectionTitle elaborate variant ── */
.dh__rule {
	width: clamp(3rem, 8vw, 5rem);
	height: 2px;
	background: linear-gradient(90deg, var(--cp-cyan, #00f5ff), transparent);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DESCRIPTION
   ═══════════════════════════════════════════════════════════════════════════ */

.dh__desc {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: var(--font-body-lg, clamp(1.05rem, 1.5vw, 1.2rem));
	line-height: var(--line-body, 1.65);
	color: rgba(255, 255, 255, 0.55);
	max-width: 58ch;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATS ROW
   ═══════════════════════════════════════════════════════════════════════════ */

.dh__stats {
	display: flex;
	flex-wrap: wrap;
	gap: clamp(1.5rem, 4vw, 3rem);
	padding: 0;
	list-style: none;
}

.dh__stat {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	position: relative;
}

/* Vertical separator between stats */
.dh__stat + .dh__stat::before {
	content: '';
	position: absolute;
	left: calc(-1 * clamp(0.75rem, 2vw, 1.5rem));
	top: 50%;
	transform: translateY(-50%);
	width: 1px;
	height: 2.2rem;
	background: linear-gradient(to bottom, transparent, rgba(0, 245, 255, 0.2), transparent);
}

.dh__stat-value {
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-size: clamp(1.75rem, 4vw, 2.5rem);
	font-weight: 400;
	line-height: 1;
	color: var(--cp-cyan, #00f5ff);
	text-shadow: 0 0 18px rgba(0, 245, 255, 0.4);
	letter-spacing: 0.04em;
}

.dh__stat-label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.58rem, 0.9vw, 0.68rem);
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT-TYPE TAGS
   ═══════════════════════════════════════════════════════════════════════════ */

.dh__tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	padding: 0;
	list-style: none;
}

/* Base tag — chamfered corners, tight padding */
.dh__tag {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 0.9vw, 0.68rem);
	letter-spacing: 0.14em;
	text-transform: uppercase;
	padding: 0.3rem 0.75rem;
	border: 1px solid;
	clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
	opacity: 0.72;
	transition: opacity 0.2s ease;
	/* Stagger entrance delay is handled by parent (.dh__tags animation) */
}

.dh__tag:hover { opacity: 1; }

/* Accent variants — border + text colour per project palette */
.dh__tag--cyan   { color: var(--cp-cyan,   #00f5ff); border-color: rgba(0,   245, 255, 0.3); }
.dh__tag--pink   { color: var(--cp-pink,   #ff0055); border-color: rgba(255,   0,  85, 0.3); }
.dh__tag--purple { color: var(--cp-purple, #b300ff); border-color: rgba(179,   0, 255, 0.3); }
.dh__tag--yellow { color: var(--cp-yellow, #ffe600); border-color: rgba(255, 230,   0, 0.3); }
.dh__tag--green  { color: var(--cp-lime,   #00ff88); border-color: rgba(0,   255, 136, 0.3); }

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL INDICATOR
   ═══════════════════════════════════════════════════════════════════════════ */

.dh__scroll {
	position: absolute;
	bottom: clamp(1.5rem, 3.5vw, 2.25rem);
	left: 50%;
	transform: translateX(-50%);
	z-index: 3;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.dh__scroll-text {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: 0.55rem;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	opacity: 0.55;
}

/* Scrolling-dot track */
.dh__scroll-track {
	width: 1px;
	height: 40px;
	background: rgba(0, 245, 255, 0.12);
	position: relative;
	overflow: hidden;
}

.dh__scroll-dot {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 3px;
	height: 10px;
	background: var(--cp-cyan, #00f5ff);
	box-shadow: 0 0 6px rgba(0, 245, 255, 0.7);
	border-radius: 2px;
	animation: scrollDot 1.8s ease-in-out infinite;
}

@keyframes scrollDot {
	0%   { top: -10px; opacity: 0; }
	20%  { opacity: 1; }
	80%  { opacity: 1; }
	100% { top: 40px;  opacity: 0; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE — narrow viewports
   ═══════════════════════════════════════════════════════════════════════════ */

@media (max-width: 480px) {
	.dh__heading-line--1,
	.dh__heading-line--2 {
		font-size: clamp(2.4rem, 12vw, 3.5rem);
	}

	.dh__stats {
		gap: 1.25rem;
	}
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.dh__label,
	.dh__heading-line,
	.dh__rule,
	.dh__desc,
	.dh__stats,
	.dh__tags,
	.dh__scroll {
		opacity: 1 !important;
		transform: none !important;
		animation: none !important;
	}

	.dh__heading-line--1 { animation: none !important; }
	.dh__scroll-dot      { animation: none !important; opacity: 0.5; top: 15px; }
}
</style>
