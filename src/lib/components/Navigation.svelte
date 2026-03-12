<script lang="ts">
	import { menuItems, type MenuItem } from '../data/menu';

	// ─── State ────────────────────────────────────────────────────────────────
	let isMobileMenuOpen: boolean = false;
	let activeItem: number | null = null;

	// ─── Handlers ─────────────────────────────────────────────────────────────
	function toggleMenu(): void {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu(): void {
		isMobileMenuOpen = false;
	}

	function setActive(id: number): void {
		activeItem = id;
	}
</script>

<svelte:head>
	<!-- Cyberpunk fonts: Orbitron (headers/logo) + Share Tech Mono (menu) + Rajdhani (body) -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<header class="header" class:menu-open={isMobileMenuOpen}>
	<!-- Animated border bottom -->
	<div class="border-line" aria-hidden="true"></div>

	<!-- Scanline overlay -->
	<div class="scanlines" aria-hidden="true"></div>

	<nav class="nav" aria-label="Main navigation">
		<!-- ── Logo ─────────────────────────────────────────────── -->
		<a href="/" class="logo" aria-label="Home">
            <img src="src\lib\assets\images\logo-light.svg" class="image" alt="Logo">
			<span class="logo-bracket" aria-hidden="true">[</span>
			<span class="logo-name">
				Oleksandr
				<span class="logo-sep" aria-hidden="true">//</span>
				Dorokhov
			</span>
			<span class="logo-bracket" aria-hidden="true">]</span>
			<span class="logo-cursor" aria-hidden="true">_</span>
		</a>

		<!-- ── Desktop Menu ──────────────────────────────────────── -->
		<ul class="menu desktop-menu" role="list">
			{#each menuItems as item (item.id)}
				<li class="menu-item">
					<a
						href={item.href}
						class="nav-link"
						class:active={activeItem === item.id}
						aria-label={item.label}
						on:click={() => setActive(item.id)}
					>
						<span class="nav-icon" aria-hidden="true">{@html item.icon}</span>
						<span class="nav-label">{item.label}</span>
						<span class="nav-underline" aria-hidden="true"></span>
					</a>
				</li>
			{/each}
		</ul>

		<!-- ── Actions ───────────────────────────────────────────── -->
		<div class="actions">
			<a href="#contact" class="cta-btn" aria-label="Contact me">
				<span class="cta-inner">
					<span class="cta-icon" aria-hidden="true">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
						</svg>
					</span>
					CONTACT_ME
				</span>
				<span class="cta-glitch" aria-hidden="true">CONTACT_ME</span>
			</a>

			<!-- Burger -->
			<button
				class="burger"
				class:open={isMobileMenuOpen}
				aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={isMobileMenuOpen}
				on:click={toggleMenu}
			>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</button>
		</div>
	</nav>

	<!-- ── Mobile Drawer ─────────────────────────────────────────── -->
	{#if isMobileMenuOpen}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="mobile-overlay" on:click={closeMobileMenu} aria-hidden="true"></div>
		<div class="mobile-menu" role="dialog" aria-label="Mobile navigation">
			<div class="mobile-header" aria-hidden="true">
				<span class="mobile-tag">&lt;nav&gt;</span>
			</div>
			<ul class="mobile-list" role="list">
				{#each menuItems as item, i (item.id)}
					<li class="mobile-item" style="--i: {i}">
						<a
							href={item.href}
							class="mobile-link"
							class:active={activeItem === item.id}
							aria-label={item.label}
							on:click={() => { setActive(item.id); closeMobileMenu(); }}
						>
							<span class="mobile-index" aria-hidden="true">0{i + 1}</span>
							<span class="mobile-icon" aria-hidden="true">{@html item.icon}</span>
							<span class="mobile-label">{item.label}</span>
							<span class="mobile-arrow" aria-hidden="true">›</span>
						</a>
					</li>
				{/each}
			</ul>
			<div class="mobile-cta">
				<a href="#contact" class="cta-btn mobile-cta-btn" on:click={closeMobileMenu}>
					<span class="cta-inner">CONTACT_ME</span>
				</a>
			</div>
			<div class="mobile-footer" aria-hidden="true">
				<span class="mobile-tag">&lt;/nav&gt;</span>
			</div>
		</div>
	{/if}
</header>

<style>
	/* ─── CSS Variables ───────────────────────────────────────────────── */
	:root {
		--cp-bg:          #06060a;
		--cp-bg-glass:    rgba(6, 6, 10, 0.92);
		--cp-cyan:        #00f5ff;
		--cp-pink:        #ff0055;
		--cp-yellow:      #ffe600;
		--cp-purple:      #b300ff;
		--cp-text:        #c8d8e8;
		--cp-muted:       #4a5a6a;
		--cp-border:      rgba(0, 245, 255, 0.12);

		--font-logo:   'Orbitron', sans-serif;
		--font-mono:   'Share Tech Mono', monospace;
		--font-ui:     'Rajdhani', sans-serif;

		--nav-h:       4.5rem;
		--max-w:       1200px;
	}

	/* ─── Header Shell ────────────────────────────────────────────────── */
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		height: var(--nav-h);
		background: var(--cp-bg-glass);
		backdrop-filter: blur(18px) saturate(1.4);
		-webkit-backdrop-filter: blur(18px) saturate(1.4);
		border-bottom: 1px solid var(--cp-border);
		font-family: var(--font-ui);
		overflow: visible;
	}

	/* ─── Animated Gradient Border ────────────────────────────────────── */
	.border-line {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(
			90deg,
			var(--cp-bg)       0%,
			var(--cp-cyan)    15%,
			var(--cp-pink)    35%,
			var(--cp-yellow)  50%,
			var(--cp-purple)  65%,
			var(--cp-cyan)    85%,
			var(--cp-bg)      100%
		);
		background-size: 250% 100%;
		animation: borderFlow 5s linear infinite;
		filter: blur(0.4px);
		box-shadow:
			0 0 6px  0px var(--cp-cyan),
			0 0 14px 0px rgba(0, 245, 255, 0.25);
	}

	@keyframes borderFlow {
		0%   { background-position: 0%   50%; }
		100% { background-position: 250% 50%; }
	}

	/* ─── Scanlines ────────────────────────────────────────────────────── */
	.scanlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0px,
			transparent 3px,
			rgba(0, 245, 255, 0.015) 3px,
			rgba(0, 245, 255, 0.015) 4px
		);
		z-index: 1;
	}

	/* ─── Nav Container ────────────────────────────────────────────────── */
	.nav {
		position: relative;
		z-index: 2;
		height: 100%;
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	/* ─── Logo ─────────────────────────────────────────────────────────── */
    .image {
        width: clamp(3rem, 5vw, 5rem);
        margin-inline: 1rem;
    }
	.logo {
		display: flex;
		align-items: center;
		gap: 0.1em;
		text-decoration: none;
		font-family: var(--font-logo);
		font-size: clamp(0.75rem, 1.5vw, 1rem);
		font-weight: 700;
		color: var(--cp-text);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		white-space: nowrap;
		flex-shrink: 0;
		transition: color 0.3s;
	}

	.logo:hover {
		color: var(--cp-cyan);
	}

	.logo-bracket {
		color: var(--cp-pink);
		font-weight: 900;
	}

	.logo-name {
		padding: 0 0.25em;
	}

	.logo-sep {
		color: var(--cp-cyan);
		margin: 0 0.25em;
	}

	.logo-cursor {
		color: var(--cp-cyan);
		animation: blink 1.1s step-end infinite;
		margin-left: 0.1em;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0; }
	}

	/* ─── Desktop Menu ─────────────────────────────────────────────────── */
	.menu {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.menu-item {
		position: relative;
	}

	.nav-link {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.75rem;
		text-decoration: none;
		color: var(--cp-muted);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		transition: color 0.25s, background 0.25s;
		border: 1px solid transparent;
		clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
	}

	.nav-link:hover,
	.nav-link.active {
		color: var(--cp-cyan);
		background: rgba(0, 245, 255, 0.06);
		border-color: rgba(0, 245, 255, 0.18);
	}

	.nav-link.active {
		color: var(--cp-yellow);
		border-color: rgba(255, 230, 0, 0.3);
		background: rgba(255, 230, 0, 0.05);
	}

	.nav-icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		color: var(--cp-pink);
		transition: color 0.25s;
	}

	.nav-link:hover .nav-icon {
		color: var(--cp-cyan);
	}

	.nav-link.active .nav-icon {
		color: var(--cp-yellow);
	}

	.nav-label {
		position: relative;
	}

	/* ─── Actions ──────────────────────────────────────────────────────── */
	.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
	}

	/* ─── CTA Button ───────────────────────────────────────────────────── */
	.cta-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		padding: 0.5rem 1.4rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--cp-yellow);
		background: transparent;
		border: 1.5px solid var(--cp-yellow);
		clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
		cursor: pointer;
		overflow: hidden;
		transition: color 0.3s;
		white-space: nowrap;
	}

	.cta-inner {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.cta-glitch {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		color: var(--cp-bg);
		background: var(--cp-yellow);
		clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
		transform: translateX(-110%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 3;
	}

	.cta-btn:hover .cta-glitch {
		transform: translateX(0%);
	}

	.cta-btn:hover {
		box-shadow: 0 0 18px rgba(255, 230, 0, 0.45);
	}

	/* ─── Burger ───────────────────────────────────────────────────────── */
	.burger {
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
		gap: 5px;
		width: 2.25rem;
		height: 2.25rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
	}

	.burger-line {
		display: block;
		height: 2px;
		background: var(--cp-cyan);
		border-radius: 0;
		transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.burger-line:nth-child(1) { width: 100%; }
	.burger-line:nth-child(2) { width: 70%; }
	.burger-line:nth-child(3) { width: 50%; }

	.burger.open .burger-line:nth-child(1) {
		width: 100%;
		transform: translateY(7px) rotate(45deg);
		background: var(--cp-pink);
	}

	.burger.open .burger-line:nth-child(2) {
		opacity: 0;
		transform: translateX(-10px);
	}

	.burger.open .burger-line:nth-child(3) {
		width: 100%;
		transform: translateY(-7px) rotate(-45deg);
		background: var(--cp-pink);
	}

	/* ─── Mobile Overlay ───────────────────────────────────────────────── */
	.mobile-overlay {
		position: fixed;
		inset: var(--nav-h) 0 0 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 98;
		backdrop-filter: blur(2px);
	}

	/* ─── Mobile Drawer ────────────────────────────────────────────────── */
	.mobile-menu {
		position: fixed;
		top: var(--nav-h);
		right: 0;
		width: min(340px, 100vw);
		height: calc(100dvh - var(--nav-h));
		background: rgba(6, 6, 12, 0.98);
		border-left: 1px solid rgba(0, 245, 255, 0.15);
		z-index: 99;
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		gap: 0;
		animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow-y: auto;
	}

	@keyframes slideIn {
		from { transform: translateX(100%); opacity: 0; }
		to   { transform: translateX(0%);  opacity: 1; }
	}

	.mobile-tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--cp-muted);
		letter-spacing: 0.05em;
	}

	.mobile-header { margin-bottom: 1.25rem; }
	.mobile-footer { margin-top: 1.25rem; }

	.mobile-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.mobile-item {
		animation: fadeUp 0.3s ease both;
		animation-delay: calc(var(--i) * 0.07s);
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(12px); }
		to   { opacity: 1; transform: translateY(0);    }
	}

	.mobile-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 0.75rem;
		text-decoration: none;
		border: 1px solid transparent;
		border-left: 2px solid transparent;
		color: var(--cp-muted);
		font-family: var(--font-ui);
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition: all 0.25s;
	}

	.mobile-link:hover,
	.mobile-link.active {
		color: var(--cp-cyan);
		border-color: rgba(0, 245, 255, 0.2);
		border-left-color: var(--cp-cyan);
		background: rgba(0, 245, 255, 0.05);
		padding-left: 1rem;
	}

	.mobile-index {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--cp-pink);
		min-width: 1.5rem;
	}

	.mobile-icon {
		display: flex;
		align-items: center;
		color: var(--cp-cyan);
		opacity: 0.7;
	}

	.mobile-label { flex: 1; }

	.mobile-arrow {
		font-size: 1.2rem;
		color: var(--cp-muted);
		transition: transform 0.25s, color 0.25s;
	}

	.mobile-link:hover .mobile-arrow {
		transform: translateX(4px);
		color: var(--cp-cyan);
	}

	.mobile-cta {
		margin-top: 2rem;
	}

	.mobile-cta-btn {
		display: flex;
		justify-content: center;
		width: 100%;
		clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
	}

	/* ─── Responsive ───────────────────────────────────────────────────── */
	@media (max-width: 960px) {
        .cta-btn {
            display: none;
        }
		.menu {
			gap: 0rem;
		}

		.nav-link {
			padding: 0.4rem 0.55rem;
			font-size: 0.72rem;
		}
	}

	@media (max-width: 768px) {
		.desktop-menu {
			display: none;
		}

		.burger {
			display: flex;
		}
	}

	@media (max-width: 480px) {
		.nav {
			padding: 0 1rem;
		}

		.logo {
			font-size: 0.7rem;
		}
	}
</style>