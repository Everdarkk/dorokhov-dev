<script lang="ts">
	/**
	 * ProfileHeroSection — "IDENTITY_MATRIX"
	 *
	 * Full-viewport (min-height: 100dvh) profile page hero for /profile.
	 *
	 * Layout: photo LEFT — text RIGHT on desktop (inverted from main hero).
	 * Collapses to single column on mobile with text first, photo second.
	 *
	 * LCP strategy:
	 *   • Photo: loading="eager" fetchpriority="high" decoding="async"
	 *   • Background (NeatBackground) deferred behind requestIdleCallback
	 *     so the main paint is not blocked by WebGL init.
	 *
	 * Entrance: same @keyframes dhEnter + .is-mounted pattern as
	 * hero-section.svelte and deploys-hero-section.svelte.
	 */

	import { onMount }        from 'svelte';
	import NeatBackground      from '$lib/components/backgrounds/neat-background.svelte';
	import CyberButton         from '$lib/components/common/cyber-button.svelte';
	import developerPhoto      from '$lib/assets/images/od-2.webp';
	import {
		PROFILE_HERO_ACTIONS,
		PROFILE_HERO_BACKGROUND,
		PROFILE_HERO_COPY,
		PROFILE_HERO_CORNERS,
		PROFILE_HERO_IMAGE,
		PROFILE_STACK_GROUPS,
		PROFILE_FACTS,
	} from '$lib/constants/profile-hero';

	let mounted        = false;
	let showBackground = false;

	onMount((): (() => void) => {
		const rafId = requestAnimationFrame(() => { mounted = true; });

		let idleId:    number | null = null;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let disposed   = false;

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

<!-- ═══════════════════════════════════════════════════════════════════════════
     SECTION
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	class="ph"
	class:is-mounted={mounted}
	aria-labelledby="ph-heading"
>
	<!-- NeatBackground (WebGL2 mesh gradient) — deferred, low-power config -->
	{#if showBackground}
		<NeatBackground
			speed={PROFILE_HERO_BACKGROUND.speed}
			flowScale={PROFILE_HERO_BACKGROUND.flowScale}
			colorPressure={PROFILE_HERO_BACKGROUND.colorPressure}
			grain={PROFILE_HERO_BACKGROUND.grain}
			colors={[...PROFILE_HERO_BACKGROUND.colors]}
		/>
	{/if}

	<!-- CRT scanlines -->
	<div class="ph__scanlines" aria-hidden="true"></div>

	<!-- Radial spotlight — centred on the photo side -->
	<div class="ph__spotlight" aria-hidden="true"></div>

	<!-- ═══════════════════════════════════════════════════════════════════════
	     INNER GRID
	     ═══════════════════════════════════════════════════════════════════════ -->
	<div class="ph__inner">

		<!-- ── LEFT: photo ─────────────────────────────────────────────────── -->
		<div class="ph__photo-col">

			<div class="ph__photo-wrap">
				<!-- Scan label -->
				<div class="ph__photo-label" aria-hidden="true">{PROFILE_HERO_COPY.photoLabel}</div>

				<!-- Corner brackets -->
				{#each PROFILE_HERO_CORNERS as corner (corner)}
					<div class="ph__corner ph__corner--{corner}" aria-hidden="true"></div>
				{/each}

				<!-- Photo frame -->
				<div class="ph__photo-frame">
					<!--
						LCP critical image:
						• loading="eager"     — don't defer this image
						• fetchpriority="high" — hint browser to load first
						• decoding="async"    — free main thread after fetch
					-->
					<img
						src={developerPhoto}
						alt={PROFILE_HERO_COPY.photoAlt}
						loading="eager"
						fetchpriority="high"
						decoding="async"
						class="ph__photo-img"
						width={PROFILE_HERO_IMAGE.width}
						height={PROFILE_HERO_IMAGE.height}
					/>
					<!-- Colour-grade overlays (same recipe as hero) -->
					<div class="ph__photo-grade"   aria-hidden="true"></div>
					<div class="ph__photo-scanline" aria-hidden="true"></div>
				</div>

				<!-- Status badge — below the photo frame -->
				<div class="ph__status" aria-label="Availability status">
					<span class="ph__status-dot" aria-hidden="true"></span>
					{PROFILE_HERO_COPY.availabilityLabel}
				</div>
			</div>

		</div><!-- /.ph__photo-col -->

		<!-- ── RIGHT: text ─────────────────────────────────────────────────── -->
		<div class="ph__text-col">

			<!-- Eyebrow label -->
			<div class="ph__label" aria-hidden="true">
				<span class="ph__label-slash">// </span>{PROFILE_HERO_COPY.sectionLabel}
			</div>

			<!-- Page h1 — full name for maximum SEO signal on /profile -->
			<h1 class="ph__heading" id="ph-heading">
				<span class="ph__heading-line ph__heading-line--name">{PROFILE_HERO_COPY.heading.name}</span>
				<span class="ph__heading-line ph__heading-line--surname">{PROFILE_HERO_COPY.heading.surname}</span>
				<span class="ph__heading-line ph__heading-line--role">{PROFILE_HERO_COPY.heading.role}</span>
			</h1>

			<!-- Gradient rule — matches SectionTitle elaborate variant -->
			<div class="ph__rule" aria-hidden="true"></div>

			<!-- Bio — two focused paragraphs -->
			<div class="ph__bio">
				{#each PROFILE_HERO_COPY.bio as paragraph (paragraph)}
					<p>{paragraph}</p>
				{/each}
			</div>

			<!-- Tech stack — grouped by layer -->
			<div class="ph__stack" aria-label="Technology stack">
				{#each PROFILE_STACK_GROUPS as group (group.category)}
					<div class="ph__stack-group ph__stack-group--{group.accent}">
						<span class="ph__stack-label" aria-hidden="true">{group.category}</span>
						<ul class="ph__stack-pills" role="list">
							{#each group.items as item (item)}
								<li class="ph__stack-pill">{item}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<!-- Quick facts -->
			<ul class="ph__facts" aria-label="Quick facts">
				{#each PROFILE_FACTS as fact (fact.label)}
					<li class="ph__fact">
						<strong class="ph__fact-value">{fact.value}</strong>
						<span  class="ph__fact-label">{fact.label}</span>
					</li>
				{/each}
			</ul>

			<!-- CTA buttons -->
			<div class="ph__actions">
				{#each PROFILE_HERO_ACTIONS as action (action.label)}
					<CyberButton
						variant={action.variant}
						href={action.href}
						ariaLabel={action.ariaLabel}
					>
						{action.label}
					</CyberButton>
				{/each}
			</div>

		</div><!-- /.ph__text-col -->

	</div><!-- /.ph__inner -->

</section>


<style>
/* ═══════════════════════════════════════════════════════════════════════════
   SECTION SHELL
   ═══════════════════════════════════════════════════════════════════════════ */

.ph {
	position: relative;
	width: 100%;
	min-height: 100dvh;
	display: flex;
	align-items: center;
	background: var(--cp-bg, #06060a);
	overflow: hidden;
}

/* CRT scanlines — identical recipe across all sections */
.ph__scanlines {
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

/* Spotlight — biased left toward the photo */
.ph__spotlight {
	position: absolute;
	inset: 0;
	background: radial-gradient(
		ellipse 55% 65% at 28% 50%,
		rgba(0, 245, 255, 0.05) 0%,
		transparent 70%
	);
	pointer-events: none;
	z-index: 1;
}

/* ═══════════════════════════════════════════════════════════════════════════
   INNER GRID
   ═══════════════════════════════════════════════════════════════════════════ */

.ph__inner {
	position: relative;
	z-index: 2;
	width: 100%;
	max-width: var(--max-w, 1400px);
	margin: 0 auto;
	padding: calc(var(--nav-h, 5rem) + clamp(2.5rem, 5vw, 4rem))
	         clamp(1rem, 4vw, 3rem)
	         clamp(3rem, 6vw, 5rem);
	display: grid;
	grid-template-columns: 5fr 7fr;
	gap: clamp(3rem, 6vw, 6rem);
	align-items: center;
}

@media (max-width: 900px) {
	.ph__inner {
		grid-template-columns: 1fr;
		gap: clamp(2.5rem, 6vw, 3.5rem);
	}

	/* Text column first on mobile for better UX + LCP heading */
	.ph__photo-col { order: 2; }
	.ph__text-col  { order: 1; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENTRANCE ANIMATIONS — same @keyframes + .is-mounted pattern as hero
   ═══════════════════════════════════════════════════════════════════════════ */

.ph__photo-wrap,
.ph__label,
.ph__heading-line,
.ph__rule,
.ph__bio,
.ph__stack,
.ph__facts,
.ph__actions {
	opacity: 0;
	transform: translateY(24px);
}

/* Photo enters from the right (same as hero's heroEnterRight) */
.ph__photo-wrap {
	transform: translateX(32px) scale(0.97);
}

.is-mounted .ph__photo-wrap      { animation: phEnterRight 0.7s cubic-bezier(0.22,1,0.36,1) forwards 0.1s; }
.is-mounted .ph__label           { animation: phEnter 0.55s ease forwards 0.05s; }
.is-mounted .ph__heading-line--name   { animation: phEnter 0.6s  ease forwards 0.12s; }
.is-mounted .ph__heading-line--surname{ animation: phEnter 0.6s  ease forwards 0.20s; }
.is-mounted .ph__heading-line--role   { animation: phEnter 0.6s  ease forwards 0.28s; }
.is-mounted .ph__rule            { animation: phEnter 0.5s  ease forwards 0.35s; }
.is-mounted .ph__bio             { animation: phEnter 0.55s ease forwards 0.42s; }
.is-mounted .ph__stack           { animation: phEnter 0.55s ease forwards 0.52s; }
.is-mounted .ph__facts           { animation: phEnter 0.5s  ease forwards 0.62s; }
.is-mounted .ph__actions         { animation: phEnter 0.5s  ease forwards 0.72s; }

@keyframes phEnter {
	from { opacity: 0; transform: translateY(24px); }
	to   { opacity: 1; transform: translateY(0);    }
}

@keyframes phEnterRight {
	from { opacity: 0; transform: translateX(32px) scale(0.97); }
	to   { opacity: 1; transform: translateX(0)    scale(1);    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHOTO COLUMN
   ═══════════════════════════════════════════════════════════════════════════ */

.ph__photo-col {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

@media (max-width: 900px) {
	.ph__photo-col {
		align-items: center;
	}
}

.ph__photo-wrap {
	position: relative;
	width: 100%;
	max-width: 380px;
	padding: 1.25rem;
}

@media (max-width: 900px) {
	.ph__photo-wrap {
		max-width: 280px;
	}
}

/* Scan label — top-left of the photo wrap */
.ph__photo-label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: 0.6rem;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	margin-bottom: 0.5rem;
	padding-left: 2px;
}

/* Corner brackets — same pattern as hero and testimonials */
.ph__corner {
	position: absolute;
	width: 20px;
	height: 20px;
	pointer-events: none;
	z-index: 2;
	transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
	opacity: 0.5;
}

.ph__photo-wrap:hover .ph__corner {
	width: 28px;
	height: 28px;
	opacity: 1;
}

.ph__corner--tl { top: 0; left: 0;     border-top:    2px solid var(--cp-pink, #ff0055); border-left:   2px solid var(--cp-pink, #ff0055); }
.ph__corner--tr { top: 0; right: 0;    border-top:    2px solid var(--cp-pink, #ff0055); border-right:  2px solid var(--cp-pink, #ff0055); }
.ph__corner--bl { bottom: 0; left: 0;  border-bottom: 2px solid var(--cp-pink, #ff0055); border-left:   2px solid var(--cp-pink, #ff0055); }
.ph__corner--br { bottom: 0; right: 0; border-bottom: 2px solid var(--cp-pink, #ff0055); border-right:  2px solid var(--cp-pink, #ff0055); }

/* Photo frame */
.ph__photo-frame {
	position: relative;
	width: 100%;
	aspect-ratio: 4 / 5;
	overflow: hidden;
	border: 1px solid rgba(255, 0, 85, 0.3);
	box-shadow:
		0 0 30px rgba(255, 0, 85, 0.12),
		inset 0 0 20px rgba(255, 0, 85, 0.04);
}

.ph__photo-img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center top;
}

/* Colour-grade overlay — same treatment as hero */
.ph__photo-grade {
	position: absolute;
	inset: 0;
	background: linear-gradient(
		135deg,
		rgba(255, 0, 85, 0.08) 0%,
		transparent 50%,
		rgba(0, 245, 255, 0.06) 100%
	);
	mix-blend-mode: color;
	pointer-events: none;
}

/* Scan-line animation across the photo */
.ph__photo-scanline {
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		to bottom,
		transparent           0px,
		transparent           2px,
		rgba(255, 0, 85, 0.03) 2px,
		rgba(255, 0, 85, 0.03) 3px
	);
	pointer-events: none;
	animation: phPhotoScan 10s linear infinite;
}

@keyframes phPhotoScan {
	0%   { background-position: 0 0; }
	100% { background-position: 0 120px; }
}

/* Status badge */
.ph__status {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.85rem;
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.58rem, 0.9vw, 0.66rem);
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--cp-lime, #00ff88);
	opacity: 0.85;
}

.ph__status-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--cp-lime, #00ff88);
	box-shadow: 0 0 8px rgba(0, 255, 136, 0.7);
	animation: phDotBlink 2.5s ease-in-out infinite;
	flex-shrink: 0;
}

@keyframes phDotBlink {
	0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(0, 255, 136, 0.7); }
	50%       { opacity: 0.3; box-shadow: 0 0 2px rgba(0, 255, 136, 0.2); }
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEXT COLUMN
   ═══════════════════════════════════════════════════════════════════════════ */

.ph__text-col {
	display: flex;
	flex-direction: column;
	gap: clamp(1.1rem, 2.5vw, 1.7rem);
	min-width: 0;
}

/* ── Eyebrow label ── */
.ph__label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 1.2vw, 0.75rem);
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	display: flex;
	align-items: center;
	gap: 0.3em;
}

.ph__label-slash {
	color: var(--cp-cyan, #00f5ff);
}

/* ── Heading ── */
.ph__heading {
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0;
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-weight: 400;
	line-height: 1.05;
	text-transform: uppercase;
}

.ph__heading-line {
	display: block;
}

.ph__heading-line--name {
	font-size: var(--font-display, clamp(2.5rem, 5vw, 3.5rem));
	color: var(--cp-cyan, #00f5ff);
	text-shadow: 0 0 32px rgba(0, 245, 255, 0.4);
	animation: phGlow 4s ease-in-out infinite;
}

.ph__heading-line--surname {
	font-size: var(--font-display, clamp(2.5rem, 5vw, 3.5rem));
	color: azure;
	padding-left: clamp(0.5rem, 2vw, 1.5rem);
}

.ph__heading-line--role {
	font-size: clamp(0.9rem, 2.2vw, 1.4rem);
	color: var(--cp-pink, #ff0055);
	text-shadow: 0 0 22px rgba(255, 0, 85, 0.4);
	padding-left: clamp(1rem, 3vw, 2.5rem);
	margin-top: 0.3em;
}

@keyframes phGlow {
	0%, 100% { text-shadow: 0 0 32px rgba(0, 245, 255, 0.4),  0 0 64px rgba(0, 245, 255, 0.15); }
	50%       { text-shadow: 0 0 48px rgba(0, 245, 255, 0.65), 0 0 96px rgba(0, 245, 255, 0.25); }
}

/* ── Rule ── */
.ph__rule {
	width: clamp(3rem, 8vw, 5rem);
	height: 2px;
	background: linear-gradient(90deg, var(--cp-cyan, #00f5ff), transparent);
}

/* ── Bio ── */
.ph__bio {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.ph__bio p {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.82rem, 1.3vw, 0.96rem);
	line-height: 1.75;
	color: rgba(255, 255, 255, 0.58);
	margin: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TECH STACK
   ═══════════════════════════════════════════════════════════════════════════ */

.ph__stack {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
}

.ph__stack-group {
	display: flex;
	align-items: baseline;
	gap: 0.65rem;
	flex-wrap: wrap;
}

.ph__stack-label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: 0.58rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	flex-shrink: 0;
	min-width: 5.5rem;
	opacity: 0.55;
}

.ph__stack-group--cyan   .ph__stack-label { color: var(--cp-cyan,   #00f5ff); }
.ph__stack-group--pink   .ph__stack-label { color: var(--cp-pink,   #ff0055); }
.ph__stack-group--purple .ph__stack-label { color: var(--cp-purple, #b300ff); }

.ph__stack-pills {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem;
	padding: 0;
	list-style: none;
}

.ph__stack-pill {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 0.85vw, 0.68rem);
	letter-spacing: 0.1em;
	padding: 0.2rem 0.55rem;
	border: 1px solid;
	transition: opacity 0.2s ease;
}

.ph__stack-group--cyan   .ph__stack-pill {
	color: var(--cp-cyan, #00f5ff);
	border-color: rgba(0, 245, 255, 0.2);
	background: rgba(0, 245, 255, 0.04);
}

.ph__stack-group--pink   .ph__stack-pill {
	color: var(--cp-pink, #ff0055);
	border-color: rgba(255, 0, 85, 0.2);
	background: rgba(255, 0, 85, 0.04);
}

.ph__stack-group--purple .ph__stack-pill {
	color: var(--cp-purple, #b300ff);
	border-color: rgba(179, 0, 255, 0.2);
	background: rgba(179, 0, 255, 0.04);
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUICK FACTS
   ═══════════════════════════════════════════════════════════════════════════ */

.ph__facts {
	display: flex;
	flex-wrap: wrap;
	gap: clamp(1.25rem, 3vw, 2.5rem);
	padding: 0;
	list-style: none;
	border-top: 1px solid rgba(0, 245, 255, 0.08);
	padding-top: clamp(0.75rem, 2vw, 1.25rem);
}

.ph__fact {
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
	position: relative;
}

.ph__fact + .ph__fact::before {
	content: '';
	position: absolute;
	left: calc(-1 * clamp(0.6rem, 1.5vw, 1.25rem));
	top: 50%;
	transform: translateY(-50%);
	width: 1px;
	height: 1.8rem;
	background: linear-gradient(to bottom, transparent, rgba(0, 245, 255, 0.18), transparent);
}

.ph__fact-value {
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-size: clamp(1.4rem, 3vw, 1.9rem);
	font-weight: 400;
	line-height: 1;
	color: var(--cp-cyan, #00f5ff);
	text-shadow: 0 0 14px rgba(0, 245, 255, 0.35);
	letter-spacing: 0.04em;
}

.ph__fact-label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.55rem, 0.82vw, 0.63rem);
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CTA ACTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

.ph__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.ph__photo-wrap,
	.ph__label,
	.ph__heading-line,
	.ph__rule,
	.ph__bio,
	.ph__stack,
	.ph__facts,
	.ph__actions {
		opacity: 1 !important;
		transform: none !important;
		animation: none !important;
	}

	.ph__heading-line--name,
	.ph__status-dot,
	.ph__photo-scanline {
		animation: none !important;
	}

	.ph__status-dot { opacity: 1; }
}
</style>
