import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

const PrintOnly: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className={`${styles['print-only']}`}>{children}</div>
);

const PrintNever: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className={`${styles['print-never']}`}>{children}</div>
);

export { PrintNever, PrintOnly };
