<script lang="ts">
	/**
	 * CaseStudy Component
	 *
	 * Featured deep-dive into the Terno-Top project integrated into
	 * the ValueProposition section. Includes an interactive before/after
	 * image comparison slider and animated metric counters.
	 *
	 * Visibility is controlled by the parent's scrollReveal action so
	 * animations are perfectly timed with the VP card stagger.
	 */

	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { reducedMotion } from '$lib/stores';
	import { easeOutCubic } from '$lib/utils';
	import { TERNO_TOP_DATA } from '$lib/constants/case-study';
	import type { CaseStudyMetric } from '$lib/types';
	import ttOld from '$lib/assets/images/tt-old.webp';
	import ttNew from '$lib/assets/images/tt-new.webp';

	/** Mirrors the parent's `sectionVisible` flag from scrollReveal */
	export let isVisible: boolean = false;

	// ─── Before / After Slider ────────────────────────────────────────────────

	let sliderPos = 50;
	let isDragging = false;
	let compareEl: HTMLElement;

	function onPointerDown(e: MouseEvent | TouchEvent) {
		isDragging = true;
		e.preventDefault();
	}

	function moveSlider(clientX: number) {
		if (!isDragging || !compareEl) return;
		const { left, width } = compareEl.getBoundingClientRect();
		sliderPos = Math.min(Math.max(((clientX - left) / width) * 100, 3), 97);
	}

	// ─── Metric Counter ───────────────────────────────────────────────────────

	const METRICS: CaseStudyMetric[] = TERNO_TOP_DATA.metrics;
	const TECH: string[] = TERNO_TOP_DATA.tech;
	const META: [string, string][] = TERNO_TOP_DATA.meta;

	let displayValues: number[] = METRICS.map(() => 0);
	let metricsStarted = false;

	function runCounters() {
		if (metricsStarted) return;
		metricsStarted = true;

		if (get(reducedMotion)) {
			displayValues = METRICS.map((m) => m.endValue);
			return;
		}

		const DURATION = 1800;
		const t0 = performance.now();

		(function tick(now: number) {
			const progress = Math.min((now - t0) / DURATION, 1);
			const eased = easeOutCubic(progress);
			displayValues = METRICS.map((m) => Math.round(m.endValue * eased));
			if (progress < 1) requestAnimationFrame(tick);
		})(t0);
	}

	$: if (isVisible && !metricsStarted) {
		setTimeout(runCounters, get(reducedMotion) ? 0 : 500);
	}

	// ─── Lifecycle ────────────────────────────────────────────────────────────

	onMount(() => {
		const mm = (e: MouseEvent) => moveSlider(e.clientX);
		const tm = (e: TouchEvent) => moveSlider(e.touches[0].clientX);
		const up = () => {
			isDragging = false;
		};

		window.addEventListener('mousemove', mm);
		window.addEventListener('mouseup', up);
		window.addEventListener('touchmove', tm, { passive: false });
		window.addEventListener('touchend', up);

		return () => {
			window.removeEventListener('mousemove', mm);
			window.removeEventListener('mouseup', up);
			window.removeEventListener('touchmove', tm);
			window.removeEventListener('touchend', up);
		};
	});

</script>

<!-- ── Bridge: visual connector from VP cards to case study ───────────────── -->
<div class="cs-bridge" class:cs-bridge--visible={isVisible} aria-hidden="true">
	<span class="cs-bridge__line"></span>
	<span class="cs-bridge__label">FEATURED_PROJECT.case</span>
	<span class="cs-bridge__line"></span>
</div>

