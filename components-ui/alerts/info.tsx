import React, { PropsWithChildren } from 'react';
import { Icon } from '#components-ui/icon/wrapper';

const Info: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full = false,
  children,
}) => (
  <div className="alert">
    <div>
      <Icon color="#3ca3ff" size={16} slug="information" />
    </div>
    <div>{children}</div>
    <style jsx>{`
      .alert {
        border: none;
        border-radius: 2px;
        border-left: 4px solid #3ca3ff;
        background-color: #e5f3ff;
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

export default Info;
