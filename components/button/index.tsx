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
      a {
        display: block;
        border-radius: 0;
        background-color: #000091;
        color: #fff;
        text-decoration: none;
        padding: ${small ? '5px 10px' : '10px 20px'};
        border: none;
      }
      a:hover {
        color: #fff;
        text-decoration: none;
        background-color: #000091;
      }
    `}</style>
  </div>
);

export default Button;
