'use client';

import { logConversionEvent } from '#utils/matomo';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

  const baseURL = getBaseUrl();
  const isFromSite = referrer?.indexOf(baseURL) === 0;

  const pathFrom =
    shouldRedirectToReferer && isFromSite
      ? new URL(referrer).pathname
      : currentPath;

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
