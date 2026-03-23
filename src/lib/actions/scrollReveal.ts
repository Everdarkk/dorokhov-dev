/**
 * scrollReveal — Svelte Action
 *
 * Watches an element with IntersectionObserver and dispatches a custom
 * `reveal` event (+ sets a CSS class) when it enters the viewport.
 * Automatically disconnects after the first intersection so it only
 * fires once, and cleans up on component destroy.
 *
 * Usage:
 *   <section use:scrollReveal={{ threshold: 0.08 }}
 *            on:reveal={() => (visible = true)}>
 *
 * Options:
 *   threshold  – 0‒1, fraction of the element that must be visible   (default 0.08)
 *   rootMargin – IntersectionObserver rootMargin string               (default '0px')
 *   once       – disconnect after first reveal                        (default true)
 *   activeClass– CSS class added to the node on reveal                (default 'is-revealed')
 */

export interface ScrollRevealOptions {
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
	activeClass?: string;
}

export function scrollReveal(
	node: HTMLElement,
	options: ScrollRevealOptions = {}
) {
	const {
		threshold  = 0.08,
		rootMargin = '0px',
		once       = true,
		activeClass = 'is-revealed',
	} = options;

	// SSR / old-browser guard — reveal immediately so content is never hidden
	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add(activeClass);
		node.dispatchEvent(new CustomEvent('reveal'));
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];
			if (!entry.isIntersecting) return;

			node.classList.add(activeClass);
			node.dispatchEvent(new CustomEvent('reveal', { bubbles: false }));

			if (once) observer.disconnect();
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		// Called by Svelte when the action options change reactively
		update(newOptions: ScrollRevealOptions) {
			// Nothing to do for once-only reveals; extend if you need dynamic thresholds.
		},
		// Called by Svelte on component destroy
		destroy() {
			observer.disconnect();
		},
	};
}