<script lang="ts">
	/**
	 * ProfileExpertiseSection — "CAPABILITY_MAP"
	 *
	 * Six-service capability grid for /profile.
	 * Each card shows service label, title, description, and tech pills.
	 *
	 * Animation: scrollReveal action with CSS transition stagger per card.
	 * Background: CSS-only — subtle top-right spotlight for visual separation.
	 */

	import { scrollReveal } from '$lib/actions';
	import {
		PROFILE_EXPERTISE_COPY,
		PROFILE_EXPERTISE_SERVICES,
	} from '$lib/constants/profile-sections';

	let sectionRevealed = false;
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     SECTION
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	class="pexp"
	use:scrollReveal={{ threshold: 0.05, onReveal: () => (sectionRevealed = true) }}
	aria-labelledby="pexp-heading"
>
	<!-- CRT scanlines -->
	<div class="pexp__scanlines" aria-hidden="true"></div>

	<!-- Accent glow — top-right, pink tint -->
	<div class="pexp__glow" aria-hidden="true"></div>

	<div class="pexp__inner" class:is-revealed={sectionRevealed}>

		<!-- ── Header ──────────────────────────────────────────────────────── -->
		<header class="pexp__header">
			<div class="pexp__label" aria-hidden="true">
				<span class="pexp__label-slash">// </span>{PROFILE_EXPERTISE_COPY.sectionLabel}
			</div>
			<h2 class="pexp__heading" id="pexp-heading">{PROFILE_EXPERTISE_COPY.heading}</h2>
			<div class="pexp__rule" aria-hidden="true"></div>
			<p class="pexp__desc">{PROFILE_EXPERTISE_COPY.desc}</p>
		</header>

		<!-- ── Service cards grid ──────────────────────────────────────────── -->
		<ul class="pexp__grid" role="list" aria-label="Service domains">
			{#each PROFILE_EXPERTISE_SERVICES as service, i (service.label)}
				<li
					class="pexp__card pexp__card--{service.accent}"
					style="--card-i: {i}"
				>
					<!-- Accent label -->
					<span class="pexp__card-label" aria-hidden="true">{service.label}</span>

					<!-- Service title -->
					<h3 class="pexp__card-title">{service.title}</h3>

					<!-- Description -->
					<p class="pexp__card-desc">{service.desc}</p>

					<!-- Tech pills -->
					<ul class="pexp__card-stack" role="list" aria-label="Technologies: {service.title}">
						{#each service.stack as tech (tech)}
							<li class="pexp__pill">{tech}</li>
						{/each}
					</ul>

					<!-- Corner accent -->
					<div class="pexp__card-corner" aria-hidden="true"></div>
				</li>
			{/each}
		</ul>

	</div><!-- /.pexp__inner -->

</section>


<style>
/* ═══════════════════════════════════════════════════════════════════════════
   SECTION SHELL
   ═══════════════════════════════════════════════════════════════════════════ */

.pexp {
	position: relative;
	width: 100%;
	min-height: 100dvh;
	display: flex;
	align-items: center;
	background: var(--cp-bg, #06060a);
	overflow: hidden;
}

.pexp__scanlines {
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

/* Accent glow — top-right, pink tint */
.pexp__glow {
	position: absolute;
	inset: 0;
	background: radial-gradient(
		ellipse 55% 45% at 90% 15%,
		rgba(255, 0, 85, 0.035) 0%,
		transparent 70%
	);
	pointer-events: none;
	z-index: 1;
}

/* Section separator */
.pexp::before {
	content: '';
	position: absolute;
	top: 0;
	left: clamp(1rem, 4vw, 3rem);
	right: clamp(1rem, 4vw, 3rem);
	height: 1px;
	background: linear-gradient(90deg, transparent, rgba(255, 0, 85, 0.12), transparent);
	z-index: 2;
}

/* ═══════════════════════════════════════════════════════════════════════════
   INNER LAYOUT
   ═══════════════════════════════════════════════════════════════════════════ */

.pexp__inner {
	position: relative;
	z-index: 2;
	width: 100%;
	max-width: var(--max-w, 1400px);
	margin: 0 auto;
	padding: clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem);
	display: flex;
	flex-direction: column;
	gap: clamp(3rem, 6vw, 5rem);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL-REVEAL ENTRANCE
   ═══════════════════════════════════════════════════════════════════════════ */

.pexp__header,
.pexp__grid {
	opacity: 0;
	transform: translateY(28px);
	transition:
		opacity 0.6s ease,
		transform 0.6s ease;
}

.pexp__inner.is-revealed .pexp__header { opacity: 1; transform: none; transition-delay: 0.05s; }
.pexp__inner.is-revealed .pexp__grid   { opacity: 1; transform: none; transition-delay: 0.18s; }

/* Individual card stagger via CSS custom property --card-i */
.pexp__card {
	opacity: 0;
	transform: translateY(20px);
	transition:
		opacity 0.5s ease,
		transform 0.5s ease;
}

.pexp__inner.is-revealed .pexp__card {
	opacity: 1;
	transform: none;
	/* 0.22s base + 0.08s per card index */
	transition-delay: calc(0.22s + var(--card-i, 0) * 0.08s);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════════════════════ */

.pexp__header {
	display: flex;
	flex-direction: column;
	gap: clamp(0.75rem, 1.8vw, 1.1rem);
	max-width: 54ch;
}

.pexp__label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 1.2vw, 0.75rem);
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	display: flex;
	align-items: center;
	gap: 0.3em;
}

.pexp__label-slash {
	color: var(--cp-pink, #ff0055);
}

.pexp__heading {
	margin: 0;
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-weight: 400;
	font-size: clamp(2rem, 4.5vw, 3.2rem);
	line-height: 1.1;
	text-transform: uppercase;
	color: azure;
}

.pexp__rule {
	width: clamp(3rem, 8vw, 5rem);
	height: 2px;
	background: linear-gradient(90deg, var(--cp-pink, #ff0055), transparent);
}

.pexp__desc {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.82rem, 1.3vw, 0.96rem);
	line-height: 1.72;
	color: rgba(255, 255, 255, 0.5);
	margin: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICE GRID
   ═══════════════════════════════════════════════════════════════════════════ */

.pexp__grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1px;
	list-style: none;
	padding: 0;
	margin: 0;
}

@media (max-width: 1100px) {
	.pexp__grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 600px) {
	.pexp__grid {
		grid-template-columns: 1fr;
	}
}

/* ── Service card ── */
.pexp__card {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
	padding: clamp(1.5rem, 3vw, 2rem);
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	overflow: hidden;
	transition: background 0.25s ease, border-color 0.25s ease;
}

.pexp__card:hover {
	background: rgba(255, 255, 255, 0.04);
}

/* Accent top border per service */
.pexp__card--cyan   { border-top: 2px solid rgba(0,   245, 255, 0.4); }
.pexp__card--pink   { border-top: 2px solid rgba(255,   0,  85, 0.4); }
.pexp__card--purple { border-top: 2px solid rgba(179,   0, 255, 0.4); }
.pexp__card--yellow { border-top: 2px solid rgba(255, 230,   0, 0.4); }
.pexp__card--green  { border-top: 2px solid rgba(0,   255, 136, 0.4); }
.pexp__card--orange { border-top: 2px solid rgba(255, 120,   0, 0.4); }

/* Corner accent — chamfered bottom-right */
.pexp__card-corner {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 20px;
	height: 20px;
	pointer-events: none;
}

.pexp__card--cyan   .pexp__card-corner { border-bottom: 1px solid rgba(0,   245, 255, 0.2); border-right: 1px solid rgba(0,   245, 255, 0.2); }
.pexp__card--pink   .pexp__card-corner { border-bottom: 1px solid rgba(255,   0,  85, 0.2); border-right: 1px solid rgba(255,   0,  85, 0.2); }
.pexp__card--purple .pexp__card-corner { border-bottom: 1px solid rgba(179,   0, 255, 0.2); border-right: 1px solid rgba(179,   0, 255, 0.2); }
.pexp__card--yellow .pexp__card-corner { border-bottom: 1px solid rgba(255, 230,   0, 0.2); border-right: 1px solid rgba(255, 230,   0, 0.2); }
.pexp__card--green  .pexp__card-corner { border-bottom: 1px solid rgba(0,   255, 136, 0.2); border-right: 1px solid rgba(0,   255, 136, 0.2); }
.pexp__card--orange .pexp__card-corner { border-bottom: 1px solid rgba(255, 120,   0, 0.2); border-right: 1px solid rgba(255, 120,   0, 0.2); }

/* Service label (accent colored) */
.pexp__card-label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: 0.58rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	display: block;
}

.pexp__card--cyan   .pexp__card-label { color: var(--cp-cyan,   #00f5ff); }
.pexp__card--pink   .pexp__card-label { color: var(--cp-pink,   #ff0055); }
.pexp__card--purple .pexp__card-label { color: var(--cp-purple, #b300ff); }
.pexp__card--yellow .pexp__card-label { color: var(--cp-yellow, #ffe600); }
.pexp__card--green  .pexp__card-label { color: var(--cp-lime,   #00ff88); }
.pexp__card--orange .pexp__card-label { color: #ff7800; }

/* Service title */
.pexp__card-title {
	margin: 0;
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.82rem, 1.3vw, 1rem);
	font-weight: 600;
	color: rgba(255, 255, 255, 0.9);
	letter-spacing: 0.03em;
	line-height: 1.3;
}

/* Service description */
.pexp__card-desc {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.72rem, 1vw, 0.8rem);
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.45);
	margin: 0;
	flex: 1;
}

/* Tech pills */
.pexp__card-stack {
	display: flex;
	flex-wrap: wrap;
	gap: 0.3rem;
	list-style: none;
	padding: 0;
	margin: 0;
	margin-top: auto;
	padding-top: 0.75rem;
	border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pexp__pill {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: 0.58rem;
	letter-spacing: 0.1em;
	padding: 0.18rem 0.45rem;
	border: 1px solid rgba(255, 255, 255, 0.08);
	color: rgba(255, 255, 255, 0.38);
	background: rgba(255, 255, 255, 0.02);
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.pexp__inner .pexp__header,
	.pexp__inner .pexp__grid,
	.pexp__inner .pexp__card {
		opacity: 1 !important;
		transform: none !important;
		transition: none !important;
	}
}
</style>
