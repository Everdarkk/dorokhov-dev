<script lang="ts">
	/**
	 * Hero Component — redesigned
	 *
	 * Design direction:
	 *   Keeps the core terminal / data-stream DNA of the original but aligns
	 *   visually with the other sections:
	 *   • Uses the same section-inner max-width, padding, and SectionTitle
	 *     design-language (elaborate header with // label).
	 *   • Drops the heavy outer terminal chrome in favour of a lighter
	 *     layout: full-bleed Background, a left/right 50/50 split, and
	 *     clean typography hierarchy matching ValueProposition / RecentLaunches.
	 *   • The "terminal window" becomes a focused data-stream panel rather
	 *     than wrapping the entire section.
	 *   • Buttons replaced with the new <CyberButton> reusable component.
	 *   • Photo frame kept — same pink neon treatment, tightened.
	 *   • Entrance: staggered CSS animation sequence on mount (no scroll
	 *     trigger — the hero is always visible first).
	 *   • Fully responsive: 2-col desktop → 1-col mobile, photo moves below.
	 */

	import { onMount } from 'svelte';
	import Background from '$lib/components/backgrounds/background-canvas.svelte';
	import CyberButton from '$lib/components/common/cyber-button.svelte';
	import { reducedMotion } from '$lib/stores';
	import { createTypewriter, type TypewriterController } from '$lib/utils';
	import type { DataStreamLine } from '$lib/types';
	import {
		DATA_STREAM_MESSAGES,
		RANDOM_MESSAGES,
		ACTION_BUTTONS,
		MAX_VISIBLE_LINES,
		MESSAGE_UPDATE_INTERVAL,
	} from '$lib/constants/hero';

	// ─── State ────────────────────────────────────────────────────────────────

	let dataStreamLines: DataStreamLine[] = [];
	let currentLineId = 0;
	let mounted = false;
	let messageQueue: string[] = [];
	let streamTypewriter: TypewriterController | null = null;
	let streamInterval: ReturnType<typeof setInterval> | null = null;
	let activeLineId: number | null = null;
	let isTyping = false;

	const HERO_STREAM_CHAR_DELAY = 14;

	function trimStreamLines(): void {
		if (dataStreamLines.length > MAX_VISIBLE_LINES) {
			dataStreamLines = dataStreamLines.slice(-MAX_VISIBLE_LINES);
		}
	}

	function setLineText(lineId: number, text: string): void {
		dataStreamLines = dataStreamLines.map((line) =>
			line.id === lineId ? { ...line, text } : line
		);
	}

	function appendInstantLine(text: string): void {
		dataStreamLines = [
			...dataStreamLines,
			{ id: currentLineId++, text, delay: 0, opacity: 1 },
		];
		trimStreamLines();
	}

	function runNextMessage(): void {
		if (isTyping || messageQueue.length === 0) return;

		const nextMessage = messageQueue[0];
		messageQueue = messageQueue.slice(1);

		if ($reducedMotion) {
			appendInstantLine(nextMessage);
			runNextMessage();
			return;
		}

		const lineId = currentLineId++;
		activeLineId = lineId;
		isTyping = true;
		dataStreamLines = [
			...dataStreamLines,
			{ id: lineId, text: '', delay: 0, opacity: 1 },
		];
		trimStreamLines();

		streamTypewriter = createTypewriter({
			lines: [nextMessage],
			charDelay: HERO_STREAM_CHAR_DELAY,
			lineDelay: 0,
			onChar: (partialLine) => {
				if (activeLineId !== null) {
					setLineText(activeLineId, partialLine);
				}
			},
			onLineComplete: (line) => {
				if (activeLineId !== null) {
					setLineText(activeLineId, line);
				}
			},
			onDone: () => {
				isTyping = false;
				activeLineId = null;
				streamTypewriter = null;
				runNextMessage();
			},
		});

		streamTypewriter.start();
	}

	function enqueueMessage(message: string): void {
		messageQueue = [...messageQueue, message];
		runNextMessage();
	}

	// ─── Lifecycle ────────────────────────────────────────────────────────────

	onMount((): (() => void) => {
		// Trigger entrance animations
		requestAnimationFrame(() => { mounted = true; });

		// Seed the data stream through a shared typewriter pipeline
		for (const msg of DATA_STREAM_MESSAGES) {
			enqueueMessage(msg);
		}

		// Periodic new messages continue through the same queue
		streamInterval = setInterval(() => {
			const msg = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
			enqueueMessage(msg);
		}, MESSAGE_UPDATE_INTERVAL);

		return () => {
			if (streamInterval !== null) {
				clearInterval(streamInterval);
				streamInterval = null;
			}
			if (streamTypewriter !== null) {
				streamTypewriter.cancel();
				streamTypewriter = null;
			}
			messageQueue = [];
			isTyping = false;
			activeLineId = null;
		};
	});

	// ─── Helpers ──────────────────────────────────────────────────────────────

	function handleAction(action: string): void {
		if (action === 'contact') {
			const el = document.getElementById('contact');
			el?.scrollIntoView({ behavior: 'smooth' });
		} else if (action === 'learn-more') {
			window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
		}
	}
