import type { Service } from '$lib/types';
export type { Service } from '$lib/types';

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
			{ label: 'Data layer',    value: 'REST'  },
			{ label: 'Auth',          value: 'Role-based access'  },
			{ label: 'Accessibility', value: 'WCAG AA'            },
		],
		tools: [
			{ name: 'TypeScript', tag: 'TS'  },
			{ name: 'Node.js',    tag: 'NOD' },
			{ name: 'Postgres',   tag: 'PG'  },
			{ name: 'Refine',   tag: 'RFN'  },
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
			{ label: 'Components',   value: 'Fully unique / Lib'    },
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
