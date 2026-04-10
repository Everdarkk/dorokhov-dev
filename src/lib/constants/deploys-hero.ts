/**
 * DeploysHero section (deploys-hero-section.svelte) — DEPLOY_LOG
 *
 * The tag colours intentionally mirror the project colours in
 * recent-launches.ts so the visual language is consistent end-to-end.
 */

export const DEPLOYS_HERO_STATS = [
	{ value: 'x2',   label: 'Avg. Conversion Impact' },
	{ value: '90+', label: 'Lighthouse Score' },
	{ value: '100%', label: 'SEO Ready' },
] as const;

export const DEPLOYS_HERO_TAGS = [
	{ label: 'Personal Site',    accent: 'cyan'   },
	{ label: 'Artist Portfolio', accent: 'pink'   },
	{ label: 'Social Platform',  accent: 'purple' },
	{ label: 'AI Application',   accent: 'yellow' },
	{ label: 'Business Site',    accent: 'green'  },
] as const;

export type DeploysHeroTagAccent = (typeof DEPLOYS_HERO_TAGS)[number]['accent'];
