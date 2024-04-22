import { forwardRef } from 'react';
import styles from './style.module.css';
type IProps = React.HTMLAttributes<HTMLDivElement> & {
  agentColor?: boolean;
  footer?: React.ReactNode;
};
export default forwardRef(function FloatingModal(
  { children, agentColor = false, footer, ...props }: IProps,
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
        (props.className ?? '')
      }
      ref={ref}
    >
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
});
