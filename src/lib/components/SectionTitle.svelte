<script lang="ts">
	/**
	 * SectionTitle Component
	 *
	 * Reusable section title component supporting multiple styles:
	 * - 'simple': Centered title with glow effect and animated accent line
	 * - 'elaborate': Title with label, slash, and gradient rule (requires active prop)
	 *
	 * This component provides consistent styling and animations across sections
	 * while maintaining design flexibility for different use cases.
	 */

	export let title: string;
	export let variant: 'simple' | 'elaborate' = 'simple';
	export let label: string | undefined = undefined;
	export let isVisible: boolean = true; // Controls entrance animation for elaborate variant

</script>

<!-- ─── Simple Variant ──────────────────────────────────────────────────── -->
{#if variant === 'simple'}
	<div class="section-title section-title--simple">
		<h2 class="section-title__heading">{title}</h2>
		<div class="section-title__accent"></div>
	</div>

	<!-- ─── Elaborate Variant ───────────────────────────────────────────────── -->
{:else if variant === 'elaborate'}
	<header
		class="section-title section-title--elaborate"
		class:is-visible={isVisible}
	>
		{#if label}
			<div class="section-title__label" aria-hidden="true">
				<span class="section-title__slash">//</span>
				{label}
			</div>
		{/if}
		<h2 class="section-title__heading">{title}</h2>
		<div class="section-title__rule" aria-hidden="true"></div>
	</header>
{/if}

<style>
	/* ─── Simple Variant ────────────────────────────────────────────────── */

	.section-title--simple {
		text-align: center;
		position: relative;
		z-index: 2;
	}

	.section-title--simple .section-title__heading {
		font-size: var(--font-h2);
		font-family: var(--font-bionical);
		text-transform: uppercase;
		font-weight: 300;
		color: var(--cp-cyan);
		letter-spacing: 0.1em;
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

	.section-title--simple .section-title__accent {
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

	/* ─── Elaborate Variant ────────────────────────────────────────────────── */

	.section-title--elaborate {
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}

	.section-title--elaborate.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.section-title__label {
		font-family: var(--font-mono, 'Share Tech Mono', monospace);
		font-size: clamp(0.6rem, 1.2vw, 0.75rem);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5568);
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.section-title__slash {
		color: var(--cp-cyan, #00f5ff);
	}

	.section-title--elaborate .section-title__heading {
		font-family: var(--font-logo, var(--font-bionical, 'Share Tech Mono', monospace));
		font-size: var(--font-h2, clamp(1.8rem, 5vw, 3.2rem));
		font-weight: 400;
		color: var(--color-cyan);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin: 0 0 1rem;
		text-shadow: 0 0 40px rgba(0, 245, 255, 0.2);
	}

	.section-title__rule {
		width: clamp(3rem, 8vw, 6rem);
		height: 2px;
		background: linear-gradient(90deg, var(--cp-cyan, #00f5ff), transparent);
	}

	/* ─── Reduce Motion ────────────────────────────────────────────────– */
	@media (prefers-reduced-motion: reduce) {
		.section-title--simple .section-title__heading,
		.section-title--simple .section-title__accent,
		.section-title--elaborate {
			animation: none !important;
			transition: none !important;
			opacity: 1;
			transform: none;
		}
	}
</style>
