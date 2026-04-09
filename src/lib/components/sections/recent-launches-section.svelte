<script lang="ts">
	import { onDestroy } from 'svelte';
	import SectionTitle from '$lib/components/common/section-title.svelte';
	import { scrollReveal } from '$lib/actions';
	import { reducedMotion } from '$lib/stores';
	import { PROJECTS, COLOR_MAP } from '$lib/constants/recent-launches';
	

	// ─── State ────────────────────────────────────────────────────────────────

	let activeId = PROJECTS[0].id;
	let transitioning = false;
	let visible = false;       // driven by scrollReveal action
	let videoEl: HTMLVideoElement | undefined;
	let switchTimeout: ReturnType<typeof setTimeout> | null = null;
	let unlockTimeout: ReturnType<typeof setTimeout> | null = null;
	const handleSectionReveal = () => (visible = true);

	$: active  = PROJECTS.find(p => p.id === activeId)!;
	$: colors  = COLOR_MAP[active.color];

	function itemColor(color: keyof typeof COLOR_MAP): string {
		return COLOR_MAP[color].primary;
	}

	function openProject(url: string): void {
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	// ─── Project switch — cross-fade with brief lock ───────────────────────────

	function selectProject(id: string): void {
		if (id === activeId || transitioning) return;
		transitioning = true;
		if (switchTimeout !== null) {
			clearTimeout(switchTimeout);
			switchTimeout = null;
		}
		if (unlockTimeout !== null) {
			clearTimeout(unlockTimeout);
			unlockTimeout = null;
		}

		switchTimeout = setTimeout(() => {
			activeId      = id;
			unlockTimeout = setTimeout(() => {
				transitioning = false;
				unlockTimeout = null;
			}, 450);
			switchTimeout = null;
		}, 30);
	}

	onDestroy(() => {
		if (switchTimeout !== null) clearTimeout(switchTimeout);
		if (unlockTimeout !== null) clearTimeout(unlockTimeout);
	});

	// ─── Keyboard navigation in project list ──────────────────────────────────

	function onListKeyDown(e: KeyboardEvent): void {
		const idx = PROJECTS.findIndex(p => p.id === activeId);
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectProject(PROJECTS[Math.min(idx + 1, PROJECTS.length - 1)].id);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectProject(PROJECTS[Math.max(idx - 1, 0)].id);
		}
	}
</script>

<!-- ─── Markup ──────────────────────────────────────────────────────────── -->
<!--
	The `scrollReveal` action replaces the manual onMount/onDestroy
	IntersectionObserver setup. When the section enters the viewport it:
	  1. Adds the CSS class `is-revealed` to the element (activeClass default)
	  2. Dispatches a custom `reveal` event that we handle to set `visible = true`
	The action automatically disconnects and cleans up on destroy.
-->
<section
	class="rl-section"
	class:is-visible={visible}
	use:scrollReveal={{ threshold: 0.08, onReveal: handleSectionReveal }}
	id="launches"
	aria-label="Recent launches"
