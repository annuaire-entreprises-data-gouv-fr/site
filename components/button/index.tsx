import React, { PropsWithChildren } from 'react';

interface IProps extends HTMLLinkElement {
  small: boolean;
}

const Button: React.FC<PropsWithChildren<IProps>> = ({
  href,
  children,
  small = false,
}) => (
  <div id="button">
    <a href={href}>{children}</a>
    <style jsx>{`
      div {
        display: block;
      }
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0;
        background-color: #000091;
        color: #fff;
        text-decoration: none;
        padding: ${small ? '4px 10px' : '9px 20px'};
        border: 2px solid transparent;
      }
      div:hover > a {
        color: #000091;
        border-color: #000091;
        text-decoration: none;
        background-color: #dfdff1;
      }
    `}</style>
  </div>
);

export default Button;
