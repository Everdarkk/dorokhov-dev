<script lang="ts">
	/**
	 * Testimonials — "CLIENT_SIGNALS"
	 *
	 * Three client review cards with cyberpunk aesthetics:
	 * - Staggered scroll-reveal entrance (CSS, no JS timers)
	 * - Per-card accent colour (cyan / purple / yellow)
	 * - Animated signal-strength bars that fill after each card enters
	 * - Pulsing avatar ring + corner brackets on hover
	 * - Optional animated metric counter (Nazar's SEO stats)
	 * - Reduced-motion aware: all animations skipped, metric shown at final value
	 */

	import { onDestroy } from 'svelte';
	import SectionTitle from './SectionTitle.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';
	import { reducedMotion } from '$lib/stores/motion';
	import {
		TESTIMONIALS,
		SIGNAL_BAR_COUNT,
		SIGNAL_BAR_HEIGHTS,
	} from '$lib/constants/testimonials.constants';

	// ─── State ───────────────────────────────────────────────────────────────

	let sectionVisible = false;

	/** Live counter value shown inside Nazar's metric bubble */
	let metricCount = 0;
	let metricDone = false;
	let metricTimer: ReturnType<typeof setInterval> | null = null;
	let metricStartTimeout: ReturnType<typeof setTimeout> | null = null;

	const METRIC_DURATION_MS = 1800;
	const METRIC_TARGET = TESTIMONIALS.reduce(
		(target, testimonial) => testimonial.metric?.counterTarget ?? target,
		0
	);

	// ─── Helpers ─────────────────────────────────────────────────────────────

	/**
	 * Format an integer for display during counter animation.
	 *   ≥ 1000  → "3.9K"
	 *   < 1000  → "847"
	 */
	function formatLiveCount(n: number): string {
		if (n >= 1000) {
			return (n / 1000).toFixed(1) + 'K';
		}
		return n.toString();
	}

	/**
	 * Ease-out cubic — fast start, smooth brake at the end.
	 */
	function easeOutCubic(t: number): number {
		return 1 - Math.pow(1 - t, 3);
	}

	function startMetricCounter(): void {
		if (metricDone) return;

		// Skip animation entirely for users who prefer reduced motion
		if ($reducedMotion) {
			metricCount = METRIC_TARGET;
			metricDone = true;
			return;
		}

		const target = METRIC_TARGET;
		const startTime = Date.now();

		metricTimer = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / METRIC_DURATION_MS, 1);
			metricCount = Math.round(easeOutCubic(progress) * target);

			if (progress >= 1) {
				metricCount = target;
				metricDone = true;
				if (metricTimer !== null) {
					clearInterval(metricTimer);
					metricTimer = null;
				}
			}
		}, 16);
	}

	// ─── Reveal handler ──────────────────────────────────────────────────────

	function handleReveal(): void {
		sectionVisible = true;
		// Give cards time to finish entering before the counter fires
		const delay = $reducedMotion ? 0 : 1200;
		metricStartTimeout = setTimeout(startMetricCounter, delay);
	}

	// ─── Cleanup ─────────────────────────────────────────────────────────────

	onDestroy(() => {
		if (metricStartTimeout !== null) clearTimeout(metricStartTimeout);
		if (metricTimer !== null) clearInterval(metricTimer);
	});

	/** Pre-build the bar index array once, not inside the template loop */
	const BARS = Array.from({ length: SIGNAL_BAR_COUNT }, (_, i) => i);
</script>

<!-- ─── Section ───────────────────────────────────────────────────────────── -->
<section
	class="tm-section"
	aria-label="Client testimonials"
	use:scrollReveal={{ threshold: 0.08 }}
	on:reveal={handleReveal}
