<script lang="ts">
	import { onMount } from 'svelte';
	import Background from './Background.svelte';

	interface DataStreamLine {
		id: number;
		text: string;
		delay: number;
		opacity: number;
	}

	let dataStreamLines: DataStreamLine[] = [];
	let currentLineId: number = 0;

	onMount(() => {
		const messages = [
			'> Initializing neural pathways...',
			'> Loading digital consciousness...',
			'> Connecting to mainframe...',
			'> Streaming consciousness data...',
			'> Compiling biographical matrix...',
			'> Configuring portfolio interface...',
			'> System ready for navigation...',
			'> > _'
		];

		// Generate initial data stream lines
		messages.forEach((msg, idx) => {
			setTimeout(
				() => {
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
					if (dataStreamLines.length > 6) {
						dataStreamLines = dataStreamLines.slice(-6);
					}
				},
				idx * 300
			);
		});

		// Add new random messages periodically
		const interval = setInterval(() => {
			const randomMessages = [
				'> Scanning portfolio assets...',
				'> Updating skill matrix...',
				'> Buffering experience data...',
				'> Refreshing project cache...',
				'> Syncing web presence...',
				'> > _'
			];

			const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];

			dataStreamLines = [
				...dataStreamLines,
				{
					id: currentLineId++,
					text: randomMsg,
					delay: 0,
					opacity: 1
				}
			];

			if (dataStreamLines.length > 6) {
				dataStreamLines = dataStreamLines.slice(-6);
			}
		}, 5000);

		return () => clearInterval(interval);
	});

	const handleContactMe = () => {
		// Scroll to contact section or trigger modal
		console.log('Contact Me clicked');
	};

	const handleLearnMore = () => {
		// Scroll to about section
		console.log('Learn More clicked');
	};
