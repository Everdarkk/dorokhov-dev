/**
 * CTA Section (cta-section.svelte) — INITIATE_CONTACT
 * Data constants for the closing call-to-action section.
 */

export const CTA_STATS = [
	{ value: '+250%',  label: 'Avg Organic Views Boost',   symbol: '◈' },
	{ value: '3×',   label: 'Avg Performance Gain', symbol: '▲' },
	{ value: '12h',  label: 'Response Guaranteed',  symbol: '◉' },
] as const;

export interface CtaService {
	value: string;
	label: string;
}

export interface CtaBudget {
	value: string;
	label: string;
}

export const CTA_SERVICES: CtaService[] = [
	{ value: 'web-app',   label: 'Web Application' },
	{ value: 'ecommerce', label: 'E-Commerce Platform' },
	{ value: 'landing',   label: 'Landing Page' },
	{ value: 'redesign',  label: 'Redesign / Rebrand' },
	{ value: 'mvp',       label: 'MVP / Prototype' },
	{ value: 'other',     label: 'Other' },
];

export const CTA_BUDGETS: CtaBudget[] = [
	{ value: '',         label: 'Prefer not to say' },
	{ value: '150', label: '< $150' },
	{ value: '150-300',    label: '$150 – $300' },
	{ value: '300-1000',   label: '$300 – $1,000' },
	{ value: '1000-2000',   label: '$1000 – $2,000' },
	{ value: '2000', label: '$2,000+' },
	{ value: 'discuss',  label: "Let's Discuss" },
];