>
	<!-- Scanlines overlay -->
	<div class="tm-scanlines" aria-hidden="true"></div>

	<div class="tm-inner">
		<!-- Section header -->
		<SectionTitle
			title="Testimonials"
			variant="elaborate"
			label="CLIENT_SIGNALS"
			isVisible={sectionVisible}
		/>

		<!-- Cards grid -->
		<div
			class="tm-grid"
			class:tm-grid--visible={sectionVisible}
			role="list"
		>
			{#each TESTIMONIALS as testimonial, i (testimonial.id)}
				<article
					class="tm-card tm-card--{testimonial.accent}"
					style="--card-index: {i}"
					role="listitem"
					aria-label="Testimonial from {testimonial.name}, {testimonial.role}"
				>
					<!-- Ambient glow layer -->
					<div class="tm-card__glow" aria-hidden="true"></div>
					<!-- Border pulse layer -->
					<div class="tm-card__border-glow" aria-hidden="true"></div>

					<!-- ── Header: signal label + bars ── -->
					<div class="tm-card__header">
						<span class="tm-card__signal-label" aria-hidden="true">
							// SIG_{testimonial.accent.toUpperCase()}
						</span>
						<div class="tm-card__bars" aria-hidden="true" title="Signal strength">
							{#each BARS as b (b)}
								<div
									class="tm-card__bar"
									style="--bar-index: {b}; height: {SIGNAL_BAR_HEIGHTS[b]}px"
								></div>
							{/each}
						</div>
					</div>

					<!-- ── Identity: avatar + name/role ── -->
					<div class="tm-card__identity">
						<div class="tm-card__avatar" aria-hidden="true">
							<span class="tm-card__initials">{testimonial.initials}</span>
							<div class="tm-card__avatar-ring"></div>
						</div>
						<div class="tm-card__info">
							<strong class="tm-card__name">{testimonial.name}</strong>
							<span class="tm-card__role">{testimonial.role}</span>
							<span class="tm-card__company">{testimonial.company}</span>
						</div>
					</div>

					<!-- ── Divider ── -->
					<div class="tm-card__divider" aria-hidden="true"></div>

					<!-- ── Review body ── -->
					<div class="tm-card__quote-wrap">
						<span class="tm-card__quote-mark" aria-hidden="true">"</span>
						<p class="tm-card__review">{testimonial.review}</p>
					</div>

					<!-- ── Optional metric block ── -->
					{#if testimonial.metric}
						<div class="tm-card__metric" aria-label="Performance metric">
							<div class="tm-card__metric-cell tm-card__metric-cell--before">
								<span class="tm-card__metric-value">{testimonial.metric.before}</span>
								<span class="tm-card__metric-label">{testimonial.metric.beforeLabel}</span>
							</div>

							<div class="tm-card__metric-arrow" aria-hidden="true">
								<svg viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M0 4h20M16 1l4 3-4 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>

							<div class="tm-card__metric-cell tm-card__metric-cell--after">
								<span class="tm-card__metric-value tm-card__metric-value--live">
									{metricDone ? testimonial.metric.after : formatLiveCount(metricCount)}
								</span>
								<span class="tm-card__metric-label">{testimonial.metric.afterLabel}</span>
							</div>
						</div>
					{/if}

					<!-- ── Footer ── -->
					<div class="tm-card__footer">
						<span class="tm-card__verified" aria-label="Verified client">
							<span class="tm-card__verified-dot" aria-hidden="true"></span>
							CLIENT_VERIFIED
						</span>
						<span class="tm-card__year">{testimonial.year}</span>
					</div>

					<!-- Corner brackets (decorative) -->
					<div class="tm-card__corner tm-card__corner--tl" aria-hidden="true"></div>
					<div class="tm-card__corner tm-card__corner--tr" aria-hidden="true"></div>
					<div class="tm-card__corner tm-card__corner--bl" aria-hidden="true"></div>
					<div class="tm-card__corner tm-card__corner--br" aria-hidden="true"></div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	/* ═══════════════════════════════════════════════════════════════════════════
	   SECTION
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-section {
		position: relative;
		width: 100%;
		background: var(--cp-bg);
		overflow: hidden;
	}

	/* CRT scanlines — same pattern used across all sections */
	.tm-scanlines {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.07) 3px,
			rgba(0, 0, 0, 0.07) 4px
		);
		pointer-events: none;
		z-index: 1;
	}

	.tm-inner {
		position: relative;
		z-index: 2;
		max-width: var(--max-w, 1400px);
		margin: 0 auto;
		padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 3rem);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 4rem);
	}

	/* ═══════════════════════════════════════════════════════════════════════════
	   GRID
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(1.25rem, 3vw, 2rem);
	}

	@media (min-width: 900px) {
		.tm-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* ═══════════════════════════════════════════════════════════════════════════
	   CARD — BASE
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: clamp(1.25rem, 3vw, 1.75rem);
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.06);
		overflow: hidden;
		cursor: default;

		/* Entrance: start hidden, animation triggered by parent class */
		opacity: 0;
		transform: translateY(36px);
		will-change: transform, opacity;

		transition:
			transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	/* Card hover lift — only after the entrance animation has settled */
	.tm-grid--visible .tm-card:hover {
		transform: translateY(-4px);
	}

	/* ── Entrance stagger ── */
	.tm-grid--visible .tm-card {
		animation: tmCardEnter 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: calc(var(--card-index, 0) * 0.14s);
	}

	@keyframes tmCardEnter {
		from {
			opacity: 0;
			transform: translateY(36px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── Accent colour variants — border + glow ── */

	.tm-card--cyan {
		border-color: rgba(0, 245, 255, 0.14);
	}
	.tm-card--cyan:hover {
		border-color: rgba(0, 245, 255, 0.38);
		box-shadow:
			0 0 32px rgba(0, 245, 255, 0.12),
			inset 0 0 20px rgba(0, 245, 255, 0.04);
	}

	.tm-card--purple {
		border-color: rgba(179, 0, 255, 0.14);
	}
	.tm-card--purple:hover {
		border-color: rgba(179, 0, 255, 0.38);
		box-shadow:
			0 0 32px rgba(179, 0, 255, 0.12),
			inset 0 0 20px rgba(179, 0, 255, 0.04);
	}

	.tm-card--yellow {
		border-color: rgba(255, 230, 0, 0.14);
	}
	.tm-card--yellow:hover {
		border-color: rgba(255, 230, 0, 0.38);
		box-shadow:
			0 0 32px rgba(255, 230, 0, 0.10),
			inset 0 0 20px rgba(255, 230, 0, 0.04);
	}

	/* ── Ambient glow (bottom-centre radial) ── */

	.tm-card__glow {
		position: absolute;
		bottom: -40%;
		left: 50%;
		width: 80%;
		height: 60%;
		transform: translateX(-50%);
		border-radius: 50%;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.4s ease;
		will-change: opacity;
	}

	.tm-card:hover .tm-card__glow {
		opacity: 1;
	}

	.tm-card--cyan .tm-card__glow {
		background: radial-gradient(ellipse at center, rgba(0, 245, 255, 0.15) 0%, transparent 70%);
	}
	.tm-card--purple .tm-card__glow {
		background: radial-gradient(ellipse at center, rgba(179, 0, 255, 0.15) 0%, transparent 70%);
	}
	.tm-card--yellow .tm-card__glow {
		background: radial-gradient(ellipse at center, rgba(255, 230, 0, 0.12) 0%, transparent 70%);
	}

	/* ── Border glow (pulsing inset shadow on hover) ── */

	.tm-card__border-glow {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
	}

	.tm-card:hover .tm-card__border-glow {
		animation: borderPulse 2.2s ease-in-out infinite;
	}

	.tm-card--cyan .tm-card__border-glow {
		box-shadow: inset 0 0 24px rgba(0, 245, 255, 0.18);
	}
	.tm-card--purple .tm-card__border-glow {
		box-shadow: inset 0 0 24px rgba(179, 0, 255, 0.18);
	}
	.tm-card--yellow .tm-card__border-glow {
		box-shadow: inset 0 0 24px rgba(255, 230, 0, 0.15);
	}

	@keyframes borderPulse {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.5; }
	}

	/* ═══════════════════════════════════════════════════════════════════════════
	   CARD HEADER — signal label + bars
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-card__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 2;
	}

	.tm-card__signal-label {
		font-family: var(--font-ui, 'Courier Prime', monospace);
		font-size: 0.6rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		opacity: 0.45;
	}

	.tm-card--cyan  .tm-card__signal-label { color: var(--cp-cyan); }
	.tm-card--purple .tm-card__signal-label { color: var(--cp-purple); }
	.tm-card--yellow .tm-card__signal-label { color: var(--cp-yellow); }

	/* ── Signal bars ── */

	.tm-card__bars {
		display: flex;
		align-items: flex-end;
		gap: 3px;
	}

	.tm-card__bar {
		width: 4px;
		border-radius: 2px;
		/* Start invisible; animation triggered when grid gets --visible */
		opacity: 0;
		transform: scaleY(0);
		transform-origin: bottom;
		will-change: transform, opacity;
	}

	/* Bars fill sequentially: card stagger + per-bar stagger + 0.4s card-enter offset */
	.tm-grid--visible .tm-card__bar {
		animation: barFill 0.35s ease forwards;
		animation-delay: calc(
			var(--card-index, 0) * 0.14s +
			var(--bar-index, 0) * 0.055s +
			0.45s
		);
	}

	@keyframes barFill {
		from { opacity: 0; transform: scaleY(0); }
		to   { opacity: 1; transform: scaleY(1); }
	}

	.tm-card--cyan   .tm-card__bar { background: var(--cp-cyan); }
	.tm-card--purple .tm-card__bar { background: var(--cp-purple); }
	.tm-card--yellow .tm-card__bar { background: var(--cp-yellow); }

	/* ═══════════════════════════════════════════════════════════════════════════
	   IDENTITY — avatar + name / role / company
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-card__identity {
		display: flex;
		align-items: center;
		gap: 1rem;
		position: relative;
		z-index: 2;
	}

	/* ── Avatar circle ── */

	.tm-card__avatar {
		position: relative;
		flex-shrink: 0;
		width: 52px;
		height: 52px;
	}

	.tm-card__initials {
		position: absolute;
		inset: 4px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-bionical, 'Courier Prime', monospace);
		font-size: 0.85rem;
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background: rgba(255, 255, 255, 0.04);
		transition: background 0.3s ease;
	}

	.tm-card:hover .tm-card__initials {
		background: rgba(255, 255, 255, 0.07);
	}

	.tm-card--cyan   .tm-card__initials { color: var(--cp-cyan); }
	.tm-card--purple .tm-card__initials { color: var(--cp-purple); }
	.tm-card--yellow .tm-card__initials { color: var(--cp-yellow); }

	/* Ring around avatar — pulses on hover */
	.tm-card__avatar-ring {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1.5px solid currentColor;
		opacity: 0.3;
		transition: opacity 0.3s ease;
	}

	.tm-card:hover .tm-card__avatar-ring {
		opacity: 0.9;
		animation: ringPulse 1.8s ease-in-out infinite;
	}

	@keyframes ringPulse {
		0%, 100% { opacity: 0.9; transform: scale(1); }
		50%       { opacity: 0.5; transform: scale(1.08); }
	}

	.tm-card--cyan   .tm-card__avatar-ring { color: var(--cp-cyan); }
	.tm-card--purple .tm-card__avatar-ring { color: var(--cp-purple); }
	.tm-card--yellow .tm-card__avatar-ring { color: var(--cp-yellow); }

	/* ── Name / role / company ── */

	.tm-card__info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.tm-card__name {
		font-family: var(--font-bionical, 'Courier Prime', monospace);
		font-size: var(--font-body, 1rem);
		font-weight: 400;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.tm-card--cyan   .tm-card__name { color: var(--cp-cyan); }
	.tm-card--purple .tm-card__name { color: var(--cp-purple); }
	.tm-card--yellow .tm-card__name { color: var(--cp-yellow); }

	.tm-card__role,
	.tm-card__company {
		font-family: var(--font-ui, 'Courier Prime', monospace);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5a6a);
		line-height: 1.4;
	}

	.tm-card__company {
		opacity: 0.7;
	}

	/* ═══════════════════════════════════════════════════════════════════════════
	   DIVIDER
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-card__divider {
		height: 1px;
		background: linear-gradient(90deg, currentColor, transparent);
		opacity: 0.1;
		position: relative;
		z-index: 2;
		transition: opacity 0.3s ease;
	}

	.tm-card:hover .tm-card__divider {
		opacity: 0.22;
	}

	.tm-card--cyan   .tm-card__divider { color: var(--cp-cyan); }
	.tm-card--purple .tm-card__divider { color: var(--cp-purple); }
	.tm-card--yellow .tm-card__divider { color: var(--cp-yellow); }

	/* ═══════════════════════════════════════════════════════════════════════════
	   REVIEW QUOTE
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-card__quote-wrap {
		position: relative;
		z-index: 2;
		padding-left: 1.25rem;
		flex: 1;
	}

	/* Decorative large quotation mark — floats subtly on hover */
	.tm-card__quote-mark {
		position: absolute;
		top: -0.5rem;
		left: -0.25rem;
		font-size: 3.5rem;
		line-height: 1;
		opacity: 0.12;
		font-family: Georgia, serif;
		pointer-events: none;
		transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		will-change: transform;
	}

	.tm-card:hover .tm-card__quote-mark {
		opacity: 0.22;
		transform: translateY(-3px) rotate(-3deg);
	}

	.tm-card--cyan   .tm-card__quote-mark { color: var(--cp-cyan); }
	.tm-card--purple .tm-card__quote-mark { color: var(--cp-purple); }
	.tm-card--yellow .tm-card__quote-mark { color: var(--cp-yellow); }

	.tm-card__review {
		font-family: var(--font-ui, 'Courier Prime', monospace);
		font-size: var(--font-body-sm, 0.875rem);
		line-height: var(--line-body, 1.65);
		color: rgba(255, 255, 255, 0.75);
		transition: color 0.3s ease;
	}

	.tm-card:hover .tm-card__review {
		color: rgba(255, 255, 255, 0.9);
	}

	/* ═══════════════════════════════════════════════════════════════════════════
	   METRIC BLOCK (Nazar's SEO stats)
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-card__metric {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		position: relative;
		z-index: 2;
		padding: 0.875rem;
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 230, 0, 0.1);
	}

	.tm-card--yellow .tm-card__metric {
		border-color: rgba(255, 230, 0, 0.12);
	}

	.tm-card__metric-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		flex: 1;
	}

	.tm-card__metric-value {
		font-family: var(--font-bionical, 'Courier Prime', monospace);
		font-size: clamp(1.1rem, 2.5vw, 1.4rem);
		font-weight: 400;
		letter-spacing: 0.06em;
		line-height: 1;
		color: rgba(255, 255, 255, 0.45);
	}

	/* The live "after" value gets the accent colour */
	.tm-card__metric-value--live {
		color: var(--cp-yellow);
		text-shadow: 0 0 16px rgba(255, 230, 0, 0.5);
		/* Subtle number-change flash */
		transition: color 0.1s ease;
	}

	.tm-card__metric-label {
		font-family: var(--font-ui, 'Courier Prime', monospace);
		font-size: 0.6rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5a6a);
		text-align: center;
	}

	.tm-card__metric-arrow {
		display: flex;
		align-items: center;
		color: var(--cp-yellow);
		opacity: 0.55;
		flex-shrink: 0;
	}

	.tm-card__metric-arrow svg {
		width: 28px;
		height: 10px;
	}

	/* ═══════════════════════════════════════════════════════════════════════════
	   FOOTER
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-card__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 2;
		margin-top: auto;
	}

	.tm-card__verified {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-ui, 'Courier Prime', monospace);
		font-size: 0.58rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5a6a);
	}

	/* Blinking verified dot */
	.tm-card__verified-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		animation: dotBlink 2.4s ease-in-out infinite;
	}

	.tm-card--cyan   .tm-card__verified-dot { background: var(--cp-cyan); }
	.tm-card--purple .tm-card__verified-dot { background: var(--cp-purple); }
	.tm-card--yellow .tm-card__verified-dot { background: var(--cp-yellow); }

	@keyframes dotBlink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.2; }
	}

	.tm-card__year {
		font-family: var(--font-ui, 'Courier Prime', monospace);
		font-size: 0.58rem;
		letter-spacing: 0.18em;
		color: var(--cp-muted, #4a5a6a);
		opacity: 0.6;
	}

	/* ═══════════════════════════════════════════════════════════════════════════
	   CORNER BRACKETS
	   ═══════════════════════════════════════════════════════════════════════════ */

	.tm-card__corner {
		position: absolute;
		width: 14px;
		height: 14px;
		pointer-events: none;
		opacity: 0.35;
		transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
	}

	.tm-card:hover .tm-card__corner {
		opacity: 0.9;
		width: 18px;
		height: 18px;
	}

	.tm-card__corner--tl { top: 0; left: 0; border-top: 1.5px solid currentColor; border-left: 1.5px solid currentColor; }
	.tm-card__corner--tr { top: 0; right: 0; border-top: 1.5px solid currentColor; border-right: 1.5px solid currentColor; }
	.tm-card__corner--bl { bottom: 0; left: 0; border-bottom: 1.5px solid currentColor; border-left: 1.5px solid currentColor; }
	.tm-card__corner--br { bottom: 0; right: 0; border-bottom: 1.5px solid currentColor; border-right: 1.5px solid currentColor; }

	.tm-card--cyan   .tm-card__corner { color: var(--cp-cyan); }
	.tm-card--purple .tm-card__corner { color: var(--cp-purple); }
	.tm-card--yellow .tm-card__corner { color: var(--cp-yellow); }

	/* ═══════════════════════════════════════════════════════════════════════════
	   REDUCED MOTION
	   ═══════════════════════════════════════════════════════════════════════════ */

	@media (prefers-reduced-motion: reduce) {
		.tm-card,
		.tm-card__bar,
		.tm-card__avatar-ring,
		.tm-card__border-glow,
		.tm-card__quote-mark,
		.tm-card__verified-dot {
			animation: none !important;
			transition: none !important;
		}

		/* Immediately show everything and disable hover movement */
		.tm-card,
		.tm-grid--visible .tm-card:hover {
			opacity: 1;
			transform: none !important;
		}

		.tm-card__bar {
			opacity: 1;
			transform: scaleY(1);
		}
	}
</style>
