import React, { PropsWithChildren } from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';

const ProtectedData: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full = false,
  children,
}) => (
  <div className="alert">
    <div>
      <Icon color={constants.colors.espaceAgent} size={16} slug="lockFill" />
    </div>
    <div>{children}</div>
    <style jsx>{`
      .alert {
        border: none;
        border-radius: 2px;
        border-left: 4px solid ${constants.colors.espaceAgent};
        background-color: ${constants.colors.espaceAgentPastel};
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

export default ProtectedData;
