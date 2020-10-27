import React, { PropsWithChildren } from 'react';

interface IProps {
  small?: boolean;
  href?: string;
  type?: 'submit' | null;
  alt?: boolean;
  target?: '_blank';
}

const ButtonLink: React.FC<PropsWithChildren<IProps>> = ({
  href,
  children,
  small = false,
  alt = false,
  target = '',
}) => (
  <div id="button">
    {!href ? (
      <button type="submit">{children}</button>
    ) : (
      <a
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : ''}
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
        line-height: 1rem;
        height: ${small ? '36px' : '46px'};
        padding: 0 10px;
        border: 2px solid ${alt ? '#000091' : 'transparent'};
      }
      button {
      }
      div:hover > a,
      div:hover > button {
        color: #000091;
        border-color: #000091;
        text-decoration: none;
        background-color: #dfdff1;
      }
    `}</style>
  </div>
);

export default ButtonLink;
