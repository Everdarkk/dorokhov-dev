<script lang="ts">
	/**
	 * CyberButton — reusable action button for all sections.
	 *
	 * Variants:
	 *   primary   — solid accent fill on hover, strongest visual weight  (cyan)
	 *   secondary — outlined, softer glow                                (pink)
	 *   ghost     — very subtle, minimal border                          (any colour via `color`)
	 *
	 * Can render as <button> or <a> depending on whether `href` is supplied.
	 * Supports disabled state, loading state, and an optional left/right icon slot.
	 *
	 * All hover effects are compositor-only (transform + opacity + box-shadow).
	 * The sweep animation uses a CSS pseudo-element — no JS.
	 */

	// ─── Props ────────────────────────────────────────────────────────────────

	/** Visual style preset */
	export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';

	/** Optional override colour — CSS colour string or var() */
	export let color: string = '';

	/** If set, renders as <a href="..."> instead of <button> */
	export let href: string = '';

	/** <button type> — ignored when href is set */
	export let type: 'button' | 'submit' | 'reset' = 'button';

	/** Disables interaction and dims the element */
	export let disabled: boolean = false;

	/** Shows a spinner and locks interaction */
	export let loading: boolean = false;

	/** Accessible label — falls back to slot text */
	export let ariaLabel: string = '';

	/** Size preset */
	export let size: 'sm' | 'md' | 'lg' = 'md';

	// ─── Derived ──────────────────────────────────────────────────────────────

	$: isDisabled = disabled || loading;
	$: tag = href && !isDisabled ? 'a' : 'button';

	/** Inline style used only when `color` prop overrides the variant default */
	$: inlineStyle = color ? `--btn-accent: ${color};` : '';
</script>

