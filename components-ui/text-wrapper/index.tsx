import React, { PropsWithChildren } from 'react';

const TextWrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="content-container fr-col-lg-8 fr-col-xl-8">
    {children}
    <style jsx>{`
      .content-container {
        margin-left: 0;
      }
    `}</style>
  </div>
);

export default TextWrapper;
