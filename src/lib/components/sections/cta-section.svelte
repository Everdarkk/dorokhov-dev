<script lang="ts">
	/**
	 * CtaSection — "INITIATE_CONTACT"
	 *
	 * Closing call-to-action section that drives project inquiries.
	 * Clicking the primary CTA opens a full-screen modal with an
	 * application form featuring:
	 *   • Client-side validation with inline feedback
	 *   • Honeypot + time-based bot/spam prevention (no external APIs)
	 *   • Body-scroll lock while the modal is active
	 *   • Escape-key + backdrop-click close
	 *   • Focus trap (Tab cycles within the modal only)
	 *   • Reduced-motion aware (no entrance animations, no canvas)
	 *
	 * Background:
	 *   • NeuralGridBackground — canvas 2D particle constellation
	 *   • CSS hex-dot grid overlay (static, zero runtime cost)
	 *   • CRT scanlines (shared pattern from other sections)
	 *   • Centre radial spotlight (draws eye to content)
	 */

	import { onMount, onDestroy, tick } from 'svelte';
	import { browser }                   from '$app/environment';
	import NeuralGridBackground           from '$lib/components/backgrounds/neural-grid-background.svelte';
	import CyberButton                    from '$lib/components/common/cyber-button.svelte';
	import { scrollReveal }               from '$lib/actions';
	import { reducedMotion }              from '$lib/stores';
	import { CTA_STATS, CTA_SERVICES, CTA_BUDGETS } from '$lib/constants/cta';

	// ── Section reveal ────────────────────────────────────────────────────────

	let sectionRevealed = false;

	// ── Modal state ───────────────────────────────────────────────────────────

	let modalOpen    = false;
	let modalEl: HTMLElement | null = null;
	let formOpenTime = 0;

	async function openModal(): Promise<void> {
		modalOpen = true;
		if (browser) document.body.style.overflow = 'hidden';
		formOpenTime = Date.now();
		await tick();
		// Focus first visible text input
		modalEl
			?.querySelector<HTMLElement>('input:not([tabindex="-1"])')
			?.focus();
	}

	function closeModal(): void {
		modalOpen = false;
		if (browser) document.body.style.overflow = '';
		resetForm();
	}

	// ── Form data ─────────────────────────────────────────────────────────────

	interface FormFields {
		name:    string;
		email:   string;
		company: string;
		service: string;
		budget:  string;
		message: string;
	}

	type RequiredField = 'name' | 'email' | 'service' | 'message';
	const REQUIRED: RequiredField[] = ['name', 'email', 'service', 'message'];

	let formData: FormFields = {
		name: '', email: '', company: '', service: '', budget: '', message: '',
	};

	let errors:  Partial<Record<RequiredField, string>> = {};
	let touched: Partial<Record<RequiredField, boolean>> = {};

	/** Hidden honeypot — bots fill this in; real users never see it. */
	let honeypotValue = '';

	type FormState = 'idle' | 'submitting' | 'success' | 'error';
	let formState: FormState = 'idle';

	// ── Validation ────────────────────────────────────────────────────────────

	function validateField(field: RequiredField): string {
		switch (field) {
			case 'name':
				if (!formData.name.trim())              return 'Name is required';
				if (formData.name.trim().length < 2)    return 'At least 2 characters';
				return '';
			case 'email':
				if (!formData.email.trim())             return 'Email is required';
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
					                                    return 'Enter a valid email';
				return '';
			case 'service':
				if (!formData.service)                  return 'Please select a type';
				return '';
			case 'message':
				if (!formData.message.trim())           return 'Message is required';
				if (formData.message.trim().length < 10) return 'At least 10 characters';
				return '';
		}
	}

	function validateAll(): boolean {
		let ok = true;
		for (const f of REQUIRED) {
			const err = validateField(f);
			errors[f]  = err;
			touched[f] = true;
			if (err) ok = false;
		}
		errors = { ...errors };
		return ok;
	}

	function handleBlur(field: RequiredField): void {
		touched[field] = true;
		errors[field]  = validateField(field);
		errors = { ...errors };
	}

	function handleInput(field: RequiredField): void {
		if (!touched[field]) return;
		errors[field] = validateField(field);
		errors = { ...errors };
	}

	function resetForm(): void {
		formData    = { name: '', email: '', company: '', service: '', budget: '', message: '' };
		errors      = {};
		touched     = {};
		formState   = 'idle';
		honeypotValue = '';
	}

	// ── Submit ────────────────────────────────────────────────────────────────

	async function handleSubmit(e: Event): Promise<void> {
		e.preventDefault();

		// ── Bot & spam guards ──────────────────────────────────────────────────
		if (honeypotValue)                        return; // honeypot triggered
		if (Date.now() - formOpenTime < 2000)     return; // submitted too fast

		if (!validateAll()) return;

		formState = 'submitting';

		try {
			// ─────────────────────────────────────────────────────────────────
			// TODO: Replace the line below with your actual API call.
			//   e.g. await fetch('/api/contact', { method: 'POST', body: ... })
			// ─────────────────────────────────────────────────────────────────
			await new Promise((resolve) => setTimeout(resolve, 1600));

			formState = 'success';
		} catch {
			formState = 'error';
		}
	}

	// ── Keyboard handling (Escape + Tab trap) ─────────────────────────────────

	function handleKeydown(e: KeyboardEvent): void {
		if (!modalOpen) return;

		if (e.key === 'Escape') {
			closeModal();
			return;
		}

		if (e.key === 'Tab' && modalEl) {
			const focusable = Array.from(
				modalEl.querySelectorAll<HTMLElement>(
					'input:not([tabindex="-1"]), select, textarea, button:not([disabled]), a[href]'
				)
			).filter((el) => !el.closest('.cta-form__honeypot'));

			if (focusable.length === 0) return;

			const first = focusable[0];
			const last  = focusable[focusable.length - 1];

			if (e.shiftKey && document.activeElement === first) {
				last.focus();
				e.preventDefault();
			} else if (!e.shiftKey && document.activeElement === last) {
				first.focus();
				e.preventDefault();
			}
		}
	}

	// ── Backdrop click ────────────────────────────────────────────────────────

	function handleBackdropClick(e: MouseEvent): void {
		if (e.target === e.currentTarget) closeModal();
	}

	// ── Lifecycle ─────────────────────────────────────────────────────────────

	onMount(() => {
		if (!browser) return;
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = '';
		};
	});

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = '';
	});
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     SECTION
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	class="cta-section"
	id="contact"
	aria-labelledby="cta-heading"
	use:scrollReveal={{ threshold: 0.08, onReveal: () => (sectionRevealed = true) }}
