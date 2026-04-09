/**
 * src/lib/server/contact.spec.ts
 *
 * Unit tests for the contact-form business logic.
 * Runs in the "server" Vitest project (Node environment, no browser).
 *
 * Covers:
 *   • sanitise()         — HTML stripping, control-char removal, length cap
 *   • validatePayload()  — all fields, honeypot, time guard, spam patterns
 *   • checkRateLimit()   — window enforcement, counter increment, reset
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	sanitise,
	validatePayload,
	checkRateLimit,
} from './contact';
import type { ContactPayload } from './contact';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePayload(overrides: Partial<ContactPayload> = {}): ContactPayload {
	return {
		name:         'Jane Doe',
		email:        'jane@example.com',
		company:      'Acme Corp',
		service:      'web-app',
		budget:       '2k-5k',
		message:      'I need a new website for my startup.',
		website:      '',          // honeypot — must stay empty
		formOpenedAt: Date.now() - 5_000, // opened 5 s ago → passes time guard
		...overrides,
	};
}

// ── sanitise() ────────────────────────────────────────────────────────────────

describe('sanitise()', () => {
	it('strips HTML tags', () => {
		expect(sanitise('<b>Hello</b>', 200)).toBe('Hello');
	});

	it('strips nested and self-closing tags', () => {
		expect(sanitise('<script>alert(1)</script>', 200)).toBe('alert(1)');
		expect(sanitise('<br/>', 200)).toBe('');
	});

	it('removes ASCII control characters', () => {
		// NUL, BEL, BS, VT, FF, DEL — should be stripped
		const dirty = 'abc\x00\x07\x08\x0b\x0c\x7fdef';
		expect(sanitise(dirty, 200)).toBe('abcdef');
	});

	it('preserves line feeds and carriage returns', () => {
		// \n (0x0a) and \r (0x0d) are NOT in the strip set — keep them
		expect(sanitise('line1\nline2', 200)).toBe('line1\nline2');
	});

	it('trims leading and trailing whitespace', () => {
		expect(sanitise('  hello  ', 200)).toBe('hello');
	});

	it('hard-clamps to maxLen', () => {
		const long = 'a'.repeat(300);
		expect(sanitise(long, 100)).toHaveLength(100);
	});

	it('returns empty string for empty input', () => {
		expect(sanitise('', 200)).toBe('');
	});
});

// ── validatePayload() ─────────────────────────────────────────────────────────

describe('validatePayload()', () => {
	it('returns no errors for a valid payload', () => {
		expect(validatePayload(makePayload())).toHaveLength(0);
	});

	// ── Honeypot ──────────────────────────────────────────────────────────────

	it('rejects when the honeypot field is filled', () => {
		const errs = validatePayload(makePayload({ website: 'http://spam.com' }));
		expect(errs).toHaveLength(1);
		expect(errs[0].field).toBe('website');
	});

	// ── Time guard ────────────────────────────────────────────────────────────

	it('rejects submissions that are too fast (< 2 s after open)', () => {
		const now = Date.now();
		const errs = validatePayload(makePayload({ formOpenedAt: now - 500 }), now);
		expect(errs.some((e) => e.field === 'formOpenedAt')).toBe(true);
	});

	it('accepts submissions at exactly the minimum time', () => {
		const now = Date.now();
		const errs = validatePayload(makePayload({ formOpenedAt: now - 2_000 }), now);
		expect(errs).toHaveLength(0);
	});

	// ── Name ──────────────────────────────────────────────────────────────────

	it('rejects empty name', () => {
		const errs = validatePayload(makePayload({ name: '' }));
		expect(errs.some((e) => e.field === 'name')).toBe(true);
	});

	it('rejects name shorter than 2 chars', () => {
		const errs = validatePayload(makePayload({ name: 'A' }));
		expect(errs.some((e) => e.field === 'name')).toBe(true);
	});

	it('rejects name containing a URL', () => {
		const errs = validatePayload(makePayload({ name: 'http://spam.site' }));
		expect(errs.some((e) => e.field === 'name')).toBe(true);
	});

	it('accepts a short but valid name', () => {
		const errs = validatePayload(makePayload({ name: 'Bo' }));
		expect(errs.filter((e) => e.field === 'name')).toHaveLength(0);
	});

	// ── Email ─────────────────────────────────────────────────────────────────

	it('rejects empty email', () => {
		const errs = validatePayload(makePayload({ email: '' }));
		expect(errs.some((e) => e.field === 'email')).toBe(true);
	});

	it('rejects malformed email addresses', () => {
		const bad = ['notanemail', 'missing@dot', '@nodomain.com', 'two@@at.com'];
		for (const email of bad) {
			const errs = validatePayload(makePayload({ email }));
			expect(errs.some((e) => e.field === 'email'), `should reject: ${email}`).toBe(true);
		}
	});

	it('accepts valid email addresses', () => {
		const good = ['user@example.com', 'user+tag@sub.domain.io', 'a@b.co'];
		for (const email of good) {
			const errs = validatePayload(makePayload({ email }));
			expect(errs.filter((e) => e.field === 'email'), `should accept: ${email}`).toHaveLength(0);
		}
	});

	// ── Company (optional) ────────────────────────────────────────────────────

	it('allows empty company', () => {
		const errs = validatePayload(makePayload({ company: '' }));
		expect(errs.filter((e) => e.field === 'company')).toHaveLength(0);
	});

	it('rejects company containing a URL', () => {
		const errs = validatePayload(makePayload({ company: 'https://casino.bet' }));
		expect(errs.some((e) => e.field === 'company')).toBe(true);
	});

	// ── Service ───────────────────────────────────────────────────────────────

	it('rejects empty service', () => {
		const errs = validatePayload(makePayload({ service: '' }));
		expect(errs.some((e) => e.field === 'service')).toBe(true);
	});

	it('rejects unknown service values', () => {
		const errs = validatePayload(makePayload({ service: 'unknown-type' }));
		expect(errs.some((e) => e.field === 'service')).toBe(true);
	});

	it('accepts all defined service values', () => {
		const services = ['web-app', 'ecommerce', 'landing', 'redesign', 'mvp', 'other'];
		for (const service of services) {
			const errs = validatePayload(makePayload({ service }));
			expect(errs.filter((e) => e.field === 'service'), `should accept: ${service}`).toHaveLength(0);
		}
	});

	// ── Budget ────────────────────────────────────────────────────────────────

	it('accepts all defined budget values including empty string', () => {
		const budgets = ['', 'under-2k', '2k-5k', '5k-15k', '15k-plus', 'discuss'];
		for (const budget of budgets) {
			const errs = validatePayload(makePayload({ budget }));
			expect(errs.filter((e) => e.field === 'budget'), `should accept: ${budget}`).toHaveLength(0);
		}
	});

	it('rejects unknown budget values', () => {
		const errs = validatePayload(makePayload({ budget: 'billions' }));
		expect(errs.some((e) => e.field === 'budget')).toBe(true);
	});

	// ── Message ───────────────────────────────────────────────────────────────

	it('rejects empty message', () => {
		const errs = validatePayload(makePayload({ message: '' }));
		expect(errs.some((e) => e.field === 'message')).toBe(true);
	});

	it('rejects message shorter than 10 chars', () => {
		const errs = validatePayload(makePayload({ message: 'Hi!' }));
		expect(errs.some((e) => e.field === 'message')).toBe(true);
	});

	it('accepts message of exactly 10 chars', () => {
		const errs = validatePayload(makePayload({ message: '1234567890' }));
		expect(errs.filter((e) => e.field === 'message')).toHaveLength(0);
	});

	it('rejects message with spam keywords', () => {
		const errs = validatePayload(makePayload({ message: 'Buy viagra cheap now!' }));
		expect(errs.some((e) => e.field === 'message')).toBe(true);
	});

	it('rejects message containing a URL', () => {
		const errs = validatePayload(makePayload({ message: 'Visit http://spam.com for deals' }));
		expect(errs.some((e) => e.field === 'message')).toBe(true);
	});

	it('rejects message with 7+ repeated characters', () => {
		const errs = validatePayload(makePayload({ message: 'aaaaaaa spam spam' }));
		expect(errs.some((e) => e.field === 'message')).toBe(true);
	});

	// ── Multiple errors ───────────────────────────────────────────────────────

	it('can return multiple errors at once', () => {
		const errs = validatePayload(makePayload({ name: '', email: 'bad', service: '' }));
		const fields = errs.map((e) => e.field);
		expect(fields).toContain('name');
		expect(fields).toContain('email');
		expect(fields).toContain('service');
	});
});

// ── checkRateLimit() ──────────────────────────────────────────────────────────

describe('checkRateLimit()', () => {
	// Each test uses a unique IP so it doesn't interfere with module-level state
	let ip: string;
	let callCount = 0;

	beforeEach(() => {
		ip = `192.0.2.${++callCount}`; // RFC 5737 documentation range
	});

	it('allows the first request', () => {
		expect(checkRateLimit(ip)).toBe(true);
	});

	it('allows up to RATE_LIMIT_MAX (5) requests', () => {
		for (let i = 0; i < 5; i++) {
			expect(checkRateLimit(ip), `request ${i + 1}`).toBe(true);
		}
	});

	it('blocks the (RATE_LIMIT_MAX + 1)th request', () => {
		for (let i = 0; i < 5; i++) checkRateLimit(ip);
		expect(checkRateLimit(ip)).toBe(false);
	});

	it('treats different IPs independently', () => {
		const ip2 = '192.0.2.200';
		// Exhaust ip
		for (let i = 0; i < 5; i++) checkRateLimit(ip);
		// ip2 should still be allowed
		expect(checkRateLimit(ip2)).toBe(true);
	});

	it('resets the window after the time window elapses', () => {
		// Use vi.setSystemTime to simulate time passage
		const base = new Date('2025-01-01T00:00:00Z');
		vi.useFakeTimers();
		vi.setSystemTime(base);

		const windowIp = `192.0.2.${++callCount}`;

		// Exhaust the limit
		for (let i = 0; i < 5; i++) checkRateLimit(windowIp);
		expect(checkRateLimit(windowIp)).toBe(false);

		// Advance past the 1-hour window
		vi.setSystemTime(new Date(base.getTime() + 60 * 60 * 1_000 + 1));
		expect(checkRateLimit(windowIp)).toBe(true);

		vi.useRealTimers();
	});
});