</script>

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
<section class="hero" class:is-mounted={mounted} aria-label="Hero">

	<!-- Shared canvas background — same as rest of page -->
	<Background />

	<!-- Scanlines overlay -->
	<div class="hero__scanlines" aria-hidden="true"></div>

	<!-- ── Inner layout ─────────────────────────────────────────────────── -->
	<div class="hero__inner">

		<!-- ── LEFT: text content ────────────────────────────────────────── -->
		<div class="hero__content">

			<!-- // label — matches SectionTitle elaborate variant language -->
			<div class="hero__label" aria-hidden="true">
				<span class="hero__label-slash">// </span>PORTFOLIO_CORE.EXE
			</div>

			<!-- Main heading -->
			<h1 class="hero__heading">
				<span class="hero__heading-line hero__heading-line--1">
					Full-Stack
				</span>
				<span class="hero__heading-line hero__heading-line--2">
					Developer
				</span>
				<span class="hero__heading-line hero__heading-line--3">
					& Web Architect
				</span>
			</h1>

			<!-- Subtitle rule — matches section __rule -->
			<div class="hero__rule" aria-hidden="true"></div>

			<!-- Description -->
			<p class="hero__desc">
				High-performance solutions from concept to deployment.
				React, Svelte, Node, PostgreSQL — clean code meets the cybernetic frontier.
			</p>

			<!-- Data-stream panel -->
			<div class="hero__stream" aria-label="System log">
				<div class="hero__stream-header" aria-hidden="true">
					<span class="hero__stream-dot"></span>
					<span class="hero__stream-dot"></span>
					<span class="hero__stream-dot"></span>
					<span class="hero__stream-title">SYSTEM_LOG</span>
				</div>
				<div class="hero__stream-body">
					{#each dataStreamLines as line (line.id)}
						<div class="hero__stream-line">
							<span class="hero__stream-prompt" aria-hidden="true">$</span>
							<span class="hero__stream-text">{line.text}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- CTA buttons — use the reusable CyberButton -->
			<div class="hero__actions">
				{#each ACTION_BUTTONS as btn (btn.id)}
					<CyberButton
						variant={btn.className === 'contact-btn' ? 'primary' : 'secondary'}
						on:click={() => handleAction(btn.action)}
						ariaLabel={btn.label}
					>
						{btn.label}
						<span class="hero__btn-arrow" aria-hidden="true">→</span>
					</CyberButton>
				{/each}
			</div>

		</div>

		<!-- ── RIGHT: photo ──────────────────────────────────────────────── -->
		<div class="hero__photo-wrap">

			<!-- Decorative cross-hair corners -->
			<div class="hero__photo-corner hero__photo-corner--tl" aria-hidden="true"></div>
			<div class="hero__photo-corner hero__photo-corner--tr" aria-hidden="true"></div>
			<div class="hero__photo-corner hero__photo-corner--bl" aria-hidden="true"></div>
			<div class="hero__photo-corner hero__photo-corner--br" aria-hidden="true"></div>

			<!-- Scan label -->
			<div class="hero__photo-label" aria-hidden="true">SUBJECT_SCAN.jpg</div>

			<div class="hero__photo-frame">
				<img
					src="/src/lib/assets/images/od-2.webp"
					alt="Oleksandr Dorokhov"
					loading="eager"
					decoding="async"
				/>
				<!-- Colour grade overlays -->
				<div class="hero__photo-grade" aria-hidden="true"></div>
				<div class="hero__photo-scanline" aria-hidden="true"></div>
			</div>

			<!-- Status badge -->
			<div class="hero__status" aria-label="Status: available for hire">
				<span class="hero__status-dot" aria-hidden="true"></span>
				AVAILABLE_FOR_HIRE
			</div>

		</div>

	</div>
</section>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
	   SECTION
	══════════════════════════════════════════════════════════════════════ */
	.hero {
		position: relative;
		width: 100%;
		min-height: calc(100dvh - var(--nav-h, 4rem));
		background: var(--cp-bg, #06060a);
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	/* Scanlines — same recipe as other sections */
	.hero__scanlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.07) 3px,
			rgba(0, 0, 0, 0.07) 4px
		);
	}

	/* ─── Inner — mirrors max-width / padding of other sections ── */
	.hero__inner {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: var(--max-w, 1400px);
		margin: 0 auto;
		padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 3rem);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(2.5rem, 5vw, 5rem);
		align-items: center;
	}

	.hero__content {
		padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 3rem);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   ENTRANCE ANIMATIONS
	   Staggered CSS sequence, triggered once on mount via .is-mounted class.
	   Each child uses a CSS custom property for its delay.
	══════════════════════════════════════════════════════════════════════ */

	/* All animated elements start hidden */
	.hero__label,
	.hero__heading-line,
	.hero__rule,
	.hero__desc,
	.hero__stream,
	.hero__actions,
	.hero__photo-wrap {
		opacity: 0;
		transform: translateY(24px);
	}

	/* When mounted, play entrance in sequence */
	.is-mounted .hero__label         { animation: heroEnter 0.6s ease forwards 0.05s; }
	.is-mounted .hero__heading-line--1{ animation: heroEnter 0.6s ease forwards 0.12s; }
	.is-mounted .hero__heading-line--2{ animation: heroEnter 0.6s ease forwards 0.20s; }
	.is-mounted .hero__heading-line--3{ animation: heroEnter 0.6s ease forwards 0.28s; }
	.is-mounted .hero__rule          { animation: heroEnter 0.5s ease forwards 0.35s; }
	.is-mounted .hero__desc          { animation: heroEnter 0.5s ease forwards 0.42s; }
	.is-mounted .hero__stream        { animation: heroEnter 0.5s ease forwards 0.50s; }
	.is-mounted .hero__actions       { animation: heroEnter 0.5s ease forwards 0.60s; }
	.is-mounted .hero__photo-wrap    { animation: heroEnterRight 0.7s cubic-bezier(0.22,1,0.36,1) forwards 0.15s; }

	@keyframes heroEnter {
		from { opacity: 0; transform: translateY(24px); }
		to   { opacity: 1; transform: translateY(0);    }
	}

	@keyframes heroEnterRight {
		from { opacity: 0; transform: translateX(32px) scale(0.97); }
		to   { opacity: 1; transform: translateX(0)    scale(1);    }
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   LEFT CONTENT
	══════════════════════════════════════════════════════════════════════ */
	.hero__content {
		display: flex;
		flex-direction: column;
		gap: clamp(1rem, 2.5vw, 1.75rem);
		min-width: 0;
	}

	/* ─── // label — matches SectionTitle elaborate variant ── */
	.hero__label {
		font-family: var(--font-mono, monospace);
		font-size: clamp(0.6rem, 1.2vw, 0.75rem);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5568);
		display: flex;
		align-items: center;
		gap: 0.4em;
	}

	.hero__label-slash {
		color: var(--cp-cyan, #00f5ff);
		font-weight: 700;
	}

	/* ─── Heading ── */
	.hero__heading {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.1em;
		/* Font matches SectionTitle elaborate h2 */
		font-family: var(--font-bionical, var(--font-logo, monospace));
		font-weight: 400;
		line-height: 1.0;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.hero__heading-line {
		display: block;
	}

	.hero__heading-line--1 {
		font-size: var(--font-display);
		color: var(--cp-cyan, #00f5ff);
		text-shadow: 0 0 40px rgba(0, 245, 255, 0.35);
	}

	.hero__heading-line--2 {
		font-size: var(--font-display);
		/* Slight indent for visual rhythm */
		padding-left: clamp(0.5rem, 2vw, 1.5rem);
		color: rgba(255, 255, 255, 0.88);
	}

	.hero__heading-line--3 {
		font-size: clamp(1.2rem, 3vw, 2.4rem);
		color: var(--cp-pink, #ff0055);
		text-shadow: 0 0 28px rgba(255, 0, 85, 0.4);
		padding-left: clamp(1rem, 3vw, 2.5rem);
	}

	/* ─── Rule — matches SectionTitle __rule ── */
	.hero__rule {
		width: clamp(3rem, 8vw, 6rem);
		height: 2px;
		background: linear-gradient(90deg, var(--cp-cyan, #00f5ff), transparent);
	}

	/* ─── Description ── */
	.hero__desc {
		font-family: var(--font-ui, sans-serif);
		font-size: clamp(0.82rem, 1.5vw, 1rem);
		line-height: 1.75;
		color: rgba(226, 232, 240, 0.65);
		margin: 0;
		max-width: 50ch;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   DATA STREAM PANEL
	══════════════════════════════════════════════════════════════════════ */
	.hero__stream {
		border: 1px solid rgba(0, 245, 255, 0.18);
		background: rgba(0, 245, 255, 0.03);
		overflow: hidden;
		height: 10rem;
	}

	.hero__stream-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.85rem;
		background: rgba(0, 245, 255, 0.06);
		border-bottom: 1px solid rgba(0, 245, 255, 0.1);
	}

	.hero__stream-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--cp-cyan, #00f5ff);
		opacity: 0.5;
	}

	.hero__stream-dot:first-child { opacity: 0.85; }
	.hero__stream-dot:last-of-type { opacity: 0.25; }

	.hero__stream-title {
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		letter-spacing: 0.18em;
		color: var(--cp-cyan, #00f5ff);
		opacity: 0.6;
		margin-left: auto;
	}

	.hero__stream-body {
		padding: 0.75rem 0.85rem;
		max-height: clamp(80px, 14vh, 140px);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.hero__stream-line {
		display: flex;
		gap: 0.5rem;
		font-family: var(--font-mono, monospace);
		font-size: clamp(0.6rem, 1.1vw, 0.7rem);
		animation: streamIn 0.4s ease-out both;
		min-width: 0;
	}

	@keyframes streamIn {
		from { opacity: 0; transform: translateX(-8px); }
		to   { opacity: 1; transform: translateX(0);    }
	}

	.hero__stream-prompt {
		color: var(--cp-cyan, #00f5ff);
		flex-shrink: 0;
	}

	.hero__stream-text {
		color: rgba(0, 255, 136, 0.8);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   CTA ACTIONS
	══════════════════════════════════════════════════════════════════════ */
	.hero__actions {
		display: flex;
		gap: clamp(0.75rem, 2vw, 1.25rem);
		flex-wrap: wrap;
	}

	/* Arrow glyph inside button */
	.hero__btn-arrow {
		font-size: 1.1em;
		transition: transform 0.25s ease;
		display: inline-block;
	}

	:global(.cyber-btn:hover) .hero__btn-arrow {
		transform: translateX(4px);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   RIGHT COLUMN — PHOTO
	══════════════════════════════════════════════════════════════════════ */
	.hero__photo-wrap {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		/* Give the corner decorations room */
		padding: 1.25rem;
	}

	/* ─── Corner decorations ── */
	.hero__photo-corner {
		position: absolute;
		width: 20px;
		height: 20px;
		border-color: var(--cp-cyan, #00f5ff);
		border-style: solid;
		opacity: 0.55;
		pointer-events: none;
		transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
	}

	.hero__photo-wrap:hover .hero__photo-corner {
		opacity: 0.9;
		width: 28px;
		height: 28px;
	}

	.hero__photo-corner--tl { top: 0; left: 0;  border-width: 2px 0 0 2px; }
	.hero__photo-corner--tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
	.hero__photo-corner--bl { bottom: 0; left: 0;  border-width: 0 0 2px 2px; }
	.hero__photo-corner--br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

	/* ─── Scan label ── */
	.hero__photo-label {
		font-family: var(--font-mono, monospace);
		font-size: 0.58rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5568);
		align-self: flex-start;
	}

	/* ─── Photo frame ── */
	.hero__photo-frame {
		position: relative;
		width: 100%;
		max-width: clamp(220px, 40vw, 440px);
		aspect-ratio: 3 / 4;
		border: 1px solid var(--cp-pink, #ff0055);
		overflow: hidden;
		background: var(--cp-bg, #06060a);
		box-shadow:
			0 0 24px rgba(255, 0, 85, 0.3),
			inset 0 0 24px rgba(255, 0, 85, 0.06);
		transition: box-shadow 0.35s ease;
	}

	.hero__photo-wrap:hover .hero__photo-frame {
		box-shadow:
			0 0 40px rgba(255, 0, 85, 0.45),
			inset 0 0 32px rgba(255, 0, 85, 0.1);
	}

	.hero__photo-frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
		display: block;
		opacity: 0.9;
		filter: saturate(1.15) contrast(1.08);
	}

	/* Colour-grade overlay */
	.hero__photo-grade {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(0, 245, 255, 0.07) 0%,
			transparent 40%,
			rgba(255, 0, 85, 0.05) 100%
		);
		pointer-events: none;
		z-index: 1;
	}

	/* Moving scanline effect */
	.hero__photo-scanline {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.08) 3px,
			rgba(0, 0, 0, 0.08) 4px
		);
		pointer-events: none;
		z-index: 2;
		animation: photoScan 8s linear infinite;
		will-change: background-position;
	}

	@keyframes photoScan {
		from { background-position: 0 0; }
		to   { background-position: 0 40px; }
	}

	/* ─── Status badge ── */
	.hero__status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(0, 255, 136, 0.7);
		align-self: flex-start;
	}

	.hero__status-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #39ff14;
		box-shadow: 0 0 8px rgba(57, 255, 20, 0.8);
		flex-shrink: 0;
		animation: statusBlink 2.5s ease-in-out infinite;
	}

	@keyframes statusBlink {
		0%, 100% { opacity: 1;   box-shadow: 0 0 8px  rgba(57,255,20,0.8); }
		50%       { opacity: 0.5; box-shadow: 0 0 16px rgba(57,255,20,0.4); }
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   RESPONSIVE
	══════════════════════════════════════════════════════════════════════ */

	/* Tablet — single column, photo below */
	@media (max-width: 900px) {
		.hero__inner {
			grid-template-columns: 1fr;
			gap: clamp(2rem, 5vw, 3rem);
		}

		.hero__photo-wrap {
			/* Centre the photo on tablet/mobile */
			align-items: center;
			order: -1; /* Move photo above text on small screens */
		}

		.hero__photo-frame {
			max-width: clamp(200px, 55vw, 320px);
			aspect-ratio: 3 / 4;
		}

		.hero__photo-label,
		.hero__status {
			align-self: center;
		}

		.hero__heading-line--2,
		.hero__heading-line--3 {
			padding-left: 0;
		}
	}

	/* Mobile */
	@media (max-width: 480px) {
		.hero__inner {
			padding-inline: 0.75rem;
		}

		.hero__heading-line--1, .hero__heading-line--2 {
			font-size: var(--font-h1);
		}		
		
		.hero__stream {
			display: none; /* hidden on very small screens for space */
		}

		.hero__actions {
			gap: 0.65rem;
		}

		.hero__photo-frame {
			max-width: clamp(160px, 60vw, 260px);
		}
	}


	/* ─── Reduce motion ── */
	@media (prefers-reduced-motion: reduce) {
		.hero__label,
		.hero__heading-line,
		.hero__rule,
		.hero__desc,
		.hero__stream,
		.hero__actions,
		.hero__photo-wrap {
			animation: none !important;
			opacity: 1 !important;
			transform: none !important;
		}

		.hero__stream-line,
		.hero__photo-scanline,
		.hero__status-dot {
			animation: none !important;
		}
	}
</style>