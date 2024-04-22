'use client';

import React, { MouseEventHandler, PropsWithChildren } from 'react';
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
  <>
    {!to ? (
      <button
        role={role}
        type="submit"
        onClick={onClick}
        className={`fr-btn ${alt ? ' fr-btn--secondary ' : ''} ${
          small ? ' fr-btn--sm ' : ''
        }`}
      >
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
        className={`fr-btn ${alt ? ' fr-btn--secondary ' : ''} ${
          small ? ' fr-btn--sm ' : ''
        }`}
      >
        {children}
      </a>
    )}
  </>
);

export default ButtonLink;
