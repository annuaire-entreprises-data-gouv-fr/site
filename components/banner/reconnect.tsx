'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import constants from '#models/constants';
import { isLoggedIn } from '#models/user/rights';
import { ISession } from '#models/user/session';
import {
  deleteCookieBrowser,
  getCookieBrowser,
} from '#utils/cookies/browser-cookies';
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

  const currentPath = usePathname();

  useEffect(() => {
    setWasLoggedIn(getCookieBrowser('user-was-logged-in') === 'true');
  }, []);

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
        style={{
          backgroundColor: constants.colors.espaceAgentPastel,
          borderColor: constants.colors.espaceAgent,
        }}
      >
        <div className="fr-container">
          <Icon slug="lockFill" color={constants.colors.espaceAgent}>
            Pour des raisons de sécurité, vous devez vous reconnecter chaque
            jour.{' '}
            <a href={`/api/auth/agent-connect/login?pathFrom=${currentPath}`}>
              Voulez-vous vous reconnecter ?
            </a>
          </Icon>
          <button onClick={handleClose}>
            <strong>Ne plus afficher ce message ✕</strong>
          </button>
        </div>
      </div>
    </PrintNever>
  ) : null;
}
