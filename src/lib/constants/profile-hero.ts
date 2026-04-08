/**
 * ProfileHeroSection (profile-hero-section.svelte) — IDENTITY_MATRIX
 *
 * Static content and display configuration for the profile hero section.
 * Stack groups and fact badges are maintained locally in this file.
 */

export const PROFILE_HERO_BACKGROUND = {
	speed: 0.16,
	flowScale: 1.6,
	colorPressure: 1.1,
	grain: 0.04,
	colors: ['#06060a', '#06080f', '#0a0508', '#07060d', '#060a07'],
} as const;

export const PROFILE_HERO_COPY = {
	sectionLabel: 'IDENTITY_MATRIX',
	photoLabel: 'IDENTITY_SCAN.webp',
	photoAlt: 'Oleksandr Dorokhov - Full-Stack Developer',
	availabilityLabel: 'AVAILABLE_FOR_HIRE',
	heading: {
		name: 'Oleksandr',
		surname: 'Dorokhov',
		role: 'Full-Stack Developer',
	},
	bio: [
		'Full-Stack Developer and Web Architect specialising in high-performance, conversion-focused web experiences. Expert in SvelteKit, Next.js, and TypeScript - building everything from pixel-perfect UIs to scalable APIs and PostgreSQL schemas.',
		'Every project follows a clear five-phase process: Discovery -> Design -> Development -> Launch -> Support. Shipped five production applications across client work and personal builds in 2025-2026. Available for remote engagements across Europe and beyond.',
	],
} as const;

export const PROFILE_HERO_IMAGE = {
	width: 480,
	height: 600,
} as const;

export const PROFILE_HERO_CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

export const PROFILE_HERO_ACTIONS = [
	{
		label: 'INITIATE_CONTACT',
		variant: 'primary',
		href: '/#contact',
		ariaLabel: 'Start a project - contact Oleksandr Dorokhov',
	},
	{
		label: 'VIEW_PROJECTS',
		variant: 'secondary',
		href: '/deploys',
		ariaLabel: 'Browse shipped projects',
	},
] as const;

export const PROFILE_STACK_GROUPS = [
	{
		category: 'FRONTEND',
		accent: 'cyan',
		items: ['TypeScript', 'SvelteKit', 'Next.js', 'TailwindCSS'],
	},
	{
		category: 'BACKEND',
		accent: 'pink',
		items: ['Node.js', 'Express', 'PostgreSQL', 'Supabase'],
	},
	{
		category: 'INFRA',
		accent: 'purple',
		items: ['Vercel', 'Railway', 'GitHub', 'Figma', 'Sentry'],
	},
] as const;

export const PROFILE_FACTS = [
	{ value: '5',    label: 'Projects Shipped' },
	{ value: '12h',  label: 'Avg Response'     },
	{ value: '3×',   label: 'Perf. Gain'       },
] as const;

export type ProfileStackAccent = (typeof PROFILE_STACK_GROUPS)[number]['accent'];
