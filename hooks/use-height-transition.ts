import { useSpring } from '@react-spring/web';
import { useMeasure } from './use-measure';
import usePrefersReducedMotion from './use-prefers-reduced-motion';

export function useHeightTransition({ animateAppear = false } = {}) {
  const [ref, { height }] = useMeasure();

  const prefersReducedMotion = usePrefersReducedMotion();
  const resizeObserverNotSupported =
    typeof window !== 'undefined' && !window.ResizeObserver;

  const animatedStyle = useSpring(
    prefersReducedMotion ||
      resizeObserverNotSupported ||
      (!animateAppear && height === undefined)
      ? {}
      : { height: height || 0 }
  );

  return { ref, animatedStyle } as const;
}
