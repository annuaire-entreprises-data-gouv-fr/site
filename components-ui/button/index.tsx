'use client';

import React, { MouseEventHandler, PropsWithChildren } from 'react';
type IProps = {
  role?: string;
  small?: boolean;
  to?: string;
  type?: 'button' | 'submit' | null;
  disabled?: boolean;
  alt?: boolean;
  target?: '_blank';
  ariaLabel?: string;
  nofollow?: boolean;
  onClick?: MouseEventHandler;
};

const ButtonLink: React.FC<PropsWithChildren<IProps>> = ({
  role,
  disabled,
  to,
  type,
  children,
  small = false,
  alt = false,
  ariaLabel,
  target = '',
  nofollow = false,
  onClick = () => {},
}) => (
  <>
    {!to ? (
      <button
        role={role}
        type={type || 'submit'}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`fr-btn ${alt ? ' fr-btn--secondary ' : ''} ${
          small ? ' fr-btn--sm ' : ''
        }`}
      >
        {children}
      </button>
    ) : (
      <a
        role={role}
        aria-label={ariaLabel}
        target={target}
        rel={
          (target === '_blank' ? 'noopener noreferrer' : '') +
          (nofollow ? 'nofollow' : '')
        }
        href={(to || '').indexOf('@') > -1 ? `mailto:${to}` : to}
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
