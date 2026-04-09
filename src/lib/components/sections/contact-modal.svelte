<script lang="ts">
	/**
	 * ContactModal — "NEW_MISSION_BRIEFING"
	 *
	 * Self-contained project-inquiry modal extracted from cta-section.svelte.
	 * Opened imperatively via the exported openModal() method; manages its own
	 * open/close state so the parent stays thin.
	 *
	 * Features:
	 *   • Full client-side validation with per-field inline feedback
	 *   • Honeypot + form-open-time bot/spam guard (client layer)
	 *   • Actual POST to /api/contact (server validates again independently)
	 *   • Body-scroll lock while open (preserves scrollbar width)
	 *   • Escape-key close + backdrop-click close
	 *   • Focus trap (Tab cycles inside modal only)
	 *   • Reduced-motion aware
	 *   • Full ARIA: role=dialog, aria-modal, inert, aria-invalid, aria-describedby
	 */

	import { onMount, onDestroy, tick } from 'svelte';
	import { browser }                  from '$app/environment';
	import CyberButton                  from '$lib/components/common/cyber-button.svelte';
	import { CTA_SERVICES, CTA_BUDGETS } from '$lib/constants/cta';

	// ── Open/Close ────────────────────────────────────────────────────────────

	let isOpen = false;
	let modalEl: HTMLElement | null = null;
	let formOpenTime = 0;
	let previousBodyOverflow     = '';
	let previousBodyPaddingRight = '';

	function lockBodyScroll(): void {
		if (!browser) return;
		const { body, documentElement } = document;
		previousBodyOverflow     = body.style.overflow;
		previousBodyPaddingRight = body.style.paddingRight;
		const sbw = Math.max(0, window.innerWidth - documentElement.clientWidth);
		body.style.overflow = 'hidden';
		if (sbw > 0) body.style.paddingRight = `${sbw}px`;
	}

	function unlockBodyScroll(): void {
		if (!browser) return;
		document.body.style.overflow     = previousBodyOverflow;
		document.body.style.paddingRight = previousBodyPaddingRight;
	}

	/** Called by parent: <ContactModal bind:this={ref}> → ref.openModal() */
	export async function openModal(): Promise<void> {
		isOpen      = true;
		formOpenTime = Date.now();
		lockBodyScroll();
		await tick();
		modalEl
			?.querySelector<HTMLElement>('input:not([tabindex="-1"])')
			?.focus();
	}

	function closeModal(): void {
		isOpen = false;
		unlockBodyScroll();
		// Delay reset so the closing animation completes before clearing fields
		setTimeout(resetForm, 320);
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
	let honeypotValue = '';

	type FormState = 'idle' | 'submitting' | 'success' | 'error';
	let formState: FormState = 'idle';
	let serverError = '';

	// ── Validation ────────────────────────────────────────────────────────────

	function validateField(field: RequiredField): string {
		switch (field) {
			case 'name':
				if (!formData.name.trim())           return 'Name is required';
				if (formData.name.trim().length < 2) return 'At least 2 characters';
				return '';
			case 'email':
				if (!formData.email.trim())          return 'Email is required';
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
					                                 return 'Enter a valid email';
				return '';
			case 'service':
				if (!formData.service)               return 'Please select a type';
				return '';
			case 'message':
				if (!formData.message.trim())        return 'Message is required';
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
		formData      = { name: '', email: '', company: '', service: '', budget: '', message: '' };
		errors        = {};
		touched       = {};
		formState     = 'idle';
		serverError   = '';
		honeypotValue = '';
	}

	// ── Submit ────────────────────────────────────────────────────────────────

	async function handleSubmit(e: Event): Promise<void> {
		e.preventDefault();

		// Client-side bot guards (server re-validates independently)
		if (honeypotValue)                    return; // honeypot triggered
		if (Date.now() - formOpenTime < 2000) return; // too fast

		if (!validateAll()) return;

		formState   = 'submitting';
		serverError = '';

		try {
			const res = await fetch('/api/contact', {
				method:  'POST',
				headers: {
					'Content-Type':     'application/json',
					'X-Requested-With': 'XMLHttpRequest',
				},
				body: JSON.stringify({
					...formData,
					website:      honeypotValue,
					formOpenedAt: formOpenTime,
				}),
			});

			if (res.ok) {
				formState = 'success';
			} else {
				// Surface the server's error message when available
				let msg = 'Transmission failed. Please try again.';
				try {
					const data = await res.json() as { message?: string };
					if (data.message) msg = data.message;
				} catch { /* ignore parse error */ }
				serverError = msg;
				formState   = 'error';
			}
		} catch {
			serverError = 'Network error. Check your connection and try again.';
			formState   = 'error';
		}
	}

	// ── Keyboard: Escape + Tab trap ───────────────────────────────────────────

	function handleKeydown(e: KeyboardEvent): void {
		if (!isOpen) return;

		if (e.key === 'Escape') {
			closeModal();
			return;
		}

		if (e.key === 'Tab' && modalEl) {
			const focusable = Array.from(
				modalEl.querySelectorAll<HTMLElement>(
					'input:not([tabindex="-1"]), select, textarea, button:not([disabled]), a[href]',
				),
			).filter((el) => !el.closest('.cm-honeypot'));

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

	function handleBackdropClick(e: MouseEvent): void {
		if (e.target === e.currentTarget) closeModal();
	}

	// ── Lifecycle ─────────────────────────────────────────────────────────────

	onMount(() => {
		if (!browser) return;
		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		if (!browser) return;
		unlockBodyScroll();
	});
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     MODAL OVERLAY
     ═══════════════════════════════════════════════════════════════════════════ -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="cm"
	class:is-open={isOpen}
	role="dialog"
	aria-modal="true"
	aria-label="Project inquiry form"
	aria-hidden={!isOpen || undefined}
	inert={!isOpen || undefined}
	bind:this={modalEl}
	on:click={handleBackdropClick}
>
	<!-- Panel -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="cm__panel" role="document" on:click|stopPropagation>

		<!-- Scanlines overlay -->
		<div class="cm__scanlines" aria-hidden="true"></div>

		<!-- Corner brackets (decorative) -->
		<div class="cm__corner cm__corner--tl" aria-hidden="true"></div>
		<div class="cm__corner cm__corner--tr" aria-hidden="true"></div>
		<div class="cm__corner cm__corner--bl" aria-hidden="true"></div>
		<div class="cm__corner cm__corner--br" aria-hidden="true"></div>

		<!-- ── Header ── -->
		<div class="cm__header">
			<div class="cm__title" aria-hidden="true">
				<span class="cm__slash">// </span>NEW_MISSION_BRIEFING
			</div>
			<button
				class="cm__close"
				type="button"
				on:click={closeModal}
				aria-label="Close form"
			>
				<svg viewBox="0 0 18 18" fill="none" aria-hidden="true" width="18" height="18">
					<line x1="2" y1="2"  x2="16" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
					<line x1="16" y1="2" x2="2"  y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</button>
		</div>

		<!-- Glow accent line -->
		<div class="cm__accent-line" aria-hidden="true"></div>

		<!-- ═══════════════════════════════════════════════════════════════════
		     SUCCESS STATE
		     ═══════════════════════════════════════════════════════════════════ -->
		{#if formState === 'success'}
			<div class="cm-success">
				<div class="cm-success__icon" aria-hidden="true">◈</div>
				<h3 class="cm-success__title">TRANSMISSION_RECEIVED</h3>
				<p class="cm-success__body">
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
			<form class="cm-form" on:submit={handleSubmit} novalidate>

				<!-- Honeypot — hidden from real users, irresistible to bots -->
				<div class="cm-honeypot" aria-hidden="true">
					<label for="cm-website">Website</label>
					<input
						type="text"
						id="cm-website"
						name="website"
						tabindex="-1"
						autocomplete="off"
						bind:value={honeypotValue}
					/>
				</div>

				<!-- Row 1: Name + Email -->
				<div class="cm-form__row">

					<div class="cm-form__group" class:has-error={touched.name && errors.name}>
						<label class="cm-form__label" for="cm-name">
							<span class="cm-form__slash" aria-hidden="true">// </span>Name
							<span class="cm-form__req" aria-label="required">*</span>
						</label>
						<input
							class="cm-form__input"
							type="text"
							id="cm-name"
							name="name"
							autocomplete="name"
							placeholder="Alex Mercer"
							bind:value={formData.name}
							on:blur={() => handleBlur('name')}
							on:input={() => handleInput('name')}
							aria-describedby={touched.name && errors.name ? 'cm-err-name' : undefined}
							aria-invalid={!!(touched.name && errors.name)}
						/>
						{#if touched.name && errors.name}
							<span class="cm-form__error" id="cm-err-name" role="alert">{errors.name}</span>
						{/if}
					</div>

					<div class="cm-form__group" class:has-error={touched.email && errors.email}>
						<label class="cm-form__label" for="cm-email">
							<span class="cm-form__slash" aria-hidden="true">// </span>Email
							<span class="cm-form__req" aria-label="required">*</span>
						</label>
						<input
							class="cm-form__input"
							type="email"
							id="cm-email"
							name="email"
							autocomplete="email"
							placeholder="alex@company.com"
							bind:value={formData.email}
							on:blur={() => handleBlur('email')}
							on:input={() => handleInput('email')}
							aria-describedby={touched.email && errors.email ? 'cm-err-email' : undefined}
							aria-invalid={!!(touched.email && errors.email)}
						/>
						{#if touched.email && errors.email}
							<span class="cm-form__error" id="cm-err-email" role="alert">{errors.email}</span>
						{/if}
					</div>

				</div><!-- /row 1 -->

				<!-- Row 2: Company + Project Type -->
				<div class="cm-form__row">

					<div class="cm-form__group">
						<label class="cm-form__label" for="cm-company">
							<span class="cm-form__slash" aria-hidden="true">// </span>Company
						</label>
						<input
							class="cm-form__input"
							type="text"
							id="cm-company"
							name="company"
							autocomplete="organization"
							placeholder="Optional"
							bind:value={formData.company}
						/>
					</div>

					<div class="cm-form__group" class:has-error={touched.service && errors.service}>
						<label class="cm-form__label" for="cm-service">
							<span class="cm-form__slash" aria-hidden="true">// </span>Project&nbsp;Type
							<span class="cm-form__req" aria-label="required">*</span>
						</label>
						<div class="cm-form__select-wrap">
							<select
								class="cm-form__select"
								id="cm-service"
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
							<span class="cm-form__select-arrow" aria-hidden="true">▼</span>
						</div>
						{#if touched.service && errors.service}
							<span class="cm-form__error" id="cm-err-service" role="alert">{errors.service}</span>
						{/if}
					</div>

				</div><!-- /row 2 -->

				<!-- Budget Range -->
				<div class="cm-form__group">
					<label class="cm-form__label" for="cm-budget">
						<span class="cm-form__slash" aria-hidden="true">// </span>Budget&nbsp;Range
					</label>
					<div class="cm-form__select-wrap">
						<select
							class="cm-form__select"
							id="cm-budget"
							name="budget"
							bind:value={formData.budget}
						>
							{#each CTA_BUDGETS as b (b.value + b.label)}
								<option value={b.value}>{b.label}</option>
							{/each}
						</select>
						<span class="cm-form__select-arrow" aria-hidden="true">▼</span>
					</div>
				</div>

				<!-- Message -->
				<div class="cm-form__group" class:has-error={touched.message && errors.message}>
					<label class="cm-form__label" for="cm-message">
						<span class="cm-form__slash" aria-hidden="true">// </span>Message
						<span class="cm-form__req" aria-label="required">*</span>
					</label>
					<textarea
						class="cm-form__textarea"
						id="cm-message"
						name="message"
						rows="4"
						placeholder="Describe your project, goals, and any specific requirements..."
						bind:value={formData.message}
						on:blur={() => handleBlur('message')}
						on:input={() => handleInput('message')}
						aria-describedby={touched.message && errors.message ? 'cm-err-message' : undefined}
						aria-invalid={!!(touched.message && errors.message)}
					></textarea>
					{#if touched.message && errors.message}
						<span class="cm-form__error" id="cm-err-message" role="alert">{errors.message}</span>
					{/if}
				</div>

				<!-- Submit row -->
				<div class="cm-form__footer">
					{#if formState === 'error'}
						<p class="cm-form__send-error" role="alert">
							⚠&nbsp;{serverError || 'Transmission failed. Please try again.'}
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
					<p class="cm-form__note">
						Your data is never shared or sold. No spam, ever.
					</p>
				</div>

			</form>
		{/if}

	</div><!-- /.cm__panel -->
</div><!-- /.cm -->


<style>
/* ═════════════════════════════════════════════════════════════════════════════
   MODAL OVERLAY
   ═════════════════════════════════════════════════════════════════════════════ */

.cm {
	position:        fixed;
	inset:           0;
	z-index:         9000;
	display:         flex;
	align-items:     flex-start;
	justify-content: center;
	padding:         clamp(1rem, 4vw, 2.5rem) clamp(0.75rem, 3vw, 1.5rem);
	overflow-y:      auto;
	background:      rgba(4, 4, 10, 0.88);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);

	opacity:        0;
	pointer-events: none;
	transition:     opacity 0.3s ease;
}

.cm.is-open {
	opacity:        1;
	pointer-events: all;
}

/* ── Panel ── */
.cm__panel {
	position:   relative;
	width:      100%;
	max-width:  680px;
	margin:     auto;
	background: rgba(6, 6, 10, 0.96);
	border:     1px solid rgba(0, 245, 255, 0.2);
	padding:    clamp(1.5rem, 4vw, 2.5rem);
	overflow:   hidden;

	transform:  translateY(28px) scale(0.98);
	transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cm.is-open .cm__panel {
	transform: translateY(0) scale(1);
}

/* ── Panel scanlines ── */
.cm__scanlines {
	position:       absolute;
	inset:          0;
	background:     repeating-linear-gradient(
		to bottom,
		transparent          0px,
		transparent          3px,
		rgba(0, 0, 0, 0.06)  3px,
		rgba(0, 0, 0, 0.06)  4px
	);
	pointer-events: none;
	z-index:        0;
}

/* ── Accent line below header ── */
.cm__accent-line {
	height:      1px;
	background:  linear-gradient(90deg, var(--cp-cyan, #00f5ff), rgba(0, 245, 255, 0) 60%);
	margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
	animation:   accentSweep 3s linear infinite;
}

@keyframes accentSweep {
	0%   { background-position: -200% 0; opacity: 0.8; }
	50%  { opacity: 1; }
	100% { background-position:  200% 0; opacity: 0.8; }
}

/* ── Corner brackets ── */
.cm__corner {
	position:       absolute;
	width:          16px;
	height:         16px;
	pointer-events: none;
	z-index:        2;
}

.cm__corner--tl { top: 0;    left:  0; border-top:    1.5px solid var(--cp-cyan, #00f5ff); border-left:   1.5px solid var(--cp-cyan, #00f5ff); }
.cm__corner--tr { top: 0;    right: 0; border-top:    1.5px solid var(--cp-cyan, #00f5ff); border-right:  1.5px solid var(--cp-cyan, #00f5ff); }
.cm__corner--bl { bottom: 0; left:  0; border-bottom: 1.5px solid var(--cp-cyan, #00f5ff); border-left:   1.5px solid var(--cp-cyan, #00f5ff); }
.cm__corner--br { bottom: 0; right: 0; border-bottom: 1.5px solid var(--cp-cyan, #00f5ff); border-right:  1.5px solid var(--cp-cyan, #00f5ff); }

/* ── Modal header ── */
.cm__header {
	display:         flex;
	align-items:     center;
	justify-content: space-between;
	margin-bottom:   clamp(0.75rem, 2vw, 1rem);
	position:        relative;
	z-index:         1;
}

.cm__title {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.62rem, 1.1vw, 0.72rem);
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color:          var(--cp-cyan, #00f5ff);
}

.cm__slash { opacity: 0.6; }

.cm__close {
	display:         flex;
	align-items:     center;
	justify-content: center;
	width:           32px;
	height:          32px;
	background:      transparent;
	border:          1px solid rgba(0, 245, 255, 0.2);
	color:           var(--cp-muted, #4a5a6a);
	cursor:          pointer;
	transition:      color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
	outline:         none;
	flex-shrink:     0;
}

.cm__close:hover,
.cm__close:focus-visible {
	color:        var(--cp-cyan, #00f5ff);
	border-color: rgba(0, 245, 255, 0.5);
	background:   rgba(0, 245, 255, 0.06);
}

.cm__close:focus-visible {
	outline:        2px solid var(--cp-cyan, #00f5ff);
	outline-offset: 2px;
}

/* ═════════════════════════════════════════════════════════════════════════════
   SUCCESS STATE
   ═════════════════════════════════════════════════════════════════════════════ */

.cm-success {
	display:        flex;
	flex-direction: column;
	align-items:    center;
	text-align:     center;
	gap:            1.25rem;
	padding:        clamp(1rem, 4vw, 2rem) 0;
	position:       relative;
	z-index:        1;
}

.cm-success__icon {
	font-size:   3rem;
	color:       var(--cp-cyan, #00f5ff);
	text-shadow: 0 0 32px rgba(0, 245, 255, 0.6);
	animation:   successPulse 2s ease-in-out infinite;
}

@keyframes successPulse {
	0%, 100% { opacity: 1;   text-shadow: 0 0 32px rgba(0, 245, 255, 0.6); }
	50%       { opacity: 0.7; text-shadow: 0 0 56px rgba(0, 245, 255, 0.9); }
}

.cm-success__title {
	font-family:    var(--font-bionical, 'Courier Prime', monospace);
	font-size:      var(--font-h4, 1.5rem);
	font-weight:    400;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color:          var(--cp-cyan, #00f5ff);
}

.cm-success__body {
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size:   var(--font-body-sm, 0.95rem);
	line-height: var(--line-body, 1.65);
	color:       rgba(255, 255, 255, 0.65);
	max-width:   42ch;
}

/* ═════════════════════════════════════════════════════════════════════════════
   FORM
   ═════════════════════════════════════════════════════════════════════════════ */

.cm-form {
	display:        flex;
	flex-direction: column;
	gap:            clamp(1rem, 2.5vw, 1.4rem);
	position:       relative;
	z-index:        1;
}

/* Honeypot — off-screen, invisible, inaccessible */
.cm-honeypot {
	position:       absolute;
	left:           -9999px;
	top:            -9999px;
	width:          1px;
	height:         1px;
	overflow:       hidden;
	opacity:        0;
	pointer-events: none;
}

/* Two-column rows */
.cm-form__row {
	display:               grid;
	grid-template-columns: 1fr 1fr;
	gap:                   clamp(0.75rem, 2vw, 1.25rem);
}

@media (max-width: 520px) {
	.cm-form__row { grid-template-columns: 1fr; }
}

.cm-form__group {
	display:        flex;
	flex-direction: column;
	gap:            0.35rem;
}

/* Labels */
.cm-form__label {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.58rem, 0.9vw, 0.68rem);
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color:          var(--cp-muted, #4a5a6a);
	display:        flex;
	align-items:    center;
	gap:            0.3em;
}

.cm-form__slash { color: var(--cp-cyan, #00f5ff); opacity: 0.7; }
.cm-form__req   { color: var(--cp-pink, #ff0055); font-style: normal; }

/* Inputs & Textarea */
.cm-form__input,
.cm-form__textarea {
	width:       100%;
	background:  rgba(255, 255, 255, 0.03);
	border:      1px solid rgba(0, 245, 255, 0.15);
	color:       rgba(255, 255, 255, 0.88);
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size:   var(--font-body-sm, 0.9rem);
	padding:     0.65rem 0.9rem;
	outline:     none;
	transition:  border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
	caret-color: var(--cp-cyan, #00f5ff);
}

.cm-form__input::placeholder,
.cm-form__textarea::placeholder {
	color: rgba(74, 90, 106, 0.7);
}

.cm-form__input:focus,
.cm-form__textarea:focus {
	border-color: rgba(0, 245, 255, 0.5);
	background:   rgba(0, 245, 255, 0.04);
	box-shadow:   0 0 0 1px rgba(0, 245, 255, 0.15),
	              inset 0 0 12px rgba(0, 245, 255, 0.04);
}

.cm-form__textarea {
	resize:     vertical;
	min-height: 100px;
}

/* Select */
.cm-form__select-wrap {
	position: relative;
	display:  flex;
	align-items: center;
}

.cm-form__select {
	width:       100%;
	background:  rgba(255, 255, 255, 0.03);
	border:      1px solid rgba(0, 245, 255, 0.15);
	color:       rgba(255, 255, 255, 0.88);
	font-family: var(--font-ui, 'Courier Prime', monospace);
	font-size:   var(--font-body-sm, 0.9rem);
	padding:     0.65rem 2.5rem 0.65rem 0.9rem;
	outline:     none;
	appearance:  none;
	cursor:      pointer;
	transition:  border-color 0.22s ease, background 0.22s ease;
}

.cm-form__select:focus {
	border-color: rgba(0, 245, 255, 0.5);
	background:   rgba(0, 245, 255, 0.04);
}

.cm-form__select option {
	background: #0d0d14;
	color:      rgba(255, 255, 255, 0.88);
}

.cm-form__select-arrow {
	position:       absolute;
	right:          0.75rem;
	font-size:      0.55rem;
	color:          var(--cp-cyan, #00f5ff);
	opacity:        0.6;
	pointer-events: none;
}

/* Error state */
.cm-form__group.has-error .cm-form__input,
.cm-form__group.has-error .cm-form__textarea,
.cm-form__group.has-error .cm-form__select {
	border-color: rgba(255, 0, 85, 0.5);
}

.cm-form__error {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      0.65rem;
	letter-spacing: 0.08em;
	color:          var(--cp-pink, #ff0055);
	text-shadow:    0 0 8px rgba(255, 0, 85, 0.4);
}

/* Footer */
.cm-form__footer {
	display:        flex;
	flex-direction: column;
	align-items:    flex-start;
	gap:            0.75rem;
	padding-top:    0.25rem;
}

.cm-form__send-error {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      0.7rem;
	letter-spacing: 0.1em;
	color:          var(--cp-pink, #ff0055);
}

.cm-form__note {
	font-family:    var(--font-ui, 'Courier Prime', monospace);
	font-size:      clamp(0.58rem, 0.85vw, 0.65rem);
	letter-spacing: 0.1em;
	color:          var(--cp-muted, #4a5a6a);
	opacity:        0.75;
}

/* ═════════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═════════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
	.cm,
	.cm__panel {
		transition: none !important;
	}

	.cm-success__icon,
	.cm__accent-line {
		animation: none !important;
	}
}
</style>
