/**
 * src/lib/server/contact.ts
 *
 * All business logic for the /api/contact endpoint:
 *   • Input validation & sanitisation
 *   • Spam / bot detection (honeypot, time guard, content patterns)
 *   • In-memory rate limiting  (best-effort on serverless; upgrade to
 *     Vercel KV / Upstash Redis for strict multi-instance enforcement)
 *   • Nodemailer email dispatch
 *   • Structured result type for clean handler responses
 *
 * Nothing in this file touches HTTP — it is plain TypeScript so it
 * can be unit-tested without a running SvelteKit server.
 */

import nodemailer from 'nodemailer';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ContactPayload {
	name:         string;
	email:        string;
	company:      string;
	service:      string;
	budget:       string;
	message:      string;
	/** Honeypot — must be empty */
	website:      string;
	/** Unix timestamp (ms) when the user opened the form */
	formOpenedAt: number;
}

export type ContactResult =
	| { ok: true;  message: string }
	| { ok: false; status: number; message: string };

export interface SmtpConfig {
	host:     string;
	port:     number;
	secure:   boolean;
	user:     string;
	pass:     string;
	from:     string;
	to:       string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

/** Accepted service values (mirrors src/lib/constants/cta.ts). */
const VALID_SERVICES = new Set([
	'web-app', 'ecommerce', 'landing', 'redesign', 'mvp', 'other',
]);

/** Accepted budget values (empty string = "prefer not to say"). */
const VALID_BUDGETS = new Set([
	'', 'under-2k', '2k-5k', '5k-15k', '15k-plus', 'discuss',
]);

/** Maximum field lengths (bytes). */
const MAX_LEN = {
	name:    120,
	email:   254,
	company: 200,
	message: 4_000,
} as const;

/** Minimum milliseconds between form open and submit (bot guard). */
const MIN_FILL_MS = 2_000;

/** Rate-limit: max requests per window per IP. */
const RATE_LIMIT_MAX    = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1_000; // 1 hour

/** Patterns that flag obvious spam content. */
const SPAM_PATTERNS: RegExp[] = [
	/https?:\/\//i,                                       // URL in name/company
	/\b(viagra|casino|poker|lottery|loan\s?offer|seo\s?service|buy\s?followers)\b/i,
	/(.)\1{6,}/,                                          // 7+ repeated chars (aaaaaaa)
];

// ── Rate limiter (in-process, best-effort) ────────────────────────────────────

interface RateEntry { count: number; windowStart: number }

/**
 * Module-level Map persists across warm invocations of the same serverless
 * instance.  Cold starts reset it — acceptable for defence-in-depth.
 * Replace with Vercel KV for hard multi-instance limits.
 */
const rateMap = new Map<string, RateEntry>();

export function checkRateLimit(ip: string): boolean {
	const now   = Date.now();
	const entry = rateMap.get(ip);

	if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
		rateMap.set(ip, { count: 1, windowStart: now });
		return true;
	}

	if (entry.count >= RATE_LIMIT_MAX) return false;

	entry.count++;
	return true;
}

// ── Sanitisation ──────────────────────────────────────────────────────────────

