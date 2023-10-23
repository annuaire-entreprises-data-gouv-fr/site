import { useSpring } from '@react-spring/web';
import { useMeasure } from './use-measure';
import usePrefersReducedMotion from './use-prefers-reduced-motion';

export function useHeightTransition({ animateAppear = false } = {}) {
  const [ref, { height }] = useMeasure();
  const prefersReducedMotion =
    usePrefersReducedMotion() ||
    (typeof window !== 'undefined' && !window.ResizeObserver); // Feature not supported

  const animatedStyle = useSpring(
    prefersReducedMotion || (!animateAppear && height === undefined)
      ? {}
      : { height: height || 0 }
  );

  return { ref, animatedStyle } as const;
}
