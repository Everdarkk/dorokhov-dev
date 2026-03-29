<script lang="ts">
	/**
	 * WorkProcessBackground
	 *
	 * Animated film-grain + ambient glow background.
	 * Zero Canvas, zero rAF, zero JS in the hot path.
	 *
	 * ── How it works ────────────────────────────────────────────────────────
	 *
	 *  GRAIN  — a 64×64 noise PNG (inlined base64, ~9 kB) is tiled and animated
	 *           via `background-position` using `steps(1)` keyframes. Each step
	 *           is an instant jump to a new random offset, mimicking film grain
	 *           flicker. This runs entirely on the GPU compositor thread —
	 *           the driver only shifts a texture pointer. No paint, no layout.
	 *
	 *  GLOW   — a radial-gradient animated with `transform` only (translate +
	 *           scale). Another pure compositor operation. The gradient colour
	 *           tracks the slide accent via a CSS custom property; the browser
	 *           re-evaluates it during style recalc (no paint triggered).
	 *
	 * ── Performance guarantees ──────────────────────────────────────────────
	 *
	 *  • Zero rAF / setInterval after mount.
	 *  • Zero Canvas, no ImageData, no pixel buffer.
	 *  • Animations: `transform` + `background-position` — compositor-only on
	 *    Chrome 36+, Safari 9+, Firefox 54+, all modern Android WebViews.
	 *  • `will-change` declared only on the two animated layers (not the wrapper)
	 *    to avoid unnecessary layer promotion.
	 *  • IntersectionObserver toggles `.is-active`:
	 *      off-screen  →  `animation: none`  →  compositor drops the layers.
	 *      on-screen   →  animations restored → layers recreated.
	 *  • `visibilitychange` sets `--anim-state: paused` when the tab is hidden,
	 *    so the animation timeline freezes in place without dropping the layer.
	 *  • `prefers-reduced-motion`: both animations disabled.
	 *  • Memory: ~9 kB in GPU VRAM (shared noise tile), never grows.
	 *  • No ResizeObserver needed — CSS fills the container natively.
	 *
	 * ── Noise texture ───────────────────────────────────────────────────────
	 *  64×64 RGBA PNG, deterministic seed 1337, uniform random greyscale.
	 *  Generated once offline with Python (struct + zlib + base64).
	 *  Raw noise tiles seamlessly — no edge stitching required.
	 * ────────────────────────────────────────────────────────────────────────
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// ─── Props ────────────────────────────────────────────────────────────────

	/** Accent colour for the ambient glow. Any CSS colour string accepted. */
	let { color = '#00f5ff' }: { color?: string } = $props();

	// ─── DOM ref ──────────────────────────────────────────────────────────────

	let wrapper: HTMLDivElement;
	let io: IntersectionObserver | null = null;

	// ─── Helpers ──────────────────────────────────────────────────────────────

	function onVisibility(): void {
		if (!wrapper) return;
		wrapper.style.setProperty(
			'--anim-state',
			document.hidden ? 'paused' : 'running'
		);
	}

	// ─── Lifecycle ────────────────────────────────────────────────────────────

	onMount(() => {
		io = new IntersectionObserver(
			(entries) => wrapper?.classList.toggle('is-active', entries[0].isIntersecting),
			{ threshold: 0.04 }
		);
		io.observe(wrapper);

		document.addEventListener('visibilitychange', onVisibility, { passive: true });

		return () => {
			io?.disconnect();
			io = null;
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});

	onDestroy(() => {
		if (browser) { io?.disconnect(); io = null; }
	});

	// ─── Noise texture ────────────────────────────────────────────────────────
	// 64×64 greyscale RGBA PNG, base64-encoded, deterministic seed 1337.
	// Splitting across const lines keeps the linter happy; the runtime
	// concatenates them into a single data-URI string.
	const N =
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAbiUlEQVR4' +
		'2k3bBdCVVRcF4GNjKxYmmNiB3S2KomBhotjd3Y0KKhagYotd2KBiYXeC3d3d7v9/9sx2/GbufHz3' +
		'vvecHWutvc57L+3ee++NTTfdNK6//voYM2ZM3HPPPXHxxRfHE088EbvttluMGjUqll122Xj99djm' +
		'meeiTnnnDNuu+22eO655/Jx6aWXxqSTThp33HFHrLTSSvHll1/GMcccE3369InLLrssvvjii+jfv3' +
		'/ssssuMddcc8WMM84Y88wzT7zwwgsx66yzRocOHWKnnXbKx9JLLx1nn312/vvTTz/N908888cQZ29' +
		'tvvx0HH3xwzDTTTBnf3nvvHdtss0307ds3Zp555vj777/j888/jymmmCJ+//33jOfEE0+MU045Jfdd' +
		'Y401Yo455si4Lr/88ph//vljhx12iPb+++/H8ccfn8FssMEG8cYbb2SCM8wwQ7z11ltx7rnnxkYb' +
		'bRSzzTZbfPXVVzFixIh4+OGHY+6554499tgjN7KJgCy49tprx6+//poFfPPNN3Pt3r17x/7775+J' +
		'PPnkk7HjjjvGq6++ms9/9913cdVVV8X0008fU089da7x7rvvZpICVeS77747DjzwwBg2bFiI1/4e' +
		'6623Xpxxxhlx+OGHx6OPPhoLLbRQNmC88caLW265Jf8eOHBg/Pnnn/H4449H9+7dY7rppouHHnoo' +
		'i/zhhx9GW2GFFeKoo46KCy+8MGaZZZa8eK+99oq77rorrr322txgqaWWig033DC7988//8SQIUO2' +
		'cwq2/vrrxzfffBMLLLBA/PHHH9nxySabLLbccstMZpNNNskADzjggCyqBBTy+eefzyR1WdcUXjHt' +
		'tfnmm+d6k0wySVxwwQVZsF69emXQyyyzTHZP8axx9NFHZ2c166CDDopXXnkl47bHDz/8kO+dd955' +
		'8wEJGgTlAwYMyEK0qaaaKlpr/y6kIE8//XSceeaZcc4552T3J5hgglxYML/99luMHj06Kzl8+PCE' +
		'KHQsssgiiaIHHnggOzh27NhcRxBbbLFFXqd4INuvX78MCK223377fK8EoQJSJK9g2223Xa6loK6F' +
		'ADSBmEGDBv3bMDS++uqrs5CSu+6662KfffbJYk455ZTRuXPnePbZZzMecaOynKGuvfPOO8mdBRdc' +
		'MBf++OONE86CAqeRI0dmwtNMM0306NEjHzRBtV988cXssKruuuuuyXVQRIGbbropaaIggnHd999/' +
		'H6eddlpC86yzzsrr8LRnz565Js2xvms9B3HgrMBQBCGrrrpqXHLJJakpXbp0iXHjxmUnUWXRRRfN' +
		'5xVZIew7++yzJ8KXXXLJRO4VV1yRjdW88847L5pNTjjhhOyYAtx8882ZvEDBf9ppp82LCQ0O4bVO' +
		'+sEzcH3wwQezS+CtszpMUAVKJ1CD6BG21VdfPfVB0I899lhsvfXW0bVr1zj55JOzc8TquOOOi9NP' +
		'Pz1/g7zgocFr9Onll1/Of6+yyipJTevQJs1EzYsuuigWW2yxbIbX0JK+QAQ0HHbYYfm+Qw45JBpe' +
		'gIkqU1j/ViUXSJCiDx06NBf1N94+9dRT2WHBQ4a/BQmuOgJiFPujjz5KxT/00ENj/PHHj2233TY7' +
		'deqpp2ahdV9Rttpqq0QLWBJUuvDee+8FeuoWWvz0008poMstt1zcfvvt2RC0kgTkQTFaeB8EyMM6' +
		'tMCeHTt2zMShTjF//vnnbHCTXMGzkiNq+KiiBX0Bgyk1VQidoRuocN9992UQ0EBZ99tvv+ym66HF' +
		'qJQgNC2//PJJMQUqxX/ppZdi8cUXz9d1ENKsO9FEE+UEgCAJ1yjF9zXXXDObACk1bhWURnzwwQdZ' +
		'OHqG53JAUbSTNAquttpquUej5GbjEksskRvjPPjPN998sdlmm2W3cB0cwZ/QUFzBW8yPwimA0cQL' +
		'CES3jTGjz4wWINia5wLRKUkIVAEJqESILErYd911000aaZLiigt1dPiGG26II488MimBoiYGrfrk' +
		'k08SFV7XZbH7G/UU3XQTH70xRhtld6GRospeJBbXXHNNwkhxrrzyylh55ZXzOcpLoAjOnnvumQXA' +
		'eWKnk64HeV2GENoAsmBHsQW24oorpqKDM59BnUEUjM1tMH3ttdeSisYzCkjARPG3kTn55JNnslBA' +
		'Xx555JHUAb4C2iBPU1Dzxx9/TNTeeuut0alTp5wwqAflDUzBDyx0jwfwBkG5CNwkosq6tfDCC2dB' +
		'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';
</script>

<div bind:this={wrapper} class="wpbg" aria-hidden="true">
	<div class="wpbg__base"></div>
	<div class="wpbg__glow" style="--glow: {color}"></div>
	<div class="wpbg__grain" style="background-image: url('{N}')"></div>
	<div class="wpbg__scanlines"></div>
	<div class="wpbg__vignette"></div>
</div>

<style>
	.wpbg {
		--anim-state: running;
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
		isolation: isolate;
	}

	/* ─── Base ─── */
	.wpbg__base {
		position: absolute;
		inset: 0;
		background: var(--cp-bg, #06060a);
	}

	/* ─── Glow: compositor-only transform animation ─── */
	.wpbg__glow {
		position: absolute;
		inset: -12%;
		background: radial-gradient(
			ellipse 52% 42% at 50% 54%,
			color-mix(in srgb, var(--glow, #00f5ff) 12%, transparent) 0%,
			transparent 68%
		);
		transition: background 0.55s ease;
		will-change: transform;
		animation-play-state: var(--anim-state);
	}

	.wpbg.is-active .wpbg__glow {
		animation: glowDrift 16s ease-in-out infinite alternate;
		animation-play-state: var(--anim-state);
	}

	@keyframes glowDrift {
		0%   { transform: translate(  0%,   0%) scale(1.00); }
		25%  { transform: translate(  4%,  -5%) scale(1.04); }
		50%  { transform: translate( -5%,   3%) scale(0.97); }
		75%  { transform: translate(  3%,   6%) scale(1.03); }
		100% { transform: translate( -2%,  -3%) scale(1.01); }
	}

	/* ─── Grain: background-position-only animation ─── */
	/*
	  steps(1) = instant jumps, not smooth sliding.
	  0.12 s interval = ~8 unique grain frames/sec — convincing flicker
	  without hammering the GPU. Pure texture-pointer update.
	*/
	.wpbg__grain {
		position: absolute;
		inset: 0;
		background-repeat: repeat;
		background-size: 192px 192px;
		opacity: 0.055;
		mix-blend-mode: overlay;
		will-change: background-position;
		animation-play-state: var(--anim-state);
	}

	.wpbg.is-active .wpbg__grain {
		animation: grainFlicker 0.12s steps(1) infinite;
		animation-play-state: var(--anim-state);
	}

	@keyframes grainFlicker {
		0%   { background-position:   0px   0px; }
		10%  { background-position: -53px  31px; }
		20%  { background-position:  79px -27px; }
		30%  { background-position: -19px  88px; }
		40%  { background-position:  61px -61px; }
		50%  { background-position: -88px  17px; }
		60%  { background-position:  37px  73px; }
		70%  { background-position: -44px -55px; }
		80%  { background-position:  22px  66px; }
		90%  { background-position: -71px -38px; }
	}

	/* ─── Scanlines ─── */
	.wpbg__scanlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.055) 3px,
			rgba(0, 0, 0, 0.055) 4px
		);
	}

	/* ─── Vignette ─── */
	.wpbg__vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 80% 70% at 50% 50%,
				transparent 28%,
				rgba(6, 6, 10, 0.58) 68%,
				rgba(6, 6, 10, 0.94) 100%
			),
			linear-gradient(to bottom, rgba(6, 6, 10, 0.62) 0%, transparent 16%),
			linear-gradient(to top,    rgba(6, 6, 10, 0.62) 0%, transparent 16%);
	}

	/* ─── Off-screen: drop GPU layers entirely ─── */
	.wpbg:not(.is-active) .wpbg__grain,
	.wpbg:not(.is-active) .wpbg__glow {
		animation: none;
	}

	/* ─── Reduce motion ─── */
	@media (prefers-reduced-motion: reduce) {
		.wpbg__grain,
		.wpbg__glow {
			animation: none !important;
		}
	}
</style>