>
	<!-- Ambient background glow — shifts colour per project -->
	<div
		class="rl-ambient"
		style="--amb-color: {colors.glow}"
		aria-hidden="true"
	></div>

	<!-- Scanlines overlay -->
	<div class="rl-scanlines" aria-hidden="true"></div>

	<div class="rl-inner">

		<!-- ── Section header ──────────────────────────────────────────────── -->
		<SectionTitle
			title="Recent Launches"
			variant="elaborate"
			label="RECENT_LAUNCHES.exe"
			isVisible={visible}
		/>

		<!-- ── Main grid: 1/3 list  +  2/3 detail ─────────────────────────── -->
		<div class="rl-grid">

			<!-- LEFT — Project list (1/3) -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<nav
				class="rl-list"
				aria-label="Project list"
				role="list"
				on:keydown={onListKeyDown}
			>
				<!-- Vertical track decoration -->
				<div class="rl-list__track" aria-hidden="true"></div>

				{#each PROJECTS as project (project.id)}
					<button
						class="rl-item"
						class:is-active={activeId === project.id}
						style="--item-color: {itemColor(project.color)}"
						aria-current={activeId === project.id ? 'true' : 'false'}
						aria-label="View {project.name}"
						on:click={() => selectProject(project.id)}
					>
						<span class="rl-item__index" aria-hidden="true">{project.index}</span>

						<span class="rl-item__info">
							<span class="rl-item__name">{project.name}</span>
							<span class="rl-item__tag">{project.tag} · {project.year}</span>
						</span>

						<!-- Active indicator bar -->
						<span class="rl-item__bar" aria-hidden="true"></span>
						<!-- Chevron -->
						<span class="rl-item__chevron" aria-hidden="true">›</span>
					</button>
				{/each}
			</nav>

			<!-- RIGHT — Project detail (2/3) -->
			<div class="rl-detail" aria-live="polite" aria-atomic="true">

				{#key activeId}
					<div class="rl-detail__body" style="--proj-color: {colors.primary}; --proj-border: {colors.border}">

						<!-- Project header row -->
						<div class="rl-detail__head">
							<div class="rl-detail__meta">
								<span class="rl-detail__index" aria-hidden="true">{active.index}</span>
								<div>
									<h3 class="rl-detail__name">{active.name}</h3>
									<span class="rl-detail__tag">{active.tag} · {active.year}</span>
								</div>
							</div>

							{#if active.url}
								<button
									type="button"
									class="rl-detail__link"
									on:click={() => openProject(active.url)}
									aria-label="Visit {active.name}"
								>
									<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9"/>
										<path d="M10 2h4v4"/>
										<line x1="14" y1="2" x2="8" y2="8"/>
									</svg>
									VISIT_SITE →
								</button>
							{/if}
						</div>

						<!-- Description -->
						<p class="rl-detail__desc">{active.description}</p>

						<!-- Key metrics / what was built -->
						<ul class="rl-keys" aria-label="Project highlights">
							{#each active.keys as key, ki (key.label)}
								<li class="rl-key" style="--ki: {ki}">
									<span class="rl-key__label">{key.label}</span>
									<span class="rl-key__sep" aria-hidden="true">//</span>
									<span class="rl-key__value">{key.value}</span>
								</li>
							{/each}
						</ul>

						<!-- Video capture — hidden if no URL -->
						{#if active.videoUrl && visible}
							<div class="rl-video-wrap">
								<div class="rl-video-frame" aria-hidden="true"></div>
								<div class="rl-video-label" aria-hidden="true">SCREEN_CAPTURE.mp4</div>
								<video
									bind:this={videoEl}
									class="rl-video"
									src={active.videoUrl}
									poster={active.videoPoster || undefined}
									autoplay={!$reducedMotion}
									muted
									loop
									playsinline
									preload="none"
									aria-label="{active.name} screen recording"
								></video>
							</div>
						{:else}
							<!-- Placeholder when no video is available -->
							<div class="rl-video-placeholder" aria-hidden="true">
								<div class="rl-video-ph-inner">
									<span class="rl-video-ph-icon">▶</span>
									<span class="rl-video-ph-text">SCREEN_CAPTURE<br/>_PENDING.mp4</span>
								</div>
							</div>
						{/if}

					</div>
				{/key}

			</div><!-- /rl-detail -->
		</div><!-- /rl-grid -->
	</div><!-- /rl-inner -->
</section>

<style>
	/* ROOT SECTION */
	.rl-section {
		position: relative;
		width: 100%;
		min-height: 100dvh;
		background: var(--cp-bg, #06060a);
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	/* ─── Ambient colour blob — shifts per project ── */
	.rl-ambient {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 60% 50% at 70% 50%,
			var(--amb-color) 0%,
			transparent 70%
		);
		transition: background 0.6s ease;
		will-change: background;
	}

	/* ─── Scanlines ── */
	.rl-scanlines {
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

	/* ─── Content wrapper ── */
	.rl-inner {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: var(--max-w, 1400px);
		margin: 0 auto;
		padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 3rem);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 4rem);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   GRID  1/3  +  2/3
	══════════════════════════════════════════════════════════════════════ */
	.rl-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: start;
		opacity: 0;
		transform: translateY(32px);
		transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
	}

	.is-visible .rl-grid {
		opacity: 1;
		transform: translateY(0);
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   LEFT — PROJECT LIST
	══════════════════════════════════════════════════════════════════════ */
	.rl-list {
		position: sticky;
		top: calc(var(--nav-h, 4rem) + 1.5rem);
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		/* vertical track */
		padding-left: 1.25rem;
	}

	/* Vertical track line */
	.rl-list__track {
		position: absolute;
		left: 0;
		top: 0.5rem;
		bottom: 0.5rem;
		width: 1px;
		background: linear-gradient(
			to bottom,
			transparent,
			rgba(0, 245, 255, 0.3) 20%,
			rgba(0, 245, 255, 0.3) 80%,
			transparent
		);
	}

	/* ─── Each item ── */
	.rl-item {
		position: relative;
		display: grid;
		grid-template-columns: 2rem 1fr auto auto;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		padding: 0.75rem 0.75rem 0.75rem 0;
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		text-align: left;
		transition: background 0.25s ease, border-color 0.25s ease;
	}

	.rl-item:hover {
		background: rgba(0, 245, 255, 0.04);
		border-color: rgba(0, 245, 255, 0.12);
	}

	/* Active state — colour driven by per-item class */
	.rl-item.is-active {
		background: color-mix(in srgb, var(--item-color, var(--cp-cyan, #00f5ff)) 7%, transparent);
		border-color: color-mix(in srgb, var(--item-color, var(--cp-cyan, #00f5ff)) 25%, transparent);
	}

	/* Index number */
	.rl-item__index {
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		color: var(--cp-muted, #4a5568);
		letter-spacing: 0.1em;
		flex-shrink: 0;
		transition: color 0.25s;
		text-align: center;
	}

	.rl-item.is-active .rl-item__index { color: var(--item-color, var(--cp-cyan, #00f5ff)); }

	/* Text block */
	.rl-item__info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.rl-item__name {
		font-family: var(--font-logo, monospace);
		font-size: clamp(0.7rem, 1.4vw, 0.85rem);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--cp-text, #e2e8f0);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: color 0.25s;
	}

	.rl-item.is-active .rl-item__name { color: var(--item-color, var(--cp-cyan, #00f5ff)); }

	.rl-item__tag {
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		color: var(--cp-muted, #4a5568);
		letter-spacing: 0.08em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Active side bar */
	.rl-item__bar {
		position: absolute;
		left: -1.25rem;
		top: 50%;
		transform: translateY(-50%) scaleY(0);
		width: 2px;
		height: 70%;
		background: var(--cp-cyan, #00f5ff);
		transform-origin: center;
		transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
	}

	.rl-item.is-active .rl-item__bar                { transform: translateY(-50%) scaleY(1); }
	.rl-item.is-active .rl-item__bar { background: var(--item-color, var(--cp-cyan, #00f5ff)); }

	/* Chevron */
	.rl-item__chevron {
		font-size: 1rem;
		color: var(--cp-muted, #4a5568);
		transition: color 0.25s, transform 0.25s;
		flex-shrink: 0;
	}

	.rl-item:hover .rl-item__chevron,
	.rl-item.is-active .rl-item__chevron {
		transform: translateX(3px);
		color: var(--item-color, var(--cp-cyan, #00f5ff));
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   RIGHT — PROJECT DETAIL
	══════════════════════════════════════════════════════════════════════ */
	.rl-detail {
		position: relative;
		min-height: 28rem;
	}

	/* {#key} creates/destroys this div — entrance animation */
	.rl-detail__body {
		display: flex;
		flex-direction: column;
		gap: clamp(1.25rem, 2.5vw, 2rem);
		border: 1px solid var(--proj-border);
		background: linear-gradient(
			135deg,
			rgba(16, 66, 233, 0.08) 0%,
			rgba(16, 66, 233, 0.03) 100%
		);
		padding: clamp(1.25rem, 3vw, 2rem);
		/* entrance */
		animation: detailEnter 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes detailEnter {
		from {
			opacity: 0;
			transform: translateX(18px) scale(0.985);
			filter: blur(2px);
		}
		to {
			opacity: 1;
			transform: translateX(0) scale(1);
			filter: blur(0);
		}
	}

	/* ─── Detail header row ── */
	.rl-detail__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.rl-detail__meta {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.rl-detail__index {
		font-family: var(--font-mono, monospace);
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 700;
		color: var(--proj-color);
		opacity: 0.15;
		line-height: 1;
		letter-spacing: -0.02em;
		flex-shrink: 0;
		pointer-events: none;
		user-select: none;
	}

	.rl-detail__name {
		font-family: var(--font-logo, var(--font-bionical, monospace));
		font-size: clamp(1.1rem, 3vw, 1.8rem);
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--proj-color);
		text-shadow: 0 0 20px color-mix(in srgb, var(--proj-color) 40%, transparent);
		margin: 0 0 0.2rem;
	}

	.rl-detail__tag {
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5568);
	}

	.rl-detail__link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.9rem;
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--proj-color);
		border: 1px solid var(--proj-border);
		transition: background 0.2s, box-shadow 0.2s;
		flex-shrink: 0;
	}

	.rl-detail__link svg {
		width: 0.85rem;
		height: 0.85rem;
	}

	.rl-detail__link:hover {
		background: color-mix(in srgb, var(--proj-color) 10%, transparent);
		box-shadow: 0 0 12px color-mix(in srgb, var(--proj-color) 30%, transparent);
	}

	/* ─── Description ── */
	.rl-detail__desc {
		font-family: var(--font-ui, sans-serif);
		font-size: clamp(0.8rem, 1.5vw, 0.95rem);
		line-height: 1.75;
		color: rgba(226, 232, 240, 0.8);
		margin: 0;
		border-left: 2px solid var(--proj-border);
		padding-left: 1rem;
	}

	/* ─── Key metrics list ── */
	.rl-keys {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 0.5rem;
	}

	.rl-key {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		padding: 0.55rem 0.75rem;
		background: rgba(0, 0, 0, 0.25);
		border: 1px solid rgba(255, 255, 255, 0.06);
		/* stagger entrance */
		animation: keyEnter 0.35s ease both;
		animation-delay: calc(0.1s + var(--ki) * 0.06s);
	}

	@keyframes keyEnter {
		from { opacity: 0; transform: translateY(8px); }
		to   { opacity: 1; transform: translateY(0);   }
	}

	.rl-key__label {
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--proj-color);
		flex-shrink: 0;
	}

	.rl-key__sep {
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		color: var(--cp-muted, #4a5568);
		flex-shrink: 0;
	}

	.rl-key__value {
		font-family: var(--font-mono, monospace);
		font-size: 0.68rem;
		color: rgba(226, 232, 240, 0.75);
		letter-spacing: 0.04em;
		white-space: normal;
		overflow: hidden;
	}

	/* ─── Video ── */
	.rl-video-wrap {
		position: relative;
		width: 100%;
		border: 1px solid var(--proj-border);
		overflow: hidden;
		background: #000;
	}

	.rl-video-frame {
		position: absolute;
		inset: 0;
		border: 1px solid color-mix(in srgb, var(--proj-color) 25%, transparent);
		pointer-events: none;
		z-index: 1;
	}

	.rl-video-label {
		position: absolute;
		top: 0.5rem;
		left: 0.75rem;
		font-family: var(--font-mono, monospace);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		color: var(--proj-color);
		opacity: 0.7;
		z-index: 2;
		pointer-events: none;
	}

	.rl-video {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	/* ─── Video placeholder ── */
	.rl-video-placeholder {
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 1px dashed var(--proj-border);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.rl-video-ph-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.rl-video-ph-icon {
		font-size: 2rem;
		color: var(--proj-color);
		opacity: 0.25;
	}

	.rl-video-ph-text {
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--cp-muted, #4a5568);
		text-align: center;
		line-height: 1.6;
	}

	/* ═══════════════════════════════════════════════════════════════════════
	   RESPONSIVE
	══════════════════════════════════════════════════════════════════════ */

	/* Tablet: stack list above detail, list goes horizontal */
	@media (max-width: 900px) {
		.rl-grid {
			grid-template-columns: 1fr;
			gap: clamp(1rem, 3vw, 1.5rem);
		}

		.rl-list {
			position: static;
			flex-direction: row;
			flex-wrap: wrap;
            justify-content: center;
            align-items: center;
			overflow-x: auto;
			padding-left: 0;
			padding-bottom: 0.5rem;
			gap: 0.5rem;
			/* hide scrollbar visually */
			scrollbar-width: none;
		}

		.rl-list::-webkit-scrollbar { display: none; }

		.rl-list__track { display: none; }

		/* Horizontal pill shape */
		.rl-item {
			max-width: clamp(6rem, 30vw, 10rem);
			padding: 0.65rem 0.75rem;
		}

		.rl-item__info {
			display: flex;
			align-items: center;
		}


		.rl-item__bar, .rl-item__tag, .rl-item__chevron {
			display: none;
		}

		.rl-item__index {
			font-size: 0.55rem;
		}

		.rl-item__tag {
			display: none; /* too narrow */
		}

		.rl-item__bar {
			display: none;
		}

		.rl-item__chevron {
			display: none;
		}
	}

	

	/* Very small mobile ≤ 450px */
	@media (max-width: 450px) {
		.rl-list {
			justify-content: flex-start;
			display: flex;
			width: 100%;
		}
        .rl-item {
            min-width: 0;
            max-width: 30px;
			display: flex;
			justify-content: center;
			align-items: center;
        }

		.rl-item__info, .rl-item__bar, .rl-item__chevron{
			display: none;
		}
		.rl-item__name {
			font-size: 0.7rem;
		}

		.rl-detail__name {
			font-size: 1.1rem;
		}

		.rl-detail__link {
			font-size: 0.6rem;
			padding: 0.4rem 0.65rem;
		}
		
		.rl-inner {
			padding-inline: 0.75rem;
		}

		.rl-detail__head {
			flex-direction: column;
			gap: 0.75rem;
		}

		.rl-detail__index {
			font-size: 2rem;
			display: none;
		}

		.rl-keys {
			grid-template-columns: 1fr;
		}

		.rl-key__value {
			white-space: normal;
		}

		.rl-item {
			min-width: clamp(1.5rem, 30vw, 2rem);
			padding: 0.5rem 0.6rem;
		}
	}

	/* ─── Reduce motion ── */
	@media (prefers-reduced-motion: reduce) {
		.rl-grid,
		.rl-detail__body,
		.rl-key {
			animation: none !important;
			transition: none !important;
			opacity: 1;
			transform: none;
		}
	}
</style>