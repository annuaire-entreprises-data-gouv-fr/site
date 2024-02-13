import { PropsWithChildren } from 'react';

const PrintOnly: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="print-only">{children}</div>
);

const PrintNever: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="print-never">{children}</div>
);

export { PrintNever, PrintOnly };