</script>

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
		<div class="terminal-content">
			<!-- Left pane: Title and text -->
			<div class="pane pane-left">
				<h1 class="portfolio-title">
					<span class="glitch" data-text="Oleksandr Dorokhov">Oleksandr Dorokhov</span>
					<span class="subtitle glitch" data-text="Full-stack web-dev"
						>Full-stack web-dev</span
					>
				</h1>
				<p class="portfolio-subtitle">
					Crafting digital experiences for businesses and beyond, where code meets creativity in
					the cybernetic frontier.
				</p>

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

			<!-- Right pane: Image -->
			<div class="pane pane-right">
				<div class="image-container">
					<div class="image-frame">
						<!-- svelte-ignore a11y_img_redundant_alt -->
						<img src="/your-photo.jpg" alt="Oleksandr Dorokhov's Photo" />
						<div class="frame-glitch"></div>
						<div class="frame-border"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Terminal footer with scanlines effect -->
		<div class="terminal-footer">
			<div class="scanlines"></div>
		</div>
	</div>

	<!-- Action buttons -->
	<div class="button-container">
		<button class="action-btn contact-btn" on:click={handleContactMe}>
			<span class="btn-text">CONTACT.ME()</span>
			<span class="btn-glyph">→</span>
		</button>
		<button class="action-btn learn-btn" on:click={handleLearnMore}>
			<span class="btn-text">LEARN_MORE()</span>
			<span class="btn-glyph">→</span>
		</button>
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
		position: relative;
		width: 100%;
		min-height: 100dvh;
		/* background: linear-gradient(135deg, #0a0e27 0%, #1a0a2e 50%, #0a0e27 100%); */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		overflow: hidden;
		gap: 3rem;
	}

	/* Terminal Window */
	.terminal-window {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1200px;
		background: rgba(6, 6, 10, 0.75);
		border: 3px solid var(--cp-cyan);
		border-radius: 8px;
		backdrop-filter: blur(20px);
		box-shadow: 0 0 40px rgba(0, 245, 255, 0.4), inset 0 0 40px rgba(0, 245, 255, 0.05);
		overflow: hidden;
		animation: borderGlow 3s ease-in-out infinite;
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

	/* Terminal Header */
	.terminal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(90deg, rgba(0, 245, 255, 0.1) 0%, transparent 100%);
		border-bottom: 2px solid rgba(0, 245, 255, 0.3);
		padding: 0.75rem 1.5rem;
		font-size: 0.9rem;
		color: var(--cp-green);
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.title-text {
		color: var(--cp-green);
		font-weight: bold;
		letter-spacing: 2px;
		text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
	}

	.header-controls {
		display: flex;
		gap: 0.8rem;
	}

	.control-btn {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--cp-cyan);
		box-shadow: 0 0 8px rgba(0, 245, 255, 0.6);
	}

	/* Terminal Content */
	.terminal-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		padding: 2rem;
		min-height: 400px;
	}

	@media (max-width: 768px) {
		.terminal-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			padding: 1.5rem;
			min-height: auto;
		}
	}

	/* Panes */
	.pane {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.pane-left {
		gap: 1.5rem;
	}

	/* Portfolio Title */
	.portfolio-title {
		font-size: clamp(1.5rem, 5vw, 3.5rem);
		font-weight: 700;
		margin: 0;
		line-height: 1.2;
		color: var(--cp-cyan);
		text-shadow: 0 0 20px rgba(0, 245, 255, 0.6);
		letter-spacing: -1px;
	}

	.glitch {
		position: relative;
		display: block;
		color: var(--cp-cyan);
		animation: glitch 3s ease-in-out infinite;
	}

	.glitch[data-text]::before {
		content: attr(data-text);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: var(--cp-bg);
		color: var(--cp-pink);
		padding: inherit;
		z-index: -1;
		text-shadow: -2px 0 var(--cp-cyan);
		opacity: 0.75;
		animation: glitchBefore 0.3s ease-in-out infinite;
	}

	.glitch[data-text]::after {
		content: attr(data-text);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: var(--cp-bg);
		color: var(--cp-cyan);
		padding: inherit;
		z-index: -2;
		text-shadow: 2px 0 var(--cp-pink);
		opacity: 0.75;
		animation: glitchAfter 0.3s ease-in-out infinite;
	}

	@keyframes glitch {
		0%,
		100% {
			clip-path: inset(0 0 0 0);
		}
		20% {
			clip-path: inset(25% 0 58% 0);
		}
		40% {
			clip-path: inset(10% 0 61% 0);
		}
		60% {
			clip-path: inset(29% 0 12% 0);
		}
		80% {
			clip-path: inset(83% 0 11% 0);
		}
	}

	@keyframes glitchBefore {
		0% {
			clip-path: inset(81% 0 19% 0);
			transform: translate(-2px, -3px);
		}
		20% {
			clip-path: inset(20% 0 65% 0);
			transform: translate(2px, 3px);
		}
		40% {
			clip-path: inset(42% 0 1% 0);
			transform: translate(-2px, 2px);
		}
		60% {
			clip-path: inset(18% 0 71% 0);
			transform: translate(2px, -1px);
		}
		80% {
			clip-path: inset(69% 0 6% 0);
			transform: translate(-1px, 3px);
		}
		100% {
			clip-path: inset(23% 0 58% 0);
			transform: translate(0);
		}
	}

	@keyframes glitchAfter {
		0% {
			clip-path: inset(25% 0 58% 0);
			transform: translate(2px, 1px);
		}
		20% {
			clip-path: inset(80% 0 6% 0);
			transform: translate(-2px, 2px);
		}
		40% {
			clip-path: inset(65% 0 15% 0);
			transform: translate(2px, -3px);
		}
		60% {
			clip-path: inset(17% 0 58% 0);
			transform: translate(-1px, -2px);
		}
		80% {
			clip-path: inset(16% 0 23% 0);
			transform: translate(2px, 2px);
		}
		100% {
			clip-path: inset(69% 0 22% 0);
			transform: translate(0);
		}
	}

	.subtitle {
		font-size: clamp(1rem, 3vw, 1.8rem);
		color: var(--cp-pink);
		text-shadow: 0 0 15px rgba(255, 0, 85, 0.5);
		margin: 0;
	}

	/* Portfolio Subtitle */
	.portfolio-subtitle {
		font-size: clamp(0.85rem, 2vw, 1.1rem);
		color: var(--cp-lime);
		text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
		line-height: 1.6;
		margin: 0;
		max-width: 600px;
	}

	/* Data Stream Window */
	.data-stream-window {
		background: rgba(0, 20, 40, 0);
		border: 2px solid rgba(0, 255, 136, 0.5);
		border-radius: 4px;
		padding: 1rem;
		font-size: clamp(0.75rem, 1.5vw, 0.95rem);
		color: var(--cp-green);
		overflow-y: auto;
		max-height: 180px;
		margin-top: 1rem;
		background-clip: padding-box;
		backdrop-filter: blur(10px);
	}

	.stream-line {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		animation: fadeIn 0.5s ease-out;
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
	}

	.stream-text {
		color: var(--cp-green);
		white-space: nowrap;
		overflow: hidden;
		animation: typing 0.5s steps(30, end);
	}

	@keyframes typing {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	/* Right Pane - Image */
	.pane-right {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.image-container {
		width: 100%;
		max-width: 350px;
		aspect-ratio: 1;
	}

	.image-frame {
		position: relative;
		width: 100%;
		height: 100%;
		border: 3px solid var(--cp-pink);
		border-radius: 4px;
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

	/* Terminal Footer */
	.terminal-footer {
		position: relative;
		height: 20px;
		background: rgba(0, 255, 0, 0.05);
		border-top: 1px solid rgba(0, 255, 136, 0.3);
		overflow: hidden;
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

	/* Action Buttons */
	.button-container {
		display: flex;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
		position: relative;
		z-index: 10;
		margin-top: 1rem;
	}

	.action-btn {
		position: relative;
		padding: 1rem 2rem;
		font-size: clamp(0.9rem, 2vw, 1.1rem);
		font-family: var(--font-mono);
		font-weight: bold;
		border: 2px solid;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		transition: all 0.3s ease;
		letter-spacing: 1px;
		overflow: hidden;
		background: rgba(6, 6, 10, 0.5);
		backdrop-filter: blur(10px);
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

	.contact-btn:hover {
		color: var(--cp-bg);
		background: rgba(0, 245, 255, 0.3);
		box-shadow: 0 0 20px rgba(0, 245, 255, 0.6), inset 0 0 20px rgba(0, 245, 255, 0.2);
		text-shadow: 0 0 20px rgba(0, 245, 255, 0.8);
		transform: translateX(4px);
	}

	.contact-btn:active {
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

	.learn-btn:hover {
		color: var(--cp-bg);
		background: rgba(255, 0, 85, 0.3);
		box-shadow: 0 0 20px rgba(255, 0, 85, 0.6), inset 0 0 20px rgba(255, 0, 85, 0.2);
		text-shadow: 0 0 20px rgba(255, 0, 85, 0.8);
		transform: translateX(4px);
	}

	.learn-btn:active {
		transform: translateX(2px) scale(0.98);
		box-shadow: 0 0 30px rgba(255, 0, 85, 0.8), inset 0 0 30px rgba(255, 0, 85, 0.3);
	}

	.btn-text {
		letter-spacing: 1px;
	}

	.btn-glyph {
		font-size: 1.3em;
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

	/* Floating Accent Elements */
	.accent-element {
		position: absolute;
		pointer-events: none;
		opacity: 0.15;
	}

	.accent-1 {
		width: 200px;
		height: 200px;
		top: 10%;
		right: 5%;
		background: radial-gradient(circle, rgba(0, 255, 255, 0.5) 0%, transparent 70%);
		border-radius: 50%;
		animation: float 8s ease-in-out infinite;
		z-index: 0;
	}

	.accent-2 {
		width: 150px;
		height: 150px;
		bottom: 15%;
		left: 5%;
		background: radial-gradient(circle, rgba(255, 0, 255, 0.5) 0%, transparent 70%);
		border-radius: 50%;
		animation: float 10s ease-in-out infinite reverse;
		z-index: 0;
	}

	.accent-3 {
		width: 100px;
		height: 100px;
		top: 50%;
		left: 50%;
		background: radial-gradient(circle, rgba(0, 255, 136, 0.5) 0%, transparent 70%);
		border-radius: 50%;
		animation: float 12s ease-in-out infinite;
		z-index: 0;
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

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.hero-container {
			padding: 1rem;
			gap: 2rem;
		}

		.terminal-window {
			max-width: 100%;
		}

		.terminal-content {
			padding: 1.5rem;
		}

		.portfolio-title {
			font-size: 1.5rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.button-container {
			gap: 1rem;
			width: 100%;
			margin-top: 0.5rem;
		}

		.action-btn {
			flex: 1;
			justify-content: center;
			min-width: 180px;
		}

		.image-container {
			max-width: 280px;
		}

		.data-stream-window {
			max-height: 140px;
		}

		.accent-element {
			opacity: 0.08;
		}
	}

	@media (max-width: 480px) {
		.hero-container {
			padding: 0.75rem;
			min-height: auto;
			gap: 1.5rem;
		}

		.terminal-window {
			border-width: 2px;
		}

		.terminal-header {
			padding: 0.5rem 1rem;
			font-size: 0.8rem;
		}

		.terminal-content {
			gap: 1rem;
			padding: 1rem;
			min-height: auto;
		}

		.portfolio-title {
			font-size: 1.2rem;
		}

		.subtitle {
			font-size: 0.9rem;
		}

		.portfolio-subtitle {
			font-size: 0.8rem;
			line-height: 1.5;
		}

		.data-stream-window {
			max-height: 120px;
			font-size: 0.7rem;
		}

		.button-container {
			gap: 0.75rem;
			flex-direction: column;
		}

		.action-btn {
			width: 100%;
			padding: 0.8rem 1.5rem;
			font-size: 0.95rem;
			min-width: 100%;
		}

		.image-container {
			max-width: 250px;
		}

		.image-frame {
			border-width: 2px;
		}

		.control-btn {
			width: 10px;
			height: 10px;
		}
	}
</style>
