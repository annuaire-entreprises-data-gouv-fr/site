import React, { PropsWithChildren } from 'react';

interface IProps {
  small?: boolean;
  href?: string;
  type?: 'submit' | null;
  alt?: boolean;
  target?: '_blank';
  nofollow?: Boolean;
}

const ButtonLink: React.FC<PropsWithChildren<IProps>> = ({
  href,
  children,
  small = false,
  alt = false,
  target = '',
  nofollow = false,
}) => (
  <div>
    {!href ? (
      <button type="submit">{children}</button>
    ) : (
      <a
        target={target}
        rel={
          (target === '_blank' ? 'noopener noreferrer' : '') +
          (nofollow ? 'nofollow' : '')
        }
        href={href}
      >
        {children}
      </a>
    )}
    <style jsx>{`
      div {
        display: block;
      }
      a,
      button {
        text-align: center;
        outline: none;
        transition: none;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0;
        background-color: ${alt ? '#fff' : '#000091'};
        color: ${alt ? '#000091' : '#fff'};
        text-decoration: none;
        font-size: ${small ? '0.9rem' : '1rem'};
        line-height: 1.2rem;
        min-height: ${small ? '36px' : '46px'};
        padding: 0 10px;
        border: 2px solid ${alt ? '#000091' : 'transparent'};
        border-radius: 3px;
        box-shadow: none;
      }

      div:hover > a,
      div:hover > button {
        color: ${alt ? '#0b01c3' : '#fff'};
        border-color: #0b01c3;
        text-decoration: none;
        background-color: ${alt ? '#dfdff1' : '#0b01c3'};
      }
    `}</style>
  </div>
);

export default ButtonLink;