<!-- ── Case Study Card ─────────────────────────────────────────────────────── -->
<article class="cs-card" class:cs-card--visible={isVisible}>
	<!-- Ambient glow -->
	<div class="cs-glow" aria-hidden="true"></div>

	<!-- Corner brackets (cyberpunk aesthetic) -->
	<div class="cs-corner cs-corner--tl" aria-hidden="true"></div>
	<div class="cs-corner cs-corner--tr" aria-hidden="true"></div>
	<div class="cs-corner cs-corner--bl" aria-hidden="true"></div>
	<div class="cs-corner cs-corner--br" aria-hidden="true"></div>

	<!-- ── Header ── -->
	<header class="cs-header">
		<div class="cs-header__top">
			<span class="cs-label">CASE_STUDY.log</span>
			<span class="cs-status" aria-label="Project status: Live">
				<span class="cs-status__dot"></span>
				LIVE
			</span>
		</div>

		<div class="cs-header__main">
			<div class="cs-header__title-block">
				<h3 class="cs-name">Terno-Top</h3>
				<p class="cs-subtitle">Orthopedic Center — Full Web Transformation</p>
			</div>

			<div class="cs-tech" aria-label="Technologies used">
				{#each TECH as tag (tag)}
					<span class="cs-tech__tag">{tag}</span>
				{/each}
			</div>
		</div>
	</header>

	<!-- ── Body: metrics + image comparison ── -->
	<div class="cs-body">

		<!-- Left column: animated metrics -->
		<div class="cs-metrics" role="list" aria-label="Project performance metrics">
			{#each METRICS as m, i (m.id)}
				<div
					class="cs-metric"
					class:cs-metric--visible={isVisible}
					style="--mi: {i};"
					role="listitem"
				>
					<span class="cs-metric__value" style="color: {m.color};">
						{isVisible ? m.format(displayValues[i]) : '—'}
					</span>
					<span class="cs-metric__label">{m.label}</span>
					<span class="cs-metric__sub">{m.sublabel}</span>
					<div class="cs-metric__before-row">
						<span class="cs-metric__before-tag">BEFORE</span>
						<span class="cs-metric__before-val">{m.before}</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Right column: before/after interactive comparison -->
		<div class="cs-compare-wrap">
			<div
				class="cs-compare"
				bind:this={compareEl}
				role="group"
				aria-label="Interactive before and after website comparison — drag to reveal"
			>
				<!-- Before (old) image — base layer -->
				<img
					src={ttOld}
					alt="Terno-Top website before redesign"
					class="cs-compare__img"
					draggable="false"
					loading="lazy"
				/>

				<!-- After (new) image — clipped by slider position -->
				<img
					src={ttNew}
					alt="Terno-Top website after redesign"
					class="cs-compare__img cs-compare__img--new"
					style="clip-path: inset(0 {100 - sliderPos}% 0 0);"
					draggable="false"
					loading="lazy"
				/>

				<!-- Corner labels -->
				<span class="cs-compare__lbl cs-compare__lbl--before" aria-hidden="true">BEFORE</span>
				<span class="cs-compare__lbl cs-compare__lbl--after" aria-hidden="true">AFTER</span>

				<!-- Draggable handle -->
				<!-- svelte-ignore a11y-interactive-supports-focus -->
				<div
					class="cs-compare__handle"
					style="left: {sliderPos}%;"
					on:mousedown={onPointerDown}
					on:touchstart={onPointerDown}
					role="slider"
					tabindex="0"
					aria-label="Drag to compare before and after"
					aria-valuenow={Math.round(sliderPos)}
					aria-valuemin={3}
					aria-valuemax={97}
					on:keydown={(e) => {
						if (e.key === 'ArrowLeft') sliderPos = Math.max(sliderPos - 5, 3);
						else if (e.key === 'ArrowRight') sliderPos = Math.min(sliderPos + 5, 97);
					}}
				>
					<div class="cs-compare__line" aria-hidden="true"></div>
					<div class="cs-compare__knob" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
							<path
								d="M8 5L4 12L8 19M16 5L20 12L16 19"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>

			<p class="cs-compare__hint" aria-hidden="true">← drag to compare →</p>
		</div>
	</div>

	<!-- ── Footer ── -->
	<footer class="cs-footer">
		<div class="cs-project-meta">
			{#each META as [k, v] (k)}
				<div class="cs-meta-item">
					<span class="cs-meta__key">{k}</span>
					<span class="cs-meta__val">{v}</span>
				</div>
			{/each}
		</div>

		<a
			href="https://terno-top.vercel.app"
			target="_blank"
			rel="noopener noreferrer"
			class="cs-cta"
		>
			View Live Project
			<svg viewBox="0 0 20 20" fill="none" width="13" height="13" aria-hidden="true">
				<path
					d="M5 15L15 5M15 5H8M15 5V12"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	</footer>
</article>

<style>
	/* ── Bridge ─────────────────────────────────────────────────────────────── */

	.cs-bridge {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		opacity: 0;
		transform: scaleX(0.85);
		transition:
			opacity 0.5s ease 0.25s,
			transform 0.5s ease 0.25s;
		will-change: opacity, transform;
	}

	.cs-bridge--visible {
		opacity: 1;
		transform: scaleX(1);
	}

	.cs-bridge__line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.25), transparent);
	}

	.cs-bridge__label {
		font-family: var(--font-ui);
		font-size: var(--font-caption);
		letter-spacing: 0.2em;
		color: rgba(0, 255, 136, 0.5);
		white-space: nowrap;
		text-transform: uppercase;
	}

	/* ── Card ────────────────────────────────────────────────────────────────── */

	.cs-card {
		position: relative;
		width: 100%;
		border: 1px solid rgba(0, 255, 136, 0.14);
		padding: clamp(1.5rem, 3vw, 2.5rem);
		display: flex;
		flex-direction: column;
		gap: clamp(1.5rem, 3vw, 2rem);
		overflow: hidden;
		opacity: 0;
		transform: translateY(36px);
		will-change: transform, opacity;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.cs-card--visible {
		animation: csCardEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: 0.2s;
	}

	@keyframes csCardEnter {
		from {
			transform: translateY(36px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.cs-card:hover {
		border-color: rgba(0, 255, 136, 0.32);
		box-shadow:
			0 0 40px rgba(0, 255, 136, 0.07),
			inset 0 0 28px rgba(0, 255, 136, 0.03);
	}

	/* ── Ambient glow ────────────────────────────────────────────────────────── */

	.cs-glow {
		position: absolute;
		top: -30%;
		left: 50%;
		transform: translateX(-50%);
		width: 70%;
		height: 60%;
		border-radius: 50%;
		background: radial-gradient(ellipse at center, rgba(0, 255, 136, 0.05) 0%, transparent 70%);
		pointer-events: none;
		z-index: 0;
	}

	/* ── Corner brackets ─────────────────────────────────────────────────────── */

	.cs-corner {
		position: absolute;
		width: 14px;
		height: 14px;
		pointer-events: none;
		color: var(--cp-lime, #00ff88);
		opacity: 0.35;
		transition:
			opacity 0.3s ease,
			width 0.3s ease,
			height 0.3s ease;
		z-index: 1;
	}

	.cs-card:hover .cs-corner {
		opacity: 0.85;
		width: 20px;
		height: 20px;
	}

	.cs-corner--tl {
		top: 0;
		left: 0;
		border-top: 1.5px solid currentColor;
		border-left: 1.5px solid currentColor;
	}
	.cs-corner--tr {
		top: 0;
		right: 0;
		border-top: 1.5px solid currentColor;
		border-right: 1.5px solid currentColor;
	}
	.cs-corner--bl {
		bottom: 0;
		left: 0;
		border-bottom: 1.5px solid currentColor;
		border-left: 1.5px solid currentColor;
	}
	.cs-corner--br {
		bottom: 0;
		right: 0;
		border-bottom: 1.5px solid currentColor;
		border-right: 1.5px solid currentColor;
	}

	/* ── Header ──────────────────────────────────────────────────────────────── */

	.cs-header {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.cs-header__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.cs-label {
		font-family: var(--font-ui);
		font-size: var(--font-caption);
		letter-spacing: 0.2em;
		color: var(--cp-lime, #00ff88);
		text-transform: uppercase;
		opacity: 0.7;
	}

	.cs-status {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-ui);
		font-size: var(--font-caption);
		letter-spacing: 0.14em;
		color: var(--cp-lime, #00ff88);
	}

	.cs-status__dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--cp-lime, #00ff88);
		box-shadow: 0 0 6px var(--cp-lime, #00ff88);
		animation: dotBlink 2s ease-in-out infinite;
	}

	@keyframes dotBlink {
		0%,
		100% {
			opacity: 1;
			box-shadow: 0 0 6px var(--cp-lime, #00ff88);
		}
		50% {
			opacity: 0.45;
			box-shadow: 0 0 14px var(--cp-lime, #00ff88);
		}
	}

	.cs-header__main {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.cs-header__title-block {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.cs-name {
		font-family: var(--font-bionical);
		font-size: var(--font-h3);
		font-weight: 400;
		text-transform: uppercase;
		color: var(--cp-lime, #00ff88);
		text-shadow: 0 0 24px rgba(0, 255, 136, 0.35);
		line-height: var(--line-tight);
	}

	.cs-subtitle {
		font-family: var(--font-ui);
		font-size: var(--font-body-sm);
		color: rgba(255, 255, 255, 0.45);
		letter-spacing: 0.04em;
	}

	.cs-tech {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: flex-start;
	}

	.cs-tech__tag {
		font-family: var(--font-ui);
		font-size: clamp(0.58rem, 0.75vw, 0.68rem);
		letter-spacing: 0.1em;
		padding: 0.2em 0.6em;
		border: 1px solid rgba(0, 255, 136, 0.2);
		color: rgba(0, 255, 136, 0.65);
		background: rgba(0, 255, 136, 0.03);
		white-space: nowrap;
		transition:
			border-color 0.25s ease,
			color 0.25s ease,
			background 0.25s ease;
	}

	.cs-tech__tag:hover {
		border-color: rgba(0, 255, 136, 0.45);
		color: var(--cp-lime, #00ff88);
		background: rgba(0, 255, 136, 0.07);
	}

	/* ── Body ────────────────────────────────────────────────────────────────── */

	.cs-body {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: clamp(1.5rem, 3vw, 2.5rem);
		align-items: start;
	}

	/* ── Metrics ─────────────────────────────────────────────────────────────── */

	.cs-metrics {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(0.6rem, 1.2vw, 0.875rem);
	}

	.cs-metric {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: clamp(0.75rem, 1.5vw, 1rem);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.02);
		opacity: 0;
		transform: translateY(16px);
		will-change: transform, opacity;
		transition: border-color 0.3s ease;
	}

	.cs-metric:hover {
		border-color: rgba(255, 255, 255, 0.12);
	}

	.cs-metric--visible {
		animation: metricEnter 0.45s ease forwards;
		animation-delay: calc(0.45s + var(--mi, 0) * 0.08s);
	}

	@keyframes metricEnter {
		from {
			transform: translateY(16px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.cs-metric__value {
		font-family: var(--font-bionical);
		font-size: var(--font-h4);
		font-weight: 400;
		line-height: 1;
		text-shadow: 0 0 14px currentColor;
	}

	.cs-metric__label {
		font-family: var(--font-ui);
		font-size: var(--font-body-sm);
		color: rgba(255, 255, 255, 0.72);
		letter-spacing: 0.04em;
		margin-top: 0.15rem;
	}

	.cs-metric__sub {
		font-family: var(--font-ui);
		font-size: clamp(0.6rem, 0.7vw, 0.68rem);
		color: rgba(255, 255, 255, 0.28);
		letter-spacing: 0.08em;
	}

	.cs-metric__before-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}

	.cs-metric__before-tag {
		font-family: var(--font-ui);
		font-size: clamp(0.5rem, 0.6vw, 0.58rem);
		letter-spacing: 0.15em;
		color: rgba(255, 255, 255, 0.2);
		padding: 0.1em 0.35em;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.cs-metric__before-val {
		font-family: var(--font-ui);
		font-size: var(--font-caption);
		color: rgba(255, 255, 255, 0.22);
		text-decoration: line-through;
		text-decoration-color: rgba(255, 255, 255, 0.12);
	}

	/* ── Before / After Compare ──────────────────────────────────────────────── */

	.cs-compare-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.cs-compare {
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(0, 255, 136, 0.14);
		cursor: col-resize;
		user-select: none;
		touch-action: none;
		aspect-ratio: 16 / 10;
		background: rgba(0, 0, 0, 0.4);
	}

	.cs-compare:hover {
		border-color: rgba(0, 255, 136, 0.28);
	}

	.cs-compare__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top center;
		display: block;
	}

	.cs-compare__img--new {
		/* clip-path is set inline; no transition — real-time drag must be instant */
		z-index: 1;
	}

	/* Labels */
	.cs-compare__lbl {
		position: absolute;
		top: 0.625rem;
		font-family: var(--font-ui);
		font-size: clamp(0.58rem, 0.72vw, 0.68rem);
		letter-spacing: 0.14em;
		padding: 0.2em 0.5em;
		pointer-events: none;
		z-index: 3;
	}

	.cs-compare__lbl--before {
		left: 0.625rem;
		background: rgba(6, 6, 10, 0.7);
		color: rgba(255, 255, 255, 0.45);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.cs-compare__lbl--after {
		right: 0.625rem;
		background: rgba(6, 6, 10, 0.7);
		color: var(--cp-lime, #00ff88);
		border: 1px solid rgba(0, 255, 136, 0.28);
		z-index: 3;
	}

	/* Handle */
	.cs-compare__handle {
		position: absolute;
		top: 0;
		bottom: 0;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 4;
		cursor: col-resize;
		outline: none;
	}

	.cs-compare__handle:focus-visible .cs-compare__knob {
		box-shadow:
			0 0 0 2px rgba(0, 255, 136, 0.6),
			0 0 20px rgba(0, 255, 136, 0.4);
	}

	.cs-compare__line {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 2px;
		transform: translateX(-50%);
		background: var(--cp-lime, #00ff88);
		box-shadow: 0 0 8px rgba(0, 255, 136, 0.55);
	}

	.cs-compare__knob {
		position: relative;
		z-index: 1;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--cp-bg, #06060a);
		border: 2px solid var(--cp-lime, #00ff88);
		box-shadow: 0 0 12px rgba(0, 255, 136, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--cp-lime, #00ff88);
		transition:
			transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 0.2s ease;
	}

	.cs-compare__handle:hover .cs-compare__knob {
		transform: scale(1.18);
		box-shadow: 0 0 22px rgba(0, 255, 136, 0.6);
	}

	.cs-compare__hint {
		font-family: var(--font-ui);
		font-size: clamp(0.6rem, 0.68vw, 0.68rem);
		color: rgba(255, 255, 255, 0.25);
		letter-spacing: 0.12em;
		text-align: center;
	}

	/* ── Footer ──────────────────────────────────────────────────────────────── */

	.cs-footer {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: clamp(1rem, 2vw, 1.5rem);
		border-top: 1px solid rgba(0, 255, 136, 0.1);
		flex-wrap: wrap;
	}

	.cs-project-meta {
		display: flex;
		gap: clamp(1.25rem, 3vw, 2rem);
	}

	.cs-meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.cs-meta__key {
		font-family: var(--font-ui);
		font-size: clamp(0.55rem, 0.65vw, 0.62rem);
		letter-spacing: 0.15em;
		color: rgba(0, 255, 136, 0.45);
	}

	.cs-meta__val {
		font-family: var(--font-ui);
		font-size: var(--font-body-sm);
		color: rgba(255, 255, 255, 0.75);
	}

	.cs-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-ui);
		font-size: var(--font-body-sm);
		letter-spacing: 0.1em;
		color: var(--cp-lime, #00ff88);
		text-decoration: none;
		border: 1px solid rgba(0, 255, 136, 0.24);
		padding: 0.55em 1.25em;
		position: relative;
		overflow: hidden;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.cs-cta::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(0, 255, 136, 0.07);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s ease;
	}

	.cs-cta:hover::before {
		transform: scaleX(1);
	}

	.cs-cta:hover {
		border-color: rgba(0, 255, 136, 0.5);
		box-shadow: 0 0 18px rgba(0, 255, 136, 0.14);
	}

	.cs-cta:focus-visible {
		outline: 2px solid rgba(0, 255, 136, 0.6);
		outline-offset: 2px;
	}

	/* ── Responsive ──────────────────────────────────────────────────────────── */

	@media (max-width: 960px) {
		.cs-body {
			grid-template-columns: 1fr;
		}

		/* On tablet, comparison goes second (above metrics on narrow screens feels off) */
		.cs-compare-wrap {
			order: -1;
		}

		.cs-compare {
			aspect-ratio: 16 / 9;
		}
	}

	@media (max-width: 640px) {
		.cs-header__main {
			flex-direction: column;
		}

		.cs-metrics {
			grid-template-columns: 1fr 1fr;
		}

		.cs-compare-wrap {
			order: 0;
		}
	}

	@media (max-width: 380px) {
		.cs-metrics {
			grid-template-columns: 1fr;
		}
	}

	/* ── Reduced motion ──────────────────────────────────────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.cs-card,
		.cs-metric,
		.cs-bridge,
		.cs-corner,
		.cs-status__dot,
		.cs-tech__tag {
			animation: none !important;
			transition: none !important;
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>
