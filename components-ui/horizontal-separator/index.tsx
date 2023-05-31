import React from 'react';
import constants from '#models/constants';
import styles from './styles.module.scss';

export const SimpleSeparator = () => (
  <>
    <div
      className={styles['simple-horizontal-separator']}
      style={{ backgroundColor: constants.colors.pastelBlue }}
    />
  </>
);

export const HorizontalSeparator = () => (
  <>
    <div className={styles['horizontal-separator']}>
      <span
        className={styles.line}
        style={{
          backgroundColor: constants.colors.pastelBlue,
        }}
      />
      <span
        className={styles.circle}
        style={{
          backgroundColor: constants.colors.pastelBlue,
        }}
      />
      <span className={styles.line} />
    </div>
  </>
);
