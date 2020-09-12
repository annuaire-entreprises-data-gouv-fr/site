import React, { PropsWithChildren } from 'react';

interface IProps {
  small?: boolean;
  href?: string;
  type?: 'submit' | null;
}

const ButtonLink: React.FC<PropsWithChildren<IProps>> = ({
  href,
  children,
  small = false,
  type,
}) => (
  <div id="button">
    {!href ? (
      <button type="submit">{children}</button>
    ) : (
      <a href={href}>{children}</a>
    )}
    <style jsx>{`
      div {
        display: block;
      }
      a,
      button {
        outline: none;
        transition: none;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0;
        background-color: #000091;
        color: #fff;
        text-decoration: none;
        font-size: ${small ? '0.9rem' : '1rem'};
        height: ${small ? '36px' : '46px'};
        padding: 0 10px;
        border: 2px solid transparent;
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
