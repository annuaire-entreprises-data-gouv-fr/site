import React from 'react';
import styles from './styles.module.scss';

const HiddenH1: React.FC<{ title: string }> = ({ title }) => (
  <h1 className={styles.h1}>{title}</h1>
);

export default HiddenH1;
