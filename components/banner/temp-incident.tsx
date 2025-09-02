'use client';

import { PrintNever } from '#components-ui/print-visibility';
import ClientOnly from '#components/client-only';
import constants from '#models/constants';
import { useStorage } from 'hooks/use-storage';
import styles from './styles.module.css';

const TEMP_INCIDENT_BANNER_ID = 'temp-incident-banner';

export default function TempIncidentBanner() {
  return null;

  const [shouldDisplayBanner, setShouldDisplayBanner] = useStorage(
    'local',
    TEMP_INCIDENT_BANNER_ID,
    true
  );

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
              backgroundColor: constants.colors.espaceAgentPastel,
              borderColor: constants.colors.espaceAgent,
            }}
          >
            <div className="fr-container">
              🚨 Un incident a été identifié concernant les fichiers des
              établissements géolocalisés du mois de juillet. Nos équipes sont
              mobilisées pour résoudre ce problème, et une correction sera
              apportée d’ici 15h aujourd’hui. Nous vous prions de nous excuser
              pour la gêne occasionnée et vous remercions pour votre
              compréhension.
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
