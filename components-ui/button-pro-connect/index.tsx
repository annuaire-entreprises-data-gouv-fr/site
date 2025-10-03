"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { logConversionEvent } from "#utils/matomo";
import { getBaseUrl } from "#utils/server-side-helper/app/get-base-url";

type IProps = {
  shouldRedirectToReferer?: boolean;
  event: string;
  noFootLink?: boolean;
};

const ButtonProConnect: React.FC<IProps> = ({
  shouldRedirectToReferer = false,
  event = "BTN_DEFAULT",
  noFootLink = false,
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
        <input aria-hidden hidden name="pathFrom" readOnly value={pathFrom} />
      )}
      <div className="fr-connect-group">
        <button
          className="fr-connect pro-connect"
          onClick={() => logConversionEvent(event)}
        >
          <span className="fr-connect__login">S’identifier avec</span>
          <span className="fr-connect__brand">ProConnect</span>
        </button>
        {!noFootLink && (
          <p>
            <a
              href="https://www.proconnect.gouv.fr/"
              rel="noopener"
              target="_blank"
              title="Qu'est-ce que ProConnect ? - nouvelle fenêtre"
            >
              Qu’est-ce que ProConnect ?
            </a>
          </p>
        )}
      </div>
    </form>
  );
};

export default ButtonProConnect;
