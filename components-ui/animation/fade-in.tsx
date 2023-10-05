import { animated, useSpring } from '@react-spring/web';
import usePrefersReducedMotion from 'hooks/use-prefers-reduced-motion';

type IFadeInProps = {
  children: React.ReactNode;
  delay?: number;
};

export function FadeIn({ children, delay }: IFadeInProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animatedStyle = useSpring(
    !prefersReducedMotion
      ? {
          from: { opacity: 0 },
          to: { opacity: 1 },
          delay,
        }
      : {}
  );

  return <animated.div style={animatedStyle}>{children} </animated.div>;
}
