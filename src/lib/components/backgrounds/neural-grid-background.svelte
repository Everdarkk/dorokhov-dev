<script lang="ts">
	/**
	 * NeuralGridBackground — Canvas 2D animated particle-constellation.
	 *
	 * Floating particles connect to nearby neighbours with faint lines.
	 * Energy "pulses" travel along those connections, giving a live-circuit
	 * feel that complements the cyber aesthetic without WebGL overhead.
	 *
	 * Performance notes:
	 *   • DPR capped at 1.5 — limits pixel budget on hi-DPI displays
	 *   • O(n²) per frame; n ≤ 80 → ≤ 3 160 dist checks (negligible)
	 *   • Pauses on hidden tab (visibilitychange)
	 *   • One static frame when prefers-reduced-motion is set
	 *   • Resize deferred to next RAF tick (avoids blank-frame flash)
	 */

	import { onMount } from 'svelte';
	import { reducedMotion }      from '$lib/stores';
	import { createAnimationLoop } from '$lib/utils';

	export let particleCount:    number = 72;
	export let connectionRadius: number = 148;

	let canvasEl:  HTMLCanvasElement;
	let destroyed = false;

	// ── Colour palette ─────────────────────────────────────────────────────────
	const C = {
		cyan:   [0,   245, 255] as const,
		pink:   [255,   0,  85] as const,
		purple: [179,   0, 255] as const,
	} as const;
	type CKey = keyof typeof C;

	interface Particle {
		x: number; y: number;
		vx: number; vy: number;
		r: number;
		phase: number;
		phaseSpeed: number;
		ck: CKey;
	}

	interface Pulse {
		fi:    number;   // index of "from" particle
		ti:    number;   // index of "to"   particle
		t:     number;   // 0–1 progress
		speed: number;
		ck:    CKey;
	}

	onMount(() => {
		const ctx = canvasEl.getContext('2d')!;
		const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
		const dpr = Math.min(window.devicePixelRatio || 1, isCoarsePointer ? 1.2 : 1.5);

		let W = 0, H = 0;
		let pendingW = 0, pendingH = 0;
		let particles: Particle[] = [];
		let pulses: Pulse[]       = [];
		let nextPulse   = 0;   // countdown (frames) before next pulse spawn
		let loop: ReturnType<typeof createAnimationLoop> | undefined;

		// ── Helpers ────────────────────────────────────────────────────────────

		const rnd = (a: number, b: number) => a + Math.random() * (b - a);

		function dist2(a: Particle, b: Particle): number {
			const dx = a.x - b.x, dy = a.y - b.y;
			return dx * dx + dy * dy;
		}

		function pickColor(): CKey {
			const r = Math.random();
			return r < 0.68 ? 'cyan' : r < 0.88 ? 'pink' : 'purple';
		}

		// ── Init / resize ──────────────────────────────────────────────────────

		function applyResize(w: number, h: number): void {
			W = w; H = h;
			canvasEl.width  = Math.round(W * dpr);
			canvasEl.height = Math.round(H * dpr);
			// canvas.width assignment resets context transform — reapply scale
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function initParticles(): void {
			particles = Array.from({ length: particleCount }, () => ({
				x:          rnd(0, W),
				y:          rnd(0, H),
				vx:         rnd(-0.22, 0.22),
				vy:         rnd(-0.22, 0.22),
				r:          rnd(1.4, 2.8),
				phase:      rnd(0, Math.PI * 2),
				phaseSpeed: rnd(0.014, 0.038),
				ck:         pickColor(),
			}));
		}

		function spawnPulse(): void {
			const r2 = connectionRadius * connectionRadius;
			for (let attempt = 0; attempt < 14; attempt++) {
				const fi = Math.floor(Math.random() * particles.length);
				const ti = Math.floor(Math.random() * particles.length);
				if (fi !== ti && dist2(particles[fi], particles[ti]) < r2) {
					pulses.push({ fi, ti, t: 0, speed: rnd(0.003, 0.009), ck: pickColor() });
					return;
				}
			}
		}

		// ── Draw ───────────────────────────────────────────────────────────────

		function draw(): void {
			ctx.clearRect(0, 0, W, H);

			const r2 = connectionRadius * connectionRadius;

			// ── Connection lines ─────────────────────────────────────────────────
			ctx.lineWidth = 0.5;
			for (let i = 0; i < particles.length - 1; i++) {
				const pi = particles[i];
				for (let j = i + 1; j < particles.length; j++) {
					const pj   = particles[j];
					const d2   = dist2(pi, pj);
					if (d2 >= r2) continue;

					const alpha = (1 - Math.sqrt(d2) / connectionRadius) * 0.11;
					const [r, g, b] = C.cyan;
					ctx.beginPath();
					ctx.moveTo(pi.x, pi.y);
					ctx.lineTo(pj.x, pj.y);
					ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
					ctx.stroke();
				}
			}

			// ── Pulses ───────────────────────────────────────────────────────────
			const alive: Pulse[] = [];
			for (const pulse of pulses) {
				pulse.t += pulse.speed;
				if (pulse.t > 1) continue;

				const fp = particles[pulse.fi];
				const tp = particles[pulse.ti];
				if (dist2(fp, tp) >= r2) continue; // connection broke

				const px   = fp.x + (tp.x - fp.x) * pulse.t;
				const py   = fp.y + (tp.y - fp.y) * pulse.t;
				const fade = Math.sin(pulse.t * Math.PI);
				const [r, g, b] = C[pulse.ck];

				ctx.beginPath();
				ctx.arc(px, py, 5, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${r},${g},${b},${(fade * 0.18).toFixed(3)})`;
				ctx.fill();

				ctx.beginPath();
				ctx.arc(px, py, 2.2, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${r},${g},${b},${(fade * 0.82).toFixed(3)})`;
				ctx.fill();

				alive.push(pulse);
			}
			pulses = alive;

			if (--nextPulse <= 0) {
				spawnPulse();
				nextPulse = 18 + Math.floor(Math.random() * 34);
			}

			// ── Particles ────────────────────────────────────────────────────────
			for (const p of particles) {
				p.phase += p.phaseSpeed;
				const glow = 0.27 + 0.17 * Math.sin(p.phase);
				const [r, g, b] = C[p.ck];

				// soft halo
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${r},${g},${b},${(glow * 0.11).toFixed(3)})`;
				ctx.fill();

				// bright core
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${r},${g},${b},${(0.42 + glow * 0.32).toFixed(3)})`;
				ctx.fill();
			}
		}

		function updateParticles(): void {
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0)  { p.x = 0;  p.vx =  Math.abs(p.vx); }
				if (p.x > W)  { p.x = W;  p.vx = -Math.abs(p.vx); }
				if (p.y < 0)  { p.y = 0;  p.vy =  Math.abs(p.vy); }
				if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); }
			}
		}

		// ── RAF loop ──────────────────────────────────────────────────────────

		function tick({ shouldAnimate }: { shouldAnimate: boolean }): void {
			if (destroyed) return;

			if (pendingW > 0) {
				applyResize(pendingW, pendingH);
				for (const p of particles) {
					p.x = Math.min(p.x, W);
					p.y = Math.min(p.y, H);
				}
				pendingW = pendingH = 0;
			}

			if (shouldAnimate) updateParticles();
			draw();
		}

		// ── Observers ─────────────────────────────────────────────────────────

		const ro = new ResizeObserver(([entry]) => {
			const nw = entry.contentRect.width;
			const nh = entry.contentRect.height;
			if (nw > 0 && nh > 0) {
				pendingW = nw; pendingH = nh;
				loop?.requestFrame();
			}
		});

		// ── Bootstrap ─────────────────────────────────────────────────────────

		const parent = canvasEl.parentElement!;
		const rect   = parent.getBoundingClientRect();
		applyResize(rect.width || 800, rect.height || 600);
		initParticles();
		loop = createAnimationLoop({
			node: parent,
			reducedMotionStore: reducedMotion,
			shouldAnimate: () => !destroyed,
			rootMargin: '220px 0px 220px 0px',
			threshold: 0.01,
			frame: tick,
		});
		ro.observe(parent);

		loop.requestFrame();
		loop.start();

		return () => {
			destroyed = true;
			loop?.destroy();
			ro.disconnect();
		};
	});
</script>

<div class="ngb" aria-hidden="true" role="presentation">
	<canvas bind:this={canvasEl} class="ngb__canvas"></canvas>
</div>

<style>
	.ngb {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.ngb__canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
