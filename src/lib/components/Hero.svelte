<script lang="ts">
	import { onMount } from 'svelte';
	import Background from './Background.svelte';
	import type { DataStreamLine, ActionButton } from '$lib/types/types';
	import {
		DATA_STREAM_MESSAGES,
		RANDOM_MESSAGES,
		ACTION_BUTTONS,
		BREAKPOINTS,
		MAX_VISIBLE_LINES,
		MESSAGE_UPDATE_INTERVAL,
		INITIAL_MESSAGE_DELAY
	} from '$lib/constants/hero.constants';

	// ─── State ───────────────────────────────────────────────────────────

	let dataStreamLines: DataStreamLine[] = [];
	let currentLineId: number = 0;
	let screenWidth: number = typeof window !== 'undefined' ? window.innerWidth : 0;
	let screenHeight: number = typeof window !== 'undefined' ? window.innerHeight : 0;
	let showImage: boolean = true;
	let isMobile: boolean = false;

	// ─── Lifecycle ───────────────────────────────────────────────────────

	onMount((): (() => void) => {
		// Update screen dimensions on mount
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
		updateBreakpoints();

		// Show image on all devices (adapt styling instead of hiding)
		showImage = true;

		// Initialize data stream
		initializeDataStream();

		// Start periodic message updates
		const interval = setInterval(addRandomMessage, MESSAGE_UPDATE_INTERVAL);

		// Handle window resize
		const handleResize = (): void => {
			screenWidth = window.innerWidth;
			screenHeight = window.innerHeight;
			updateBreakpoints();
		};

		window.addEventListener('resize', handleResize);

		return (): void => {
			clearInterval(interval);
			window.removeEventListener('resize', handleResize);
		};
	});

	// ─── Functions ───────────────────────────────────────────────────────

	/**
	 * Update breakpoint states based on current screen width
	 */
	function updateBreakpoints(): void {
		isMobile = screenWidth < BREAKPOINTS.tablet;
	}

	/**
	 * Initialize the data stream with startup messages
	 */
	function initializeDataStream(): void {
		DATA_STREAM_MESSAGES.forEach((msg: string, idx: number) => {
			setTimeout((): void => {
				dataStreamLines = [
					...dataStreamLines,
					{
						id: currentLineId++,
						text: msg,
						delay: idx * 0.3,
						opacity: 1
					}
				];

				// Keep only last 6 lines visible
				if (dataStreamLines.length > MAX_VISIBLE_LINES) {
					dataStreamLines = dataStreamLines.slice(-MAX_VISIBLE_LINES);
				}
			}, idx * INITIAL_MESSAGE_DELAY);
		});
	}

	/**
	 * Add a random message to the data stream
	 */
	function addRandomMessage(): void {
		const randomMsg: string =
			RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];

		dataStreamLines = [
			...dataStreamLines,
			{
				id: currentLineId++,
				text: randomMsg,
				delay: 0,
				opacity: 1
			}
		];

		if (dataStreamLines.length > MAX_VISIBLE_LINES) {
			dataStreamLines = dataStreamLines.slice(-MAX_VISIBLE_LINES);
		}
	}

	/**
	 * Handle contact button click
	 */
	function handleActionButtonClick(action: ActionButton['action']): void {
		switch (action) {
			case 'contact':
				// Scroll to contact section or trigger modal
				console.log('Contact Me clicked');
				break;
			case 'learn-more':
				// Scroll to about section
				console.log('Learn More clicked');
				break;
			default:
				console.log('Action triggered:', action);
		}
	}
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<section class="hero-container">
	<!-- Background dynamic elements -->
	<Background />

	<!-- Main terminal window -->
	<div class="terminal-window">
		<!-- Terminal header bar -->
		<div class="terminal-header">
			<div class="header-title">
				<span class="title-text">PORTFOLIO_CORE.EXE</span>
			</div>
			<div class="header-controls">
				<div class="control-btn"></div>
				<div class="control-btn"></div>
				<div class="control-btn"></div>
			</div>
		</div>

		<!-- Terminal content -->
		<div class="terminal-content" class:single-column={isMobile}>
			<!-- Left pane: Title and text -->
			<div class="pane pane-left">
				<h1 class="portfolio-title">
					<span class="title" data-text="Full-Stack Developer & Modern Web Architect">
						Full-Stack Developer & Modern Web Architect
					</span>

					<span class="subtitle" data-text="High-Performance Solutions from Concept to Deployment">
						High-Performance Solutions from Concept to Deployment
					</span>
				</h1>

				<h2 class="portfolio-subtitle">
					Crafting seamless digital experiences with React, Svelte, PostgreSQL and more. Where clean code meets creativity in the cybernetic frontier.
				</h2>

				<!-- Data stream window -->
				<div class="data-stream-window">
					{#each dataStreamLines as line (line.id)}
						<div
							class="stream-line"
							style="--fade-delay: {line.delay}s; opacity: {line.opacity};"
						>
							<span class="stream-prompt">$</span>
							<span class="stream-text">{line.text}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right pane: Image - shown on all devices with adaptive sizing -->
			{#if showImage}
				<div class="pane pane-right">
					<div class="image-container">
						<div class="image-frame">
							<img src="/src/lib/assets/images/od-2.webp" alt="Oleksandr Dorokhov" />
							<div class="frame-glitch"></div>
							<div class="frame-border"></div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Terminal footer with scanlines effect -->
		<div class="terminal-footer">
			<div class="scanlines"></div>
		</div>
	</div>

	<!-- Action buttons -->
	<div class="button-container">
		{#each ACTION_BUTTONS as button (button.id)}
			<button
				class="action-btn {button.className}"
				on:click={() => handleActionButtonClick(button.action)}
				aria-label={button.label}
				type="button"
			>
				<span class="btn-text">{button.label}</span>
				<span class="btn-glyph">→</span>
			</button>
		{/each}
	</div>

	<!-- Floating accent elements -->
	<div class="accent-element accent-1"></div>
	<div class="accent-element accent-2"></div>
	<div class="accent-element accent-3"></div>
</section>

<style lang="postcss">
	:global(html, body) {
		background-color: var(--cp-bg);
		color: var(--cp-cyan);
		font-family: var(--font-mono);
		overflow-x: hidden;
	}

	.hero-container {
		/* Height calculation: Full viewport minus navigation height */
		position: relative;
		width: 100%;
		height: calc(100dvh - var(--nav-h));
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: clamp(1rem, 3vw, 2rem);
		overflow: hidden;
		gap: clamp(1.5rem, 3vw, 3rem);
	}

	/* ─── Terminal Window ─────────────────────────────────────────────── */
	.terminal-window {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: clamp(320px, 95vw, 1200px);
		background: rgba(6, 6, 10, 0.75);
		border: clamp(2px, 0.2vw, 3px) solid var(--cp-cyan);
		border-radius: clamp(4px, 0.5vw, 8px);
		backdrop-filter: blur(20px);
		box-shadow: 0 0 40px rgba(0, 245, 255, 0.4), inset 0 0 40px rgba(0, 245, 255, 0.05);
		overflow: hidden;
		animation: borderGlow 3s ease-in-out infinite;
		display: flex;
		flex-direction: column;
		max-height: 80%;
	}

	@keyframes borderGlow {
		0%,
		100% {
			box-shadow: 0 0 40px rgba(0, 245, 255, 0.4), inset 0 0 40px rgba(0, 245, 255, 0.05);
			border-color: var(--cp-cyan);
		}
		50% {
			box-shadow: 0 0 60px rgba(0, 245, 255, 0.6), inset 0 0 60px rgba(0, 245, 255, 0.1);
			border-color: var(--cp-cyan);
		}
	}

	/* ─── Terminal Header ──────────────────────────────────────────────── */
	.terminal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(90deg, rgba(0, 245, 255, 0.1) 0%, transparent 100%);
		border-bottom: clamp(1px, 0.1vw, 2px) solid rgba(0, 245, 255, 0.3);
		padding: clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 2vw, 1.5rem);
		font-size: clamp(0.75rem, 1.5vw, 0.9rem);
		color: var(--cp-green);
		flex-shrink: 0;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
	}

	.title-text {
		color: var(--cp-green);
		font-weight: bold;
		letter-spacing: var(--tracking-wide);
		text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.header-controls {
		display: flex;
		gap: clamp(0.5rem, 1vw, 0.8rem);
		flex-shrink: 0;
	}

	.control-btn {
		width: clamp(8px, 1.5vw, 12px);
		height: clamp(8px, 1.5vw, 12px);
		border-radius: 50%;
		background: var(--cp-cyan);
		box-shadow: 0 0 8px rgba(0, 245, 255, 0.6);
	}

	/* ─── Terminal Content ─────────────────────────────────────────────── */
	.terminal-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(1rem, 3vw, 2rem);
		padding: clamp(1rem, 2vw, 2rem);
		flex: 1;
		align-items: center;
	}

	/* Single column layout for mobile */
	.terminal-content.single-column {
		grid-template-columns: 1fr;
		gap: clamp(1rem, 2vw, 1.5rem);
		padding: clamp(0.75rem, 1.5vw, 1.5rem);
	}

	/* ─── Panes ───────────────────────────────────────────────────────── */
	.pane {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}

	.pane-left {
		gap: clamp(1rem, 2vw, 1.5rem);
	}

	/* ─── Portfolio Title ──────────────────────────────────────────────── */
	.portfolio-title {
		font-size: var(--font-h1);
		margin: 0;
		color: var(--cp-cyan);
		text-shadow: 0 0 20px rgba(0, 245, 255, 0.6);
		display: flex;
		flex-direction: column;
		gap: clamp(0.5rem, 1vw, 1rem);
		line-height: var(--line-heading);
		word-break: break-word;
	}

	.title {
		position: relative;
		display: flex;
		color: var(--cp-cyan);
	}

	.subtitle {
		font-size: var(--font-h2);
		color: var(--cp-pink);
		text-shadow: 0 0 15px rgba(255, 0, 85, 0.5);
		margin: 0;
		line-height: var(--line-heading);
	}

	/* ─── Portfolio Subtitle ───────────────────────────────────────────── */
	.portfolio-subtitle {
		font-size: var(--font-body);
		color: var(--cp-lime);
		text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
		line-height: var(--line-body);
		margin: 0;
		max-width: 100%;
		word-break: break-word;
	}

	/* ─── Data Stream Window ───────────────────────────────────────────── */
	.data-stream-window {
		background: rgba(0, 20, 40, 0);
		border: clamp(1px, 0.1vw, 2px) solid rgba(0, 255, 136, 0.5);
		border-radius: clamp(2px, 0.2vw, 4px);
		padding: clamp(0.75rem, 1.5vw, 1rem);
		font-size: var(--font-caption);
		color: var(--cp-green);
		overflow: hidden;
		height: auto;
		max-height: clamp(120px, 20vh, 180px);
		margin-top: clamp(0.5rem, 1vw, 1rem);
		background-clip: padding-box;
		backdrop-filter: blur(10px);
	}

	.stream-line {
		display: flex;
		gap: clamp(0.3rem, 1vw, 0.5rem);
		margin-bottom: clamp(0.25rem, 0.5vw, 0.5rem);
		animation: fadeIn 0.5s ease-out;
		min-width: 0;
		word-break: break-word;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.stream-prompt {
		color: var(--cp-cyan);
		font-weight: bold;
		flex-shrink: 0;
		min-width: max-content;
	}

	.stream-text {
		color: var(--cp-green);
		white-space: normal;
		overflow-wrap: break-word;
		word-break: break-word;
		animation: typing 0.5s steps(30, end);
		min-width: 0;
	}

	@keyframes typing {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	/* ─── Right Pane - Image ───────────────────────────────────────────── */
	.pane-right {
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 0;
	}

	.image-container {
		width: 100%;
		max-width: clamp(150px, 40vw, 350px);
		aspect-ratio: 1;
	}

	.image-frame {
		position: relative;
		width: 100%;
		height: 100%;
		border: clamp(2px, 0.2vw, 3px) solid var(--cp-pink);
		border-radius: clamp(2px, 0.2vw, 4px);
		overflow: hidden;
		box-shadow: 0 0 30px rgba(255, 0, 85, 0.4), inset 0 0 30px rgba(255, 0, 85, 0.1);
		background: var(--cp-bg);
	}

	.image-frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		opacity: 0.9;
		filter: saturate(1.2) contrast(1.1);
	}

	.frame-glitch {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			180deg,
			rgba(0, 245, 255, 0.1) 0%,
			transparent 50%,
			rgba(255, 0, 85, 0.05) 100%
		);
		pointer-events: none;
		z-index: 2;
		animation: scanlineGlitch 0.15s infinite;
	}

	@keyframes scanlineGlitch {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(2px);
		}
	}

	.frame-border {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 1px solid rgba(255, 0, 85, 0.3);
		pointer-events: none;
		z-index: 3;
		animation: borderPulse 2s ease-in-out infinite;
	}

	@keyframes borderPulse {
		0%,
		100% {
			box-shadow: inset 0 0 10px rgba(255, 0, 85, 0.2);
		}
		50% {
			box-shadow: inset 0 0 20px rgba(255, 0, 85, 0.4);
		}
	}

	/* ─── Terminal Footer ──────────────────────────────────────────────── */
	.terminal-footer {
		position: relative;
		height: clamp(12px, 2vw, 20px);
		background: rgba(0, 255, 0, 0.05);
		border-top: clamp(1px, 0.1vw, 1px) solid rgba(0, 255, 136, 0.3);
		overflow: hidden;
		flex-shrink: 0;
	}

	.scanlines {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.3) 0px,
			rgba(0, 0, 0, 0.3) 1px,
			transparent 1px,
			transparent 2px
		);
		animation: scanlineScroll 0.5s linear infinite;
		pointer-events: none;
	}

	@keyframes scanlineScroll {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(2px);
		}
	}

	/* ─── Action Buttons ───────────────────────────────────────────────── */
	.button-container {
		display: flex;
		gap: clamp(1rem, 3vw, 2rem);
		justify-content: center;
		flex-wrap: wrap;
		position: relative;
		z-index: 10;
		margin-top: clamp(0.5rem, 1vw, 1rem);
		width: 100%;
		max-width: clamp(300px, 95vw, 1200px);
	}

	.action-btn {
		position: relative;
		padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 3vw, 2rem);
		font-size: var(--font-body);
		font-family: var(--font-mono);
		font-weight: bold;
		border: clamp(1px, 0.1vw, 2px) solid;
		border-radius: clamp(2px, 0.2vw, 4px);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: clamp(0.5rem, 1vw, 0.8rem);
		transition: all 0.3s ease;
		letter-spacing: var(--tracking-wide);
		overflow: hidden;
		background: rgba(6, 6, 10, 0.5);
		backdrop-filter: blur(10px);
		white-space: nowrap;
		text-decoration: none;
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.contact-btn {
		color: var(--cp-cyan);
		border-color: var(--cp-cyan);
		text-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
	}

	.contact-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: rgba(0, 245, 255, 0.2);
		transition: left 0.3s ease;
		z-index: -1;
	}

	.contact-btn:hover:not(:disabled) {
		color: var(--cp-bg);
		background: rgba(0, 245, 255, 0.3);
		box-shadow: 0 0 20px rgba(0, 245, 255, 0.6), inset 0 0 20px rgba(0, 245, 255, 0.2);
		text-shadow: 0 0 20px rgba(0, 245, 255, 0.8);
		transform: translateX(4px);
	}

	.contact-btn:active:not(:disabled) {
		transform: translateX(2px) scale(0.98);
		box-shadow: 0 0 30px rgba(0, 245, 255, 0.8), inset 0 0 30px rgba(0, 245, 255, 0.3);
	}

	.learn-btn {
		color: var(--cp-pink);
		border-color: var(--cp-pink);
		text-shadow: 0 0 10px rgba(255, 0, 85, 0.5);
	}

	.learn-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: rgba(255, 0, 85, 0.2);
		transition: left 0.3s ease;
		z-index: -1;
	}

	.learn-btn:hover:not(:disabled) {
		color: var(--cp-bg);
		background: rgba(255, 0, 85, 0.3);
		box-shadow: 0 0 20px rgba(255, 0, 85, 0.6), inset 0 0 20px rgba(255, 0, 85, 0.2);
		text-shadow: 0 0 20px rgba(255, 0, 85, 0.8);
		transform: translateX(4px);
	}

	.learn-btn:active:not(:disabled) {
		transform: translateX(2px) scale(0.98);
		box-shadow: 0 0 30px rgba(255, 0, 85, 0.8), inset 0 0 30px rgba(255, 0, 85, 0.3);
	}

	.btn-text {
		letter-spacing: var(--tracking-wide);
	}

	.btn-glyph {
		font-size: clamp(1rem, 2vw, 1.3em);
		animation: arrowPulse 1s ease-in-out infinite;
	}

	@keyframes arrowPulse {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(4px);
		}
	}

	/* ─── Floating Accent Elements ─────────────────────────────────────── */
	.accent-element {
		position: absolute;
		pointer-events: none;
		opacity: 0.15;
	}

	.accent-1 {
		width: clamp(100px, 20vw, 200px);
		height: clamp(100px, 20vw, 200px);
		top: 10%;
		right: 5%;
		background: radial-gradient(circle, rgba(0, 255, 255, 0.5) 0%, transparent 70%);
		border-radius: 50%;
		animation: float 8s ease-in-out infinite;
		z-index: 0;
	}

	.accent-2 {
		width: clamp(75px, 15vw, 150px);
		height: clamp(75px, 15vw, 150px);
		bottom: 15%;
		left: 5%;
		background: radial-gradient(circle, rgba(255, 0, 255, 0.5) 0%, transparent 70%);
		border-radius: 50%;
		animation: float 10s ease-in-out infinite reverse;
		z-index: 0;
	}

	.accent-3 {
		width: clamp(50px, 10vw, 100px);
		height: clamp(50px, 10vw, 100px);
		top: 50%;
		left: 50%;
		background: radial-gradient(circle, rgba(0, 255, 136, 0.5) 0%, transparent 70%);
		border-radius: 50%;
		animation: float 12s ease-in-out infinite;
		z-index: 0;
		transform: translate(-50%, -50%);
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) scale(1);
		}
		50% {
			transform: translateY(-30px) scale(1.1);
		}
	}

	/* ─── Mobile Adjustments ───────────────────────────────────────────── */
	@media (max-width: 480px) {
		.hero-container {
			all: unset;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			min-height: calc(90dvh - 5rem);
			

			padding: clamp(0.75rem, 2vw, 1rem);
			gap: clamp(1rem, 2vw, 1.5rem);
			padding-top: clamp(1rem, 2vw, 1.5rem);
		}

		.terminal-content {
			grid-template-columns: 1fr;
			gap: clamp(1rem, 2vw, 1.5rem);
			padding: clamp(0.5rem, 1vw, 1rem);
			align-items: start;
		}

		.pane-left {
			gap: clamp(0.75rem, 1vw, 1rem);
		}

		.pane-right {
			width: 100%;
			max-width: 100%;
		}

		.image-container {
			max-width: clamp(250px, 15vw, 300px);
			margin: 0 auto;
		}

		.button-container {
			gap: clamp(0.75rem, 1.5vw, 1rem);
		}

		.action-btn {
			flex: 1;
			min-width: 140px;
			justify-content: center;
		}

		.data-stream-window {
			display: none;
		}

		
		.title {
			font-size: 1.75rem;
		}
		
		.subtitle {
			font-size: 1.5rem;
		}

		.portfolio-subtitle {
			font-size: 0.7rem;
		}
	}

	/* ─── Tablet Adjustments ───────────────────────────────────────────── */
	@media (min-width: 481px) and (max-width: 1024px) {
		.terminal-content {
			grid-template-columns: 1fr;
		}

		.image-container {
			max-width: clamp(180px, 50vw, 300px);
		}
	}

	/* ─── Desktop Adjustments ──────────────────────────────────────────── */
	@media (min-width: 1025px) {
		.terminal-window {
			max-width: min(95vw, 1400px);
		}

		.button-container {
			gap: 2rem;
		}

		.action-btn {
			min-width: 200px;
		}
	}

	/* ─── High-Resolution Display ──────────────────────────────────────── */
	@media (min-width: 1920px) {
		.hero-container {
			padding: 3rem;
			gap: 3rem;
		}

		.terminal-window {
			max-width: 1400px;
		}

		.action-btn {
			padding: 1.25rem 3rem;
			font-size: 1.2rem;
		}
	}

	/* ─── Reduce Motion ───────────────────────────────────────────────── */
	@media (prefers-reduced-motion: reduce) {
		.terminal-window,
		.action-btn,
		.btn-glyph,
		.accent-element,
		.stream-line,
		.frame-glitch,
		.frame-border {
			animation: none;
			transition: none;
		}
	}

	/* ─── Dark Mode / High Contrast ────────────────────────────────────── */
	@media (prefers-contrast: more) {
		.terminal-window {
			border-color: var(--cp-cyan);
			border-width: 3px;
		}

		.action-btn {
			border-width: 2px;
		}
	}
</style>
