"use client";

import { useStorage } from "hooks";
import type React from "react";
import { useEffect, useState } from "react";
import ClientOnly from "#components/client-only";
import { PrintNever } from "#components-ui/print-visibility";
import { Exception } from "#models/exceptions";
import { logInfoInSentry } from "#utils/sentry";
import styles from "./styles.module.css";

const NPS_MODAL_ID = "nps-modal-2";

export const NPSBanner: React.FC<{}> = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered] = useStorage(
    "local",
    NPS_MODAL_ID,
    false
  );

  const [pageViewCount, setPageViewCount] = useStorage(
    "session",
    "pv-" + NPS_MODAL_ID,
    "0"
  );

  const pathCounter = () => {
    try {
      if (hasAlreadyBeenTriggered) {
        return 0;
      }
      const newViewCount = Number.parseInt(pageViewCount, 10) + 1;
      setPageViewCount(newViewCount.toString());
      return newViewCount;
    } catch (e) {
      logInfoInSentry(
        new Exception({
          name: "SaveFavouriteException",
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

  return (
    <ClientOnly>
      {isVisible ? (
        <PrintNever>
          <div
            aria-label="Donnez-nous votre avis"
            className={styles.npsModal}
            id={NPS_MODAL_ID}
            role="dialog"
          >
            <div className="fr-container">
              <a
                href="/formulaire/nps"
                onClick={close}
                rel="noopener"
                target="_blank"
              >
                👍👎 Quel est votre avis sur l‘Annuaire des Entreprises ?
              </a>
              <button onClick={close}>
                <strong>Ne plus afficher ce message ✕</strong>
              </button>
            </div>
          </div>
        </PrintNever>
      ) : null}
    </ClientOnly>
  );
};
