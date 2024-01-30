import React from 'react';
import usePathFromRouter from 'hooks/use-path-from-router';

const ButtonAgentConnect: React.FC<{ usePathFrom?: boolean }> = ({
  usePathFrom,
}) => {
  const pathFrom = usePathFromRouter();
  return (
    <form action="/api/auth/agent-connect/login" method="get">
      {usePathFrom && pathFrom && (
        <input readOnly hidden aria-hidden name="pathFrom" value={pathFrom} />
      )}
      <div className="fr-connect-group">
        <button className="fr-connect">
          <span className="fr-connect__login">S’identifier avec</span>
          <span className="fr-connect__brand">AgentConnect</span>
        </button>
      </div>
      <style jsx>{`
        button.fr-connect {
          filter: drop-shadow(0px 2px 6px rgba(0, 0, 18, 0.16));
        }
      `}</style>
    </form>
  );
};

export default ButtonAgentConnect;
