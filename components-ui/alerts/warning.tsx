import React, { PropsWithChildren } from 'react';
import { alertFill } from '#components-ui/icon';

const Warning: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full = false,
  children,
}) => (
  <div className="alert">
    <div className="icon">{alertFill}</div>
    <div>{children}</div>
    <style jsx>{`
      .alert {
        border: none;
        border-radius: 2px;
        border-left: 4px solid #ff9c00;
        background-color: #fff3e0;
        padding: 10px;
        margin: 10px 0;
        display: flex;
        align-items: start;
        width: ${full ? '100%' : 'auto'};
      }

      .icon {
        color: #ff9c00;
        padding-right: 10px;
      }
    `}</style>
  </div>
);

export default Warning;
