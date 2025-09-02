'use client';

import { PrintNever } from '#components-ui/print-visibility';
import ClientOnly from '#components/client-only';
import constants from '#models/constants';
import { useStorage } from 'hooks/use-storage';
import styles from './styles.module.css';

const TEMP_INCIDENT_BANNER_ENABLED = true;
const TEMP_INCIDENT_BANNER_ID = 'temp-incident-banner-2025-09-02';
const TEMP_INCIDENT_BANNER_MESSAGE = `
        🚨 Nous rencontrons actuellement des difficultés techniques, le service peut être temporairement indisponible.
        Nos équipes sont mobilisées pour résoudre ce problème, nous vous prions de nous excuser
        pour la gêne occasionnée.`;

export default function TempIncidentBanner() {
  const [shouldDisplayBanner, setShouldDisplayBanner] = useStorage(
    'local',
    TEMP_INCIDENT_BANNER_ID,
    true
  );

  if (!TEMP_INCIDENT_BANNER_ENABLED) {
    return null;
  }

  const close = () => {
    setShouldDisplayBanner(false);
  };

  return (
    <ClientOnly>
      {shouldDisplayBanner ? (
        <PrintNever>
          <div
            id="temp-incident"
            role="dialog"
            aria-label="Incident en cours"
            className={styles.npsModal}
            style={{
              backgroundColor: constants.colors.pastelBlue,
              borderColor: constants.colors.blue,
            }}
          >
            <div className="fr-container">
              {TEMP_INCIDENT_BANNER_MESSAGE}
              <button onClick={close}>
                <strong>Ne plus afficher ce message ✕</strong>
              </button>
            </div>
          </div>
        </PrintNever>
      ) : null}
    </ClientOnly>
  );
}
