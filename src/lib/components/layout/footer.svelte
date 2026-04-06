<script lang="ts">
	/**
	 * Footer — site-wide layout component.
	 *
	 * Three-column grid on desktop → single column on mobile.
	 * No canvas, no JS timers — CSS-only animations for zero runtime cost.
	 *
	 * Columns:
	 *   Brand   — logo, tagline, location
	 *   Navigate — main links + service deep-links
	 *   Connect  — social icon-links + mini CTA
	 *
	 * Bottom bar — copyright, system-status blinking dot, built-with note.
	 */

	import logoLight from '$lib/assets/images/logo-light.svg';

	const year = new Date().getFullYear();
</script>

<footer class="ft" aria-label="Site footer">

	<!-- Animated top border — identical timing to nav's borderFlow -->
	<div class="ft-border" aria-hidden="true"></div>

	<!-- Scanlines overlay -->
	<div class="ft-scanlines" aria-hidden="true"></div>

	<!-- ── Main grid ───────────────────────────────────────────────────────── -->
	<div class="ft-inner">

		<!-- ── Col 1: Brand ─────────────────────────────────────────────────── -->
		<div class="ft-brand">
			<a href="/" class="ft-logo" aria-label="Oleksandr Dorokhov — homepage">
				<img
					src={logoLight}
					alt=""
					class="ft-logo__img"
					width="36"
					height="18"
					loading="lazy"
					decoding="async"
				/>
				<span class="ft-logo__name">
					<span class="ft-logo__first">Oleksandr</span>
					<span class="ft-logo__last">Dorokhov</span>
				</span>
			</a>

			<p class="ft-tagline">
				Full-Stack Developer crafting fast, conversion-focused web
				experiences with SvelteKit&nbsp;&amp;&nbsp;TypeScript.
			</p>

			<div class="ft-location" aria-label="Work location">
				<svg class="ft-location__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true" width="11" height="11">
					<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
					<path d="M1.5 8h13M8 1.5c-2 2-3 4-3 6.5s1 4.5 3 6.5M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5" stroke="currentColor" stroke-width="1.2"/>
				</svg>
				Ukraine · Europe · Remote
			</div>
		</div>

		<!-- ── Col 2: Navigate ──────────────────────────────────────────────── -->
		<nav class="ft-nav" aria-label="Footer navigation">

			<p class="ft-col-label" aria-hidden="true">// NAVIGATE</p>

			<ul class="ft-links" role="list">
				<li>
					<a href="#profile" class="ft-link">Profile</a>
				</li>
				<li>
					<a href="/deploys" class="ft-link">Deploys</a>
				</li>
			</ul>

			<p class="ft-col-label ft-col-label--spaced" aria-hidden="true">// SERVICES</p>

			<ul class="ft-links" role="list">
				<li>
					<a href="#service-landing" class="ft-link">Landing Page</a>
				</li>
				<li>
					<a href="#service-saas" class="ft-link">SaaS Dashboard</a>
				</li>
				<li>
					<a href="#service-design" class="ft-link">Website Design</a>
				</li>
			</ul>

		</nav>

		<!-- ── Col 3: Connect ───────────────────────────────────────────────── -->
		<div class="ft-connect">

			<p class="ft-col-label" aria-hidden="true">// CONNECT</p>

			<ul class="ft-socials" role="list">

				<li>
					<a
						href="mailto:alex.dorokhov.mail@gmail.com"
						class="ft-social"
						aria-label="Send email to alex.dorokhov.mail@gmail.com"
					>
						<!-- Envelope icon -->
						<svg class="ft-social__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" width="14" height="14">
							<rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/>
							<path d="m2 6 8 5.5L18 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
						</svg>
						<span>alex.dorokhov.mail@gmail.com</span>
					</a>
				</li>

				<li>
					<a
						href="https://t.me/everdarkk"
						class="ft-social"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Telegram: @everdarkk"
					>
						<!-- Telegram paper-plane icon -->
						<svg class="ft-social__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" width="14" height="14">
							<path d="M17.5 3.5 2.5 8.5l5 2 2.5 5.5 1.5-4 4 3-3-11.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
							<path d="m7.5 10.5 2.5 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
						</svg>
						<span>@everdarkk</span>
					</a>
				</li>

				<li>
					<a
						href="https://github.com/Everdarkk"
						class="ft-social"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub profile: Everdarkk"
					>
						<!-- GitHub mark (simplified) -->
						<svg class="ft-social__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" width="14" height="14">
							<path d="M10 2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.35c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.97 0-.88.31-1.6.83-2.16-.08-.2-.36-1.02.08-2.13 0 0 .68-.22 2.22.83A7.72 7.72 0 0 1 10 5.84c.69 0 1.38.09 2.03.27 1.54-1.05 2.22-.83 2.22-.83.44 1.11.16 1.93.08 2.13.52.56.83 1.28.83 2.16 0 3.09-1.88 3.77-3.67 3.97.29.25.54.73.54 1.48v2.19c0 .21.14.46.55.38A8 8 0 0 0 10 2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
						</svg>
						<span>Everdarkk</span>
					</a>
				</li>

				<li>
					<a
						href="https://www.linkedin.com/in/oleksandr-dorokhov-632b59303/"
						class="ft-social"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn profile: Oleksandr Dorokhov"
					>
						<!-- LinkedIn "in" box icon -->
						<svg class="ft-social__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" width="14" height="14">
							<rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.4"/>
							<path d="M6 8.5v5.5M6 5.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
							<path d="M10 14v-3c0-1.1.9-2 2-2s2 .9 2 2v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
							<path d="M10 8.5V14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
						</svg>
						<span>Oleksandr Dorokhov</span>
					</a>
				</li>

			</ul>

			<!-- Mini CTA -->
			<a href="#contact" class="ft-cta" aria-label="Start a project — go to contact section">
				<span>Start a Project</span>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="13" height="13">
					<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</a>

		</div>

	</div><!-- /.ft-inner -->

	<!-- ── Bottom bar ───────────────────────────────────────────────────────── -->
	<div class="ft-bottom" aria-label="Footer metadata">
		<div class="ft-bottom__inner">

			<span class="ft-copy">
				© {year} Oleksandr Dorokhov. All rights reserved.
			</span>

			<span class="ft-status" aria-label="System online">
				<span class="ft-status__dot" aria-hidden="true"></span>
				// SYSTEM_ONLINE
			</span>

		</div>
	</div>

