"use client";

import ClientOnly from "#components/client-only";
import { PrintNever } from "#components-ui/print-visibility";
import { useStorage } from "#hooks/use-storage";
import constants from "#models/constants";
import styles from "./styles.module.css";

const PROCONNECT_2FA_BANNER_ID = "proconnect-2fa-banner";

export default function Proconnect2FABanner() {
  const [isVisible, setIsVisible] = useStorage(
    "local",
    PROCONNECT_2FA_BANNER_ID,
    true
  );

  const close = () => {
    setIsVisible(false);
  };

  return (
    <ClientOnly>
      <PrintNever>
        {isVisible ? (
          <div
            aria-label="Authentification à double facteur activée"
            className={styles.npsModal}
            id="proconnect-2fa"
            role="dialog"
            style={{
              backgroundColor: constants.colors.pastelBlue,
              borderColor: constants.colors.frBlue,
            }}
          >
            <div className="fr-container">
              <div className={styles.proconnect2FABanner}>
                <div>
                  <p className={styles.unspacedParagraph}>
                    <strong>
                      🔐 Pour mieux protéger votre espace agent,
                      l’authentification à double facteur a été activée.
                    </strong>
                    <br />
                    Lors de votre prochaine connexion, ProConnect vous demandera
                    de configurer cette étape de sécurité. Plus d’infos{" "}
                    <a
                      href="https://proconnect.crisp.help/fr/article/quest-ce-que-la-double-authentification-1m5mpmj/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      ici
                    </a>
                  </p>
                </div>
                <div>
                  <button onClick={close}>
                    <strong>Ne plus afficher ce message ✕</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </PrintNever>
    </ClientOnly>
  );
}
