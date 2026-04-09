<script lang="ts">
	/**
	 * CtaSection — "INITIATE_CONTACT"
	 *
	 * Closing call-to-action section that drives project inquiries.
	 * The contact form logic lives in ContactModal (contact-modal.svelte),
	 * which is opened imperatively via bind:this.
	 *
	 * Background:
	 *   • NeuralGridBackground — canvas 2D particle constellation
	 *   • CSS hex-dot grid overlay (static, zero runtime cost)
	 *   • CRT scanlines (shared pattern from other sections)
	 *   • Centre radial spotlight (draws eye to content)
	 */

	import NeuralGridBackground from '$lib/components/backgrounds/neural-grid-background.svelte';
	import CyberButton from '$lib/components/common/cyber-button.svelte';
	import ContactModal from '$lib/components/sections/contact-modal.svelte';
	import { scrollReveal } from '$lib/actions';
	import { reducedMotion } from '$lib/stores';
	import { CTA_STATS } from '$lib/constants/cta';

	// ── Section reveal ────────────────────────────────────────────────────────

	let sectionRevealed = false;

	// ── Modal ref — opened imperatively ──────────────────────────────────────

	let contactModal: ContactModal;
</script>
 
<!-- ═══════════════════════════════════════════════════════════════════════════
     SECTION
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	class="cta-section"
	id="contact"
	aria-labelledby="cta-heading"
	use:scrollReveal={{ threshold: 0.08, onReveal: () => (sectionRevealed = true) }}
