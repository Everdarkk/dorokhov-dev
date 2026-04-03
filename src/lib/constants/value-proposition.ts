import type { ValuePropCard } from '$lib/types';
export type { ValuePropCard } from '$lib/types';

export const VALUE_PROP_CARDS: ValuePropCard[] = [
	{
		id: 'innovation',
		title: 'INNOVATION',
		description: 'Cutting-edge solutions built with the latest technologies and forward-thinking approaches.',
		icon: 'circuit',
		accentColor: 'cyan'
	},
	{
		id: 'performance',
		title: 'PERFORMANCE',
		description: 'Optimized code and efficient architectures that deliver lightning-fast, responsive experiences.',
		icon: 'lightning',
		accentColor: 'pink'
	},
	{
		id: 'reliability',
		title: 'RELIABILITY',
		description: 'Robust systems engineered with quality, scalability, and security at their core.',
		icon: 'shield',
		accentColor: 'purple'
	},
	{
		id: 'creativity',
		title: 'CREATIVITY',
		description: 'Unique designs and clever implementations that push boundaries and inspire.',
		icon: 'spark',
		accentColor: 'yellow'
	}
];

/**
 * Animation configuration for value proposition cards
 */
export const VP_ANIMATION_CONFIG = {
	cardStaggerDelay: 0.1, // Delay between card animations in seconds
	cardAnimationDuration: 0.8, // Duration of card entrance animation
	hoverScaleFactor: 1.05, // Scale factor on hover
	hoverDuration: 0.3, // Duration of hover animation in seconds
	glowPulseInterval: 3, // Glow pulse animation interval in seconds
	glowPulseIterationCount: 'infinite'
} as const;

/**
 * Responsive animation adjustments
 */
export const VP_RESPONSIVE_CONFIG = {
	mobileCardGap: '1rem',
	tabletCardGap: '1.5rem',
	desktopCardGap: '2rem',
	mobilePadding: '1.5rem',
	tabletPadding: '2rem',
	desktopPadding: '3rem'
} as const;

