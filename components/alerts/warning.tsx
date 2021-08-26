import React, { PropsWithChildren } from 'react';

const Warning: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="alert">
    <div className="icon">
      <span className="fr-fi-alert-fill" aria-hidden="true"></span>
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
      }

      .icon {
        color: #ff9c00;
        padding-right: 10px;
      }
    `}</style>
  </div>
);

export default Warning;
