import type { Testimonial } from '$lib/types';
export type { Testimonial } from '$lib/types';

export const TESTIMONIALS: Testimonial[] = [
	{
		id: 'alina-speech-therapist',
		name: 'Alina D.',
		role: 'Speech Therapist',
		company: 'Private Practice',
		initials: 'AD',
		review:
			'My clients now have everything they need in one place — information about services, schedules, and a way to sign up for classes without any extra steps. It completely changed how I manage my practice and how clients engage with it.',
		accent: 'cyan',
		year: '2025',
	},
	{
		id: 'shura-artist',
		name: 'Oleksandr M.',
		role: 'Visual Artist',
		company: 'Independent',
		initials: 'OM',
		review:
			'People from all around the world can now visit my portfolio, browse the full collection, and read the story behind each piece — all in one seamless experience. My audience finally has a home that feels as intentional as the work itself.',
		accent: 'purple',
		year: '2025',
	},
	{
		id: 'ternotop-ortho-centre',
		name: 'Yurii K.',
		role: 'Director',
		company: 'Terno-Top Orthopedic Centre',
		initials: 'YK',
		review:
			'The redesign brought a fresh, modern look — trustworthy and fast. The real win was SEO: organic traffic jumped from around 400 views over six months to over 4 000 in the very first month after launch.',
		accent: 'yellow',
		year: '2026',
		metric: {
			before: '400',
			beforeLabel: 'views / 6 months',
			after: '4K+',
			afterLabel: 'views / month 1',
			counterTarget: 4000,
		},
	},
];

/** Number of signal-strength bars per card */
export const SIGNAL_BAR_COUNT = 5 as const;

/** Heights (px) for each signal bar — ascending left-to-right */
export const SIGNAL_BAR_HEIGHTS: readonly number[] = [8, 12, 16, 20, 24];

