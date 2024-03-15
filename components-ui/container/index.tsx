import { ReactNode } from 'react';
import styles from './style.module.css';
type ContainerProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * This container is a wrapper arround `.fr-container` from the DSFR
 *
 * It can be use at any level of nesting inside the HTML tree, and will always
 * create a new outer container wrapper that takes the full width of the viewport, and
 * then create a `.fr-container` inside of it.
 *
 * It exposes a `className` and `style` props to allow for custom styling of the
 * outer container.
 *
 * This enable to style the outer container with a background color that spans the
 * full width of the viewport for instance.
 *
 */
export default function FullWidthContainer({
  children,
  style = {},
  className = '',
}: ContainerProps) {
  return (
    <>
      <div className={styles['outer-outer-container']}>
        <div
          className={`${className} ${styles['outer-container']}`}
          style={style}
        >
          <div className="fr-container">{children}</div>
        </div>
      </div>
    </>
  );
}
