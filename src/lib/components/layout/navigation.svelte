<script lang="ts">
	import { menuItems } from '$lib/data/menu';
	import type { MenuItem } from '$lib/types';
	import { onDestroy } from 'svelte';
	import logoDark from '$lib/assets/images/logo-dark.svg';

	const bodyNoScrollClass = 'navigation-mobile-menu-open';

	// State
	let isMobileMenuOpen: boolean = false;
	let activeItem: number | null = null;
	let isVisible: boolean = true;

	// Keep document scroll locked via body class when mobile menu is open
	$: {
		if (typeof document !== 'undefined') {
			document.body.classList.toggle(bodyNoScrollClass, isMobileMenuOpen);
		}
	}

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.classList.remove(bodyNoScrollClass);
		}
	});

	// Handlers
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

<!-- MARKUP -->
<header class="header" class:menu-open={isMobileMenuOpen} class:hidden={!isVisible}>

	<!-- Scanline overlay -->
	<div class="scanlines" aria-hidden="true"></div>

	<nav class="nav" aria-label="Main navigation">
		<!-- ── Logo ─────────────────────────────────────────────── -->
		<a href="/" class="logo" aria-label="Home">
	            <img src={logoDark} class="image" alt="Logo" loading="eager" decoding="async">
			<span class="logo-text-wrap">
				<span class="logo-bracket" aria-hidden="true">[</span>
				<span class="logo-name">
					Oleksandr
					<span class="logo-sep" aria-hidden="true">//</span>
					Dorokhov
				</span>
				<span class="logo-bracket" aria-hidden="true">]</span>
				<span class="logo-cursor" aria-hidden="true">_</span>
			</span>
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

	<!-- Animated border bottom -->
	<div class="border-line" aria-hidden="true"></div>

	<!-- ── Mobile Drawer ─────────────────────────────────────────── -->
	{#if isMobileMenuOpen}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
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


	/* ─── Header Shell ────────────────────────────────────────────────── */
	.header {
		position: relative;
		inset: 0;
		width: 100%;
		height: var(--nav-h);
		z-index: 100;
		background: var(--cp-bg-glass);
		backdrop-filter: blur(18px) saturate(1.4);
		-webkit-backdrop-filter: blur(18px) saturate(1.4);
		font-family: var(--font-ui);
		font-weight: 400;
		font-style: normal;
		overflow: visible;
		transition: transform 0.3s ease-out;
	}

	.header.hidden {
		transform: translateY(-100%);
	}

	:global(body.navigation-mobile-menu-open) {
		overflow: hidden !important;
		overscroll-behavior: none !important;
		touch-action: none !important;
	}

	/* ─── Animated Gradient Border ────────────────────────────────────── */
	.border-line {
		position: relative;
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
        width: clamp(3rem, 10vw, 6rem);
        margin-inline: 1rem;
    }
	.logo {
		display: flex;
		align-items: center;
		gap: 0.1em;
		text-decoration: none;
		font-family: var(--font-bionical);
		font-size: clamp(0.5rem, 1.2vw, 1rem);
		font-weight: 700;
		color: var(--cp-text);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		white-space: nowrap;
		flex-shrink: 0;
		transition: color 0.3s;

		@media (max-width: 1250px) {
			flex-direction: column;
			gap: 0.3rem;
		}
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
		font-family: var(--font-bionical);
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

	/* ─── Mobile Drawer ────────────────────────────────────────────────── */
	.mobile-menu {
		position: absolute;
		right: 0;
		width: min(500px, 100vw);
		height: calc(100dvh - var(--nav-h));
		background: var(--cp-bg-glass);
		z-index: 900;
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
		font-family: var(--font-bionical);
		font-weight: 600;
		letter-spacing: 0.12em;
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

	.mobile-label { 
		flex: 1;
		font-size: 0.8rem;
	}

	.mobile-arrow {
		font-size: 1.2rem;
		color: var(--cp-muted);
		transition: transform 0.25s, color 0.25s;
	}

	.mobile-link:hover .mobile-arrow {
		transform: translateX(4px);
		color: var(--cp-cyan);
	}

	/* ─── Responsive ───────────────────────────────────────────────────── */
	@media (max-width: 1250px) {
		
	}

	@media (max-width: 960px) {
		.menu {
			gap: 0rem;
		}

		.nav-link {
			padding: 0.4rem 0.55rem;
			font-size: 0.72rem;
		}
	}

	@media (max-width: 960px) {
		.desktop-menu {
			display: none;
		}

		.burger {
			display: flex;
		}
	}

	@media (max-width: 480px) {
		/* .nav {
			padding: 0 1rem;
		} */
	}

	@media (max-width: 400px) {
		.nav {
			padding-inline: 0.2rem;
			gap: 0;
		}
	}
</style>