import { animated } from '@react-spring/web';
import { useHeightTransition } from 'hooks/use-height-transition';

type IHeightTransitionProps = {
  children: React.ReactNode;
  animateAppear?: boolean;
};

/**
 * Renders a component that animates its height when its children change.
 *
 * Use sparingly, as it will cause layout shifts that are bad for accessibility and SEO.
 * Prefers skeleton as a more accessible alternative.
 *
 * @param {React.ReactNode} props.children - The children to be rendered inside the component.
 * @param {boolean} [props.animateAppear=false] - Whether to animate the component when it first appears.
 */

export function HeightTransition({
  children,
  animateAppear = false,
}: IHeightTransitionProps) {
  const { ref, animatedStyle } = useHeightTransition({
    animateAppear,
  });

  return (
    <animated.div style={animatedStyle}>
      <div ref={ref}>{children}</div>
    </animated.div>
  );
}
