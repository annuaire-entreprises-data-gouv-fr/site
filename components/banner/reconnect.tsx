'use client';

import { PrintNever } from '#components-ui/print-visibility';
import { isLoggedIn } from '#models/user/rights';
import { ISession } from '#models/user/session';
import {
  deleteCookieBrowser,
  getCookieBrowser,
} from '#utils/cookies/browser-cookies';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function ReconnectBanner({
  session,
}: {
  session: ISession | null;
}) {
  const [wasLoggedIn, setWasLoggedIn] = useState(false);
  const currentlyLoggedIn = isLoggedIn(session);

  const [referrer, setReferrer] = useState<string | null>(null);
  const currentPath = usePathname();

  useEffect(() => {
    setReferrer(document.referrer);
    setWasLoggedIn(getCookieBrowser('user-was-logged-in') === 'true');
  }, []);

  const baseURL = getBaseUrl();
  const isFromSite = referrer?.indexOf(baseURL) === 0;

  const pathFrom = isFromSite ? new URL(referrer).pathname : currentPath;

  const handleClose = () => {
    deleteCookieBrowser('user-was-logged-in');
    setWasLoggedIn(false);
  };

  return wasLoggedIn && !currentlyLoggedIn ? (
    <PrintNever>
      <div
        id="reconnect"
        role="dialog"
        aria-label="Voulez-vous vous reconnecter ?"
        className={styles.npsModal}
      >
        <div className="fr-container">
          <a
            href={`/api/auth/agent-connect/login${
              pathFrom ? `?pathFrom=${pathFrom}` : ''
            }`}
          >
            Votre session a expiré, voulez-vous vous reconnecter ?
          </a>
          <button onClick={handleClose}>
            <strong>Ne plus afficher ce message ✕</strong>
          </button>
        </div>
      </div>
    </PrintNever>
  ) : null;
}
