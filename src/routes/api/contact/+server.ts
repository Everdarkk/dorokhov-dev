/**
 * POST /api/contact
 *
 * Thin SvelteKit request handler.  All business logic lives in
 * src/lib/server/contact.ts so it can be unit-tested independently.
 *
 * Security layers (in order):
 *   1. Origin check — rejects cross-origin requests
 *   2. Content-type guard — only accepts application/json
 *   3. Rate limiting — per-IP sliding window (best-effort, see contact.ts)
 *   4. Honeypot + time guard — catches fast/automated submissions
 *   5. Full server-side validation & sanitisation
 *   6. Nodemailer dispatch via Gmail SMTP
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { processContactSubmission } from '$lib/server/contact';
import type { ContactPayload, SmtpConfig } from '$lib/server/contact';

// This route must never be prerendered — it is a server-side API endpoint.
export const prerender = false;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getAllowedOrigins(): Set<string> {
	const raw = env.ALLOWED_ORIGINS ?? '';
	return new Set(
		raw.split(',')
			.map((o) => o.trim().replace(/\/$/, ''))
			.filter(Boolean),
	);
}

function getSmtpConfig(): SmtpConfig {
	const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO } = env;

	if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
		throw new Error('Missing required SMTP environment variables.');
	}

	return {
		host:   SMTP_HOST,
		port:   parseInt(SMTP_PORT ?? '587', 10),
		secure: SMTP_SECURE === 'true',
		user:   SMTP_USER,
		pass:   SMTP_PASS,
		from:   SMTP_FROM ?? SMTP_USER,
		to:     CONTACT_TO,
	};
}

/** Extract client IP — works on Vercel (x-forwarded-for) and local dev. */
function getClientIp(request: Request): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
		request.headers.get('x-real-ip') ??
		'unknown'
	);
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request }) => {
	// ── 1. Origin check ────────────────────────────────────────────────────────
	const origin = request.headers.get('origin') ?? '';
	const allowed = getAllowedOrigins();

	// Allow same-origin requests (origin header absent) and listed origins.
	if (origin && allowed.size > 0 && !allowed.has(origin)) {
		throw error(403, 'Forbidden');
	}

	// ── 2. Content-type guard ──────────────────────────────────────────────────
	const ct = request.headers.get('content-type') ?? '';
	if (!ct.includes('application/json')) {
		throw error(415, 'Unsupported Media Type');
	}

	// ── 3. Parse body ──────────────────────────────────────────────────────────
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	if (typeof body !== 'object' || body === null) {
		throw error(400, 'Invalid request body');
	}

	const raw = body as Record<string, unknown>;

	const payload: ContactPayload = {
		name:         String(raw.name         ?? ''),
		email:        String(raw.email        ?? ''),
		company:      String(raw.company      ?? ''),
		service:      String(raw.service      ?? ''),
		budget:       String(raw.budget       ?? ''),
		message:      String(raw.message      ?? ''),
		website:      String(raw.website      ?? ''),
		formOpenedAt: Number(raw.formOpenedAt ?? 0),
	};

	// ── 4–6. Rate limit → validate → send ─────────────────────────────────────
	let config: SmtpConfig;
	try {
		config = getSmtpConfig();
	} catch (e) {
		console.error('[contact] SMTP config error:', e);
		throw error(500, 'Server configuration error');
	}

	const ip     = getClientIp(request);
	const result = await processContactSubmission(payload, ip, config);

	if (!result.ok) {
		throw error(result.status, result.message);
	}

	return json({ success: true, message: result.message });
};