>
	<!-- Animated particle-constellation background -->
	{#if sectionRevealed && !$reducedMotion}
		<NeuralGridBackground />
	{/if}

	<!-- CSS hex-dot grid (static) -->
	<div class="cta-hex-grid" aria-hidden="true"></div>

	<!-- CRT scanlines -->
	<div class="cta-scanlines" aria-hidden="true"></div>

	<!-- Centre spotlight -->
	<div class="cta-spotlight" aria-hidden="true"></div>

	<!-- Content -->
	<div class="cta-inner" class:is-revealed={sectionRevealed}>

		<!-- Section tag -->
		<div class="cta-tag" aria-hidden="true">
			<span class="cta-tag__slash">// </span>INITIATE_CONTACT
		</div>

		<!-- SEO-friendly heading -->
		<h2 class="cta-headline" id="cta-heading">
			Ready to&nbsp;<span class="cta-headline__accent">Deploy</span><br/>
			Your&nbsp;<span class="cta-headline__accent2">Vision?</span>
		</h2>

		<p class="cta-sub">
			High-performance web experiences — engineered for speed, SEO,&nbsp;and
			seamless user experience. From concept to launch, let's build
			something&nbsp;extraordinary.
		</p>

		<!-- Stats row -->
		<ul class="cta-stats" aria-label="Key metrics">
			{#each CTA_STATS as stat (stat.label)}
				<li class="cta-stat">
					<span class="cta-stat__symbol" aria-hidden="true">{stat.symbol}</span>
					<strong class="cta-stat__value">{stat.value}</strong>
					<span class="cta-stat__label">{stat.label}</span>
				</li>
			{/each}
		</ul>

		<!-- Primary CTA -->
		<div class="cta-action">
			<CyberButton
				variant="primary"
				size="lg"
				ariaLabel="Open project inquiry form"
				on:click={() => contactModal.openModal()}
			>
				INITIATE&nbsp;PROJECT
			</CyberButton>
		</div>

		<!-- Trust note -->
		<p class="cta-trust" aria-label="Commitment details">
			Free consultation&nbsp;&nbsp;·&nbsp;&nbsp;12h response&nbsp;&nbsp;·&nbsp;&nbsp;No commitment
		</p>

	</div>
</section>

<!-- Contact modal (renders in a portal-like fixed overlay) -->
<ContactModal bind:this={contactModal} />


<style>
/* ═════════════════════════════════════════════════════════════════════════════
   SECTION
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-section {
	position:        relative;
	width:           100%;
	min-height:      100svh;
	display:         flex;
	align-items:     center;
	justify-content: center;
	overflow:        hidden;
	background:      var(--cp-bg, #06060a);
}

/* ── Hex-dot grid (static CSS pattern) ── */
.cta-hex-grid {
	position:            absolute;
	inset:               0;
	background-image:
		radial-gradient(circle, rgba(0, 245, 255, 0.05)  1px, transparent 1px),
		radial-gradient(circle, rgba(0, 245, 255, 0.025) 1px, transparent 1px);
	background-size:     32px 55px, 32px 55px;
	background-position: 0 0, 16px 27.5px;
	pointer-events:      none;
	z-index:             1;
}

/* ── CRT scanlines ── */
.cta-scanlines {
	position:       absolute;
	inset:          0;
	background:     repeating-linear-gradient(
		to bottom,
		transparent          0px,
		transparent          3px,
		rgba(0, 0, 0, 0.07)  3px,
		rgba(0, 0, 0, 0.07)  4px
	);
	pointer-events: none;
	z-index:        2;
}

/* ── Centre spotlight — draws focus to content ── */
.cta-spotlight {
	position:       absolute;
	inset:          0;
	background:     radial-gradient(
		ellipse 70% 55% at 50% 50%,
		rgba(0, 245, 255, 0.06) 0%,
		transparent 70%
	);
	pointer-events: none;
	z-index:        2;
}

/* ═════════════════════════════════════════════════════════════════════════════
   INNER CONTENT
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-inner {
	position:       relative;
	z-index:        3;
	max-width:      var(--max-w, 1400px);
	width:          100%;
	margin:         0 auto;
	padding:        clamp(5rem, 12vw, 9rem) clamp(1rem, 4vw, 3rem);
	display:        flex;
	flex-direction: column;
	align-items:    center;
	text-align:     center;
	gap:            clamp(1.5rem, 3vw, 2.25rem);
}

/* ── Shared entrance: stagger in after section reveal ── */

.cta-tag,
.cta-headline,
.cta-sub,
.cta-stats,
.cta-action,
.cta-trust {
	opacity:    0;
	transform:  translateY(28px);
	transition:
		opacity    0.65s ease,
		transform  0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cta-inner.is-revealed .cta-tag      { opacity: 1; transform: none; transition-delay: 0s;    }
.cta-inner.is-revealed .cta-headline { opacity: 1; transform: none; transition-delay: 0.1s;  }
.cta-inner.is-revealed .cta-sub      { opacity: 1; transform: none; transition-delay: 0.22s; }
.cta-inner.is-revealed .cta-stats    { opacity: 1; transform: none; transition-delay: 0.34s; }
.cta-inner.is-revealed .cta-action   { opacity: 1; transform: none; transition-delay: 0.48s; }
.cta-inner.is-revealed .cta-trust    { opacity: 1; transform: none; transition-delay: 0.58s; }

/* ── Tag label ── */
.cta-tag {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.6rem, 1.1vw, 0.72rem);
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color:          var(--cp-muted, #4a5a6a);
}

.cta-tag__slash { color: var(--cp-cyan, #00f5ff); }

/* ── Main headline ── */
.cta-headline {
	font-family:    var(--font-bionical, 'Courier Prime', monospace);
	font-size:      var(--font-h1);
	font-weight:    400;
	line-height:    var(--line-heading, 1.15);
	letter-spacing: -0.01em;
	text-transform: uppercase;
	color:          azure;
}

.cta-headline__accent {
	color:       var(--cp-cyan, #00f5ff);
	text-shadow:
		0 0 24px rgba(0, 245, 255, 0.55),
		0 0 60px rgba(0, 245, 255, 0.2);
	animation:   headlineGlow 3.5s ease-in-out infinite;
}

.cta-headline__accent2 {
	color:       var(--cp-pink, #ff0055);
	text-shadow:
		0 0 24px rgba(255, 0, 85, 0.45),
		0 0 60px rgba(255, 0, 85, 0.15);
}

@keyframes headlineGlow {
	0%, 100% { text-shadow: 0 0 24px rgba(0, 245, 255, 0.55), 0 0 60px rgba(0, 245, 255, 0.2); }
	50%       { text-shadow: 0 0 40px rgba(0, 245, 255, 0.8),  0 0 80px rgba(0, 245, 255, 0.35); }
}

/* ── Sub-headline ── */
.cta-sub {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size:   var(--font-body-lg, clamp(1.1rem, 1.5vw, 1.25rem));
	line-height: var(--line-body, 1.6);
	color:       rgba(255, 255, 255, 0.6);
	max-width:   56ch;
}

/* ═════════════════════════════════════════════════════════════════════════════
   STATS ROW
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-stats {
	display:         flex;
	gap:             clamp(1.5rem, 5vw, 4rem);
	flex-wrap:       wrap;
	justify-content: center;
	padding:         0;
}

.cta-stat {
	display:        flex;
	flex-direction: column;
	align-items:    center;
	gap:            0.25rem;
	position:       relative;
}

.cta-inner.is-revealed .cta-stats .cta-stat {
	opacity:          1;
	transform:        none;
	transition-delay: calc(0.34s + var(--si, 0) * 0.1s);
}

/* Separator between stats */
.cta-stat + .cta-stat::before {
	content:    '';
	position:   absolute;
	left:       calc(-1 * clamp(0.75rem, 2.5vw, 2rem));
	top:        50%;
	transform:  translateY(-50%);
	width:      1px;
	height:     2.5rem;
	background: linear-gradient(to bottom, transparent, rgba(0, 245, 255, 0.2), transparent);
}

.cta-stat__symbol {
	font-size:   1rem;
	color:       var(--cp-cyan, #00f5ff);
	opacity:     0.7;
	font-family: var(--font-ui, monospace);
}

.cta-stat__value {
	font-family:    var(--font-bionical, 'Courier Prime', monospace);
	font-size:      clamp(1.8rem, 4vw, 2.6rem);
	font-weight:    400;
	line-height:    1;
	color:          var(--cp-cyan, #00f5ff);
	text-shadow:    0 0 20px rgba(0, 245, 255, 0.4);
	letter-spacing: 0.04em;
}

.cta-stat__label {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.58rem, 0.9vw, 0.7rem);
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color:          var(--cp-muted, #4a5a6a);
}

/* ═════════════════════════════════════════════════════════════════════════════
   CTA ACTION
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-action { display: flex; justify-content: center; }

/* ── Trust note ── */
.cta-trust {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.62rem, 0.9vw, 0.72rem);
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color:          var(--cp-muted, #4a5a6a);
}

/* ═════════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═════════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.cta-tag,
	.cta-headline,
	.cta-sub,
	.cta-stats,
	.cta-action,
	.cta-trust {
		opacity:    1 !important;
		transform:  none !important;
		transition: none !important;
	}

	.cta-headline__accent {
		animation: none !important;
	}
}
</style>
