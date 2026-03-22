import type { MarqueeItem } from '$lib/types/types';

/**
 * Default marquee items
 */
export const DEFAULT_MARQUEE_ITEMS: MarqueeItem[] = [
	{ id: 'idea',        label: 'Idea → Design',  icon: 'idea',        color: 'yellow' },
	{ id: 'uiux',        label: 'UI/UX Thinking', icon: 'uiux',        color: 'pink'   },
	{ id: 'development', label: 'Development',    icon: 'development', color: 'cyan'   },
	{ id: 'testing',     label: 'Testing',        icon: 'testing',     color: 'green'  },
	{ id: 'launch',      label: 'Launch',         icon: 'launch',      color: 'purple' },
	{ id: 'support',     label: 'Support',        icon: 'support',     color: 'cyan'   },
];

/**
 * Marquee icons as SVG strings
 */
export const MARQUEE_ICONS: Record<string, string> = {
	idea:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6l-.7.5V18H9v-2.5l-.7-.5A7 7 0 0 1 12 2z"/></svg>`,
	uiux:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
	development: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
	testing:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6l-4 9a1 1 0 0 0 .9 1.4h10.2a1 1 0 0 0 .9-1.4L14 9V3"/><line x1="6.4" y1="15" x2="17.6" y2="15"/></svg>`,
	launch:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
	support:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>`,
};