import React, { PropsWithChildren } from 'react';

const SectionTitle: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <h2>
    {children}
    <style jsx>{`
      h2 {
        margin-top: 0;
        display: inline-block;
        font-size: 1.1rem;
        line-height: 1.8rem;
        background-color: #dfdff1;
        color: #000091;
        padding: 0 7px;
        border-radius: 2px;
        max-width: calc(100% - 40px);
      }
    `}</style>
  </h2>
);

export default SectionTitle;
