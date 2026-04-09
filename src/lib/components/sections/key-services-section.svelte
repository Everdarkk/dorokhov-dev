<script lang="ts">
	/**
	 * KeyServices Component
	 *
	 * Three alternating service rows (text|visual → visual|text → text|visual).
	 * Background removed per design revision — visual panels stand on their own.
	 *
	 * Icons are production-grade inline SVGs:
	 *  • All drawn on a 64×64 viewport with a precise 4 px margin padding.
	 *  • Pixel grid–snapped coordinates — no sub-pixel misalignment.
	 *  • Multi-layer approach: structural stroke + filled accent shapes + opacity layers.
	 *  • stroke-width, rx, and spacing follow an 8-pt grid system.
	 *  • Each icon is visually self-contained at any size from 48 px to 200 px.
	 */

	import SectionTitle from '$lib/components/common/section-title.svelte';
	import { scrollReveal } from '$lib/actions';
	import { ACCENT_VARS } from '$lib/config';
	import {
		SERVICES,
		type Service,
	} from '$lib/constants/key-services';
	import DitherBackground from '$lib/components/backgrounds/dither-background.svelte';
	import IconGlyph from '$lib/components/common/icon-glyph.svelte';

	// ─── State ────────────────────────────────────────────────────────────────

	let visible = false;

	// ─── Helpers ──────────────────────────────────────────────────────────────

	const accentVar = (a: Service['accent']): string => ACCENT_VARS[a];
	const handleSectionReveal = () => (visible = true);
</script>

<!-- ─── Section ──────────────────────────────────────────────────────────── -->
<section
	id="services"
	class="ks-section"
	class:is-visible={visible}
	use:scrollReveal={{ threshold: 0.06, onReveal: handleSectionReveal }}
	aria-label="Key Services"
