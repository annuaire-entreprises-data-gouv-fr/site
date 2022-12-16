import React, { PropsWithChildren } from 'react';

interface IProps {
  small?: boolean;
  to?: string;
  type?: 'submit' | null;
  alt?: boolean;
  target?: '_blank';
  nofollow?: boolean;
}

const ButtonLink: React.FC<PropsWithChildren<IProps>> = ({
  to,
  children,
  small = false,
  alt = false,
  target = '',
  nofollow = false,
}) => (
  <div className={`button-link ${alt ? 'alt' : ''} ${small ? 'small' : ''}`}>
    {!to ? (
      <button type="submit">{children}</button>
    ) : (
      <a
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
        background-color: #000091;
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
        border: 2px solid #000091;
        color: #000091;
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
        background-color: #dfdff1;
      }
    `}</style>
  </div>
);

export default ButtonLink;
