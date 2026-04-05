import type { WorkStep, AccentColor } from '$lib/types';
import { ACCENT_VARS } from '$lib/config/colors';
export type { WorkStep } from '$lib/types';

export const WORK_STEPS: WorkStep[] = [
	{
		id:          'discovery',
		index:       1,
		title:       'Discovery',
		subtitle:    'Understand · Analyse · Define',
		description: 'Deep-dive into your goals, users, and constraints. Competitive analysis, user-journey mapping and a clear problem statement before a single pixel is drawn.',
		processCode: 'INIT_0x01',
		accentColor: 'cyan',
		icon:        'radar',
		tools:       ['Notion', 'Miro', 'Figma', 'Search'],
	},
	{
		id:          'design',
		index:       2,
		title:       'Design',
		subtitle:    'Wireframe · Prototype · Iterate',
		description: 'Low-fi to hi-fi prototypes, design-system setup, and interactive prototyping cycles with real feedback loops until the experience feels inevitable.',
		processCode: 'DRAW_0x02',
		accentColor: 'pink',
		icon:        'pen',
		tools:       ['Figma', 'Lottie', 'Tokens'],
	},
	{
		id:          'development',
		index:       3,
		title:       'Development',
		subtitle:    'Engineer · Test · Optimise',
		description: 'Clean, typed, performant code. Modern stack (SvelteKit / Next.js / Node), CI pipelines, end-to-end tests, and Lighthouse scores that stay green.',
		processCode: 'BUILD_0x03',
		accentColor: 'purple',
		icon:        'code',
		tools:       ['SvelteKit', 'Next.JS', 'TypeScript', 'Node/Express', 'Postgres'],
	},
	{
		id:          'launch',
		index:       4,
		title:       'Launch',
		subtitle:    'Deploy · Monitor · Announce',
		description: 'Zero-downtime deployment, observability dashboards, error-tracking, and a coordinated go-live strategy to make the first impression count.',
		processCode: 'EXEC_0x04',
		accentColor: 'yellow',
		icon:        'rocket',
		tools:       ['Vercel', 'Docker', 'Railway', 'Analytics'],
	},
	{
		id:          'support',
		index:       5,
		title:       'Support',
		subtitle:    'Maintain · Evolve · Scale',
		description: 'Ongoing monitoring, feature iterations, performance tuning, and a dedicated communication channel so your product never stands still.',
		processCode: 'KEEP_0x05',
		accentColor: 'green',
		icon:        'shield',
		tools:       ['GitHub', 'Linear', 'Uptime', 'Retainer'],
	},
];

// ─── Static Maps ─────────────────────────────────────────────────────────────

export const STEP_ACCENT_COLOR_MAP: Record<AccentColor, string> = ACCENT_VARS;

export const WORK_STEP_ICONS: Record<string, string> = {
	radar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
		<circle cx="12" cy="12" r="2"/>
		<path d="M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2"/>
		<path d="M12 6a6 6 0 0 1 0 12A6 6 0 0 1 12 6"/>
		<line x1="12" y1="12" x2="19" y2="5"/>
	</svg>`,
	pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
		<path d="M12 19l7-7 3 3-7 7-3-3z"/>
		<path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
		<path d="M2 2l7.586 7.586"/>
		<circle cx="11" cy="11" r="2"/>
	</svg>`,
	code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
		<polyline points="16 18 22 12 16 6"/>
		<polyline points="8 6 2 12 8 18"/>
		<line x1="12" y1="2" x2="12" y2="22" opacity=".35"/>
	</svg>`,
	rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
		<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
		<path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
		<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
		<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
	</svg>`,
	shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
		<polyline points="9 12 11 14 15 10"/>
	</svg>`,
};

export const WP_ANIMATION_CONFIG = {
	cardDuration:    '0.7s',
	staggerStep:     0.12,
	revealThreshold: 0.06,
};

export const WP_RESPONSIVE_CONFIG = {
	mobilePadding:  'clamp(2rem, 5vw, 3rem) clamp(0.75rem, 3vw, 1.5rem)',
	tabletPadding:  'clamp(3rem, 6vw, 4.5rem) clamp(1.5rem, 4vw, 2.5rem)',
	desktopPadding: 'clamp(4rem, 8vw, 6rem) clamp(2rem, 5vw, 3rem)',
};
