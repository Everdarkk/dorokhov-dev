<script lang="ts">
	/**
	 * ProfileApproachSection — "EXECUTION_PROTOCOL"
	 *
	 * The client-first differentiator section on /profile.
	 * Left column: numbered 5-phase process list.
	 * Right column: philosophy block + four differentiator points.
	 *
	 * Animation: scrollReveal action — phases stagger via CSS custom props.
	 * Background: CSS-only, purple glow bottom-right for visual variety.
	 */

	import { scrollReveal } from '$lib/actions';
	import {
		PROFILE_APPROACH_COPY,
		PROFILE_APPROACH_PHASES,
		PROFILE_APPROACH_DIFFERENTIATORS,
	} from '$lib/constants/profile-sections';

	let sectionRevealed = false;
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     SECTION
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	class="papr"
	use:scrollReveal={{ threshold: 0.05, onReveal: () => (sectionRevealed = true) }}
	aria-labelledby="papr-heading"
>
	<!-- CRT scanlines -->
	<div class="papr__scanlines" aria-hidden="true"></div>

	<!-- Accent glow — bottom-right, purple tint -->
	<div class="papr__glow" aria-hidden="true"></div>

	<div class="papr__inner" class:is-revealed={sectionRevealed}>

		<!-- ── LEFT: phases ────────────────────────────────────────────────── -->
		<div class="papr__phases-col">

			<header class="papr__header">
				<div class="papr__label" aria-hidden="true">
					<span class="papr__label-slash">// </span>{PROFILE_APPROACH_COPY.sectionLabel}
				</div>
				<h2 class="papr__heading" id="papr-heading">{PROFILE_APPROACH_COPY.heading}</h2>
				<div class="papr__rule" aria-hidden="true"></div>
				<p class="papr__desc">{PROFILE_APPROACH_COPY.desc}</p>
			</header>

			<ol class="papr__phases" aria-label="Five-phase development process">
				{#each PROFILE_APPROACH_PHASES as phase, i (phase.num)}
					<li
						class="papr__phase papr__phase--{phase.accent}"
						style="--phase-i: {i}"
					>
						<span class="papr__phase-num" aria-hidden="true">{phase.num}</span>
						<div class="papr__phase-content">
							<strong class="papr__phase-title">{phase.title}</strong>
							<p class="papr__phase-desc">{phase.desc}</p>
						</div>
					</li>
				{/each}
			</ol>

		</div><!-- /.papr__phases-col -->

		<!-- ── RIGHT: philosophy + differentiators ─────────────────────────── -->
		<div class="papr__philosophy-col">

			<div class="papr__philosophy">
				<h3 class="papr__philosophy-head">{PROFILE_APPROACH_COPY.philosophyHead}</h3>
				<p class="papr__philosophy-body">{PROFILE_APPROACH_COPY.philosophyBody}</p>
			</div>

			<ul class="papr__diffs" aria-label="Why choose this approach" role="list">
				{#each PROFILE_APPROACH_DIFFERENTIATORS as diff (diff.label)}
					<li class="papr__diff">
						<span class="papr__diff-tick" aria-hidden="true">›</span>
						<span>{diff.label}</span>
					</li>
				{/each}
			</ul>

		</div><!-- /.papr__philosophy-col -->

	</div><!-- /.papr__inner -->

</section>


<style>
/* ═══════════════════════════════════════════════════════════════════════════
   SECTION SHELL
   ═══════════════════════════════════════════════════════════════════════════ */

.papr {
	position: relative;
	width: 100%;
	min-height: 100dvh;
	display: flex;
	align-items: center;
	background: var(--cp-bg, #06060a);
	overflow: hidden;
}

.papr__scanlines {
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

.papr__glow {
	position: absolute;
	inset: 0;
	background: radial-gradient(
		ellipse 50% 50% at 90% 85%,
		rgba(179, 0, 255, 0.04) 0%,
		transparent 70%
	);
	pointer-events: none;
	z-index: 1;
}

.papr::before {
	content: '';
	position: absolute;
	top: 0;
	left: clamp(1rem, 4vw, 3rem);
	right: clamp(1rem, 4vw, 3rem);
	height: 1px;
	background: linear-gradient(90deg, transparent, rgba(179, 0, 255, 0.12), transparent);
	z-index: 2;
}

/* ═══════════════════════════════════════════════════════════════════════════
   INNER GRID
   ═══════════════════════════════════════════════════════════════════════════ */

.papr__inner {
	position: relative;
	z-index: 2;
	width: 100%;
	max-width: var(--max-w, 1400px);
	margin: 0 auto;
	padding: clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem);
	display: grid;
	grid-template-columns: 6fr 4fr;
	gap: clamp(3.5rem, 8vw, 7rem);
	align-items: start;
}

@media (max-width: 960px) {
	.papr__inner {
		grid-template-columns: 1fr;
		gap: clamp(3rem, 7vw, 5rem);
	}
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL-REVEAL ENTRANCE
   ═══════════════════════════════════════════════════════════════════════════ */

.papr__header,
.papr__philosophy-col {
	opacity: 0;
	transform: translateY(28px);
	transition: opacity 0.6s ease, transform 0.6s ease;
}

.papr__phase {
	opacity: 0;
	transform: translateX(-20px);
	transition: opacity 0.5s ease, transform 0.5s ease;
}

.papr__inner.is-revealed .papr__header        { opacity: 1; transform: none; transition-delay: 0.05s; }
.papr__inner.is-revealed .papr__philosophy-col { opacity: 1; transform: none; transition-delay: 0.30s; }

.papr__inner.is-revealed .papr__phase {
	opacity: 1;
	transform: none;
	/* base 0.18s + 0.1s per phase */
	transition-delay: calc(0.18s + var(--phase-i, 0) * 0.1s);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEFT COLUMN
   ═══════════════════════════════════════════════════════════════════════════ */

.papr__phases-col {
	display: flex;
	flex-direction: column;
	gap: clamp(2rem, 4vw, 3rem);
}

/* ── Header ── */
.papr__header {
	display: flex;
	flex-direction: column;
	gap: clamp(0.75rem, 1.8vw, 1.1rem);
}

.papr__label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 1.2vw, 0.75rem);
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	display: flex;
	align-items: center;
	gap: 0.3em;
}

.papr__label-slash {
	color: var(--cp-purple, #b300ff);
}

.papr__heading {
	margin: 0;
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-weight: 400;
	font-size: clamp(2rem, 4.5vw, 3.2rem);
	line-height: 1.1;
	text-transform: uppercase;
	color: azure;
}

.papr__rule {
	width: clamp(3rem, 8vw, 5rem);
	height: 2px;
	background: linear-gradient(90deg, var(--cp-purple, #b300ff), transparent);
}

.papr__desc {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.82rem, 1.3vw, 0.96rem);
	line-height: 1.72;
	color: rgba(255, 255, 255, 0.5);
	margin: 0;
	max-width: 52ch;
}

/* ── Phases list ── */
.papr__phases {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0;
	/* Single left border line connects all phases */
	border-left: 1px solid rgba(179, 0, 255, 0.15);
	margin-left: 1.25rem;
}

.papr__phase {
	display: flex;
	gap: 1.25rem;
	padding: clamp(1rem, 2.5vw, 1.5rem) 0 clamp(1rem, 2.5vw, 1.5rem) clamp(1.25rem, 3vw, 2rem);
	position: relative;
	transition: background 0.2s ease;
}

/* Dot on the left border line */
.papr__phase::before {
	content: '';
	position: absolute;
	left: -5px;
	top: clamp(1.3rem, 3vw, 1.8rem);
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--cp-bg, #06060a);
	border: 1px solid var(--phase-dot, rgba(179, 0, 255, 0.4));
	transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.papr__phase:hover::before {
	border-color: var(--cp-purple, #b300ff);
	box-shadow: 0 0 8px rgba(179, 0, 255, 0.4);
}

/* Accent the dot per phase */
.papr__phase--cyan   { --phase-dot: rgba(0,   245, 255, 0.4); }
.papr__phase--pink   { --phase-dot: rgba(255,   0,  85, 0.4); }
.papr__phase--purple { --phase-dot: rgba(179,   0, 255, 0.4); }
.papr__phase--yellow { --phase-dot: rgba(255, 230,   0, 0.4); }
.papr__phase--green  { --phase-dot: rgba(0,   255, 136, 0.4); }

.papr__phase-num {
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-size: clamp(1.6rem, 3.5vw, 2.2rem);
	font-weight: 400;
	line-height: 1;
	opacity: 0.1;
	flex-shrink: 0;
	color: white;
	user-select: none;
	width: 2.2rem;
	text-align: right;
	padding-top: 0.1em;
}

.papr__phase-content {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

.papr__phase-title {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.78rem, 1.15vw, 0.9rem);
	letter-spacing: 0.12em;
	text-transform: uppercase;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.88);
}

/* Accent color for each phase title */
.papr__phase--cyan   .papr__phase-title { color: var(--cp-cyan,   #00f5ff); }
.papr__phase--pink   .papr__phase-title { color: var(--cp-pink,   #ff0055); }
.papr__phase--purple .papr__phase-title { color: var(--cp-purple, #b300ff); }
.papr__phase--yellow .papr__phase-title { color: var(--cp-yellow, #ffe600); }
.papr__phase--green  .papr__phase-title { color: var(--cp-lime,   #00ff88); }

.papr__phase-desc {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.72rem, 1vw, 0.8rem);
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.45);
	margin: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   RIGHT COLUMN
   ═══════════════════════════════════════════════════════════════════════════ */

.papr__philosophy-col {
	display: flex;
	flex-direction: column;
	gap: clamp(1.75rem, 4vw, 2.5rem);
	/* Sticky on desktop for scroll effect */
	position: sticky;
	top: calc(var(--nav-h, 5rem) + 2rem);
}

@media (max-width: 960px) {
	.papr__philosophy-col {
		position: static;
	}
}

.papr__philosophy {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
	padding: clamp(1.25rem, 3vw, 1.85rem);
	border: 1px solid rgba(179, 0, 255, 0.18);
	background: rgba(179, 0, 255, 0.03);
	position: relative;
}

/* Top-left corner bracket */
.papr__philosophy::before {
	content: '';
	position: absolute;
	top: -1px;
	left: -1px;
	width: 16px;
	height: 16px;
	border-top: 2px solid var(--cp-purple, #b300ff);
	border-left: 2px solid var(--cp-purple, #b300ff);
}

/* Bottom-right corner bracket */
.papr__philosophy::after {
	content: '';
	position: absolute;
	bottom: -1px;
	right: -1px;
	width: 16px;
	height: 16px;
	border-bottom: 2px solid var(--cp-purple, #b300ff);
	border-right: 2px solid var(--cp-purple, #b300ff);
}

.papr__philosophy-head {
	margin: 0;
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.75rem, 1.2vw, 0.9rem);
	letter-spacing: 0.14em;
	text-transform: uppercase;
	font-weight: 600;
	color: var(--cp-purple, #b300ff);
}

.papr__philosophy-body {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.75rem, 1.1vw, 0.84rem);
	line-height: 1.75;
	color: rgba(255, 255, 255, 0.5);
	margin: 0;
}

/* ── Differentiators ── */
.papr__diffs {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
}

.papr__diff {
	display: flex;
	align-items: baseline;
	gap: 0.65rem;
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.72rem, 1vw, 0.8rem);
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.55);
	padding: 0.55rem 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.papr__diff-tick {
	color: var(--cp-purple, #b300ff);
	font-size: 1rem;
	line-height: 1;
	flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.papr__inner .papr__header,
	.papr__inner .papr__phase,
	.papr__inner .papr__philosophy-col {
		opacity: 1 !important;
		transform: none !important;
		transition: none !important;
	}
}
</style>
