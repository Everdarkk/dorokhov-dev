<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { reducedMotion } from '$lib/stores';
	import { menuItems } from '$lib/data/menu';
	import { NAV_SCROLL, NAV_TRANSITION } from '$lib/constants/navigation';
	import logoLight from '$lib/assets/images/logo-light.svg';

	const BODY_NO_SCROLL = 'navigation-mobile-menu-open';

	// ─── State ────────────────────────────────────────────────────────────────
	let isMobileMenuOpen = $state(false);
	let isVisible        = $state(true);
	let isScrolled       = $state(false);
	let lockedScrollY    = 0;
	let wasMenuOpen      = false;

	// ─── Scroll tracking (RAF-throttled) ──────────────────────────────────────
	let lastScrollY = 0;
	let rafPending  = false;

	function handleScroll(): void {
		if (rafPending) return;
		rafPending = true;
		requestAnimationFrame(() => {
			const y = window.scrollY;
			isScrolled = y > 20;
			if (!isMobileMenuOpen) {
				isVisible = !(y > lastScrollY && y > NAV_SCROLL.HIDE_THRESHOLD);
			}
			lastScrollY = y;
			rafPending  = false;
		});
	}

	// ─── Body scroll lock ─────────────────────────────────────────────────────
	$effect(() => {
		if (typeof document === 'undefined') return;

		const html = document.documentElement;
		const body = document.body;

		if (isMobileMenuOpen && !wasMenuOpen) {
			lockedScrollY = window.scrollY;
			html.classList.add(BODY_NO_SCROLL);
			body.classList.add(BODY_NO_SCROLL);
			body.style.position = 'fixed';
			body.style.top = `-${lockedScrollY}px`;
			body.style.left = '0';
			body.style.right = '0';
			body.style.width = '100%';
			isVisible = true;
		}

		if (!isMobileMenuOpen && wasMenuOpen) {
			html.classList.remove(BODY_NO_SCROLL);
			body.classList.remove(BODY_NO_SCROLL);
			body.style.position = '';
			body.style.top = '';
			body.style.left = '';
			body.style.right = '';
			body.style.width = '';
			window.scrollTo(0, lockedScrollY);
			lastScrollY = lockedScrollY;
		}

		wasMenuOpen = isMobileMenuOpen;
	});

	// ─── Mount / cleanup ──────────────────────────────────────────────────────
	onMount(() => {
		lastScrollY = window.scrollY;
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			document.documentElement.classList.remove(BODY_NO_SCROLL);
			document.body.classList.remove(BODY_NO_SCROLL);
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.left = '';
			document.body.style.right = '';
			document.body.style.width = '';
		};
	});

	// ─── Handlers ─────────────────────────────────────────────────────────────
	const toggleMenu      = () => { isMobileMenuOpen = !isMobileMenuOpen; };
	const closeMobileMenu = () => {
		isVisible = true;
		isMobileMenuOpen = false;
	};
</script>


<!-- ── Sticky floating wrapper ───────────────────────────────────────────── -->
<header
	class="header"
	class:is-scrolled={isScrolled}
	class:is-hidden={!isVisible}
