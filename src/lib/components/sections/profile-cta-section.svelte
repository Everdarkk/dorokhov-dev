<script lang="ts">
	/**
	 * ProfileCtaSection — "TRANSMISSION_END"
	 *
	 * Closing funnel section on /profile.
	 * Converts profile-page visitors into contact-form leads via a single
	 * high-intent CTA that navigates to the /#contact section on the homepage.
	 *
	 * Performance notes:
	 *   • CSS-only background — safe to stack immediately after UrchinBackground
	 *     in ProfileApproachSection; no canvas, no WebGL, zero extra GPU load.
	 *   • scrollReveal action owns the IntersectionObserver lifecycle & cleanup.
	 *   • Pulse animation declared in CSS; respects prefers-reduced-motion.
	 *   • No onMount / JS timers — zero manual cleanup burden.
	 */

	import { scrollReveal }     from '$lib/actions';
	import CyberButton          from '$lib/components/common/cyber-button.svelte';
	import { PROFILE_CTA_COPY } from '$lib/constants/profile-sections';

	let sectionRevealed = false;
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     SECTION
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	class="pcta"
	use:scrollReveal={{ threshold: 0.1, onReveal: () => (sectionRevealed = true) }}
	aria-labelledby="pcta-heading"
>

	<!-- ── Decorative background layers (aria-hidden, no content) ─────────── -->
	<div class="pcta__scanlines" aria-hidden="true"></div>
	<div class="pcta__spotlight" aria-hidden="true"></div>

	<!-- ── Content ────────────────────────────────────────────────────────── -->
	<div class="pcta__inner" class:is-revealed={sectionRevealed}>

		<!-- Corner bracket accents -->
		<span class="pcta__corner pcta__corner--tl" aria-hidden="true"></span>
		<span class="pcta__corner pcta__corner--br" aria-hidden="true"></span>

		<!-- Availability status -->
		<div class="pcta__status">
			<span class="pcta__status-dot" aria-hidden="true"></span>
			<span class="pcta__status-text">{PROFILE_CTA_COPY.statusLabel}</span>
		</div>

		<!-- Section tag / system label -->
		<div class="pcta__tag" aria-hidden="true">
			<span class="pcta__tag-slash">// </span>{PROFILE_CTA_COPY.sectionLabel}
		</div>

		<!-- Main heading — h2 (h1 lives in ProfileHeroSection) -->
		<h2 class="pcta__heading" id="pcta-heading">
			{PROFILE_CTA_COPY.headingLine1}<br />
			<span class="pcta__heading-accent">{PROFILE_CTA_COPY.headingLine2}</span>
		</h2>

		<!-- Conversion copy -->
		<p class="pcta__sub">{PROFILE_CTA_COPY.subheading}</p>

		<!-- CTA action zone -->
		<div class="pcta__action">
			<CyberButton
				href={PROFILE_CTA_COPY.ctaHref}
				variant="primary"
				size="lg"
				ariaLabel="Contact Oleksandr Dorokhov to discuss your project"
			>
				{PROFILE_CTA_COPY.ctaLabel}
			</CyberButton>

			<p class="pcta__trust">{PROFILE_CTA_COPY.trustNote}</p>
		</div>

	</div><!-- /.pcta__inner -->

</section>


<style>
/* ═══════════════════════════════════════════════════════════════════════════
   SECTION SHELL
   ═══════════════════════════════════════════════════════════════════════════ */

.pcta {
	position: relative;
	width: 100%;
	min-height: 65dvh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--cp-bg, #06060a);
	overflow: hidden;
}

/* Top separator — cyan gradient rule matching other profile sections */
.pcta::before {
	content: '';
	position: absolute;
	top: 0;
	left: clamp(1rem, 4vw, 3rem);
	right: clamp(1rem, 4vw, 3rem);
	height: 1px;
	background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.18), transparent);
	z-index: 2;
	pointer-events: none;
}

/* ── Scanlines overlay ── */
.pcta__scanlines {
	position: absolute;
	inset: 0;
	z-index: 1;
	pointer-events: none;
	background: repeating-linear-gradient(
		to bottom,
		transparent 3px,
		rgba(0, 0, 0, 0.07) 3px,
		rgba(0, 0, 0, 0.07) 4px
	);
	opacity: 0.55;
}

/* ── Radial spotlight — draws eye toward centered content ── */
.pcta__spotlight {
	position: absolute;
	inset: 0;
	z-index: 1;
	pointer-events: none;
	background:
		radial-gradient(ellipse 72% 58% at 50% 50%, rgba(0, 245, 255, 0.04) 0%, transparent 68%),
		radial-gradient(ellipse 40% 35% at 50% 50%, rgba(0, 245, 255, 0.025) 0%, transparent 100%);
}

/* ═══════════════════════════════════════════════════════════════════════════
   INNER — centered flex column
   ═══════════════════════════════════════════════════════════════════════════ */

.pcta__inner {
	position: relative;
	z-index: 2;
	width: 100%;
	max-width: var(--max-w, 1400px);
	margin: 0 auto;
	padding: clamp(5rem, 10vw, 8rem) clamp(1rem, 4vw, 3rem);
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: clamp(0.65rem, 1.4vw, 1rem);
}

