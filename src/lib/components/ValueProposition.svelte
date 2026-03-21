<script lang="ts">
	/**
	 * ValueProposition Component
	 *
	 * Displays four centered, adaptive cards showcasing key value propositions
	 * with cyberpunk styling, responsive design, and performance optimizations
	 */

	import { onMount } from 'svelte';
	import ValuePropositionBackground from './ValuePropositionBackground.svelte';
	import {
		VALUE_PROP_CARDS,
		VP_ANIMATION_CONFIG,
		VP_RESPONSIVE_CONFIG,
		type ValuePropCard
	} from '$lib/constants/value-proposition.constants';
	import { BREAKPOINTS } from '$lib/constants/hero.constants';

	// ─── State ───────────────────────────────────────────────────────────

	let screenWidth: number = typeof window !== 'undefined' ? window.innerWidth : 0;
	let isMobile = false;
	let isTablet = false;
	let visibleCards: boolean[] = Array(VALUE_PROP_CARDS.length).fill(false);

	// ─── Lifecycle ───────────────────────────────────────────────────────

	onMount(() => {
		screenWidth = window.innerWidth;
		updateBreakpoints();

		// Stagger card visibility for entrance animation
		VALUE_PROP_CARDS.forEach((_, index) => {
			setTimeout(() => {
				visibleCards[index] = true;
			}, index * VP_ANIMATION_CONFIG.cardStaggerDelay * 1000);
		});

		// Handle window resize
		const handleResize = () => {
			screenWidth = window.innerWidth;
			updateBreakpoints();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	// ─── Functions ───────────────────────────────────────────────────────

	function updateBreakpoints(): void {
		isMobile = screenWidth < BREAKPOINTS.tablet;
		isTablet = screenWidth >= BREAKPOINTS.tablet && screenWidth < BREAKPOINTS.laptop;
	}

	/**
	 * Get SVG icon based on card icon identifier
	 */
	function getSvgIcon(iconName: string): string {
		const icons: Record<string, string> = {
			circuit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
				<path d="M9 9h6v6H9z"></path>
				<circle cx="6" cy="6" r="1"></circle>
				<circle cx="18" cy="6" r="1"></circle>
				<circle cx="6" cy="18" r="1"></circle>
				<circle cx="18" cy="18" r="1"></circle>
			</svg>`,
			lightning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
			</svg>`,
			shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
				<path d="M9 12l2 2 4-4"></path>
			</svg>`,
			spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="1"></circle>
				<path d="M12 1v6m0 6v6"></path>
				<path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
				<path d="M1 12h6m6 0h6"></path>
				<path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
			</svg>`
		};

		return icons[iconName] || icons.circuit;
	}

	/**
	 * Get card gap based on screen size
	 */
	function getCardGap(): string {
		if (isMobile) return VP_RESPONSIVE_CONFIG.mobileCardGap;
		if (isTablet) return VP_RESPONSIVE_CONFIG.tabletCardGap;
		return VP_RESPONSIVE_CONFIG.desktopCardGap;
	}

	/**
	 * Get section padding based on screen size
	 */
	function getSectionPadding(): string {
		if (isMobile) return VP_RESPONSIVE_CONFIG.mobilePadding;
		if (isTablet) return VP_RESPONSIVE_CONFIG.tabletPadding;
		return VP_RESPONSIVE_CONFIG.desktopPadding;
	}

	/**
	 * Get accent color class based on card's accent color
	 */
	function getAccentColorClass(color: ValuePropCard['accentColor']): string {
		return `vp-card--${color}`;
	}
</script>

<!-- Value Proposition Section -->
<section class="vp-section" style="--card-gap: {getCardGap()}; --section-padding: {getSectionPadding()};">
	<!-- Background component -->
	<ValuePropositionBackground />

	<!-- Section header -->
	<div class="vp-header">
		<h2 class="vp-title">VALUE PROPOSITION</h2>
		<div class="vp-header-accent"></div>
	</div>

	<!-- Content container with positioning context -->
	<div class="vp-container">

		<!-- Cards grid -->
		<div class="vp-cards-grid">
			{#each VALUE_PROP_CARDS as card, index (card.id)}
				<div
					class="vp-card {getAccentColorClass(card.accentColor)} {visibleCards[index] ? 'vp-card--visible' : ''}"
					style="--card-index: {index}"
					data-card-id={card.id}
				>
					<!-- Glow effect background -->
					<div class="vp-card__glow"></div>

					<!-- Card border accent -->
					<div class="vp-card__border"></div>

					<!-- Icon -->
					<div class="vp-card__icon">
						{@html getSvgIcon(card.icon)}
					</div>

					<!-- Title -->
					<h3 class="vp-card__title">{card.title}</h3>

					<!-- Description -->
					<p class="vp-card__description">{card.description}</p>

					<!-- Corner accent marks -->
					<div class="vp-card__corner vp-card__corner--top-left"></div>
					<div class="vp-card__corner vp-card__corner--top-right"></div>
					<div class="vp-card__corner vp-card__corner--bottom-left"></div>
					<div class="vp-card__corner vp-card__corner--bottom-right"></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	:root {
		--vp-border-color: rgba(0, 247, 255, 0.3);
		--vp-border-color-hover: rgba(0, 247, 255, 0.6);
	}

	/* Section container */
	.vp-section {
		position: relative;
		width: 100%;
        min-height: 90dvh;
		padding: var(--section-padding);
		background-color: var(--cp-bg);
		overflow: hidden;
		z-index: 1;
        display: flex;
		flex-direction: column;
		
	}

	.vp-container {
		max-width: var(--max-w);
		margin: 0 auto;
		z-index: 1;
        display: flex;
        flex-direction: column;
	}

	/* Section header */
	.vp-header {
		text-align: center;
		position: relative;
		height: 50%;
		z-index: 2;
	}

	.vp-title {
		font-size: var(--font-h3);
		font-family: var(--font-logo);
		font-weight: 700;
		color: var(--cp-cyan);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 1rem;
		text-shadow: 0 0 20px rgba(0, 247, 255, 0.5);
		animation: titleGlow 3s ease-in-out infinite;
	}

	@keyframes titleGlow {
		0%, 100% {
			text-shadow: 0 0 20px rgba(0, 247, 255, 0.5);
		}
		50% {
			text-shadow: 0 0 40px rgba(0, 247, 255, 0.8);
		}
	}

	.vp-header-accent {
		width: 60px;
		height: 3px;
		background: linear-gradient(90deg, transparent, var(--cp-cyan), transparent);
		margin: 0 auto;
		animation: accentPulse 2s ease-in-out infinite;
	}

	@keyframes accentPulse {
		0%, 100% {
			width: 60px;
			opacity: 0.5;
		}
		50% {
			width: 100px;
			opacity: 1;
		}
	}

	/* Cards grid layout */
	.vp-cards-grid {
		
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--card-gap);
		position: relative;
		z-index: 2;
	}

	/* Card styling */
	.vp-card {
		position: relative;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		background: linear-gradient(135deg, rgba(16, 66, 233, 0.1) 0%, rgba(16, 66, 233, 0.05) 100%);
		border: 2px solid var(--vp-border-color);
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		transform: translateY(40px);
		opacity: 0;
		will-change: transform, box-shadow, border-color;
		cursor: none;
	}

	.vp-card--visible {
		animation: cardEnter var(--vp-animation-duration, 0.8s) cubic-bezier(0.34, 1.56, 0.64, 1)
			forwards;
		animation-delay: calc(var(--card-index, 0) * 0.1s);
	}

	@keyframes cardEnter {
		from {
			transform: translateY(40px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* Card hover state */
	.vp-card:hover {
		transform: translateY(-5px) scale(1.02);
		border-color: var(--vp-border-color-hover);
	}

	.vp-card:hover .vp-card__glow {
		opacity: 1;
	}

	/* Glow effect background */
	.vp-card__glow {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.3s ease;
		will-change: opacity;
		pointer-events: none;
	}

	.vp-card--cyan .vp-card__glow {
		background: radial-gradient(circle at center, rgba(0, 245, 255, 0.2) 0%, transparent 70%);
	}

	.vp-card--pink .vp-card__glow {
		background: radial-gradient(circle at center, rgba(255, 0, 85, 0.2) 0%, transparent 70%);
	}

	.vp-card--purple .vp-card__glow {
		background: radial-gradient(circle at center, rgba(179, 0, 255, 0.2) 0%, transparent 70%);
	}

	.vp-card--yellow .vp-card__glow {
		background: radial-gradient(circle at center, rgba(255, 230, 0, 0.2) 0%, transparent 70%);
	}

	/* Border accent animation */
	.vp-card__border {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
	}

	.vp-card--cyan .vp-card__border {
		box-shadow: inset 0 0 20px rgba(0, 245, 255, 0.3), 0 0 30px rgba(0, 245, 255, 0.2);
	}

	.vp-card--pink .vp-card__border {
		box-shadow: inset 0 0 20px rgba(255, 0, 85, 0.3), 0 0 30px rgba(255, 0, 85, 0.2);
	}

	.vp-card--purple .vp-card__border {
		box-shadow: inset 0 0 20px rgba(179, 0, 255, 0.3), 0 0 30px rgba(179, 0, 255, 0.2);
	}

	.vp-card--yellow .vp-card__border {
		box-shadow: inset 0 0 20px rgba(255, 230, 0, 0.3), 0 0 30px rgba(255, 230, 0, 0.2);
	}

	.vp-card:hover .vp-card__border {
		opacity: 1;
		animation: borderGlow 2s ease-in-out infinite;
	}

	@keyframes borderGlow {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	/* Icon styling */
	.vp-card__icon {
		width: clamp(3rem, 8vw, 4.5rem);
		height: clamp(3rem, 8vw, 4.5rem);
		margin: 0 auto 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: currentColor;
		position: relative;
		z-index: 2;
		transition: transform 0.3s ease;
		will-change: transform;
	}

	.vp-card:hover .vp-card__icon {
		transform: scale(1.15) rotate(-5deg);
	}

	.vp-card--cyan .vp-card__icon {
		color: var(--cp-cyan);
	}

	.vp-card--pink .vp-card__icon {
		color: var(--cp-pink);
	}

	.vp-card--purple .vp-card__icon {
		color: var(--cp-purple);
	}

	.vp-card--yellow .vp-card__icon {
		color: var(--cp-yellow);
	}

	.vp-card__icon :global(svg) {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 10px currentColor);
	}

	/* Title styling */
	.vp-card__title {
		font-size: var(--font-h5);
		font-family: var(--font-logo);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 1rem;
		color: white;
		position: relative;
		z-index: 2;
	}

	.vp-card--cyan .vp-card__title {
		color: var(--cp-cyan);
	}

	.vp-card--pink .vp-card__title {
		color: var(--cp-pink);
	}

	.vp-card--purple .vp-card__title {
		color: var(--cp-purple);
	}

	.vp-card--yellow .vp-card__title {
		color: var(--cp-yellow);
	}

	/* Description styling */
	.vp-card__description {
		font-size: var(--font-body-sm);
		line-height: var(--line-body);
		color: rgba(255, 255, 255, 0.8);
		position: relative;
		z-index: 2;
		word-wrap: break-word;
	}

	/* Corner accent marks for cyberpunk aesthetic */
	.vp-card__corner {
		position: absolute;
		width: 20px;
		height: 20px;
		pointer-events: none;
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}

	.vp-card:hover .vp-card__corner {
		opacity: 1;
	}

	.vp-card__corner--top-left {
		top: 0;
		left: 0;
		border-top: 2px solid currentColor;
		border-left: 2px solid currentColor;
	}

	.vp-card__corner--top-right {
		top: 0;
		right: 0;
		border-top: 2px solid currentColor;
		border-right: 2px solid currentColor;
	}

	.vp-card__corner--bottom-left {
		bottom: 0;
		left: 0;
		border-bottom: 2px solid currentColor;
		border-left: 2px solid currentColor;
	}

	.vp-card__corner--bottom-right {
		bottom: 0;
		right: 0;
		border-bottom: 2px solid currentColor;
		border-right: 2px solid currentColor;
	}

	.vp-card--cyan .vp-card__corner {
		color: var(--cp-cyan);
	}

	.vp-card--pink .vp-card__corner {
		color: var(--cp-pink);
	}

	.vp-card--purple .vp-card__corner {
		color: var(--cp-purple);
	}

	.vp-card--yellow .vp-card__corner {
		color: var(--cp-yellow);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.vp-cards-grid {
			grid-template-columns: 1fr;
		}

		.vp-card {
			padding: 1.25rem;
		}

		.vp-title {
			font-size: var(--font-h3);
		}
	}

	@media (min-width: 769px) and (max-width: 1023px) {
		.vp-cards-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.vp-cards-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	/* Accessibility: Reduce animations for users who prefer reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.vp-card,
		.vp-title,
		.vp-header-accent,
		.vp-card__icon,
		.vp-card__corner {
			animation: none !important;
			transition: none !important;
		}

		.vp-card--visible {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
