<script lang="ts">
	/**
	 * FAQ Component — "System Query" terminal
	 *
	 * Each FAQ item is a self-contained terminal block:
	 *   • Header bar: PID label + 3 window dots
	 *   • Input row: blinking prompt + the command (question)
	 *   • A "RUN" button that triggers the typewriter answer stream
	 *   • Answer pane: lines appear character-by-character, then line-by-line
	 *
	 * Architecture decisions:
	 *   • Typewriter is pure JS string mutation — no DOM walking, no timers
	 *     left alive after the animation completes (all clearInterval/clearTimeout
	 *     on destroy or when a new item opens).
	 *   • Only ONE terminal can be "running" at a time — opening another cancels
	 *     the current one instantly and starts fresh (no stacked timers).
	 *   • All accent colours flow through a single CSS custom property per block.
	 *   • scrollReveal gates section entrance; per-card stagger via CSS --idx.
	 *   • `prefers-reduced-motion`: all answer text appears instantly.
	 *
	 * Content lives entirely in faq.constants.ts — zero hardcoding here.
	 */

	import { onDestroy } from 'svelte';
	import SectionTitle from './SectionTitle.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';
	import { reducedMotion } from '$lib/stores/motion';
	import { createTypewriter, type TypewriterController } from '$lib/utils/typewriter';
	import {
		FAQ_ITEMS,
		FAQ_ACCENT_VARS,
		FAQ_TYPEWRITER_CONFIG,
		type FaqAccent,
	} from '$lib/constants/faq.constants';
	import NeatBackground from './NeatBackground.svelte';
	

	// ─── Types ────────────────────────────────────────────────────────────────

	interface TerminalState {
		/** Which lines have been fully typed */
		completedLines: string[];
		/** The line currently being typed (partial) */
		currentLine: string;
		/** True while the typewriter is running */
		running: boolean;
		/** True once all lines are done */
		done: boolean;
	}

	const DEFAULT_TERMINAL_STATE: TerminalState = {
		completedLines: [],
		currentLine: '',
		running: false,
		done: false,
	};

	// ─── State ────────────────────────────────────────────────────────────────

	let sectionVisible = false;

	/**
	 * Map from item.id → TerminalState.
	 * Using a plain object + reactive reassignment so Svelte tracks it.
	 */
	let terminals: Record<string, TerminalState> = {};

	/** Currently animating item id (only one at a time) */
	let activeId: string | null = null;

	/** Holds the active typewriter controller so we can cancel it */
	let activeTypewriter: TypewriterController | null = null;

	// ─── Helpers ──────────────────────────────────────────────────────────────

	const accentVar = (a: FaqAccent): string => FAQ_ACCENT_VARS[a];

	function getState(id: string): TerminalState {
		return terminals[id] ?? { ...DEFAULT_TERMINAL_STATE };
	}

	function setState(id: string, patch: Partial<TerminalState>): void {
		terminals = {
			...terminals,
			[id]: { ...getState(id), ...patch },
		};
	}

	// ─── Typewriter engine ────────────────────────────────────────────────────

	/**
	 * Cancels any in-progress typewriter immediately.
	 * Safe to call even when nothing is running.
	 */
	function cancelCurrent(): void {
		if (activeTypewriter !== null) {
			activeTypewriter.cancel();
			activeTypewriter = null;
		}
		if (activeId !== null) {
			setState(activeId, { running: false });
			activeId = null;
		}
	}

	/**
	 * Starts streaming the answer for a given FAQ item.
	 * If another item is running it is cancelled first.
	 */
	function runTerminal(id: string): void {
		// If already done, toggle it closed (reset)
		if (getState(id).done) {
			setState(id, { completedLines: [], currentLine: '', running: false, done: false });
			return;
		}

		// If already running this one, do nothing
		if (activeId === id) return;

		// Cancel whatever was running
		cancelCurrent();

		const item = FAQ_ITEMS.find((f) => f.id === id);
		if (!item) return;

		activeId = id;
		setState(id, { completedLines: [], currentLine: '', running: true, done: false });

		// Instant mode for reduced-motion users
		if ($reducedMotion) {
			setState(id, {
				completedLines: item.answerLines,
				currentLine: '',
				running: false,
				done: true,
			});
			activeId = null;
			return;
		}

		activeTypewriter = createTypewriter({
			lines: item.answerLines,
			charDelay: FAQ_TYPEWRITER_CONFIG.charDelay,
			lineDelay: FAQ_TYPEWRITER_CONFIG.lineDelay,
			bootDelay: FAQ_TYPEWRITER_CONFIG.bootDelay,
			onLineStart: () => {
				setState(id, { currentLine: '' });
			},
			onChar: (partialLine) => {
				setState(id, { currentLine: partialLine });
			},
			onLineComplete: (fullLine) => {
				setState(id, {
					completedLines: [...getState(id).completedLines, fullLine],
					currentLine: '',
				});
			},
			onDone: () => {
				setState(id, { currentLine: '', running: false, done: true });
				activeTypewriter = null;
				activeId = null;
			},
		});

		activeTypewriter.start();
	}

	// ─── Cleanup ──────────────────────────────────────────────────────────────

	onDestroy(cancelCurrent);
