import { readable } from 'svelte/store';

export function easeOutCubic(t: number): number {
	return 1 - Math.pow(1 - t, 3);
}

export const reducedMotion = readable(false, (set) => {
	if (typeof window === 'undefined') {
		set(false);
		return () => {};
	}

	const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	const update = (): void => set(mediaQuery.matches);

	update();
	mediaQuery.addEventListener('change', update);

	return () => {
		mediaQuery.removeEventListener('change', update);
	};
});
