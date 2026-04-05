import { get, type Readable } from 'svelte/store';

export interface AnimationLoopFrameContext {
  time: number;
  shouldAnimate: boolean;
}

export interface AnimationLoopOptions {
  node: HTMLElement;
  frame: (context: AnimationLoopFrameContext) => void;
  shouldAnimate?: () => boolean;
  reducedMotionStore?: Readable<boolean>;
  rootMargin?: string;
  threshold?: number | number[];
  initiallyInViewport?: boolean;
}

export interface AnimationLoopController {
  start: () => void;
  stop: () => void;
  refresh: () => void;
  requestFrame: () => void;
  destroy: () => void;
  isRunning: () => boolean;
}

export function createAnimationLoop({
  node,
  frame,
  shouldAnimate = () => true,
  reducedMotionStore,
  rootMargin = '220px 0px 220px 0px',
  threshold = 0.01,
  initiallyInViewport = true,
}: AnimationLoopOptions): AnimationLoopController {
  let rafId: number | null = null;
  let destroyed = false;
  let isInViewport = initiallyInViewport;
  let prefersReducedMotion = reducedMotionStore ? get(reducedMotionStore) : false;

  const canAnimate = (): boolean => {
    return !destroyed && !document.hidden && isInViewport && !prefersReducedMotion && shouldAnimate();
  };

  const tick = (time: number): void => {
    rafId = null;
    if (destroyed) return;

    frame({ time, shouldAnimate: canAnimate() });

    if (canAnimate()) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const stop = (): void => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const start = (): void => {
    if (rafId === null && canAnimate()) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const refresh = (): void => {
    if (canAnimate()) {
      start();
    } else {
      stop();
    }
  };

  const requestFrame = (): void => {
    if (!destroyed && rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const onVisibilityChange = (): void => {
    refresh();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const unsubReducedMotion = reducedMotionStore?.subscribe((value) => {
    prefersReducedMotion = value;
    refresh();
  });

  const observer = typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(
        ([entry]) => {
          isInViewport = entry?.isIntersecting ?? true;
          refresh();
        },
        { rootMargin, threshold }
      );
  observer?.observe(node);

  return {
    start,
    stop,
    refresh,
    requestFrame,
    isRunning: () => rafId !== null,
    destroy: () => {
      destroyed = true;
      stop();
      observer?.disconnect();
      unsubReducedMotion?.();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}