import React, { PropsWithChildren } from 'react';

const Info: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full = false,
  children,
}) => (
  <div className="alert">
    <div className="icon">
      <span className="fr-fi-information-fill" aria-hidden="true"></span>
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

      .icon {
        color: #3ca3ff;
        padding-right: 10px;
      }
    `}</style>
  </div>
);

export default Info;