>
	<!-- Animated particle-constellation background -->
	{#if !$reducedMotion}
		<NeuralGridBackground />
	{/if}

	<!-- CSS hex-dot grid (static) -->
	<div class="cta-hex-grid" aria-hidden="true"></div>

	<!-- CRT scanlines -->
	<div class="cta-scanlines" aria-hidden="true"></div>

	<!-- Centre spotlight -->
	<div class="cta-spotlight" aria-hidden="true"></div>

	<!-- Content -->
	<div class="cta-inner" class:is-revealed={sectionRevealed}>

		<!-- Section tag -->
		<div class="cta-tag" aria-hidden="true">
			<span class="cta-tag__slash">// </span>INITIATE_CONTACT
		</div>

		<!-- ── SEO-friendly heading ── -->
		<h2 class="cta-headline" id="cta-heading">
			Ready to&nbsp;<span class="cta-headline__accent">Deploy</span><br/>
			Your&nbsp;<span class="cta-headline__accent2">Vision?</span>
		</h2>

		<p class="cta-sub">
			High-performance web experiences — engineered for speed, SEO,&nbsp;and
			seamless user experience. From concept to launch, let's build
			something&nbsp;extraordinary.
		</p>

		<!-- Stats row -->
		<ul class="cta-stats" aria-label="Key metrics">
			{#each CTA_STATS as stat, i (stat.label)}
				<li class="cta-stat" style="--si: {i}">
					<span class="cta-stat__symbol" aria-hidden="true">{stat.symbol}</span>
					<strong class="cta-stat__value">{stat.value}</strong>
					<span class="cta-stat__label">{stat.label}</span>
				</li>
			{/each}
		</ul>

		<!-- Primary CTA -->
		<div class="cta-action">
			<CyberButton variant="primary" size="lg" on:click={openModal} ariaLabel="Open project inquiry form">
				INITIATE&nbsp;PROJECT
			</CyberButton>
		</div>

		<!-- Trust note -->
		<p class="cta-trust" aria-label="Commitment details">
			Free consultation&nbsp;&nbsp;·&nbsp;&nbsp;48h response&nbsp;&nbsp;·&nbsp;&nbsp;No commitment
		</p>

	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     MODAL OVERLAY
     ═══════════════════════════════════════════════════════════════════════════ -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="cta-modal"
	class:is-open={modalOpen}
	role="dialog"
	aria-modal="true"
	aria-label="Project inquiry form"
	aria-hidden={!modalOpen || undefined}
	inert={!modalOpen || undefined}
	bind:this={modalEl}
	on:click={handleBackdropClick}
>
	<!-- Panel -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="cta-modal__panel"
		role="document"
		on:click|stopPropagation
	>
		<!-- Modal scanlines -->
		<div class="cta-modal__scanlines" aria-hidden="true"></div>

		<!-- Corner brackets (decorative) -->
		<div class="cta-modal__corner cta-modal__corner--tl" aria-hidden="true"></div>
		<div class="cta-modal__corner cta-modal__corner--tr" aria-hidden="true"></div>
		<div class="cta-modal__corner cta-modal__corner--bl" aria-hidden="true"></div>
		<div class="cta-modal__corner cta-modal__corner--br" aria-hidden="true"></div>

		<!-- ── Header ── -->
		<div class="cta-modal__header">
			<div class="cta-modal__title">
				<span class="cta-modal__slash" aria-hidden="true">// </span>NEW_MISSION_BRIEFING
			</div>
			<button
				class="cta-modal__close"
				type="button"
				on:click={closeModal}
				aria-label="Close form"
			>
				<svg viewBox="0 0 18 18" fill="none" aria-hidden="true" width="18" height="18">
					<line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
					<line x1="16" y1="2" x2="2"  y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</button>
		</div>

		<!-- ── Panel glow accent line ── -->
		<div class="cta-modal__accent-line" aria-hidden="true"></div>

		<!-- ═══════════════════════════════════════════════════════════════════
		     SUCCESS STATE
		     ═══════════════════════════════════════════════════════════════════ -->
		{#if formState === 'success'}
			<div class="cta-form-success">
				<div class="cta-form-success__icon" aria-hidden="true">◈</div>
				<h3 class="cta-form-success__title">TRANSMISSION_RECEIVED</h3>
				<p class="cta-form-success__body">
					Mission briefing acknowledged. I'll review your project details and
					respond within 48&nbsp;hours.
				</p>
				<CyberButton variant="ghost" on:click={closeModal}>
					CLOSE_TERMINAL
				</CyberButton>
			</div>

		<!-- ═══════════════════════════════════════════════════════════════════
		     FORM
		     ═══════════════════════════════════════════════════════════════════ -->
		{:else}
			<form class="cta-form" on:submit={handleSubmit} novalidate>

				<!-- ── Honeypot (spam prevention) — never shown to real users ── -->
				<div class="cta-form__honeypot" aria-hidden="true">
					<label for="cta-website">Website</label>
					<input
						type="text"
						id="cta-website"
						name="website"
						tabindex="-1"
						autocomplete="off"
						bind:value={honeypotValue}
					/>
				</div>

				<!-- ── Row 1: Name + Email ── -->
				<div class="cta-form__row">

					<div class="cta-form__group" class:has-error={touched.name && errors.name}>
						<label class="cta-form__label" for="cta-name">
							<span class="cta-form__slash" aria-hidden="true">// </span>Name
							<span class="cta-form__req" aria-label="required">*</span>
						</label>
						<input
							class="cta-form__input"
							type="text"
							id="cta-name"
							name="name"
							autocomplete="name"
							placeholder="Alex Mercer"
							bind:value={formData.name}
							on:blur={() => handleBlur('name')}
							on:input={() => handleInput('name')}
							aria-describedby={touched.name && errors.name ? 'err-name' : undefined}
							aria-invalid={!!(touched.name && errors.name)}
						/>
						{#if touched.name && errors.name}
							<span class="cta-form__error" id="err-name" role="alert">{errors.name}</span>
						{/if}
					</div>

					<div class="cta-form__group" class:has-error={touched.email && errors.email}>
						<label class="cta-form__label" for="cta-email">
							<span class="cta-form__slash" aria-hidden="true">// </span>Email
							<span class="cta-form__req" aria-label="required">*</span>
						</label>
						<input
							class="cta-form__input"
							type="email"
							id="cta-email"
							name="email"
							autocomplete="email"
							placeholder="alex@company.com"
							bind:value={formData.email}
							on:blur={() => handleBlur('email')}
							on:input={() => handleInput('email')}
							aria-describedby={touched.email && errors.email ? 'err-email' : undefined}
							aria-invalid={!!(touched.email && errors.email)}
						/>
						{#if touched.email && errors.email}
							<span class="cta-form__error" id="err-email" role="alert">{errors.email}</span>
						{/if}
					</div>

				</div><!-- /row 1 -->

				<!-- ── Row 2: Company + Project Type ── -->
				<div class="cta-form__row">

					<div class="cta-form__group">
						<label class="cta-form__label" for="cta-company">
							<span class="cta-form__slash" aria-hidden="true">// </span>Company
						</label>
						<input
							class="cta-form__input"
							type="text"
							id="cta-company"
							name="company"
							autocomplete="organization"
							placeholder="Optional"
							bind:value={formData.company}
						/>
					</div>

					<div class="cta-form__group" class:has-error={touched.service && errors.service}>
						<label class="cta-form__label" for="cta-service">
							<span class="cta-form__slash" aria-hidden="true">// </span>Project&nbsp;Type
							<span class="cta-form__req" aria-label="required">*</span>
						</label>
						<div class="cta-form__select-wrap">
							<select
								class="cta-form__select"
								id="cta-service"
								name="service"
								bind:value={formData.service}
								on:blur={() => handleBlur('service')}
								on:change={() => handleBlur('service')}
								aria-invalid={!!(touched.service && errors.service)}
							>
								<option value="">Select type...</option>
								{#each CTA_SERVICES as svc (svc.value)}
									<option value={svc.value}>{svc.label}</option>
								{/each}
							</select>
							<span class="cta-form__select-arrow" aria-hidden="true">▼</span>
						</div>
						{#if touched.service && errors.service}
							<span class="cta-form__error" id="err-service" role="alert">{errors.service}</span>
						{/if}
					</div>

				</div><!-- /row 2 -->

				<!-- ── Budget ── -->
				<div class="cta-form__group">
					<label class="cta-form__label" for="cta-budget">
						<span class="cta-form__slash" aria-hidden="true">// </span>Budget&nbsp;Range
					</label>
					<div class="cta-form__select-wrap">
						<select
							class="cta-form__select"
							id="cta-budget"
							name="budget"
							bind:value={formData.budget}
						>
							{#each CTA_BUDGETS as b (b.value + b.label)}
								<option value={b.value}>{b.label}</option>
							{/each}
						</select>
						<span class="cta-form__select-arrow" aria-hidden="true">▼</span>
					</div>
				</div>

				<!-- ── Message ── -->
				<div class="cta-form__group" class:has-error={touched.message && errors.message}>
					<label class="cta-form__label" for="cta-message">
						<span class="cta-form__slash" aria-hidden="true">// </span>Message
						<span class="cta-form__req" aria-label="required">*</span>
					</label>
					<textarea
						class="cta-form__textarea"
						id="cta-message"
						name="message"
						rows="4"
						placeholder="Describe your project, goals, and any specific requirements..."
						bind:value={formData.message}
						on:blur={() => handleBlur('message')}
						on:input={() => handleInput('message')}
						aria-describedby={touched.message && errors.message ? 'err-message' : undefined}
						aria-invalid={!!(touched.message && errors.message)}
					></textarea>
					{#if touched.message && errors.message}
						<span class="cta-form__error" id="err-message" role="alert">{errors.message}</span>
					{/if}
				</div>

				<!-- ── Submit row ── -->
				<div class="cta-form__footer">
					{#if formState === 'error'}
						<p class="cta-form__send-error" role="alert">
							⚠ Transmission failed. Please try again.
						</p>
					{/if}
					<CyberButton
						type="submit"
						variant="primary"
						size="lg"
						loading={formState === 'submitting'}
						disabled={formState === 'submitting'}
					>
						TRANSMIT_REQUEST
					</CyberButton>
					<p class="cta-form__note">
						Your data is never shared or sold. No spam, ever.
					</p>
				</div>

			</form>
		{/if}

	</div><!-- /.cta-modal__panel -->
</div><!-- /.cta-modal -->


<style>
/* ═════════════════════════════════════════════════════════════════════════════
   SECTION
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-section {
	position: relative;
	width: 100%;
	min-height: 100svh;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background: var(--cp-bg, #06060a);
}

/* ── Hex-dot grid (static CSS pattern) ── */
.cta-hex-grid {
	position: absolute;
	inset: 0;
	background-image:
		radial-gradient(circle, rgba(0, 245, 255, 0.05) 1px, transparent 1px),
		radial-gradient(circle, rgba(0, 245, 255, 0.025) 1px, transparent 1px);
	background-size:    32px 55px, 32px 55px;
	background-position: 0 0, 16px 27.5px;
	pointer-events: none;
	z-index: 1;
}

/* ── CRT scanlines ── */
.cta-scanlines {
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		to bottom,
		transparent           0px,
		transparent           3px,
		rgba(0, 0, 0, 0.07)   3px,
		rgba(0, 0, 0, 0.07)   4px
	);
	pointer-events: none;
	z-index: 2;
}

/* ── Centre spotlight — draws focus to content ── */
.cta-spotlight {
	position: absolute;
	inset: 0;
	background: radial-gradient(
		ellipse 70% 55% at 50% 50%,
		rgba(0, 245, 255, 0.06) 0%,
		transparent 70%
	);
	pointer-events: none;
	z-index: 2;
}

/* ═════════════════════════════════════════════════════════════════════════════
   INNER CONTENT
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-inner {
	position: relative;
	z-index: 3;
	max-width: var(--max-w, 1400px);
	width: 100%;
	margin: 0 auto;
	padding: clamp(5rem, 12vw, 9rem) clamp(1rem, 4vw, 3rem);
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: clamp(1.5rem, 3vw, 2.25rem);
}

/* ── Shared entrance: elements start hidden, stagger in after section reveal ── */

.cta-tag,
.cta-headline,
.cta-sub,
.cta-stats,
.cta-action,
.cta-trust {
	opacity: 0;
	transform: translateY(28px);
	transition:
		opacity    0.65s ease,
		transform  0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cta-inner.is-revealed .cta-tag     { opacity: 1; transform: none; transition-delay: 0s;    }
.cta-inner.is-revealed .cta-headline{ opacity: 1; transform: none; transition-delay: 0.1s;  }
.cta-inner.is-revealed .cta-sub     { opacity: 1; transform: none; transition-delay: 0.22s; }
.cta-inner.is-revealed .cta-stats   { opacity: 1; transform: none; transition-delay: 0.34s; }
.cta-inner.is-revealed .cta-action  { opacity: 1; transform: none; transition-delay: 0.48s; }
.cta-inner.is-revealed .cta-trust   { opacity: 1; transform: none; transition-delay: 0.58s; }

/* ── Tag label ── */
.cta-tag {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.6rem, 1.1vw, 0.72rem);
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
}

.cta-tag__slash {
	color: var(--cp-cyan, #00f5ff);
}

/* ── Main headline ── */
.cta-headline {
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-size: var(--font-h1);
	font-weight: 400;
	line-height: var(--line-heading, 1.15);
	letter-spacing: -0.01em;
	text-transform: uppercase;
	color: azure;
}

.cta-headline__accent {
	color: var(--cp-cyan, #00f5ff);
	text-shadow:
		0 0 24px rgba(0, 245, 255, 0.55),
		0 0 60px rgba(0, 245, 255, 0.2);
	animation: headlineGlow 3.5s ease-in-out infinite;
}

.cta-headline__accent2 {
	color: var(--cp-pink, #ff0055);
	text-shadow:
		0 0 24px rgba(255, 0, 85, 0.45),
		0 0 60px rgba(255, 0, 85, 0.15);
}

@keyframes headlineGlow {
	0%, 100% { text-shadow: 0 0 24px rgba(0, 245, 255, 0.55), 0 0 60px rgba(0, 245, 255, 0.2); }
	50%       { text-shadow: 0 0 40px rgba(0, 245, 255, 0.8),  0 0 80px rgba(0, 245, 255, 0.35); }
}

/* ── Sub-headline ── */
.cta-sub {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: var(--font-body-lg, clamp(1.1rem, 1.5vw, 1.25rem));
	line-height: var(--line-body, 1.6);
	color: rgba(255, 255, 255, 0.6);
	max-width: 56ch;
}

/* ═════════════════════════════════════════════════════════════════════════════
   STATS ROW
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-stats {
	display: flex;
	gap: clamp(1.5rem, 5vw, 4rem);
	flex-wrap: wrap;
	justify-content: center;
	padding: 0;
}

.cta-stat {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
	position: relative;
}

/* Stagger the stat entrance after the parent becomes visible */
.cta-inner.is-revealed .cta-stats .cta-stat {
	opacity: 1; transform: none;
	transition-delay: calc(0.34s + var(--si, 0) * 0.1s);
}

/* Separator between stats */
.cta-stat + .cta-stat::before {
	content: '';
	position: absolute;
	left: calc(-1 * clamp(0.75rem, 2.5vw, 2rem));
	top: 50%;
	transform: translateY(-50%);
	width: 1px;
	height: 2.5rem;
	background: linear-gradient(to bottom, transparent, rgba(0, 245, 255, 0.2), transparent);
}

.cta-stat__symbol {
	font-size: 1rem;
	color: var(--cp-cyan, #00f5ff);
	opacity: 0.7;
	font-family: var(--font-ui, monospace);
}

.cta-stat__value {
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-size: clamp(1.8rem, 4vw, 2.6rem);
	font-weight: 400;
	line-height: 1;
	color: var(--cp-cyan, #00f5ff);
	text-shadow: 0 0 20px rgba(0, 245, 255, 0.4);
	letter-spacing: 0.04em;
}

.cta-stat__label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.58rem, 0.9vw, 0.7rem);
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
}

/* ═════════════════════════════════════════════════════════════════════════════
   CTA ACTION
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-action {
	display: flex;
	justify-content: center;
}

/* ── Trust note ── */
.cta-trust {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.62rem, 0.9vw, 0.72rem);
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
}

/* ═════════════════════════════════════════════════════════════════════════════
   MODAL OVERLAY
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-modal {
	position: fixed;
	inset: 0;
	z-index: 9000;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: clamp(1rem, 4vw, 2.5rem) clamp(0.75rem, 3vw, 1.5rem);
	overflow-y: auto;
	background: rgba(4, 4, 10, 0.88);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);

	/* Hidden by default */
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s ease;
}

.cta-modal.is-open {
	opacity: 1;
	pointer-events: all;
}

/* ── Panel ── */
.cta-modal__panel {
	position: relative;
	width: 100%;
	max-width: 680px;
	margin: auto;
	background: rgba(6, 6, 10, 0.96);
	border: 1px solid rgba(0, 245, 255, 0.2);
	padding: clamp(1.5rem, 4vw, 2.5rem);
	overflow: hidden;

	/* Entrance: panel slides up as modal fades in */
	transform: translateY(28px) scale(0.98);
	transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cta-modal.is-open .cta-modal__panel {
	transform: translateY(0) scale(1);
}

/* ── Panel scanlines ── */
.cta-modal__scanlines {
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
	z-index: 0;
}

/* ── Accent line below header ── */
.cta-modal__accent-line {
	height: 1px;
	background: linear-gradient(90deg, var(--cp-cyan, #00f5ff), rgba(0, 245, 255, 0) 60%);
	margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
	animation: accentSweep 3s linear infinite;
}

@keyframes accentSweep {
	0%   { background-position: -200% 0; opacity: 0.8; }
	50%  { opacity: 1; }
	100% { background-position: 200%  0; opacity: 0.8; }
}

/* ── Corner brackets ── */
.cta-modal__corner {
	position: absolute;
	width: 16px;
	height: 16px;
	pointer-events: none;
	z-index: 2;
}

.cta-modal__corner--tl { top: 0; left: 0;  border-top:    1.5px solid var(--cp-cyan); border-left:   1.5px solid var(--cp-cyan); }
.cta-modal__corner--tr { top: 0; right: 0; border-top:    1.5px solid var(--cp-cyan); border-right:  1.5px solid var(--cp-cyan); }
.cta-modal__corner--bl { bottom: 0; left: 0;  border-bottom: 1.5px solid var(--cp-cyan); border-left:   1.5px solid var(--cp-cyan); }
.cta-modal__corner--br { bottom: 0; right: 0; border-bottom: 1.5px solid var(--cp-cyan); border-right:  1.5px solid var(--cp-cyan); }

/* ── Modal header ── */
.cta-modal__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: clamp(0.75rem, 2vw, 1rem);
	position: relative;
	z-index: 1;
}

.cta-modal__title {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.62rem, 1.1vw, 0.72rem);
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--cp-cyan, #00f5ff);
}

.cta-modal__slash {
	opacity: 0.6;
}

.cta-modal__close {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	background: transparent;
	border: 1px solid rgba(0, 245, 255, 0.2);
	color: var(--cp-muted, #4a5a6a);
	cursor: pointer;
	transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
	outline: none;
	flex-shrink: 0;
}

.cta-modal__close:hover,
.cta-modal__close:focus-visible {
	color: var(--cp-cyan, #00f5ff);
	border-color: rgba(0, 245, 255, 0.5);
	background: rgba(0, 245, 255, 0.06);
}

.cta-modal__close:focus-visible {
	outline: 2px solid var(--cp-cyan);
	outline-offset: 2px;
}

/* ═════════════════════════════════════════════════════════════════════════════
   SUCCESS STATE
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-form-success {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 1.25rem;
	padding: clamp(1rem, 4vw, 2rem) 0;
	position: relative;
	z-index: 1;
}

.cta-form-success__icon {
	font-size: 3rem;
	color: var(--cp-cyan, #00f5ff);
	text-shadow: 0 0 32px rgba(0, 245, 255, 0.6);
	animation: successPulse 2s ease-in-out infinite;
}

@keyframes successPulse {
	0%, 100% { opacity: 1; text-shadow: 0 0 32px rgba(0, 245, 255, 0.6); }
	50%       { opacity: 0.7; text-shadow: 0 0 56px rgba(0, 245, 255, 0.9); }
}

.cta-form-success__title {
	font-family: var(--font-bionical, 'Courier Prime', monospace);
	font-size: var(--font-h4, 1.5rem);
	font-weight: 400;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: var(--cp-cyan, #00f5ff);
}

.cta-form-success__body {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: var(--font-body-sm, 0.95rem);
	line-height: var(--line-body, 1.65);
	color: rgba(255, 255, 255, 0.65);
	max-width: 42ch;
}

/* ═════════════════════════════════════════════════════════════════════════════
   FORM
   ═════════════════════════════════════════════════════════════════════════════ */

.cta-form {
	display: flex;
	flex-direction: column;
	gap: clamp(1rem, 2.5vw, 1.4rem);
	position: relative;
	z-index: 1;
}

/* ── Honeypot — visually hidden, inaccessible to users ── */
.cta-form__honeypot {
	position: absolute;
	left: -9999px;
	top: -9999px;
	width: 1px;
	height: 1px;
	overflow: hidden;
	opacity: 0;
	pointer-events: none;
}

/* ── Two-column rows ── */
.cta-form__row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: clamp(0.75rem, 2vw, 1.25rem);
}

@media (max-width: 520px) {
	.cta-form__row { grid-template-columns: 1fr; }
}

/* ── Form group ── */
.cta-form__group {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

/* ── Labels ── */
.cta-form__label {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.58rem, 0.9vw, 0.68rem);
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--cp-muted, #4a5a6a);
	display: flex;
	align-items: center;
	gap: 0.3em;
}

.cta-form__slash {
	color: var(--cp-cyan, #00f5ff);
	opacity: 0.7;
}

.cta-form__req {
	color: var(--cp-pink, #ff0055);
	font-style: normal;
}

/* ── Inputs & Textarea ── */
.cta-form__input,
.cta-form__textarea {
	width: 100%;
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(0, 245, 255, 0.15);
	color: rgba(255, 255, 255, 0.88);
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: var(--font-body-sm, 0.9rem);
	padding: 0.65rem 0.9rem;
	outline: none;
	transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
	caret-color: var(--cp-cyan, #00f5ff);
}

.cta-form__input::placeholder,
.cta-form__textarea::placeholder {
	color: rgba(74, 90, 106, 0.7);
}

.cta-form__input:focus,
.cta-form__textarea:focus {
	border-color: rgba(0, 245, 255, 0.5);
	background: rgba(0, 245, 255, 0.04);
	box-shadow: 0 0 0 1px rgba(0, 245, 255, 0.15),
	            inset 0 0 12px rgba(0, 245, 255, 0.04);
}

.cta-form__textarea {
	resize: vertical;
	min-height: 100px;
}

/* ── Select wrapper ── */
.cta-form__select-wrap {
	position: relative;
	display: flex;
	align-items: center;
}

.cta-form__select {
	width: 100%;
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(0, 245, 255, 0.15);
	color: rgba(255, 255, 255, 0.88);
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: var(--font-body-sm, 0.9rem);
	padding: 0.65rem 2.5rem 0.65rem 0.9rem;
	outline: none;
	appearance: none;
	cursor: pointer;
	transition: border-color 0.22s ease, background 0.22s ease;
}

.cta-form__select:focus {
	border-color: rgba(0, 245, 255, 0.5);
	background: rgba(0, 245, 255, 0.04);
}

.cta-form__select option {
	background: #0d0d14;
	color: rgba(255, 255, 255, 0.88);
}

.cta-form__select-arrow {
	position: absolute;
	right: 0.75rem;
	font-size: 0.55rem;
	color: var(--cp-cyan, #00f5ff);
	opacity: 0.6;
	pointer-events: none;
}

/* ── Error state ── */
.cta-form__group.has-error .cta-form__input,
.cta-form__group.has-error .cta-form__textarea,
.cta-form__group.has-error .cta-form__select {
	border-color: rgba(255, 0, 85, 0.5);
}

.cta-form__error {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: 0.65rem;
	letter-spacing: 0.08em;
	color: var(--cp-pink, #ff0055);
	text-shadow: 0 0 8px rgba(255, 0, 85, 0.4);
}

/* ── Footer row ── */
.cta-form__footer {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.75rem;
	padding-top: 0.25rem;
}

.cta-form__send-error {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: 0.7rem;
	letter-spacing: 0.1em;
	color: var(--cp-pink, #ff0055);
}

.cta-form__note {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size: clamp(0.58rem, 0.85vw, 0.65rem);
	letter-spacing: 0.1em;
	color: var(--cp-muted, #4a5a6a);
	opacity: 0.75;
}

/* ═════════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═════════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.cta-tag,
	.cta-headline,
	.cta-sub,
	.cta-stats,
	.cta-action,
	.cta-trust {
		opacity: 1 !important;
		transform: none !important;
		transition: none !important;
	}

	.cta-headline__accent,
	.cta-form-success__icon,
	.cta-modal__accent-line {
		animation: none !important;
	}

	.cta-modal,
	.cta-modal__panel {
		transition: none !important;
	}
}
</style>
