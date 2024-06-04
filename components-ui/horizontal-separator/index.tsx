import styles from './styles.module.css';

export const SimpleSeparator = () => (
  <div className={styles.simpleHorizontalSeparator} />
);

export const HorizontalSeparator = () => (
  <div className={styles.horizontalSeparator + ' layout-center'}>
    <span className={styles.horizontalSeparatorLine} />
    <span className={styles.horizontalSeparatorCircle} />
    <span className={styles.horizontalSeparatorLine} />
  </div>
);
