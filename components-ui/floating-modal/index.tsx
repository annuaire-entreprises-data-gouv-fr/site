import { forwardRef } from 'react';
import styles from './style.module.css';
type IProps = React.HTMLAttributes<HTMLDivElement> & {
  agentColor?: boolean;
  noMobile?: boolean;
  elevation?: 'low' | 'high';
  footer?: React.ReactNode;
};
export default forwardRef(function FloatingModal(
  {
    children,
    agentColor = false,
    footer,
    noMobile = false,
    elevation = 'high',
    ...props
  }: IProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={
        styles['floating-modal'] +
        ' ' +
        (agentColor ? styles['agent'] : '') +
        ' ' +
        (props.className ?? '') +
        ' ' +
        (noMobile ? styles['no-mobile'] : '') +
        ' ' +
        (elevation === 'low'
          ? styles['elevation-low']
          : styles['elevation-high'])
      }
      ref={ref}
    >
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
});
