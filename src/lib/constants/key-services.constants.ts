/**
 * key-services.constants.ts
 *
 * All static data for the KeyServices section.
 * Keeping data here means KeyServices.svelte stays logic-only.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ServiceAccent = 'cyan' | 'pink' | 'purple';

/** A single benefit bullet shown inside the service row */
export interface ServiceBenefit {
	label: string;
	value: string;
}

/** A tech / tool badge shown in the visual panel */
export interface ServiceTool {
	name: string;
	/** short mono label (3-5 chars) for the badge */
	tag: string;
}

export interface Service {
	id: string;
	/** 1-based order index */
	index: number;
	/** Layout direction on desktop: text first or visual first */
	layout: 'text-visual' | 'visual-text';
	accent: ServiceAccent;
	/** Monospace process code shown as top badge */
	code: string;
	title: string;
	tagline: string;
	description: string;
	benefits: ServiceBenefit[];
	tools: ServiceTool[];
	/** Inline SVG icon name for the visual panel centerpiece */
	icon: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
	{
		id:      'landing',
		index:   1,
		layout:  'text-visual',
		accent:  'cyan',
		code:    'SVC_01 // LANDING',
		title:   'Landing Page',
		tagline: 'Full-stack. Pixel-perfect. Launch-ready.',
		description:
			'A complete conversion-focused landing page — from strategy and wireframes through polished UI and deployed production build. You get one cohesive deliverable, not a patchwork of vendors.',
		benefits: [
			{ label: 'Time to live',   value: '5–10 days'     },
			{ label: 'Scope',          value: 'End-to-end'    },
			{ label: 'Optimization',   value: 'Core Web Vitals' },
			{ label: 'Revisions',      value: 'Unlimited rounds' },
		],
		tools: [
			{ name: 'SvelteKit', tag: 'SVK' },
			{ name: 'Figma',     tag: 'FIG' },
			{ name: 'Vercel',    tag: 'VCL' },
			{ name: 'Framer',    tag: 'FRM' },
		],
		icon: 'landing',
	},
	{
		id:      'saas',
		index:   2,
		layout:  'visual-text',
		accent:  'pink',
		code:    'SVC_02 // SAAS',
		title:   'SaaS Dashboard',
		tagline: 'Complex data. Elegant interface.',
		description:
			'Data-dense admin panels and SaaS UIs engineered for real usage — fast tables, real-time updates, role-based layouts, and a design system that scales with your product.',
		benefits: [
			{ label: 'Architecture',  value: 'Component-driven' },
			{ label: 'Data layer',    value: 'REST / WebSocket'  },
			{ label: 'Auth',          value: 'Role-based access'  },
			{ label: 'Accessibility', value: 'WCAG AA'            },
		],
		tools: [
			{ name: 'TypeScript', tag: 'TS'  },
			{ name: 'Node.js',    tag: 'NOD' },
			{ name: 'Postgres',   tag: 'PG'  },
			{ name: 'TanStack',   tag: 'TQ'  },
		],
		icon: 'dashboard',
	},
	{
		id:      'design',
		index:   3,
		layout:  'text-visual',
		accent:  'purple',
		code:    'SVC_03 // DESIGN',
		title:   'Website Design',
		tagline: 'Brand-first. System-level. Memorable.',
		description:
			'Visual identity translated into a full web design system — typography, colour, motion, and component library — so every page you ship feels intentional and on-brand.',
		benefits: [
			{ label: 'Deliverable',  value: 'Figma design system' },
			{ label: 'Components',   value: 'Fully unique'    },
			{ label: 'Tokens',       value: 'Colour, type, space' },
			{ label: 'Handoff',      value: 'Dev-ready specs'     },
		],
		tools: [
			{ name: 'Figma',      tag: 'FIG' },
			{ name: 'Tokens',     tag: 'TOK' },
			{ name: 'Animations',     tag: 'ANI' },
			{ name: 'Prototyping',tag: 'PTY' },
		],
		icon: 'design',
	},
];

/** CSS colour map — keeps colour logic out of component markup */
export const ACCENT_VARS: Record<ServiceAccent, string> = {
	cyan:   'var(--cp-cyan,   #00f5ff)',
	pink:   'var(--cp-pink,   #ff0055)',
	purple: 'var(--cp-purple, #b300ff)',
};