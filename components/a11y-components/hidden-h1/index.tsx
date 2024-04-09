import React from 'react';
import styles from './style.module.css';
const HiddenH1: React.FC<{ title: string }> = ({ title }) => (
  <h1 className={styles['title']}>{title}</h1>
);

export default HiddenH1;
