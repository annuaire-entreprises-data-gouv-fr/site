'use client';

import React, { MouseEventHandler, PropsWithChildren } from 'react';
import constants from '#models/constants';

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
  <div className={`button-link ${alt ? 'alt' : ''} ${small ? 'small' : ''}`}>
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

    {/* styles are global as they are used in partials button-async */}
    <style global jsx>{`
      div.button-link {
        display: block;
      }
      div.button-link > a,
      div.button-link > button {
        text-align: center;
        outline: none;
        transition: none;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0;
        background-color: ${constants.colors.frBlue};
        color: #fff;
        text-decoration: none;
        font-size: 1rem;
        line-height: 1.2rem;
        min-height: 46px;
        padding: 0 10px;
        border: 2px solid transparent;
        border-radius: 3px;
      }
      div.button-link.small > a,
      div.button-link.small > button {
        min-height: 36px;
        font-size: 0.9rem;
      }

      div.button-link.alt > a,
      div.button-link.alt > button {
        border: 2px solid ${constants.colors.frBlue};
        color: ${constants.colors.frBlue};
        background-color: #fff;
      }

      div.button-link:hover > a,
      div.button-link:hover > button {
        color: #fff;
        border-color: #0b01c3;
        text-decoration: none;
        background-color: #0b01c3;
      }

      div.button-link.alt:hover > a,
      div.button-link.alt:hover > button {
        color: #0b01c3;
        background-color: ${constants.colors.pastelBlue};
      }
    `}</style>
  </div>
);

export default ButtonLink;
