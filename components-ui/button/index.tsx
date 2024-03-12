'use client';

import React, { MouseEventHandler, PropsWithChildren } from 'react';
import styles from './style.module.css';
type IProps = {
  role?: string;
  small?: boolean;
  to?: string;
  type?: 'submit' | null;
  alt?: boolean;
  target?: '_blank';
  nofollow?: boolean;
  onClick?: MouseEventHandler;
};

const ButtonLink: React.FC<PropsWithChildren<IProps>> = ({
  role,
  to,
  children,
  small = false,
  alt = false,
  target = '',
  nofollow = false,
  onClick = () => {},
}) => (
  <div
    className={`${styles['button-link']} ${alt ? styles.alt : ''} ${
      small ? styles.small : ''
    }`}
  >
    {!to ? (
      <button role={role} type="submit" onClick={onClick}>
        {children}
      </button>
    ) : (
      <a
        role={role}
        target={target}
        rel={
          (target === '_blank' ? 'noopener noreferrer' : '') +
          (nofollow ? 'nofollow' : '')
        }
        href={to}
        className="no-style-link"
      >
        {children}
      </a>
    )}
  </div>
);

export default ButtonLink;
