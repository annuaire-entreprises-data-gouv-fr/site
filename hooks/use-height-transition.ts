import { useSpring } from '@react-spring/web';
import { useMeasure } from './use-measure';
import usePrefersReducedMotion from './use-prefers-reduced-motion';

export function useHeightTransition({ animateAppear = false } = {}) {
  const [ref, { height }] = useMeasure();
  const prefersReducedMotion = usePrefersReducedMotion();
  const animatedStyle = useSpring(
    prefersReducedMotion || (!animateAppear && height === 0) ? {} : { height }
  );

  return { ref, animatedStyle } as const;
}
