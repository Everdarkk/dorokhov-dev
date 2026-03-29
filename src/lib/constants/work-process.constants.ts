/**
 * work-process.constants.ts
 *
 * All static data and configuration for the WorkProcess section.
 * Keeping data here ensures WorkProcess.svelte stays logic-only.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type StepAccentColor = 'cyan' | 'pink' | 'purple' | 'yellow' | 'green';

export interface WorkStep {
	/** Unique identifier (used as key in #each) */
	id: string;
	/** 1-based display index */
	index: number;
	/** Step name */
	title: string;
	/** One-liner shown as a sub-label */
	subtitle: string;
	/** Short paragraph describing the step */
	description: string;
	/** Monospace process-code shown on the card badge */
	processCode: string;
	/** Accent colour family for this step */
	accentColor: StepAccentColor;
	/** SVG icon name key (resolved via getStepIcon) */
	icon: string;
	/** Tool/tech logos shown as text badges */
	tools: string[];
}

export interface WPAnimationConfig {
	cardDuration: string;
	staggerStep: number; // seconds between each card
	revealThreshold: number;
}

export interface WPResponsiveConfig {
	mobilePadding: string;
	tabletPadding: string;
	desktopPadding: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

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
		tools:       ['Notion', 'Miro', 'Figma', 'Interviews'],
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
		tools:       ['Figma', 'Framer', 'Lottie', 'Tokens'],
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
		tools:       ['SvelteKit', 'TypeScript', 'Node', 'Postgres'],
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
		tools:       ['Vercel', 'Docker', 'Sentry', 'Analytics'],
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

export const WP_ANIMATION_CONFIG: WPAnimationConfig = {
	cardDuration:    '0.7s',
	staggerStep:     0.12,
	revealThreshold: 0.06,
};

export const WP_RESPONSIVE_CONFIG: WPResponsiveConfig = {
	mobilePadding:  'clamp(2rem, 5vw, 3rem) clamp(0.75rem, 3vw, 1.5rem)',
	tabletPadding:  'clamp(3rem, 6vw, 4.5rem) clamp(1.5rem, 4vw, 2.5rem)',
	desktopPadding: 'clamp(4rem, 8vw, 6rem) clamp(2rem, 5vw, 3rem)',
};