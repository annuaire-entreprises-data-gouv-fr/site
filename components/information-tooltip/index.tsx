import React, { PropsWithChildren } from 'react';

const InformationTooltip: React.FC<PropsWithChildren<{}>> = (children) => (
  <div>
    <div>?</div>
    <div>{children}</div>
  </div>
);

export default InformationTooltip;
