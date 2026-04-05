/**
 * navigation.ts — Navigation constants
 *
 * Single source of truth for scroll behaviour thresholds and transition
 * timings used by the navigation component.
 */

export const NAV_SCROLL = {
	/** Pixels scrolled down before the hide-on-scroll logic activates. */
	HIDE_THRESHOLD: 80,
} as const;

export const NAV_TRANSITION = {
	/** Duration (ms) for the header slide transition. */
	HEADER_MS: 360,
	/** Duration (ms) for the mobile drawer fly-in. */
	DRAWER_MS: 360,
	/** Duration (ms) for the backdrop fade. */
	BACKDROP_MS: 220,
	/** Stagger offset (ms) per mobile menu item. */
	ITEM_STAGGER_MS: 55,
} as const;