/** Strip HTML tags, control chars and trim; hard-clamp to maxLen. */
export function sanitise(raw: string, maxLen: number): string {
	return raw
		.replace(/<[^>]*>/g, '')           // strip HTML
		.split('')
		.filter((char) => {
			const code = char.charCodeAt(0);
			return !((code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127);
		})
		.join('')
		.trim()
		.slice(0, maxLen);
}

// ── Validation ────────────────────────────────────────────────────────────────

export interface ValidationError { field: string; message: string }

/**
 * Validates a sanitised payload.
 * Returns an array of errors — empty array means valid.
 */
export function validatePayload(
	p: ContactPayload,
	serverNow = Date.now(),
): ValidationError[] {
	const errs: ValidationError[] = [];

	// ── Honeypot
	if (p.website) {
		errs.push({ field: 'website', message: 'Bot detected.' });
		return errs; // no point continuing
	}

	// ── Time guard
	if (serverNow - p.formOpenedAt < MIN_FILL_MS) {
		errs.push({ field: 'formOpenedAt', message: 'Submitted too quickly.' });
		return errs;
	}

	// ── Name
	const name = sanitise(p.name, MAX_LEN.name);
	if (!name)        errs.push({ field: 'name', message: 'Name is required.' });
	else if (name.length < 2) errs.push({ field: 'name', message: 'Name must be at least 2 characters.' });
	else if (SPAM_PATTERNS.some((r) => r.test(name))) errs.push({ field: 'name', message: 'Name contains invalid content.' });

	// ── Email
	const email = sanitise(p.email, MAX_LEN.email);
	if (!email) {
		errs.push({ field: 'email', message: 'Email is required.' });
	} else if (!/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email)) {
		errs.push({ field: 'email', message: 'Enter a valid email address.' });
	}

	// ── Company (optional, spam-check)
	const company = sanitise(p.company, MAX_LEN.company);
	if (company && SPAM_PATTERNS.some((r) => r.test(company))) {
		errs.push({ field: 'company', message: 'Company contains invalid content.' });
	}

	// ── Service
	if (!VALID_SERVICES.has(p.service)) {
		errs.push({ field: 'service', message: 'Select a valid project type.' });
	}

	// ── Budget
	if (!VALID_BUDGETS.has(p.budget)) {
		errs.push({ field: 'budget', message: 'Select a valid budget range.' });
	}

	// ── Message
	const message = sanitise(p.message, MAX_LEN.message);
	if (!message) {
		errs.push({ field: 'message', message: 'Message is required.' });
	} else if (message.length < 10) {
		errs.push({ field: 'message', message: 'Message must be at least 10 characters.' });
	} else if (SPAM_PATTERNS.some((r) => r.test(message))) {
		errs.push({ field: 'message', message: 'Message contains invalid content.' });
	}

	return errs;
}

// ── Email helpers ─────────────────────────────────────────────────────────────

const SERVICE_LABELS: Record<string, string> = {
	'web-app':   'Web Application',
	'ecommerce': 'E-Commerce Platform',
	'landing':   'Landing Page',
	'redesign':  'Redesign / Rebrand',
	'mvp':       'MVP / Prototype',
	'other':     'Other',
};

const BUDGET_LABELS: Record<string, string> = {
	'':          'Not specified',
	'under-2k':  '< $2,000',
	'2k-5k':     '$2,000 – $5,000',
	'5k-15k':    '$5,000 – $15,000',
	'15k-plus':  '$15,000+',
	'discuss':   "Let's Discuss",
};

function escHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function buildHtml(p: ContactPayload): string {
	const name    = escHtml(sanitise(p.name,    MAX_LEN.name));
	const email   = escHtml(sanitise(p.email,   MAX_LEN.email));
	const company = escHtml(sanitise(p.company, MAX_LEN.company));
	const service = escHtml(SERVICE_LABELS[p.service] ?? p.service);
	const budget  = escHtml(BUDGET_LABELS[p.budget]   ?? p.budget);
	const message = escHtml(sanitise(p.message, MAX_LEN.message)).replace(/\n/g, '<br>');
	const date    = new Date().toUTCString();

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>New Project Inquiry</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#06060a;color:#e0e8f0;font-family:'Courier New',Courier,monospace;font-size:14px;line-height:1.6}
  .wrap{max-width:620px;margin:0 auto;padding:32px 16px}
  .header{border-bottom:1px solid #00f5ff;padding-bottom:20px;margin-bottom:28px}
  .badge{display:inline-block;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.3);color:#00f5ff;font-size:10px;letter-spacing:.2em;padding:4px 10px;text-transform:uppercase;margin-bottom:14px}
  h1{font-size:20px;font-weight:400;color:#00f5ff;letter-spacing:.06em;text-transform:uppercase;text-shadow:0 0 20px rgba(0,245,255,.4)}
  .meta{font-size:11px;color:#4a5a6a;margin-top:6px;letter-spacing:.1em}
  .field{margin-bottom:18px}
  .field-label{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#4a5a6a;margin-bottom:4px}
  .field-value{color:#e0e8f0;border-left:2px solid rgba(0,245,255,.25);padding-left:12px;font-size:14px}
  .field-value a{color:#00f5ff;text-decoration:none}
  .message-box{background:rgba(255,255,255,.03);border:1px solid rgba(0,245,255,.12);padding:14px 16px;white-space:pre-wrap;color:#c0ccd8;font-size:13px;line-height:1.7}
  .divider{border:none;border-top:1px solid rgba(0,245,255,.1);margin:24px 0}
  .footer{font-size:10px;color:#2a3a4a;letter-spacing:.1em;text-align:center;padding-top:16px}
  .slash{color:#00f5ff;opacity:.6}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="badge"><span class="slash">// </span>NEW_MISSION_BRIEFING</div>
    <h1>Project Inquiry Received</h1>
    <p class="meta">Submitted: ${date}</p>
  </div>

  <div class="field">
    <div class="field-label"><span class="slash">// </span>Contact</div>
    <div class="field-value">${name}${company ? ` &nbsp;·&nbsp; ${company}` : ''}</div>
  </div>

  <div class="field">
    <div class="field-label"><span class="slash">// </span>Email</div>
    <div class="field-value"><a href="mailto:${email}">${email}</a></div>
  </div>

  <div class="field">
    <div class="field-label"><span class="slash">// </span>Project Type</div>
    <div class="field-value">${service}</div>
  </div>

  <div class="field">
    <div class="field-label"><span class="slash">// </span>Budget Range</div>
    <div class="field-value">${budget}</div>
  </div>

  <hr class="divider">

  <div class="field">
    <div class="field-label"><span class="slash">// </span>Mission Briefing</div>
    <div class="message-box">${message}</div>
  </div>

  <div class="footer">dorokhov.dev &nbsp;·&nbsp; automated contact form &nbsp;·&nbsp; reply directly to this email</div>
</div>
</body>
</html>`;
}

function buildText(p: ContactPayload): string {
	const name    = sanitise(p.name,    MAX_LEN.name);
	const email   = sanitise(p.email,   MAX_LEN.email);
	const company = sanitise(p.company, MAX_LEN.company);
	const service = SERVICE_LABELS[p.service] ?? p.service;
	const budget  = BUDGET_LABELS[p.budget]   ?? p.budget;
	const message = sanitise(p.message, MAX_LEN.message);

	return [
		'// NEW_MISSION_BRIEFING — dorokhov.dev',
		'',
		`Name:    ${name}${company ? ` (${company})` : ''}`,
		`Email:   ${email}`,
		`Service: ${service}`,
		`Budget:  ${budget}`,
		'',
		'--- Message ---',
		message,
		'',
		`Submitted: ${new Date().toUTCString()}`,
	].join('\n');
}

// ── Email dispatch ────────────────────────────────────────────────────────────

export async function sendContactEmail(
	payload: ContactPayload,
	config:  SmtpConfig,
): Promise<void> {
	const transporter = nodemailer.createTransport({
		host:   config.host,
		port:   config.port,
		secure: config.secure,
		auth: {
			user: config.user,
			pass: config.pass,
		},
		// Fail fast rather than hanging a serverless function
		connectionTimeout: 8_000,
		greetingTimeout:   8_000,
		socketTimeout:     10_000,
	});

	const senderName  = sanitise(payload.name,  MAX_LEN.name);
	const senderEmail = sanitise(payload.email, MAX_LEN.email);

	await transporter.sendMail({
		from:     config.from,
		to:       config.to,
		replyTo:  `"${senderName}" <${senderEmail}>`,
		subject:  `[Portfolio Inquiry] ${senderName} — ${SERVICE_LABELS[payload.service] ?? payload.service}`,
		text:     buildText(payload),
		html:     buildHtml(payload),
	});
}

// ── Orchestrator ──────────────────────────────────────────────────────────────

/**
 * Full contact submission pipeline.
 * Returns a structured result — callers translate it to HTTP responses.
 */
export async function processContactSubmission(
	payload:   ContactPayload,
	clientIp:  string,
	config:    SmtpConfig,
): Promise<ContactResult> {

	// 1. Rate limit
	if (!checkRateLimit(clientIp)) {
		return {
			ok:      false,
			status:  429,
			message: 'Too many requests. Please wait before sending another message.',
		};
	}

	// 2. Validate
	const errors = validatePayload(payload);
	if (errors.length > 0) {
		return {
			ok:      false,
			status:  400,
			message: errors[0].message,
		};
	}

	// 3. Send
	try {
		await sendContactEmail(payload, config);
	} catch (err) {
		console.error('[contact] Email send failed:', err);
		return {
			ok:      false,
			status:  500,
			message: 'Failed to send message. Please try again later.',
		};
	}

	return { ok: true, message: 'Message sent successfully.' };
}
