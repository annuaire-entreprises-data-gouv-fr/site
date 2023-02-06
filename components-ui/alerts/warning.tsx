import React, { PropsWithChildren } from 'react';
import { Icon } from '#components-ui/icon/wrapper';

const Warning: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full = false,
  children,
}) => (
  <div className="alert">
    <div>
      <Icon color="#ff9c00" size={16} slug="alertFill" />
    </div>
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

      .alert > div:first-of-type {
        margin-right: 10px;
      }
    `}</style>
  </div>
);

export default Warning;
