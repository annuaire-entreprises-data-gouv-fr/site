import styles from './styles.module.css';

export const SimpleSeparator = () => (
  <div className={styles.simpleHorizontalSeparator} />
);

export const HorizontalSeparator = () => (
  <div className={styles.horizontalSeparator + ' layout-center'}>
    <span className="line" />
    <span className="circle" />
    <span className="line" />
  </div>
);
