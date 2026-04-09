<script lang="ts">
	/**
	 * UrchinBackground — Canvas 2D tttwinkle-inspired radial spike field.
	 *
	 * Visual: 120 spikes radiate from the element centre at 3° intervals
	 * (TAU / spikeCount). Each spike has a random half-length, opacity, and
	 * colour. Opacities slowly oscillate per-spike (the "twinkle").
	 *
	 * Cursor interaction — angular spring repulsion:
	 *   1. Each frame, for each spike, compute distance from cursor to the
	 *      closest point on the spike line segment.
	 *   2. If within repelRadius: compute the perpendicular signed distance
	 *      (perp). Add `sign(perp) × falloff × repelSpeed` to angular velocity.
	 *      The sign of perp is derived from the right-normal of the spike,
	 *      producing the correct rotation direction to push the tip AWAY.
	 *   3. Spring force (`springK × (baseAngle − currentAngle)`) continuously
	 *      pulls toward rest angle, with damping producing oscillation.
	 *
	 * Physics derivation (sign verification):
	 *   Spike at A=0° (→ right), cursor above in screen (rdy < 0).
	 *   perp = rdx·sin(A) − rdy·cos(A) = −rdy > 0.
	 *   Desired: rotate clockwise in screen (increase A) to tilt tip down/away.
	 *   Formula: angleVel += +sign(perp) · … → positive increment → A increases ✓
	 *
	 * Performance:
	 *   • DPR capped at 1.5 (1.2 on coarse pointers)
	 *   • pointermove on parent section (canvas has pointer-events:none)
	 *   • createAnimationLoop: pauses on hidden tab / element off-screen
	 *   • One static frame for prefers-reduced-motion
	 *   • halfLenFrac stored as fraction → no re-init on container resize
	 */

	import { onMount }            from 'svelte';
	import { reducedMotion }      from '$lib/stores';
	import { createAnimationLoop } from '$lib/utils';
	import {
		URCHIN_CONFIG,
		URCHIN_COLORS,
		URCHIN_COLOR_DIST,
	} from '$lib/constants/urchin-background';

	/** Override spike count (default: URCHIN_CONFIG.spikeCount = 120) */
	export let spikeCount: number = URCHIN_CONFIG.spikeCount;

	let canvasEl: HTMLCanvasElement;
	let destroyed = false;

	const TAU = Math.PI * 2;

	onMount(() => {
		const ctx      = canvasEl.getContext('2d')!;
		const isCoarse = window.matchMedia('(pointer: coarse)').matches;
		const dpr      = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.2 : 1.5);

		let W = 0, H = 0;
		let pendingW = 0, pendingH = 0;

		// Cursor state in CSS pixels — null = no active cursor / pointer left
		let cursorX: number | null = null;
		let cursorY: number | null = null;

		let loop: ReturnType<typeof createAnimationLoop> | undefined;

		// ── Spike data model ─────────────────────────────────────────────────────

		interface Spike {
			baseAngle:    number;  // fixed rest angle [0, TAU)
			currentAngle: number;  // spring-animated current angle
			angleVel:     number;  // angular velocity (rad/frame)
			halfLenFrac:  number;  // 0–1 → maps to [minHalfLen, maxHalfLen] × minDim
			opacity:      number;  // base opacity [minOpacity, maxOpacity]
			shimmerPhase: number;  // per-spike twinkle oscillator
			shimmerSpeed: number;  // twinkle speed (rad/frame)
			lineWidth:    number;  // stroke width (px)
			colorBase:    string;  // pre-built "r,g,b" string for rgba() templates
		}

		let spikes: Spike[] = [];

		// ── Helpers ──────────────────────────────────────────────────────────────

		const rnd = (lo: number, hi: number): number => lo + Math.random() * (hi - lo);

		/** Pick a colour and return a pre-built "r,g,b" string */
		function pickColorBase(): string {
			const rand = Math.random();
			for (const [ck, threshold] of URCHIN_COLOR_DIST) {
				if (rand < threshold) {
					const c = URCHIN_COLORS[ck];
					return `${c[0]},${c[1]},${c[2]}`;
				}
			}
			const c = URCHIN_COLORS.cyan;
			return `${c[0]},${c[1]},${c[2]}`;
		}

		// ── Init / resize ────────────────────────────────────────────────────────

		function applyResize(w: number, h: number): void {
			W = w; H = h;
			canvasEl.width  = Math.round(W * dpr);
			canvasEl.height = Math.round(H * dpr);
			// Resetting canvas.width clears the transform — reapply DPR scale
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		/**
		 * Build the spike array.
		 * Lengths stored as fractions so the field stays proportional on resize
		 * without requiring re-initialisation.
		 */
		function initSpikes(): void {
			const angStep = TAU / spikeCount; // 3° for 120 spikes
			const { minOpacity, maxOpacity, lineWidthMin, lineWidthMax,
			        shimmerSpeed } = URCHIN_CONFIG;

			spikes = Array.from({ length: spikeCount }, (_, i) => {
				const angle       = i * angStep;
				const halfLenFrac = Math.random(); // uniform random length

				return {
					baseAngle:    angle,
					currentAngle: angle,
					angleVel:     0,
					halfLenFrac,
					opacity:      rnd(minOpacity, maxOpacity),
					shimmerPhase: rnd(0, TAU),
					shimmerSpeed: rnd(shimmerSpeed * 0.4, shimmerSpeed * 1.8),
					lineWidth:    lineWidthMin + halfLenFrac * (lineWidthMax - lineWidthMin),
					colorBase:    pickColorBase(),
				};
			});
		}

		// ── Physics update ───────────────────────────────────────────────────────

		function update(): void {
			const minDim   = Math.min(W, H);
			const cx       = W / 2;
			const cy       = H / 2;
			const minLen   = URCHIN_CONFIG.minHalfLen  * minDim;
			const maxLen   = URCHIN_CONFIG.maxHalfLen  * minDim;
			const repelRad = URCHIN_CONFIG.repelRadius * minDim;
			const { repelSpeed, springK, damping } = URCHIN_CONFIG;

			const hasCursor = cursorX !== null && cursorY !== null;
			const mx = cursorX ?? 0;
			const my = cursorY ?? 0;

			for (const s of spikes) {
				// Twinkle shimmer
				s.shimmerPhase += s.shimmerSpeed;

				// ── Spring restoration ───────────────────────────────────────────
				s.angleVel += (s.baseAngle - s.currentAngle) * springK;

				// ── Cursor repulsion ─────────────────────────────────────────────
				if (hasCursor) {
					const halfLen = minLen + s.halfLenFrac * (maxLen - minLen);
					const cosA    = Math.cos(s.currentAngle);
					const sinA    = Math.sin(s.currentAngle);

					// Cursor relative to centre
					const rdx = mx - cx;
					const rdy = my - cy;

					// Project cursor onto spike's local frame
					const along = rdx * cosA + rdy * sinA;  // along spike direction
					const perp  = rdx * sinA - rdy * cosA;  // right-normal component (signed)

					// Closest point on the finite spike segment [0, halfLen]
					const aClamped  = Math.max(0, Math.min(halfLen, along));
					const closestX  = cx + aClamped * cosA;
					const closestY  = cy + aClamped * sinA;
					const dist      = Math.hypot(closestX - mx, closestY - my);

					if (dist < repelRad && dist > 0.5) {
						const t          = 1 - dist / repelRad;
						const falloff    = t * t; // smooth quadratic edge
						// Spikes react more strongly when cursor is near their tip
						const tipWeight  = 0.20 + 0.80 * Math.min(1, aClamped / (halfLen * 0.6 + 1));
						// sign(perp) gives the correct rotation direction (see header derivation)
						s.angleVel += Math.sign(perp) * falloff * tipWeight * repelSpeed;
					}
				}

				// ── Integrate ────────────────────────────────────────────────────
				s.angleVel     *= damping;
				s.currentAngle += s.angleVel;
			}
		}

		// ── Draw ─────────────────────────────────────────────────────────────────

		function draw(): void {
			ctx.clearRect(0, 0, W, H);

			const minDim  = Math.min(W, H);
			const cx      = W / 2;
			const cy      = H / 2;
			const minLen  = URCHIN_CONFIG.minHalfLen * minDim;
			const maxLen  = URCHIN_CONFIG.maxHalfLen * minDim;
			const { shimmerAmp } = URCHIN_CONFIG;

			ctx.lineCap = 'round';

			for (const s of spikes) {
				const halfLen = minLen + s.halfLenFrac * (maxLen - minLen);
				const cosA    = Math.cos(s.currentAngle);
				const sinA    = Math.sin(s.currentAngle);
				const tipX    = cx + cosA * halfLen;
				const tipY    = cy + sinA * halfLen;

				// Per-spike opacity shimmer (the "twinkle")
				const shimmer = 1 - shimmerAmp + shimmerAmp * Math.sin(s.shimmerPhase);
				const alpha   = Math.max(0, Math.min(1, s.opacity * shimmer));

				// --- Soft glow halo (wide, faint) ---
				ctx.beginPath();
				ctx.moveTo(cx, cy);
				ctx.lineTo(tipX, tipY);
				ctx.lineWidth   = s.lineWidth * 4.5;
				ctx.strokeStyle = `rgba(${s.colorBase},${(alpha * 0.07).toFixed(2)})`;
				ctx.stroke();

				// --- Main spike ---
				ctx.beginPath();
				ctx.moveTo(cx, cy);
				ctx.lineTo(tipX, tipY);
				ctx.lineWidth   = s.lineWidth;
				ctx.strokeStyle = `rgba(${s.colorBase},${alpha.toFixed(2)})`;
				ctx.stroke();
			}
		}

		// ── Main loop tick ───────────────────────────────────────────────────────

		function tick({ shouldAnimate }: { shouldAnimate: boolean }): void {
			if (destroyed) return;

			// Apply pending resize
			if (pendingW > 0) {
				applyResize(pendingW, pendingH);
				// Snap spikes back to rest angles on resize
				for (const s of spikes) {
					s.currentAngle = s.baseAngle;
					s.angleVel     = 0;
				}
				pendingW = pendingH = 0;
			}

			if (shouldAnimate) update();
			draw();
		}

		// ── Pointer tracking ─────────────────────────────────────────────────────

		// canvasEl.parentElement is the .ub wrapper div (pointer-events:none).
		// Walk up one more level to reach the actual <section> so we receive
		// bubbled pointermove events from the entire section content area.
		const ub     = canvasEl.parentElement!;
		const parent = (ub.parentElement ?? ub) as HTMLElement;

		const onPointerMove = (e: PointerEvent): void => {
			if (isCoarse) return; // no hover on touch devices
			const rect = parent.getBoundingClientRect();
			cursorX    = e.clientX - rect.left;
			cursorY    = e.clientY - rect.top;
			// Wake the loop if idle (animation may have paused while cursor was outside)
			loop?.requestFrame();
		};

		const onPointerLeave = (): void => {
			cursorX = null;
			cursorY = null;
		};

		parent.addEventListener('pointermove', onPointerMove, { passive: true });
		parent.addEventListener('pointerleave', onPointerLeave, { passive: true });

		// ── ResizeObserver ────────────────────────────────────────────────────────

		const ro = new ResizeObserver(([entry]) => {
			const nw = entry.contentRect.width;
			const nh = entry.contentRect.height;
			if (nw > 0 && nh > 0) {
				pendingW = nw;
				pendingH = nh;
				loop?.requestFrame();
			}
		});

		// ── Bootstrap ─────────────────────────────────────────────────────────────

		const parentRect = parent.getBoundingClientRect();
		applyResize(parentRect.width || 800, parentRect.height || 600);
		initSpikes();

		loop = createAnimationLoop({
			node:               parent,
			reducedMotionStore: reducedMotion,
			shouldAnimate:      () => !destroyed,
			rootMargin:         '200px 0px 200px 0px',
			threshold:          0.01,
			frame:              tick,
		});
		ro.observe(parent);
		loop.requestFrame();
		loop.start();

		return () => {
			destroyed = true;
			loop?.destroy();
			ro.disconnect();
			parent.removeEventListener('pointermove', onPointerMove);
			parent.removeEventListener('pointerleave', onPointerLeave);
		};
	});
</script>

<!-- Full-bleed overlay — place as first child of position:relative parent.
     Parent section must NOT have pointer-events:none (we attach listeners there). -->
<div class="ub" aria-hidden="true" role="presentation">
	<canvas bind:this={canvasEl} class="ub__canvas"></canvas>
</div>

<style>
	.ub {
		position: absolute;
		inset: 0;
		overflow: hidden;
		/* Canvas itself does not capture events — parent section does */
		pointer-events: none;
		z-index: 0;
	}

	.ub__canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