</script>

<!-- ─── Section ──────────────────────────────────────────────────────────── -->
<section
	class="faq-section"
	class:is-visible={sectionVisible}
	use:scrollReveal={{ threshold: 0.06 }}
	on:reveal={() => (sectionVisible = true)}
	aria-label="Frequently Asked Questions"
	id="faq"
>
	<!-- Background -->
	<NeatBackground 
		flowScale={1}
		colorPressure={1}
		colors={['#06060a', '#4B5D67', '#06060a', '#4B5D67', '#06060a']}
		
	/>


	<!-- Scanlines — consistent with rest of app -->
	<div class="faq-scanlines" aria-hidden="true"></div>

	<!-- ── Inner ──────────────────────────────────────────────────────────── -->
	<div class="faq-inner">

		<SectionTitle
			title="System Query"
			variant="elaborate"
			label="FAQ.exe"
			isVisible={sectionVisible}
		/>

		<!-- ── Terminal grid ─────────────────────────────────────────────── -->
		<div class="faq-grid" role="list" aria-label="FAQ terminals">

			{#each FAQ_ITEMS as item, idx (item.id)}

				{@const state = terminals[item.id] ?? DEFAULT_TERMINAL_STATE}
				{@const accent = accentVar(item.accent)}
				{@const isOpen = state.running || state.done}

				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<article
					class="faq-terminal"
					class:is-open={isOpen}
					class:is-done={state.done}
					style="--accent: {accent}; --idx: {idx};"
					role="listitem"
					aria-label={item.question}
				>

					<!-- ── Terminal header bar ──────────────────────────────── -->
					<div class="faq-terminal__header" aria-hidden="true">
						<span class="faq-terminal__pid">{item.pid}</span>
						<div class="faq-terminal__dots">
							<span class="faq-terminal__dot"></span>
							<span class="faq-terminal__dot"></span>
							<span class="faq-terminal__dot"></span>
						</div>
					</div>

					<!-- ── Question label ───────────────────────────────────── -->
					<div class="faq-terminal__question">
						<span class="faq-terminal__q-label" aria-hidden="true">Q:</span>
						<span class="faq-terminal__q-text">{item.question}</span>
					</div>

					<!-- ── Input row — the command ──────────────────────────── -->
					<div class="faq-terminal__input-row">
						<span class="faq-terminal__prompt" aria-hidden="true">›</span>
						<code class="faq-terminal__cmd">{item.command}</code>

						<!-- RUN button — primary interaction -->
						<button
							class="faq-terminal__run"
							class:is-running={state.running}
							class:is-done={state.done}
							aria-label={state.done ? `Close answer: ${item.question}` : `Run query: ${item.question}`}
							type="button"
							on:click={() => runTerminal(item.id)}
						>
							{#if state.running}
								<span class="faq-terminal__run-spinner" aria-hidden="true"></span>
								<span>RUNNING</span>
							{:else if state.done}
								<span>RESET</span>
								<span class="faq-terminal__run-icon" aria-hidden="true">↺</span>
							{:else}
								<span>RUN</span>
								<span class="faq-terminal__run-icon" aria-hidden="true">▶</span>
							{/if}
						</button>
					</div>

					<!-- ── Answer output pane ───────────────────────────────── -->
					{#if isOpen}
						<div
							class="faq-terminal__output"
							aria-live="polite"
							aria-label="Terminal output"
						>
							<!-- Completed lines -->
							{#each state.completedLines as line, li (li)}
								<div class="faq-terminal__line" class:faq-terminal__line--blank={line === ''}>
									{line}
								</div>
							{/each}

							<!-- Currently typing line (with blinking cursor) -->
							{#if state.running && state.currentLine !== undefined}
								<div class="faq-terminal__line faq-terminal__line--active">
									{state.currentLine}<span class="faq-terminal__cursor" aria-hidden="true">█</span>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Corner brackets — consistent with other cards -->
					<span class="faq-corner faq-corner--tl" aria-hidden="true"></span>
					<span class="faq-corner faq-corner--tr" aria-hidden="true"></span>
					<span class="faq-corner faq-corner--bl" aria-hidden="true"></span>
					<span class="faq-corner faq-corner--br" aria-hidden="true"></span>

				</article>

			{/each}

		</div>

	</div><!-- /faq-inner -->
</section>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
	   SECTION
	══════════════════════════════════════════════════════════════════════ */
	.faq-section {
		position: relative;
		width: 100%;
		background: var(--cp-bg, #06060a);
		overflow: hidden;
	}

	.faq-scanlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.07) 3px,
			rgba(0, 0, 0, 0.07) 4px
		);
	}

	/* ─── Inner — identical pattern to all other sections ── */
	.faq-inner {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: var(--max-w, 1400px);
		margin: 0 auto;
		padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 3rem);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 4rem);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   GRID — 2 columns desktop, 1 column mobile
	══════════════════════════════════════════════════════════════════════ */
	.faq-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: clamp(1rem, 2.5vw, 1.75rem);
		align-items: start;
		/* Reveal gate */
		opacity: 0;
		transform: translateY(28px);
		transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
	}

	.is-visible .faq-grid {
		opacity: 1;
		transform: translateY(0);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   TERMINAL CARD
	══════════════════════════════════════════════════════════════════════ */
	.faq-terminal {
		position: relative;
		display: flex;
		flex-direction: column;
		align-self: start;
		background: rgba(6, 6, 10, 0.6);
		border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
		overflow: hidden;
		/* CSS stagger: each card enters with a small delay based on its index */
		opacity: 0;
		transform: translateY(24px);
		transition:
			border-color 0.3s ease,
			box-shadow   0.3s ease;
	}

	/* Stagger trigger */
	.is-visible .faq-terminal {
		animation: terminalEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: calc(var(--idx, 0) * 0.08s + 0.2s);
	}

	@keyframes terminalEnter {
		from { opacity: 0; transform: translateY(24px); }
		to   { opacity: 1; transform: translateY(0);    }
	}

	/* Open state: stronger border + ambient glow */
	.faq-terminal.is-open {
		border-color: color-mix(in srgb, var(--accent) 50%, transparent);
		box-shadow:
			0 0 24px color-mix(in srgb, var(--accent) 10%, transparent),
			inset 0 0 24px color-mix(in srgb, var(--accent) 4%, transparent);
	}

	/* ─── Corner brackets — same language as ValueProposition ── */
	.faq-corner {
		position: absolute;
		width: 10px;
		height: 10px;
		border-color: var(--accent);
		border-style: solid;
		opacity: 0.3;
		pointer-events: none;
		transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
	}

	.faq-terminal.is-open .faq-corner,
	.faq-terminal:hover .faq-corner {
		opacity: 0.8;
		width: 14px;
		height: 14px;
	}

	.faq-corner--tl { top: 0; left: 0;  border-width: 2px 0 0 2px; }
	.faq-corner--tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
	.faq-corner--bl { bottom: 0; left: 0;  border-width: 0 0 2px 2px; }
	.faq-corner--br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

	/* ═══════════════════════════════════════════════════════════════════════
	   HEADER BAR
	══════════════════════════════════════════════════════════════════════ */
	.faq-terminal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.55rem 0.85rem;
		background: color-mix(in srgb, var(--accent) 7%, rgba(0, 0, 0, 0.4));
		border-bottom: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
		flex-shrink: 0;
	}

	.faq-terminal__pid {
		font-family: var(--font-mono, monospace);
		font-size: 0.58rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
		opacity: 0.65;
	}

	.faq-terminal__dots {
		display: flex;
		gap: 5px;
	}

	.faq-terminal__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
		opacity: 0.35;
	}

	/* Light up dots when active */
	.faq-terminal.is-open .faq-terminal__dot:first-child  { opacity: 0.9; }
	.faq-terminal.is-open .faq-terminal__dot:nth-child(2) { opacity: 0.5; }
	.faq-terminal.is-open .faq-terminal__dot:last-child   { opacity: 0.2; }

	/* ═══════════════════════════════════════════════════════════════════════
	   QUESTION LABEL
	══════════════════════════════════════════════════════════════════════ */
	.faq-terminal__question {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.85rem 0.85rem 0;
	}

	.faq-terminal__q-label {
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--accent);
		opacity: 0.55;
		flex-shrink: 0;
	}

	.faq-terminal__q-text {
		font-family: var(--font-ui, sans-serif);
		font-size: clamp(0.82rem, 1.3vw, 0.96rem);
		font-weight: 500;
		color: rgba(226, 232, 240, 0.9);
		line-height: 1.4;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   INPUT ROW
	══════════════════════════════════════════════════════════════════════ */
	.faq-terminal__input-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.85rem 0.75rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.faq-terminal__prompt {
		font-family: var(--font-mono, monospace);
		font-size: 1rem;
		color: var(--accent);
		flex-shrink: 0;
		line-height: 1;
		opacity: 0.8;
	}

	.faq-terminal__cmd {
		font-family: var(--font-mono, monospace);
		font-size: clamp(0.6rem, 1.1vw, 0.68rem);
		color: rgba(0, 245, 255, 0.55);
		letter-spacing: 0.06em;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* ─── RUN button ── */
	.faq-terminal__run {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.75rem;
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background   0.2s ease,
			border-color 0.2s ease,
			color        0.2s ease,
			box-shadow   0.2s ease,
			transform    0.15s ease;
		/* Chamfer — consistent with CyberButton */
		clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
		outline: none;
	}

	.faq-terminal__run:hover:not(:disabled) {
		background: color-mix(in srgb, var(--accent) 22%, transparent);
		border-color: color-mix(in srgb, var(--accent) 70%, transparent);
		box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 30%, transparent);
		transform: scale(1.04);
	}

	.faq-terminal__run:active:not(:disabled) {
		transform: scale(0.97);
	}

	.faq-terminal__run:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Done / reset state */
	.faq-terminal__run.is-done {
		color: var(--cp-muted, #4a5568);
		border-color: rgba(255,255,255,0.12);
		background: rgba(255,255,255,0.04);
	}

	.faq-terminal__run.is-done:hover {
		color: rgba(226, 232, 240, 0.8);
		border-color: rgba(255,255,255,0.3);
		background: rgba(255,255,255,0.08);
		box-shadow: none;
	}

	/* Running: disabled appearance */
	.faq-terminal__run.is-running {
		opacity: 0.65;
		cursor: wait;
		pointer-events: none;
	}

	/* Spinner inside RUN while running */
	.faq-terminal__run-spinner {
		display: inline-block;
		width: 0.65em;
		height: 0.65em;
		border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: runSpin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes runSpin {
		to { transform: rotate(360deg); }
	}

	.faq-terminal__run-icon {
		font-size: 0.75em;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   ANSWER OUTPUT PANE
	══════════════════════════════════════════════════════════════════════ */
	.faq-terminal__output {
		padding: 0.75rem 0.85rem 0.9rem;
		display: flex;
		flex-direction: column;
		/* Slide open smoothly */
		animation: outputOpen 0.3s ease both;
	}

	@keyframes outputOpen {
		from { opacity: 0; transform: translateY(-6px); }
		to   { opacity: 1; transform: translateY(0);    }
	}

	.faq-terminal__line {
		font-family: var(--font-mono, monospace);
		font-size: clamp(0.62rem, 1.1vw, 0.72rem);
		line-height: 1.65;
		color: rgba(0, 255, 136, 0.72);
		white-space: pre-wrap;     /* preserve spacing + wrap text on narrow screens */
		word-break: break-word;    /* ensure long words don't overflow */
		overflow-wrap: break-word;
	}

	/* Blank spacer line */
	.faq-terminal__line--blank {
		min-height: 0.9em;
	}

	/* Actively-typing line */
	.faq-terminal__line--active {
		color: rgba(0, 255, 136, 0.9);
	}

	/* Blinking block cursor */
	.faq-terminal__cursor {
		display: inline-block;
		color: var(--accent);
		animation: cursorBlink 0.9s step-end infinite;
		font-size: 0.85em;
		vertical-align: baseline;
		line-height: 1;
	}

	@keyframes cursorBlink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0; }
	}

	/* Special line colouring — lines starting with [OK] get accent colour */
	.faq-terminal__line:has([data-ok]) {
		color: var(--accent);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   RESPONSIVE
	══════════════════════════════════════════════════════════════════════ */

	/* Tablet — keep 2 cols with tighter gap */
	@media (max-width: 900px) {
		.faq-grid {
			gap: 1rem;
		}
	}

	/* Mobile — single column */
	@media (max-width: 640px) {
		.faq-grid {
			grid-template-columns: 1fr;
		}

		.faq-inner {
			padding-inline: 0.75rem;
		}

		.faq-terminal__cmd {
			display: none; /* too narrow; question label is enough */
		}
	}

	/* Very small phones */
	@media (max-width: 380px) {
		.faq-terminal__q-text {
			font-size: 0.78rem;
		}
	}

	/* ─── Reduce motion ── */
	@media (prefers-reduced-motion: reduce) {
		.faq-terminal,
		.faq-grid,
		.faq-terminal__output,
		.faq-terminal__run-spinner,
		.faq-terminal__cursor {
			animation: none !important;
			transition: none !important;
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>