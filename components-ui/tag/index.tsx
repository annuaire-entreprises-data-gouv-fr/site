import React, { PropsWithChildren } from 'react';

interface IProps {
  className?: string;
}

export const Tag: React.FC<PropsWithChildren<IProps>> = ({
  children,
  className = '',
}) => (
  <>
    <span className={`tag ${className}`}>{children}</span>
    <style jsx>{`
      .tag {
        font-size: 0.9rem;
        font-weight: bold;
        display: inline-block;
        background-color: #eee;
        color: #666;
        border-radius: 3px;
        padding: 0 5px;
        margin: 0 7px;
      }

      .tag.closed {
        color: #914141;
        background-color: #ffe5e5;
      }
      .tag.open {
        color: #326f00;
        background-color: #cdf2c0;
      }
      .tag.unknown {
        color: #6f0000;
        background-color: #ffe585;
      }
    `}</style>
  </>
);