<!-- Render as <a> or <button> depending on props -->
{#if tag === 'a'}
	<a
		{href}
		class="cyber-btn cyber-btn--{variant} cyber-btn--{size}"
		class:is-disabled={isDisabled}
		style={inlineStyle}
		aria-label={ariaLabel || undefined}
		aria-disabled={isDisabled || undefined}
		on:click
	>
		<!-- Sweep overlay (CSS pseudo handled via ::before but we add a div
		     for better browser compat with clip-path) -->
		<span class="cyber-btn__sweep" aria-hidden="true"></span>

		{#if loading}
			<span class="cyber-btn__spinner" aria-hidden="true"></span>
		{/if}

		<slot />

	</a>
{:else}
	<button
		{type}
		class="cyber-btn cyber-btn--{variant} cyber-btn--{size}"
		class:is-disabled={isDisabled}
		style={inlineStyle}
		aria-label={ariaLabel || undefined}
		disabled={isDisabled}
		on:click
	>
		<span class="cyber-btn__sweep" aria-hidden="true"></span>

		{#if loading}
			<span class="cyber-btn__spinner" aria-hidden="true"></span>
		{/if}

		<slot />

	</button>
{/if}

<style>
	/* ─── Base ──────────────────────────────────────────────────────────── */
	.cyber-btn {
		/* Accent colour defaults — overridden per variant below */
		--btn-accent: var(--cp-cyan, #00f5ff);

		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.55em;
		font-family: var(--font-mono, 'Share Tech Mono', monospace);
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
		border: none;
		outline: none;
		overflow: hidden;
		/* Clip corners for the cyberpunk chamfer look */
		clip-path: polygon(
			8px 0%,
			100% 0%,
			100% calc(100% - 8px),
			calc(100% - 8px) 100%,
			0% 100%,
			0% 8px
		);
		background: transparent;
		transition:
			transform   0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow  0.22s ease,
			color       0.22s ease;
		will-change: transform;
		-webkit-tap-highlight-color: transparent;
	}

	/* ─── Size presets ── */
	.cyber-btn--sm {
		padding: 0.45rem 1rem;
		font-size: 0.65rem;
	}

	.cyber-btn--md {
		padding: 0.7rem 1.6rem;
		font-size: 0.72rem;
	}

	.cyber-btn--lg {
		padding: 0.9rem 2.2rem;
		font-size: 0.82rem;
	}

	/* ─── Sweep overlay ── */
	/*
	  A translucent fill that slides in from the left on hover.
	  Uses a div instead of ::before so it works correctly with
	  clip-path on the parent (pseudo-elements can clip unexpectedly).
	*/
	.cyber-btn__sweep {
		position: absolute;
		inset: 0;
		background: color-mix(in srgb, var(--btn-accent) 18%, transparent);
		transform: translateX(-105%);
		transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
		pointer-events: none;
		z-index: 0;
	}

	.cyber-btn:hover:not(.is-disabled) .cyber-btn__sweep,
	.cyber-btn:focus-visible:not(.is-disabled) .cyber-btn__sweep {
		transform: translateX(0%);
	}

	/* Keep slot content above sweep */
	.cyber-btn :global(*) {
		position: relative;
		z-index: 1;
	}

	.cyber-btn__sweep { z-index: 0; }

	/* ─── Primary variant — cyan ── */
	.cyber-btn--primary {
		--btn-accent: var(--cp-cyan);
		color: var(--btn-accent);
		border: 1px solid var(--btn-accent);
		box-shadow:
			0 0 8px  color-mix(in srgb, var(--btn-accent) 25%, transparent),
			inset 0 0 8px color-mix(in srgb, var(--btn-accent) 6%, transparent);
		text-shadow: 0 0 10px color-mix(in srgb, var(--btn-accent) 55%, transparent);
	}

	.cyber-btn--primary:hover:not(.is-disabled) {
		color: var(--cp-bg);
		background: var(--btn-accent);
		box-shadow:
			0 0 22px color-mix(in srgb, var(--btn-accent) 55%, transparent),
			0 0 40px color-mix(in srgb, var(--btn-accent) 25%, transparent),
			inset 0 0 16px color-mix(in srgb, var(--btn-accent) 20%, transparent);
		transform: translateY(-2px);
	}

	/* ─── Secondary variant — pink ── */
	.cyber-btn--secondary {
		--btn-accent: var(--cp-pink);
		color: var(--btn-accent);
		border: 1px solid color-mix(in srgb, var(--btn-accent) 70%, transparent);
		box-shadow:
			0 0 8px  color-mix(in srgb, var(--btn-accent) 20%, transparent);
		text-shadow: 0 0 10px color-mix(in srgb, var(--btn-accent) 45%, transparent);
	}

	.cyber-btn--secondary:hover:not(.is-disabled) {
		color: var(--cp-bg);
		background: var(--btn-accent);
		border-color: var(--btn-accent);
		box-shadow:
			0 0 22px color-mix(in srgb, var(--btn-accent) 55%, transparent),
			0 0 40px color-mix(in srgb, var(--btn-accent) 25%, transparent);
		transform: translateY(-2px);
	}

	/* ─── Ghost variant — very minimal ── */
	.cyber-btn--ghost {
		--btn-accent: var(--cp-cyan);
		color: color-mix(in srgb, var(--btn-accent) 70%, rgba(255,255,255,0.6));
		border: 1px solid color-mix(in srgb, var(--btn-accent) 25%, transparent);
	}

	.cyber-btn--ghost:hover:not(.is-disabled) {
		color: var(--btn-accent);
		border-color: color-mix(in srgb, var(--btn-accent) 55%, transparent);
		box-shadow: 0 0 12px color-mix(in srgb, var(--btn-accent) 20%, transparent);
		transform: translateY(-1px);
	}

	/* ─── Disabled ── */
	.cyber-btn.is-disabled {
		opacity: 0.32;
		cursor: not-allowed;
		pointer-events: none;
	}

	/* ─── Loading spinner ── */
	.cyber-btn__spinner {
		display: inline-block;
		width: 0.9em;
		height: 0.9em;
		border: 2px solid color-mix(in srgb, var(--btn-accent) 30%, transparent);
		border-top-color: var(--btn-accent);
		border-radius: 50%;
		animation: btnSpin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes btnSpin {
		to { transform: rotate(360deg); }
	}

	/* ─── Focus ring (keyboard nav) ── */
	.cyber-btn:focus-visible {
		outline: 2px solid var(--btn-accent);
		outline-offset: 3px;
	}

	/* ─── Active press ── */
	.cyber-btn:active:not(.is-disabled) {
		transform: translateY(0) scale(0.97);
	}

	/* ─── Reduce motion ── */
	@media (prefers-reduced-motion: reduce) {
		.cyber-btn,
		.cyber-btn__sweep,
		.cyber-btn__spinner {
			animation: none !important;
			transition: none !important;
		}
	}
</style>