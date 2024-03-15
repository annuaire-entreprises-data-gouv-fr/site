import React, { PropsWithChildren } from 'react';

const TextWrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div style={{ marginLeft: '0' }} className="fr-col-lg-8 fr-col-xl-8">
    {children}
  </div>
);

export default TextWrapper;
