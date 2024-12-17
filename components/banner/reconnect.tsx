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
  const [shouldDisplayBanner, setShouldDisplayBanner] = useState(false);
  const currentlyLoggedIn = isLoggedIn(session);
  const currentPath = usePathname();

  useEffect(() => {
    const wasLoggedIn = getCookieBrowser('user-was-logged-in') === 'true';
    const shouldDisplayBanner = wasLoggedIn && !currentlyLoggedIn;
    setShouldDisplayBanner(shouldDisplayBanner);
  }, [currentlyLoggedIn]);

  /**
   * Remove cookie on close or unmount
   */
  useEffect(() => {
    const onBeforeUnload = () => {
      deleteCookieBrowser('user-was-logged-in');
    };

    if (shouldDisplayBanner) {
      // on page unload
      window.addEventListener('beforeunload', onBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', onBeforeUnload);
      };
    }
  }, [shouldDisplayBanner]);

  const handleClose = () => {
    // on component closed
    deleteCookieBrowser('user-was-logged-in');
    setShouldDisplayBanner(false);
  };

  return shouldDisplayBanner ? (
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
            Pour des raisons de sécurité, vous avez été automatiquement
            déconnecté après 24 heures.{' '}
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
