import { PropsWithChildren } from 'react';
import styles from './styles.module.css';

export const ConnexionSubLayout: React.FC<
  PropsWithChildren<{ img: JSX.Element }>
> = ({ img, children }) => (
  <div className={styles.connexion}>
    <div className={styles.image}>
      <div>{img}</div>
    </div>
    <div className={styles.container}>{children}</div>
  </div>
);