>
	<nav class="pill" aria-label="Main navigation">

		<!-- ── Logo ───────────────────────────────────────── -->
		<a href="/" class="logo" aria-label="Go to homepage">
			<img src={logoLight} class="logo-img" alt="" loading="eager" decoding="async" />
			<span class="logo-name">
				<span class="logo-first">Oleksandr</span>
				<span class="logo-last">Dorokhov</span>
			</span>
		</a>

		<!-- ── Nav divider ────────────────────────────────── -->
		<span class="divider" aria-hidden="true"></span>

		<!-- ── Desktop links ──────────────────────────────── -->
		<ul class="nav-links" role="list">
			{#each menuItems as item (item.id)}
				<li>
					<a href={item.href} class="nav-link" aria-label={item.label}>
						<span class="link-icon" aria-hidden="true">{@html item.icon}</span>
						<span>{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>

		<!-- ── Actions ────────────────────────────────────── -->
		<div class="nav-actions">
			<!-- Hire Me CTA button -->
			<a href="/#contact" class="hire-btn" aria-label="Hire me — go to contact section">
				<span>Hire Me</span>
				<svg class="hire-arrow" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
			</a>

			<!-- Hamburger — mobile only -->
			<button
				class="burger"
				class:open={isMobileMenuOpen}
				aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-expanded={isMobileMenuOpen}
				aria-controls="mobile-nav"
				onclick={toggleMenu}
			>
				<span class="burger-bar"></span>
				<span class="burger-bar"></span>
				<span class="burger-bar"></span>
			</button>
		</div>
	</nav>
</header>


<!-- ── Mobile backdrop ───────────────────────────────────────────────────── -->
{#if isMobileMenuOpen}
	<div
		class="backdrop"
		transition:fade={{ duration: $reducedMotion ? 0 : NAV_TRANSITION.BACKDROP_MS }}
		onclick={closeMobileMenu}
		aria-hidden="true"
	></div>

	<!-- ── Mobile drawer ─────────────────────────────────── -->
	<nav
		id="mobile-nav"
		class="drawer"
		aria-label="Navigation menu"
		transition:fly={{
			x: 420,
			duration: $reducedMotion ? 0 : NAV_TRANSITION.DRAWER_MS,
			easing: cubicInOut
		}}
	>
		<!-- Drawer header label -->
		<p class="drawer-label" aria-hidden="true">Navigation</p>

		<!-- Nav items -->
		<ul class="drawer-list" role="list">
			{#each menuItems as item, i (item.id)}
				<li
					class="drawer-item"
					style:animation-delay="{$reducedMotion ? 0 : i * NAV_TRANSITION.ITEM_STAGGER_MS}ms"
				>
					<a
						href={item.href}
						class="drawer-link"
						onclick={closeMobileMenu}
					>
						<span class="drawer-index" aria-hidden="true">0{i + 1}</span>
						<span class="drawer-icon" aria-hidden="true">{@html item.icon}</span>
						<span class="drawer-label-text">{item.label}</span>
						<svg class="drawer-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
					</a>
				</li>
			{/each}
		</ul>

		<!-- Hire Me CTA -->
		<div class="drawer-cta">
			<a href="#contact" class="drawer-cta-btn" onclick={closeMobileMenu}>
				<span>Hire Me</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
			</a>
		</div>
	</nav>
{/if}


<style>

	/* ─── Body scroll lock ──────────────────────────────────────────────────── */
	:global(html.navigation-mobile-menu-open),
	:global(body.navigation-mobile-menu-open) {
		overflow: hidden !important;
		overscroll-behavior: none !important;
		touch-action: none !important;
	}

	/* ─── Sticky wrapper ────────────────────────────────────────────────────── */
	/*
	 * The wrapper is transparent and pointer-events:none so clicks pass through
	 * to the page. Only the .pill inside has pointer-events:all.
	 * This creates a "floating" effect — the nav doesn't visually block content.
	 */
	.header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		padding: 0.85rem 1.25rem;
		display: flex;
		justify-content: center;
		pointer-events: none;
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform;
	}

	.header.is-hidden {
		transform: translateY(-170%);
	}

	/* ─── Glass pill ────────────────────────────────────────────────────────── */
	.pill {
		pointer-events: all;
		position: relative;
		width: 100%;
		max-width: 730px;
		height: 3.25rem;
		display: flex;
		align-items: center;
		gap: 0;
		padding: 0 0.4rem 0 0.6rem;
		border-radius: 9999px;
		overflow: hidden;

		/* Frosted glass — dark-mode tuned */
		background: linear-gradient(
			145deg,
			rgba(255, 255, 255, 0.085) 0%,
			rgba(0, 245, 255, 0.035) 60%,
			rgba(255, 255, 255, 0.04) 100%
		);
		backdrop-filter: blur(48px) saturate(1.9) brightness(1.08);
		-webkit-backdrop-filter: blur(48px) saturate(1.9) brightness(1.08);

		/* Layered border — bright top edge (specular) + subtle surround */
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-top-color: rgba(255, 255, 255, 0.28);

		/* Depth shadows */
		box-shadow:
			inset 0 1px 0      rgba(255, 255, 255, 0.22),
			inset 0 -1px 0     rgba(0, 0, 0, 0.12),
			0 8px 32px -4px    rgba(0, 0, 0, 0.5),
			0 2px 8px          rgba(0, 0, 0, 0.35),
			0 0 0 1px          rgba(255, 255, 255, 0.04);

		transition:
			box-shadow 0.5s ease,
			background  0.5s ease;
	}

	/* Richer shadow when page is scrolled */
	.is-scrolled .pill {
		box-shadow:
			inset 0 1px 0      rgba(255, 255, 255, 0.26),
			inset 0 -1px 0     rgba(0, 0, 0, 0.18),
			0 20px 60px -8px   rgba(0, 0, 0, 0.7),
			0 6px 20px -2px    rgba(0, 0, 0, 0.5),
			0 0 80px           rgba(0, 245, 255, 0.06),
			0 0 0 1px          rgba(255, 255, 255, 0.06);
	}

	/* Light-sweep glint — simulates a moving specular highlight */
	.pill::before {
		content: '';
		position: absolute;
		top: 0;
		left: -55%;
		width: 35%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.07),
			transparent
		);
		border-radius: inherit;
		animation: glint 8s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes glint {
		0%   { transform: translateX(0);       opacity: 0;   }
		8%   {                                  opacity: 1;   }
		42%  { transform: translateX(430%);    opacity: 0.5; }
		43%  {                                  opacity: 0;   }
		100% { transform: translateX(430%);    opacity: 0;   }
	}

	/* ─── Logo ──────────────────────────────────────────────────────────────── */
	.logo {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		text-decoration: none;
		flex-shrink: 0;
		padding: 0.25rem 0.55rem 0.25rem 0.25rem;
		border-radius: 9999px;
		transition: background 0.2s;
	}

	.logo:hover {
		background: rgba(255, 255, 255, 0.07);
	}

	.logo-img {
		width: 2rem;
		height: 2rem;
		object-fit: contain;
		flex-shrink: 0;
	}

	/* Stacked name — first name small and offset, surname bold and grounded */
	.logo-name {
		display: flex;
		flex-direction: column;
		line-height: 1;
		gap: 0.15em;
	}

	.logo-first {
		font-family: var(--font-bionical);
		font-size: 0.45rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.42);
		font-weight: 400;
		padding-left: 0.2em; /* creative right-offset vs surname */
	}

	.logo-last {
		font-family: var(--font-bionical);
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.92);
		font-weight: 700;
	}

	/* ─── Divider ───────────────────────────────────────────────────────────── */
	.divider {
		width: 1px;
		height: 1.1rem;
		background: rgba(255, 255, 255, 0.12);
		flex-shrink: 0;
		margin: 0 0.5rem;
	}

	/* ─── Nav links ─────────────────────────────────────────────────────────── */
	.nav-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		gap: 0.15rem;
		flex: 1;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.38rem;
		padding: 0.38rem 0.72rem;
		font-family: var(--font-bionical);
		font-size: 0.73rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.52);
		text-decoration: none;
		border-radius: 9999px;
		border: 1px solid transparent;
		transition: color 0.2s, background 0.2s, border-color 0.2s;
		white-space: nowrap;
	}

	.nav-link:hover {
		color: rgba(255, 255, 255, 0.94);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.link-icon {
		display: flex;
		align-items: center;
		opacity: 0.65;
		transition: opacity 0.2s;
	}

	.nav-link:hover .link-icon { opacity: 1; }

	/* ─── Actions row ───────────────────────────────────────────────────────── */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	/* ─── Hire Me button ────────────────────────────────────────────────────── */
	.hire-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.44rem 0.95rem;
		font-family: var(--font-bionical);
		font-size: 0.72rem;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--cp-cyan);
		background: rgba(0, 245, 255, 0.09);
		border: 1px solid rgba(0, 245, 255, 0.3);
		border-radius: 9999px;
		white-space: nowrap;
		transition: color 0.22s, background 0.22s, border-color 0.22s, box-shadow 0.22s;
	}

	.hire-btn:hover {
		color: #000;
		background: var(--cp-cyan);
		border-color: var(--cp-cyan);
		box-shadow:
			0 0 22px rgba(0, 245, 255, 0.5),
			0 0 8px  rgba(0, 245, 255, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.35);
	}

	.hire-arrow {
		flex-shrink: 0;
		transition: transform 0.2s;
	}

	.hire-btn:hover .hire-arrow { transform: translateX(3px); }

	/* ─── Burger button ─────────────────────────────────────────────────────── */
	.burger {
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		width: 2.1rem;
		height: 2.1rem;
		background: none;
		border: 1px solid transparent;
		border-radius: 50%;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: background 0.2s, border-color 0.2s;
	}

	.burger:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.burger-bar {
		display: block;
		height: 1.5px;
		background: rgba(255, 255, 255, 0.78);
		border-radius: 2px;
		transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.burger-bar:nth-child(1) { width: 18px; }
	.burger-bar:nth-child(2) { width: 13px; }
	.burger-bar:nth-child(3) { width: 9px; }

	.burger.open .burger-bar:nth-child(1) {
		width: 17px;
		transform: translateY(6.5px) rotate(45deg);
		background: rgba(255, 255, 255, 0.95);
	}
	.burger.open .burger-bar:nth-child(2) {
		opacity: 0;
		transform: translateX(6px);
	}
	.burger.open .burger-bar:nth-child(3) {
		width: 17px;
		transform: translateY(-6.5px) rotate(-45deg);
		background: rgba(255, 255, 255, 0.95);
	}

	/* ─── Mobile backdrop ───────────────────────────────────────────────────── */
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: linear-gradient(
			180deg,
			rgba(5, 7, 16, 0.58) 0%,
			rgba(4, 6, 12, 0.74) 100%
		);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	/* ─── Mobile drawer ─────────────────────────────────────────────────────── */
	.drawer {
		position: fixed;
		top: 0.7rem;
		right: 0.85rem;
		width: min(390px, calc(100vw - 1.7rem));
		height: calc(100dvh - 1.4rem);
		z-index: 95;
		display: flex;
		flex-direction: column;
		padding: calc(var(--nav-h) + 0.9rem) 1.2rem 1.4rem;
		gap: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		border-radius: 1.75rem;

		/* Same glass language as the nav pill */
		background: linear-gradient(
			145deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(0, 245, 255, 0.045) 58%,
			rgba(255, 255, 255, 0.045) 100%
		);
		backdrop-filter: blur(42px) saturate(1.65) brightness(1.05);
		-webkit-backdrop-filter: blur(42px) saturate(1.65) brightness(1.05);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-top-color: rgba(255, 255, 255, 0.28);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.2),
			inset 0 -1px 0 rgba(0, 0, 0, 0.18),
			0 24px 70px rgba(0, 0, 0, 0.64),
			0 0 70px rgba(0, 245, 255, 0.06);
	}

	.drawer::before {
		content: '';
		position: absolute;
		top: 0;
		left: -35%;
		width: 45%;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.08),
			transparent
		);
		animation: glint 10s ease-in-out infinite;
		pointer-events: none;
	}

	/* ── Drawer label ───────────────────────────────────────────────────────── */
	.drawer-label {
		font-family: var(--font-ui);
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.34);
		margin-bottom: 1rem;
		padding: 0.1rem 0.55rem;
	}

	/* ── Drawer list ────────────────────────────────────────────────────────── */
	.drawer-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		flex: 1;
	}

	.drawer-item {
		animation: slideIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes slideIn {
		from { opacity: 0; transform: translateX(18px); }
		to   { opacity: 1; transform: translateX(0); }
	}

	.drawer-link {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.84rem 0.82rem;
		text-decoration: none;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.62);
		font-family: var(--font-bionical);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-size: 0.76rem;
		background: rgba(255, 255, 255, 0.03);
		transition: color 0.22s, background 0.22s, border-color 0.22s, box-shadow 0.22s;
	}

	.drawer-link:hover {
		color: rgba(255, 255, 255, 0.95);
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.16);
		box-shadow: 0 0 22px rgba(255, 255, 255, 0.06);
	}

	.drawer-index {
		font-family: var(--font-ui);
		font-size: 0.6rem;
		color: rgba(0, 245, 255, 0.58);
		min-width: 1.5rem;
		letter-spacing: 0.05em;
	}

	.drawer-icon {
		display: flex;
		align-items: center;
		opacity: 0.72;
		transition: opacity 0.2s;
	}

	.drawer-link:hover .drawer-icon { opacity: 0.9; }

	.drawer-label-text { flex: 1; }

	.drawer-chevron {
		opacity: 0.45;
		transition: opacity 0.22s, transform 0.22s;
	}

	.drawer-link:hover .drawer-chevron {
		opacity: 0.7;
		transform: translateX(3px);
	}

	/* ── Drawer CTA ─────────────────────────────────────────────────────────── */
	.drawer-cta {
		padding-top: 1rem;
	}

	.drawer-cta-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: 0.85rem 1.1rem;
		font-family: var(--font-bionical);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		color: #000;
		background: var(--cp-cyan);
		border: 1px solid var(--cp-cyan);
		border-radius: 9999px;
		transition: background 0.25s, box-shadow 0.25s, transform 0.25s;
		box-shadow: 0 0 30px rgba(0, 245, 255, 0.22);
	}

	.drawer-cta-btn:hover {
		background: rgba(0, 245, 255, 0.9);
		box-shadow: 0 0 40px rgba(0, 245, 255, 0.45);
		transform: translateY(-1px);
	}

	/* ─── Responsive ────────────────────────────────────────────────────────── */
	@media (max-width: 640px) {
		.nav-links,
		.divider,
		.hire-btn { display: none; }

		.burger { display: flex; }

		.header { padding: 0.75rem 0.85rem; }

		.pill {
			max-width: 100%;
			padding: 0 0.3rem 0 0.45rem;
		}
		.nav-actions {
			margin-left: auto;
		}
		.drawer {
			top: calc(var(--nav-h));
			right: 0.5rem;
			width: calc(100vw - 1rem);
			height: calc(100dvh - var(--nav-h) - 0.5rem);
			padding: 0.9rem 1rem;
			border-radius: 1.3rem;
		}
	}

	@media (min-width: 641px) and (max-width: 820px) {
		.pill { max-width: 100%; }
	}

	/* ─── Reduced motion ────────────────────────────────────────────────────── */
	@media (prefers-reduced-motion: reduce) {
		.header       { transition: none; }
		.pill         { transition: none; }
		.pill::before { animation: none; }
		.drawer-item  { animation: none; }
	}

</style>