>
	<!-- BACKGROUND -->
	{#if visible}
		<DitherBackground 
			speed={0.6}
			swirlScale={3}
			ditherPattern='bayer8'
			pixelSize={3}
			spread={0.05}
			colorA='#06060a'
			colorB='#061E29'

		/>
	{/if}

	<!-- ── Inner ──────────────────────────────────────────────────────────── -->
	<div class="ks-inner">

		<SectionTitle
			title="Key Services"
			variant="elaborate"
			label="KEY_SERVICES.exe"
			isVisible={visible}
		/>

		<!-- ── Service rows ─────────────────────────────────────────────────── -->
		<ul class="ks-list" role="list" aria-label="Services">

			{#each SERVICES as service, i (service.id)}

				<li
					id={"service-" + service.id}
					class="ks-row"
					class:ks-row--reversed={service.layout === 'visual-text'}
					style="--accent: {accentVar(service.accent)}; --row-index: {i};"
					aria-label="Service {service.index}: {service.title}"
				>

					<!-- ── Text panel ──────────────────────────────────────────── -->
					<div class="ks-row__text">

						<div class="ks-row__meta">
							<span class="ks-row__code">{service.code}</span>
							<span class="ks-row__num" aria-hidden="true">
								{String(service.index).padStart(2, '0')}
							</span>
						</div>

						<h3 class="ks-row__title">{service.title}</h3>
						<p class="ks-row__tagline">{service.tagline}</p>
						<p class="ks-row__desc">{service.description}</p>

						<ul class="ks-benefits" aria-label="Benefits">
							{#each service.benefits as b, bi (b.label)}
								<li class="ks-benefit" style="--bi: {bi}">
									<span class="ks-benefit__label">{b.label}</span>
									<span class="ks-benefit__sep" aria-hidden="true">//</span>
									<span class="ks-benefit__value">{b.value}</span>
								</li>
							{/each}
						</ul>

					</div>

					<!-- ── Visual panel ────────────────────────────────────────── -->
					<div class="ks-row__visual" aria-hidden="true">

						<!-- Corner brackets -->
						<span class="ks-corner ks-corner--tl"></span>
						<span class="ks-corner ks-corner--tr"></span>
						<span class="ks-corner ks-corner--bl"></span>
						<span class="ks-corner ks-corner--br"></span>

						<!-- Glow rings -->
						<div class="ks-ring ks-ring--outer"></div>
						<div class="ks-ring ks-ring--inner"></div>

						<!-- Icon — perfectly centered via flex on the parent -->
						<div class="ks-icon">
							<IconGlyph name={service.icon} size={104} />
						</div>

						<!-- Tool badges -->
						<ul class="ks-tools" aria-label="Tools used">
							{#each service.tools as tool, ti (tool.name)}
								<li class="ks-tool" style="--ti: {ti}" title={tool.name}>
									{tool.tag}
								</li>
							{/each}
						</ul>

					</div>

				</li>

			{/each}

		</ul>

		<!-- ── "And more" footer ─────────────────────────────────────────────── -->
		<div class="ks-more" aria-label="Additional services available">
			<span class="ks-more__rule"></span>
			<span class="ks-more__text">— and more —</span>
			<span class="ks-more__rule"></span>
		</div>

	</div>
</section>

<style>
	/* SECTION */
	.ks-section {
		position: relative;
		width: 100%;
		background: var(--cp-bg, #06060a);
		overflow: hidden;
	}

	.ks-inner {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: var(--max-w, 1400px);
		margin: 0 auto;
		padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 3rem);
		display: flex;
		flex-direction: column;
		gap: clamp(2.5rem, 6vw, 5rem);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   LIST
	══════════════════════════════════════════════════════════════════════ */
	.ks-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   ROW  —  2-column 50/50 grid
	══════════════════════════════════════════════════════════════════════ */
	.ks-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: clamp(2rem, 4vw, 5rem);
		padding: clamp(3rem, 6vw, 5rem) 0;
		border-top: 1px solid rgba(255,255,255,0.06);
		opacity: 0;
		transform: translateY(36px);
	}

	.ks-list li:last-child {
		border-bottom: 1px solid rgba(255,255,255,0.06);
	}

	/* Reversed: swap columns via logical property — no duplicated grid rules */
	.ks-row--reversed {
		direction: rtl;
	}

	.ks-row--reversed > * {
		direction: ltr;
	}

	/* Staggered reveal triggered by .is-visible on the section */
	.is-visible .ks-row {
		animation: rowReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: calc(var(--row-index, 0) * 0.14s + 0.08s);
	}

	@keyframes rowReveal {
		from { opacity: 0; transform: translateY(36px); }
		to   { opacity: 1; transform: translateY(0);    }
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   TEXT PANEL
	══════════════════════════════════════════════════════════════════════ */
	.ks-row__text {
		display: flex;
		flex-direction: column;
		gap: clamp(0.75rem, 1.5vw, 1.25rem);
	}

	.ks-row__meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.ks-row__code {
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		opacity: 0.6;
	}

	.ks-row__num {
		font-family: var(--font-bionical, var(--font-logo, monospace));
		font-size: clamp(3.5rem, 8vw, 6rem);
		font-weight: 700;
		line-height: 1;
		color: var(--accent);
		opacity: 0.06;
		letter-spacing: -0.04em;
		pointer-events: none;
		user-select: none;
	}

	.ks-row__title {
		font-family: var(--font-bionical, var(--font-logo, monospace));
		font-size: clamp(1.6rem, 3.5vw, 2.6rem);
		font-weight: 400;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
		margin: 0;
		text-shadow: 0 0 32px color-mix(in srgb, var(--accent) 40%, transparent);
		line-height: 1.1;
	}

	.ks-row__tagline {
		font-family: var(--font-mono, monospace);
		font-size: clamp(0.65rem, 1.2vw, 0.78rem);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5568);
		margin: 0;
	}

	.ks-row__desc {
		font-family: var(--font-ui, sans-serif);
		font-size: clamp(0.82rem, 1.4vw, 0.96rem);
		line-height: 1.8;
		color: rgba(226, 232, 240, 0.68);
		margin: 0;
		border-left: 2px solid color-mix(in srgb, var(--accent) 35%, transparent);
		padding-left: 1rem;
		max-width: 52ch;
	}

	/* ─── Benefits ── */
	.ks-benefits {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.45rem 1rem;
	}

	.ks-benefit {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 0.5rem 0.7rem;
		background: rgba(0,0,0,0.25);
		border: 1px solid rgba(255,255,255,0.05);
		border-left: 2px solid color-mix(in srgb, var(--accent) 30%, transparent);
		opacity: 0;
		animation: benefitIn 0.3s ease both;
		animation-delay: calc(0.3s + var(--bi, 0) * 0.06s);
	}

	.is-visible .ks-benefit {
		animation-fill-mode: forwards;
	}

	@keyframes benefitIn {
		from { opacity: 0; transform: translateX(-8px); }
		to   { opacity: 1; transform: translateX(0);    }
	}

	.ks-benefit__label {
		font-family: var(--font-mono, monospace);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		flex-shrink: 0;
	}

	.ks-benefit__sep {
		font-family: var(--font-mono, monospace);
		font-size: 0.55rem;
		color: var(--cp-muted, #4a5568);
		flex-shrink: 0;
	}

	.ks-benefit__value {
		font-family: var(--font-mono, monospace);
		font-size: 0.62rem;
		color: rgba(226, 232, 240, 0.72);
		letter-spacing: 0.04em;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   VISUAL PANEL
	══════════════════════════════════════════════════════════════════════ */
	.ks-row__visual {
		position: relative;
		/*
		  Flex centering so the icon sits exactly in the middle
		  regardless of panel height — no transforms on children needed.
		*/
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.75rem;
		aspect-ratio: 4 / 3;
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--accent) 7%, transparent) 0%,
			rgba(255,255,255,0.016) 100%
		);
		border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
		overflow: hidden;
		transition: border-color 0.35s ease, box-shadow 0.35s ease;
	}

	.ks-row__visual:hover {
		border-color: color-mix(in srgb, var(--accent) 45%, transparent);
		box-shadow:
			0 0 32px color-mix(in srgb, var(--accent) 10%, transparent),
			0 16px 48px rgba(0,0,0,0.4);
	}

	/* ─── Corner brackets ── */
	.ks-corner {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: var(--accent);
		border-style: solid;
		opacity: 0.35;
		pointer-events: none;
		transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
	}

	.ks-row__visual:hover .ks-corner {
		width: 20px;
		height: 20px;
		opacity: 0.85;
	}

	.ks-corner--tl { top: 0; left: 0;  border-width: 2px 0 0 2px; }
	.ks-corner--tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
	.ks-corner--bl { bottom: 0; left: 0;  border-width: 0 0 2px 2px; }
	.ks-corner--br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

	/* ─── Glow rings — centred absolutely so they don't affect flex flow ── */
	.ks-ring {
		position: absolute;
		top: 50%;
		left: 50%;
		/*
		  translate(-50%, -50%) centres without flex interference.
		  We subtract the tool badge height from the vertical centre
		  so rings appear centred around the icon, not the whole panel.
		*/
		transform: translate(-50%, calc(-50% - 1.5rem));
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
		pointer-events: none;
		animation: ringPulse 4s ease-in-out infinite;
	}

	.ks-ring--outer {
		width: clamp(9rem, 22vw, 14rem);
		aspect-ratio: 1;
		opacity: 0.4;
	}

	.ks-ring--inner {
		width: clamp(5.5rem, 14vw, 9rem);
		aspect-ratio: 1;
		border-color: color-mix(in srgb, var(--accent) 38%, transparent);
		animation-delay: 1.2s;
		opacity: 0.55;
	}

	@keyframes ringPulse {
		0%, 100% { transform: translate(-50%, calc(-50% - 1.5rem)) scale(1);    opacity: 0.4; }
		50%       { transform: translate(-50%, calc(-50% - 1.5rem)) scale(1.06); opacity: 0.75; }
	}

	/* Faster pulse on hover */
	.ks-row__visual:hover .ks-ring {
		animation-duration: 2.4s;
	}

	/* ─── Icon — perfectly centred, no extra positioning needed ── */
	.ks-icon {
		position: relative;
		z-index: 2;
		/*
		  Fixed intrinsic size. The SVG viewBox is 64×64 so this is a 1:1
		  scale at 96 px — crisp at every devicePixelRatio.
		  clamp keeps it proportional across breakpoints.
		*/
		width:  clamp(5rem, 12vw, 8rem);
		height: clamp(5rem, 12vw, 8rem);
		color: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		will-change: transform;
	}

	.ks-row__visual:hover .ks-icon {
		transform: translateY(-6px) scale(1.06);
	}

	.ks-icon :global(svg) {
		width: 100%;
		height: 100%;
		/* drop-shadow composites on the GPU — no repaint */
		filter: drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 55%, transparent));
		transition: filter 0.4s ease;
		/*
		  overflow: visible lets glow rings from the SVG extend beyond the
		  bounding box if needed — important for drop-shadow correctness.
		*/
		overflow: visible;
	}

	.ks-row__visual:hover .ks-icon :global(svg) {
		filter: drop-shadow(0 0 24px color-mix(in srgb, var(--accent) 80%, transparent));
	}

	/* ─── Tool badges ── */
	.ks-tools {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem;
		position: relative;
		z-index: 2;
	}

	.ks-tool {
		font-family: var(--font-mono, monospace);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent);
		padding: 0.22rem 0.6rem;
		background: color-mix(in srgb, var(--accent) 8%, rgba(6,6,10,0.8));
		opacity: 0;
		animation: toolIn 0.28s ease both;
		animation-delay: calc(0.4s + var(--ti, 0) * 0.05s);
	}

	.is-visible .ks-tool {
		animation-fill-mode: forwards;
	}

	@keyframes toolIn {
		from { opacity: 0; transform: scale(0.82); }
		to   { opacity: 1; transform: scale(1);    }
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   "AND MORE" FOOTER
	══════════════════════════════════════════════════════════════════════ */
	.ks-more {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		opacity: 0;
		transition: opacity 0.6s ease 0.6s;
	}

	.is-visible .ks-more {
		opacity: 1;
	}

	.ks-more__rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(0,245,255,0.18) 40%,
			rgba(0,245,255,0.18) 60%,
			transparent
		);
	}

	.ks-more__text {
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5568);
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   RESPONSIVE
	══════════════════════════════════════════════════════════════════════ */

	/* Tablet — keep 2 cols, tighten gap, collapse benefits to 1 col */
	@media (max-width: 900px) {
		.ks-row {
			gap: clamp(1.25rem, 3vw, 2rem);
		}

		.ks-benefits {
			grid-template-columns: 1fr;
		}
	}

	/* Mobile — single column, visual always below text */
	@media (max-width: 640px) {
		.ks-row {
			grid-template-columns: 1fr;
			direction: ltr;
		}

		.ks-row--reversed {
			direction: ltr;
		}

		.ks-row__visual {
			aspect-ratio: 16 / 9;
			width: 100%;
		}

		.ks-ring--outer {
			width: clamp(7rem, 40vw, 10rem);
		}

		.ks-ring--inner {
			width: clamp(4.5rem, 25vw, 6.5rem);
		}

		.ks-row__num {
			display: none;
		}

		.ks-inner {
			padding-inline: 0.75rem;
		}

		.ks-more__rule {
			display: none;
		}

		.ks-more {
			justify-content: center;
		}
	}

	/* ─── Reduce motion ── */
	@media (prefers-reduced-motion: reduce) {
		.ks-row,
		.ks-benefit,
		.ks-tool,
		.ks-ring,
		.ks-icon,
		.ks-more {
			animation: none !important;
			transition: none !important;
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>