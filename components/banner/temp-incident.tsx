"use client";

import { useMemo } from "react";
import { PrintNever } from "#components-ui/print-visibility";
import { useFeatureFlag } from "#hooks/use-feature-flag";
import { useStorage } from "#hooks/use-storage";
import constants from "#models/constants";
import styles from "./styles.module.css";

interface ITempIncidentBannerProps {
  isAgent: boolean;
}

export default function TempIncidentBanner({
  isAgent: _,
}: ITempIncidentBannerProps) {
  const { isEnabled: isDefaultIncidentEnabled } = useFeatureFlag(
    "incident_banner_displayed"
  );
  const { isEnabled: isProconnectIncidentEnabled } = useFeatureFlag(
    "proconnect_incident_banner_displayed"
  );
  const { isEnabled: isPartnersDataIncidentEnabled } = useFeatureFlag(
    "partners_data_incident_banner_displayed"
  );
  const { isEnabled: isProconnectMigrationEnabled } = useFeatureFlag(
    "proconnect_migration_banner_displayed"
  );
  const [proconnectMigrationClosed, saveProconnectMigrationClosed] = useStorage(
    "local",
    "proconnect_migration_closed",
    false
  );

  const TEMP_INCIDENT_BANNER = useMemo(
    () => ({
      default: `
  🚨 Nous rencontrons actuellement des difficultés techniques, le service peut être temporairement indisponible.
    Nos équipes sont mobilisées pour résoudre ce problème, nous vous prions de nous excuser pour la gêne occasionnée.`,
      proconnect: `
  🚨 Notre partenaire ProConnect rencontre actuellement des difficultés techniques, le service de connexion à l'espace agent public peut être temporairement indisponible.
    Nos équipes sont mobilisées pour résoudre ce problème, nous vous prions de nous excuser pour la gêne occasionnée.`,
      partnersData: `
  🚨 Certains données et fonctionnalités sont temporairement indisponibles en raison d’instabilités chez nos partenaires.
    Veuillez nous excuser pour la gêne occasionnée.`,
      proconnectMigration: (
        <div>
          🚧{" "}
          <strong>Maintenance en cours chez notre partenaire ProConnect</strong>
          <br />
          En raison d’une opération de maintenance planifiée le{" "}
          <strong>23 avril à partir de 18h</strong>, l’accès à l’
          <strong>espace agent</strong> via ProConnect sera temporairement
          indisponible.
          <br />
          Nous vous remercions pour votre compréhension et vous invitons à
          réessayer ultérieurement.
          <button
            aria-label="Fermer la notification"
            className={styles.closeButton}
            onClick={() => saveProconnectMigrationClosed(true)}
            type="button"
          >
            ✕
          </button>
        </div>
      ),
    }),
    [proconnectMigrationClosed]
  );

  const isProConnectMigrationDisplayed =
    isProconnectMigrationEnabled && !proconnectMigrationClosed;

  if (
    !isDefaultIncidentEnabled &&
    !isProconnectIncidentEnabled &&
    !isPartnersDataIncidentEnabled &&
    !isProConnectMigrationDisplayed
  ) {
    return null;
  }

  let message: React.ReactNode = TEMP_INCIDENT_BANNER.default;

  if (isPartnersDataIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.partnersData;
  } else if (isProconnectIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.proconnect;
  } else if (isProConnectMigrationDisplayed) {
    message = TEMP_INCIDENT_BANNER.proconnectMigration;
  }

  return (
    <PrintNever>
      <div
        aria-label="Incident en cours"
        className={styles.banner}
        id="temp-incident"
        role="dialog"
        style={{
          backgroundColor: constants.colors.pastelBlue,
          borderColor: constants.colors.frBlue,
        }}
      >
        <div className="fr-container">{message}</div>
      </div>
    </PrintNever>
  );
}
