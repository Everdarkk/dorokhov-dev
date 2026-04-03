/**
 * colors — Single Source of Truth for accent colours.
 *
 * Every component that renders a themed accent (cyan, pink, purple, yellow,
 * green) must import `AccentColor` and `ACCENT_VARS` from here instead of
 * defining local copies.  This replaces the previously duplicated:
 *   FAQ_ACCENT_VARS, ACCENT_VARS (key-services), STEP_ACCENT_COLOR_MAP (work-process)
 */

export type AccentColor = 'cyan' | 'pink' | 'purple' | 'yellow' | 'green';

export const ACCENT_VARS: Record<AccentColor, string> = {
	cyan:   'var(--cp-cyan,   #00f5ff)',
	pink:   'var(--cp-pink,   #ff0055)',
	purple: 'var(--cp-purple, #b300ff)',
	yellow: 'var(--cp-yellow, #ffe600)',
	green:  'var(--cp-green,  #39ff14)',
};
