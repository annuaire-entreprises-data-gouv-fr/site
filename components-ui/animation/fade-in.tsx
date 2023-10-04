import { animated, useSpring } from '@react-spring/web';
import usePrefersReducedMotion from 'hooks/use-prefers-reduced-motion';

export function FadeIn({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animatedStyle = useSpring(
    !prefersReducedMotion
      ? {
          from: { opacity: 0 },
          to: { opacity: 1 },
        }
      : {}
  );

  return <animated.div style={animatedStyle}>{children} </animated.div>;
}
