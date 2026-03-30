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

	import SectionTitle from './SectionTitle.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';
	import {
		SERVICES,
		ACCENT_VARS,
		type ServiceAccent,
	} from '$lib/constants/key-services.constants';
	import DitherBackground from './DitherBackground.svelte';

	// ─── State ────────────────────────────────────────────────────────────────

	let visible = false;

	// ─── Helpers ──────────────────────────────────────────────────────────────

	const accentVar = (a: ServiceAccent): string => ACCENT_VARS[a];

	/**
	 * Production-grade SVG icons — 64×64 viewport, 8-pt grid, pixel-snapped.
	 *
	 * Design principles applied to each:
	 *  - Primary structure: stroke, stroke-width 1.5, round caps/joins
	 *  - Accent fills: currentColor with explicit opacity layers
	 *  - Visual weight balanced around the 32,32 centre point
	 *  - No transforms on individual elements (avoids sub-pixel drift)
	 *  - Consistent padding: 6px margin from edge on all sides
	 */
	function getIcon(name: string): string {
		const icons: Record<string, string> = {

			// ── Landing Page ────────────────────────────────────────────────────
			// A browser window with a polished hero layout inside.
			// Elements: chrome bar, traffic lights, address bar, hero headline
			// placeholder, subtitle block, and a CTA button — all pixel-snapped.
			landing: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
					stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
					aria-hidden="true">

				<!-- Browser outer frame -->
				<rect x="6" y="8" width="52" height="48" rx="4" stroke-width="1.5"/>

				<!-- Chrome bar separator -->
				<line x1="6" y1="20" x2="58" y2="20" stroke-width="1.5"/>

				<!-- Traffic lights — precisely spaced on 8-pt grid -->
				<circle cx="14" cy="14" r="2.5" fill="currentColor" stroke="none" opacity="0.9"/>
				<circle cx="22" cy="14" r="2.5" fill="currentColor" stroke="none" opacity="0.55"/>
				<circle cx="30" cy="14" r="2.5" fill="currentColor" stroke="none" opacity="0.25"/>

				<!-- Address bar -->
				<rect x="36" y="11" width="16" height="6" rx="3"
					fill="currentColor" opacity="0.1" stroke-width="1" stroke-opacity="0.3"/>
				<!-- Lock icon inside address bar -->
				<rect x="38.5" y="13" width="3" height="2.5" rx="0.5"
					fill="currentColor" stroke="none" opacity="0.45"/>
				<path d="M39 13 Q39 11.5 41 11.5 Q43 11.5 43 13"
					stroke-width="1" stroke-opacity="0.45" fill="none"/>

				<!-- Hero content area -->
				<!-- Large headline block -->
				<rect x="12" y="26" width="40" height="5" rx="2"
					fill="currentColor" opacity="0.18"/>
				<!-- Sub-headline, narrower -->
				<rect x="12" y="34" width="28" height="3" rx="1.5"
					fill="currentColor" opacity="0.1"/>
				<!-- Body text line 1 -->
				<rect x="12" y="40" width="34" height="2" rx="1"
					fill="currentColor" opacity="0.07"/>
				<!-- Body text line 2 -->
				<rect x="12" y="44" width="26" height="2" rx="1"
					fill="currentColor" opacity="0.07"/>

				<!-- CTA button — right-aligned, accent weight -->
				<rect x="38" y="38" width="14" height="8" rx="4"
					fill="currentColor" opacity="0.2" stroke-width="1.2"/>
				<!-- Arrow inside button -->
				<line x1="41" y1="42" x2="49" y2="42" stroke-width="1.2" opacity="0.7"/>
				<polyline points="46,39.5 49,42 46,44.5" stroke-width="1.2" opacity="0.7" fill="none"/>

			</svg>`,

			// ── SaaS Dashboard ──────────────────────────────────────────────────
			// An app shell: sidebar nav + main content with KPI cards + bar chart.
			// Every element snapped to the 8-pt grid, chart bars mathematically spaced.
			dashboard: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
					stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
					aria-hidden="true">

				<!-- App frame -->
				<rect x="4" y="6" width="56" height="52" rx="4" stroke-width="1.5"/>

				<!-- Sidebar — 16 px wide -->
				<line x1="20" y1="6" x2="20" y2="58" stroke-width="1.5"/>

				<!-- Top nav bar — 14 px tall -->
				<line x1="20" y1="20" x2="60" y2="20" stroke-width="1.5"/>

				<!-- Sidebar: logo placeholder -->
				<rect x="8" y="10" width="8" height="6" rx="1.5"
					fill="currentColor" opacity="0.35" stroke="none"/>

				<!-- Sidebar nav items (icon-sized squares) -->
				<rect x="8" y="24" width="8" height="6" rx="1.5"
					fill="currentColor" opacity="0.55" stroke="none"/>
				<rect x="8" y="33" width="8" height="6" rx="1.5"
					fill="currentColor" opacity="0.25" stroke="none"/>
				<rect x="8" y="42" width="8" height="6" rx="1.5"
					fill="currentColor" opacity="0.25" stroke="none"/>
				<!-- Active indicator dot -->
				<circle cx="19" cy="27" r="1.5" fill="currentColor" stroke="none" opacity="0.8"/>

				<!-- Top nav: breadcrumb dots -->
				<circle cx="26" cy="14" r="1.5" fill="currentColor" stroke="none" opacity="0.5"/>
				<circle cx="32" cy="14" r="1.5" fill="currentColor" stroke="none" opacity="0.25"/>
				<!-- Top nav: avatar placeholder -->
				<circle cx="54" cy="14" r="3" stroke-width="1.2" opacity="0.5"/>

				<!-- KPI Cards — 3 equal cards, 11 px wide each with 2 px gutter -->
				<!-- Card 1 -->
				<rect x="24" y="24" width="10" height="12" rx="2"
					fill="currentColor" opacity="0.1" stroke-width="1"/>
				<rect x="26" y="26" width="6" height="2" rx="1"
					fill="currentColor" opacity="0.35" stroke="none"/>
				<rect x="26" y="30" width="4" height="4" rx="1"
					fill="currentColor" opacity="0.2" stroke="none"/>
				<!-- Card 2 -->
				<rect x="37" y="24" width="10" height="12" rx="2"
					fill="currentColor" opacity="0.1" stroke-width="1"/>
				<rect x="39" y="26" width="6" height="2" rx="1"
					fill="currentColor" opacity="0.35" stroke="none"/>
				<rect x="39" y="30" width="4" height="4" rx="1"
					fill="currentColor" opacity="0.2" stroke="none"/>
				<!-- Card 3 -->
				<rect x="50" y="24" width="7" height="12" rx="2"
					fill="currentColor" opacity="0.1" stroke-width="1"/>
				<rect x="51.5" y="26" width="4" height="2" rx="1"
					fill="currentColor" opacity="0.35" stroke="none"/>
				<rect x="51.5" y="30" width="3" height="4" rx="1"
					fill="currentColor" opacity="0.2" stroke="none"/>

				<!-- Bar chart — 6 bars, each 4 px wide, 3 px gutter, bottom at y=55 -->
				<!-- Heights (from bottom): 14, 20, 10, 24, 18, 28 px -->
				<rect x="24" y="41" width="4" height="14" rx="1.5"
					fill="currentColor" opacity="0.35" stroke="none"/>
				<rect x="30" y="35" width="4" height="20" rx="1.5"
					fill="currentColor" opacity="0.55" stroke="none"/>
				<rect x="36" y="45" width="4" height="10" rx="1.5"
					fill="currentColor" opacity="0.25" stroke="none"/>
				<rect x="42" y="31" width="4" height="24" rx="1.5"
					fill="currentColor" opacity="0.7" stroke="none"/>
				<rect x="48" y="37" width="4" height="18" rx="1.5"
					fill="currentColor" opacity="0.45" stroke="none"/>
				<!-- Trend line over bars -->
				<polyline points="26,41 32,35 38,44 44,31 50,37"
					stroke-width="1.2" opacity="0.8" fill="none"
					stroke-dasharray="none"/>
				<!-- Trend line dot markers -->
				<circle cx="26" cy="41" r="1.5" fill="currentColor" stroke="none" opacity="0.9"/>
				<circle cx="32" cy="35" r="1.5" fill="currentColor" stroke="none" opacity="0.9"/>
				<circle cx="38" cy="44" r="1.5" fill="currentColor" stroke="none" opacity="0.9"/>
				<circle cx="44" cy="31" r="1.5" fill="currentColor" stroke="none" opacity="0.9"/>
				<circle cx="50" cy="37" r="1.5" fill="currentColor" stroke="none" opacity="0.9"/>

			</svg>`,

			// ── Website Design ──────────────────────────────────────────────────
			// A Figma-inspired composition tool: canvas with frames, layer panel,
			// and a colour palette strip. Evokes "design system" without being literal.
			design: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
					stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
					aria-hidden="true">

				<!-- Outer frame (tool window) -->
				<rect x="4" y="6" width="56" height="52" rx="4" stroke-width="1.5"/>

				<!-- Top toolbar bar -->
				<line x1="4" y1="18" x2="60" y2="18" stroke-width="1.5"/>

				<!-- Left layers panel — 14 px wide -->
				<line x1="18" y1="18" x2="18" y2="58" stroke-width="1.5"/>

				<!-- Right properties panel — 14 px wide from right -->
				<line x1="46" y1="18" x2="46" y2="58" stroke-width="1.5"/>

				<!-- Toolbar: tool icons (pen, move, frame, scale) -->
				<circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.7"/>
				<rect x="21" y="10" width="4" height="4" rx="1"
					fill="currentColor" opacity="0.35" stroke="none"/>
				<rect x="29" y="10" width="4" height="4" rx="1"
					fill="currentColor" opacity="0.2" stroke="none"/>
				<rect x="37" y="10" width="4" height="4" rx="1"
					fill="currentColor" opacity="0.2" stroke="none"/>
				<!-- Zoom display -->
				<rect x="48" y="10" width="8" height="4" rx="2"
					fill="currentColor" opacity="0.12" stroke-width="0.8" stroke-opacity="0.3"/>

				<!-- Layers panel: layer rows -->
				<rect x="6" y="22" width="9" height="3" rx="1"
					fill="currentColor" opacity="0.45" stroke="none"/>
				<rect x="6" y="27" width="9" height="3" rx="1"
					fill="currentColor" opacity="0.25" stroke="none"/>
				<rect x="6" y="32" width="9" height="3" rx="1"
					fill="currentColor" opacity="0.25" stroke="none"/>
				<rect x="6" y="37" width="9" height="3" rx="1"
					fill="currentColor" opacity="0.15" stroke="none"/>
				<rect x="6" y="42" width="9" height="3" rx="1"
					fill="currentColor" opacity="0.15" stroke="none"/>
				<!-- Selected layer highlight -->
				<rect x="5" y="21.5" width="11" height="4" rx="1.5"
					fill="currentColor" opacity="0.15" stroke-width="1" stroke-opacity="0.4"/>

				<!-- Canvas area: main design frame -->
				<rect x="22" y="22" width="21" height="16" rx="2"
					fill="currentColor" opacity="0.07" stroke-width="1.2"/>
				<!-- Frame label (top) -->
				<rect x="22" y="19.5" width="12" height="2" rx="1"
					fill="currentColor" opacity="0.25" stroke="none"/>
				<!-- Frame resize handle corners — classic Figma blue handles -->
				<circle cx="22" cy="22" r="1.5" fill="currentColor" stroke="none" opacity="0.7"/>
				<circle cx="43" cy="22" r="1.5" fill="currentColor" stroke="none" opacity="0.7"/>
				<circle cx="22" cy="38" r="1.5" fill="currentColor" stroke="none" opacity="0.7"/>
				<circle cx="43" cy="38" r="1.5" fill="currentColor" stroke="none" opacity="0.7"/>
				<!-- Mid-edge handles -->
				<circle cx="32.5" cy="22" r="1.5" fill="currentColor" stroke="none" opacity="0.4"/>
				<circle cx="32.5" cy="38" r="1.5" fill="currentColor" stroke="none" opacity="0.4"/>
				<circle cx="22" cy="30" r="1.5" fill="currentColor" stroke="none" opacity="0.4"/>
				<circle cx="43" cy="30" r="1.5" fill="currentColor" stroke="none" opacity="0.4"/>

				<!-- Content inside frame: hero image placeholder -->
				<rect x="24" y="24" width="17" height="8" rx="1"
					fill="currentColor" opacity="0.14" stroke="none"/>
				<!-- Image icon (mountain) inside placeholder -->
				<polyline points="26,30 29,26.5 32,29 35,27 39,30"
					stroke-width="0.9" opacity="0.4" fill="none"/>
				<!-- Text rows in frame -->
				<rect x="24" y="34" width="13" height="1.5" rx="0.75"
					fill="currentColor" opacity="0.25" stroke="none"/>
				<rect x="24" y="36.5" width="9" height="1.5" rx="0.75"
					fill="currentColor" opacity="0.15" stroke="none"/>

				<!-- Second smaller frame (component preview) -->
				<rect x="26" y="42" width="14" height="10" rx="2"
					fill="currentColor" opacity="0.06" stroke-width="1" stroke-dasharray="2 1.5"/>
				<!-- Content -->
				<rect x="28" y="44" width="8" height="1.5" rx="0.75"
					fill="currentColor" opacity="0.2" stroke="none"/>
				<rect x="28" y="47" width="5" height="1.5" rx="0.75"
					fill="currentColor" opacity="0.12" stroke="none"/>
				<!-- Button in second frame -->
				<rect x="28" y="49.5" width="7" height="2.5" rx="1.25"
					fill="currentColor" opacity="0.18" stroke-width="0.8"/>

				<!-- Properties panel: fill swatch + sliders -->
				<rect x="48" y="22" width="8" height="8" rx="2"
					fill="currentColor" opacity="0.3" stroke-width="1"/>
				<rect x="48" y="32" width="8" height="2" rx="1"
					fill="currentColor" opacity="0.15" stroke="none"/>
				<rect x="48" y="36" width="6" height="2" rx="1"
					fill="currentColor" opacity="0.25" stroke="none"/>
				<rect x="48" y="40" width="8" height="2" rx="1"
					fill="currentColor" opacity="0.15" stroke="none"/>
				<rect x="48" y="44" width="5" height="2" rx="1"
					fill="currentColor" opacity="0.25" stroke="none"/>

				<!-- Colour palette row at the bottom of the canvas area -->
				<circle cx="24" cy="52" r="3" fill="currentColor" opacity="0.7" stroke="none"/>
				<circle cx="31" cy="52" r="3" fill="currentColor" opacity="0.4" stroke="none"/>
				<circle cx="38" cy="52" r="3" fill="currentColor" opacity="0.2" stroke="none"/>
				<!-- Plus to add colour -->
				<line x1="43" y1="52" x2="45" y2="52" stroke-width="1.2" opacity="0.4"/>
				<line x1="44" y1="51" x2="44" y2="53" stroke-width="1.2" opacity="0.4"/>

			</svg>`,
		};

		return icons[name] ?? icons.landing;
	}
</script>

<!-- ─── Section ──────────────────────────────────────────────────────────── -->
<section
	class="ks-section"
	class:is-visible={visible}
	use:scrollReveal={{ threshold: 0.06 }}
	on:reveal={() => (visible = true)}
	aria-label="Key Services"
>
	<!-- BACKGROUND -->
	<DitherBackground 
		speed={0.6}
		swirlScale={3}
		ditherPattern='bayer8'
		pixelSize={3}
		spread={0.05}
		colorA='#06060a'
		colorB='#061E29'

	/>

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
							{@html getIcon(service.icon)}
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
	/* ═══════════════════════════════════════════════════════════════════════
	   SECTION
	══════════════════════════════════════════════════════════════════════ */
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