</footer>

<style>
/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER SHELL
   ═══════════════════════════════════════════════════════════════════════════ */

.ft {
	position: relative;
	width: 100%;
	background: var(--cp-bg, #06060a);
	overflow: hidden;
}

/* ── Animated top border — same rhythm as navigation borderFlow ── */
.ft-border {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 1px;
	background: linear-gradient(
		90deg,
		transparent   0%,
		var(--cp-cyan, #00f5ff) 40%,
		var(--cp-pink, #ff0055) 60%,
		transparent   100%
	);
	background-size: 250% 100%;
	animation: ftBorderFlow 6s linear infinite;
	opacity: 0.7;
}

@keyframes ftBorderFlow {
	0%   { background-position: 200% 0; }
	100% { background-position: -50% 0; }
}

/* ── CRT scanlines ── */
.ft-scanlines {
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		to bottom,
		transparent           0px,
		transparent           3px,
		rgba(0, 0, 0, 0.06)   3px,
		rgba(0, 0, 0, 0.06)   4px
	);
	pointer-events: none;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN GRID
   ═══════════════════════════════════════════════════════════════════════════ */

.ft-inner {
	position: relative;
	z-index: 1;
	max-width: var(--max-w, 1400px);
	margin: 0 auto;
	padding: clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 3rem) clamp(2rem, 5vw, 3rem);
	display: grid;
	grid-template-columns: 1.4fr 1fr 1.3fr;
	gap: clamp(2rem, 5vw, 4rem);
	align-items: start;
}

@media (max-width: 860px) {
	.ft-inner {
		grid-template-columns: 1fr 1fr;
	}

	/* Brand spans both columns on tablet */
	.ft-brand {
		grid-column: 1 / -1;
	}
}

@media (max-width: 520px) {
	.ft-inner {
		grid-template-columns: 1fr;
	}
}

/* ═══════════════════════════════════════════════════════════════════════════
   COL 1 — BRAND
   ═══════════════════════════════════════════════════════════════════════════ */

.ft-brand {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* ── Logo ── */
.ft-logo {
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
	text-decoration: none;
	outline: none;
}

.ft-logo:focus-visible {
	outline: 2px solid var(--cp-cyan);
	outline-offset: 4px;
}

.ft-logo__img {
	width: 36px;
	height: auto;
	flex-shrink: 0;
}

.ft-logo__name {
	display: flex;
	flex-direction: column;
	line-height: 1.2;
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-weight: 400;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.ft-logo__first {
	font-size: clamp(0.62rem, 1vw, 0.72rem);
	color: var(--cp-muted, #4a5a6a);
}

.ft-logo__last {
	font-size: clamp(0.78rem, 1.2vw, 0.9rem);
	color: var(--cp-cyan, #00f5ff);
	text-shadow: 0 0 14px rgba(0, 245, 255, 0.35);
	transition: text-shadow 0.25s ease;
}

.ft-logo:hover .ft-logo__last {
	text-shadow: 0 0 22px rgba(0, 245, 255, 0.65);
}

/* ── Tagline ── */
.ft-tagline {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.72rem, 1.1vw, 0.8rem);
	line-height: 1.65;
	color: rgba(255, 255, 255, 0.45);
	max-width: 30ch;
}

/* ── Location badge ── */
.ft-location {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 0.9vw, 0.68rem);
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	padding: 0.3rem 0.65rem;
	border: 1px solid rgba(0, 245, 255, 0.1);
	width: fit-content;
}

.ft-location__icon {
	color: var(--cp-cyan, #00f5ff);
	opacity: 0.7;
	flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED COLUMN LABEL
   ═══════════════════════════════════════════════════════════════════════════ */

.ft-col-label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.55rem, 0.82vw, 0.63rem);
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--cp-cyan, #00f5ff);
	opacity: 0.55;
	margin-bottom: 0.65rem;
}

.ft-col-label--spaced {
	margin-top: 1.5rem;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COL 2 — NAVIGATE
   ═══════════════════════════════════════════════════════════════════════════ */

.ft-nav {
	display: flex;
	flex-direction: column;
}

.ft-links {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	padding: 0;
}

.ft-link {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.78rem, 1.1vw, 0.88rem);
	color: rgba(255, 255, 255, 0.55);
	text-decoration: none;
	letter-spacing: 0.04em;
	transition: color 0.2s ease, text-shadow 0.2s ease;
	outline: none;
	display: inline-flex;
	align-items: center;
	gap: 0.4em;
}

.ft-link::before {
	content: '›';
	color: var(--cp-cyan, #00f5ff);
	opacity: 0;
	font-size: 0.9em;
	transform: translateX(-4px);
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.ft-link:hover,
.ft-link:focus-visible {
	color: rgba(255, 255, 255, 0.9);
	text-shadow: 0 0 10px rgba(0, 245, 255, 0.25);
}

.ft-link:hover::before,
.ft-link:focus-visible::before {
	opacity: 1;
	transform: translateX(0);
}

.ft-link:focus-visible {
	outline: 1px solid rgba(0, 245, 255, 0.4);
	outline-offset: 3px;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COL 3 — CONNECT
   ═══════════════════════════════════════════════════════════════════════════ */

.ft-connect {
	display: flex;
	flex-direction: column;
	gap: 0;
}

/* ── Social list ── */
.ft-socials {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 0;
	margin-bottom: 1.5rem;
}

.ft-social {
	display: inline-flex;
	align-items: center;
	gap: 0.55rem;
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.72rem, 1vw, 0.82rem);
	color: rgba(255, 255, 255, 0.5);
	text-decoration: none;
	letter-spacing: 0.03em;
	transition: color 0.22s ease;
	outline: none;
	min-width: 0;
}

.ft-social span {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.ft-social__icon {
	flex-shrink: 0;
	color: var(--cp-cyan, #00f5ff);
	opacity: 0.5;
	transition: opacity 0.22s ease;
}

.ft-social:hover,
.ft-social:focus-visible {
	color: rgba(255, 255, 255, 0.9);
}

.ft-social:hover .ft-social__icon,
.ft-social:focus-visible .ft-social__icon {
	opacity: 1;
}

.ft-social:focus-visible {
	outline: 1px solid rgba(0, 245, 255, 0.4);
	outline-offset: 3px;
}

/* ── Mini CTA ── */
.ft-cta {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.62rem, 0.95vw, 0.72rem);
	letter-spacing: 0.18em;
	text-transform: uppercase;
	text-decoration: none;
	color: var(--cp-cyan, #00f5ff);
	border: 1px solid rgba(0, 245, 255, 0.25);
	padding: 0.5rem 0.9rem;
	width: fit-content;
	outline: none;
	transition:
		color       0.22s ease,
		border-color 0.22s ease,
		background  0.22s ease,
		box-shadow  0.22s ease;
	/* Cyber chamfer */
	clip-path: polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px);
}

.ft-cta:hover,
.ft-cta:focus-visible {
	color: var(--cp-bg, #06060a);
	background: var(--cp-cyan, #00f5ff);
	border-color: var(--cp-cyan, #00f5ff);
	box-shadow: 0 0 20px rgba(0, 245, 255, 0.35);
}

.ft-cta:focus-visible {
	outline: 2px solid var(--cp-cyan);
	outline-offset: 3px;
}

.ft-cta svg {
	flex-shrink: 0;
	transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ft-cta:hover svg {
	transform: translateX(3px);
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOTTOM BAR
   ═══════════════════════════════════════════════════════════════════════════ */

.ft-bottom {
	position: relative;
	z-index: 1;
	border-top: 1px solid rgba(0, 245, 255, 0.08);
}

.ft-bottom__inner {
	max-width: var(--max-w, 1400px);
	margin: 0 auto;
	padding: 1rem clamp(1rem, 4vw, 3rem);
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.ft-copy {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 0.85vw, 0.68rem);
	letter-spacing: 0.1em;
	color: var(--cp-muted, #4a5a6a);
	opacity: 0.7;
}

/* ── System online indicator ── */
.ft-status {
	display: flex;
	align-items: center;
	gap: 0.45rem;
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.55rem, 0.82vw, 0.63rem);
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	opacity: 0.55;
}

.ft-status__dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--cp-lime, #00ff88);
	box-shadow: 0 0 6px rgba(0, 255, 136, 0.7);
	animation: ftDotBlink 2.8s ease-in-out infinite;
	flex-shrink: 0;
}

@keyframes ftDotBlink {
	0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(0, 255, 136, 0.7); }
	50%       { opacity: 0.35; box-shadow: 0 0 2px rgba(0, 255, 136, 0.3); }
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.ft-border,
	.ft-status__dot {
		animation: none !important;
	}

	.ft-link::before,
	.ft-cta,
	.ft-cta svg,
	.ft-social,
	.ft-social__icon,
	.ft-link {
		transition: none !important;
	}

	.ft-status__dot {
		opacity: 1;
	}
}
</style>
