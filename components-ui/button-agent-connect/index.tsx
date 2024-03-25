'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

type IProps = {
  useCurrentPathForRediction: boolean;
  alternatePathForRedirection?: string;
};

const ButtonAgentConnect: React.FC<IProps> = ({
  alternatePathForRedirection,
  useCurrentPathForRediction,
}) => {
  let pathFrom = null;
  const currentPath = usePathname();

  if (useCurrentPathForRediction) {
    pathFrom = currentPath;
  }
  if (alternatePathForRedirection) {
    pathFrom = alternatePathForRedirection;
  }

  return (
    <form action="/api/auth/agent-connect/login" method="get">
      {pathFrom && (
        <input readOnly hidden aria-hidden name="pathFrom" value={pathFrom} />
      )}
      <div className="fr-connect-group">
        <button
          className="fr-connect"
          style={{ filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 18, 0.16))' }}
        >
          <span className="fr-connect__login">S’identifier avec</span>
          <span className="fr-connect__brand">AgentConnect</span>
        </button>
      </div>
    </form>
  );
};

export default ButtonAgentConnect;
