'use client';

import React, { useEffect, useState } from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import { Exception } from '#models/exceptions';
import { logInfoInSentry } from '#utils/sentry';
import { useStorage } from 'hooks';
import styles from './styles.module.css';

const NPS_MODAL_ID = 'nps-modal-2';

export const NPSBanner: React.FC<{}> = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered] = useStorage(
    'local',
    NPS_MODAL_ID,
    false
  );

  const [pageViewCount, setPageViewCount] = useStorage(
    'session',
    'pv-' + NPS_MODAL_ID,
    '0'
  );

  const pathCounter = () => {
    try {
      if (hasAlreadyBeenTriggered) {
        return 0;
      }
      const newViewCount = parseInt(pageViewCount, 10) + 1;
      setPageViewCount(newViewCount.toString());
      return newViewCount;
    } catch (e) {
      logInfoInSentry(
        new Exception({
          name: 'SaveFavouriteException',
          cause: e,
        })
      );
      return 0;
    }
  };

  useEffect(() => {
    const t = pathCounter();
    if (t > 2) {
      setIsVisible(true);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setHasAlreadyBeenTriggered(true);
    setIsVisible(false);
  };

  return isVisible ? (
    <PrintNever>
      <div
        id={NPS_MODAL_ID}
        role="dialog"
        aria-label="Donnez-nous votre avis"
        className={styles.npsModal}
      >
        <div className="fr-container">
          <a onClick={close} href="/formulaire/nps" target="_blank">
            👍👎 Quel est votre avis sur ce site ?
          </a>
          <button onClick={close}>
            <strong>Ne plus afficher ce message ✕</strong>
          </button>
        </div>
      </div>
    </PrintNever>
  ) : null;
};
