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
  	'Full-Stack Developer focused on building fast, scalable, and conversion-driven web products. I specialise in modern web development with Next.js, TypeScript, and performance-first architecture.',
  
  	'My work is centered around delivering real results — faster load times, better SEO visibility, and higher conversion rates. I design and develop websites that not only look good but actively support business growth. Every project is tailor-crafted quality.',
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
	{ value: 'x2', label: 'Avg. Conversion Impact' },
	{ value: '90+', label: 'Lighthouse Score' },
	{ value: '100%', label: 'SEO Ready' },
] as const;

export type ProfileStackAccent = (typeof PROFILE_STACK_GROUPS)[number]['accent'];
