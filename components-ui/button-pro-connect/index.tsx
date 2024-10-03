'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { logConversionEvent } from '#utils/matomo';

type IProps = {
  shouldRedirectToReferer?: boolean;
  event: string;
};

const ButtonProConnect: React.FC<IProps> = ({
  shouldRedirectToReferer = false,
  event = 'BTN_DEFAULT',
}) => {
  const [referrer, setReferrer] = useState<string | null>(null);
  const currentPath = usePathname();

  useEffect(() => {
    setReferrer(document.referrer);
  }, []);

  const isFromSite =
    referrer?.indexOf(
      process.env.NEXT_PUBLIC_BASE_URL || 'https://annuaire-entreprises'
    ) === 0;

  const pathFrom =
    shouldRedirectToReferer && isFromSite ? referrer : currentPath;

  return (
    <form action="/api/auth/agent-connect/login" method="get">
      {pathFrom && (
        <input readOnly hidden aria-hidden name="pathFrom" value={pathFrom} />
      )}
      <div className="fr-connect-group">
        <button
          className="fr-connect pro-connect"
          onClick={() => logConversionEvent(event)}
        >
          <span className="fr-connect__login">S’identifier avec</span>
          <span className="fr-connect__brand">ProConnect</span>
        </button>
        <p>
          <a
            href="https://www.proconnect.gouv.fr/"
            target="_blank"
            rel="noopener"
            title="Qu'est-ce que ProConnect ? - nouvelle fenêtre"
          >
            Qu’est-ce que ProConnect ?
          </a>
        </p>
      </div>
    </form>
  );
};

export default ButtonProConnect;