/* ── Corner bracket accents ── */
.pcta__corner {
	position: absolute;
	width: 18px;
	height: 18px;
	pointer-events: none;
}

.pcta__corner--tl {
	top:  clamp(1.5rem, 3vw, 2.5rem);
	left: clamp(1.5rem, 3vw, 2.5rem);
	border-top:  2px solid rgba(0, 245, 255, 0.22);
	border-left: 2px solid rgba(0, 245, 255, 0.22);
}

.pcta__corner--br {
	bottom: clamp(1.5rem, 3vw, 2.5rem);
	right:  clamp(1.5rem, 3vw, 2.5rem);
	border-bottom: 2px solid rgba(0, 245, 255, 0.22);
	border-right:  2px solid rgba(0, 245, 255, 0.22);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL-REVEAL ENTRANCE ANIMATIONS
   Applied once via scrollReveal action adding .is-revealed to .pcta__inner.
   Stagger via transition-delay so layout never jumps.
   ═══════════════════════════════════════════════════════════════════════════ */

.pcta__status,
.pcta__tag,
.pcta__heading,
.pcta__sub,
.pcta__action {
	opacity: 0;
	transform: translateY(22px);
	transition: opacity 0.55s ease, transform 0.55s ease;
	will-change: transform;
}

.pcta__inner.is-revealed .pcta__status  { opacity: 1; transform: none; transition-delay: 0.05s; }
.pcta__inner.is-revealed .pcta__tag     { opacity: 1; transform: none; transition-delay: 0.14s; }
.pcta__inner.is-revealed .pcta__heading { opacity: 1; transform: none; transition-delay: 0.26s; }
.pcta__inner.is-revealed .pcta__sub     { opacity: 1; transform: none; transition-delay: 0.40s; }
.pcta__inner.is-revealed .pcta__action  { opacity: 1; transform: none; transition-delay: 0.54s; }

/* ═══════════════════════════════════════════════════════════════════════════
   AVAILABILITY STATUS BADGE
   ═══════════════════════════════════════════════════════════════════════════ */

.pcta__status {
	display: flex;
	align-items: center;
	gap: 0.55rem;
}

.pcta__status-dot {
	display: inline-block;
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background:  var(--cp-lime, #00ff88);
	box-shadow:  0 0 6px var(--cp-lime, #00ff88);
	flex-shrink: 0;
	animation:   pctaPulse 2.4s ease-in-out infinite;
}

@keyframes pctaPulse {
	0%, 100% { opacity: 1;    box-shadow: 0 0 6px var(--cp-lime, #00ff88); }
	50%       { opacity: 0.4; box-shadow: 0 0 2px var(--cp-lime, #00ff88); }
}

.pcta__status-text {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.56rem, 0.9vw, 0.66rem);
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color:          var(--cp-lime, #00ff88);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION TAG / SYSTEM LABEL
   ═══════════════════════════════════════════════════════════════════════════ */

.pcta__tag {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.56rem, 0.9vw, 0.68rem);
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color:          var(--cp-muted, #4a5a6a);
	margin:         0;
}

.pcta__tag-slash {
	color: var(--cp-cyan, #00f5ff);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADING
   ═══════════════════════════════════════════════════════════════════════════ */

.pcta__heading {
	margin:         clamp(0.5rem, 1.5vw, 1rem) 0 0;
	font-family:    var(--font-bionical, 'Courier Prime', monospace);
	font-weight:    400;
	font-size:      clamp(2.8rem, 6.5vw, 5.2rem);
	line-height:    1.08;
	text-transform: uppercase;
	letter-spacing: -0.01em;
	color:          azure;
}

.pcta__heading-accent {
	color: var(--cp-cyan, #00f5ff);
	text-shadow:
		0 0 28px rgba(0, 245, 255, 0.45),
		0 0 64px rgba(0, 245, 255, 0.18);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB COPY
   ═══════════════════════════════════════════════════════════════════════════ */

.pcta__sub {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size:   clamp(0.82rem, 1.3vw, 0.96rem);
	line-height: 1.72;
	color:       rgba(255, 255, 255, 0.48);
	margin:      clamp(0.25rem, 1vw, 0.5rem) 0 0;
	max-width:   54ch;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION ZONE
   ═══════════════════════════════════════════════════════════════════════════ */

.pcta__action {
	display:        flex;
	flex-direction: column;
	align-items:    center;
	gap:            1.1rem;
	margin-top:     clamp(1rem, 3vw, 1.75rem);
}

/* ── Trust note ── */
.pcta__trust {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.58rem, 0.85vw, 0.7rem);
	letter-spacing: 0.12em;
	color:          rgba(255, 255, 255, 0.26);
	margin:         0;
	text-transform: uppercase;
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION — collapse all entrance animations and kill pulse
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.pcta__status,
	.pcta__tag,
	.pcta__heading,
	.pcta__sub,
	.pcta__action {
		opacity:    1 !important;
		transform:  none !important;
		transition: none !important;
	}

	.pcta__status-dot {
		animation: none !important;
	}
}
</style>
