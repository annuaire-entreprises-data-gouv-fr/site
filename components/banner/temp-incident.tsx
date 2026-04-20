"use client";

import { PrintNever } from "#components-ui/print-visibility";
import { useFeatureFlag } from "#hooks/use-feature-flag";
import constants from "#models/constants";
import styles from "./styles.module.css";

const TEMP_INCIDENT_BANNER = {
  default: `
  🚨 Nous rencontrons actuellement des difficultés techniques, le service peut être temporairement indisponible.
    Nos équipes sont mobilisées pour résoudre ce problème, nous vous prions de nous excuser pour la gêne occasionnée.`,
  proconnect: `
  🚨 Notre partenaire ProConnect rencontre actuellement des difficultés techniques, le service de connexion aux espaces agent public peut être temporairement indisponible.
    Nos équipes sont mobilisées pour résoudre ce problème, nous vous prions de nous excuser pour la gêne occasionnée.`,
  partnersData: `
  🚨 Certains données et fonctionnalités sont temporairement indisponibles en raison d’instabilités chez nos partenaires.
    Veuillez nous excuser pour la gêne occasionnée.`,
  proconnectMigration: `
  🚧 <strong>Maintenance en cours chez notre partenaire ProConnect</strong>
    <br/>En raison d’une opération de maintenance planifiée le <strong>21 avril à partir de 18h</strong>, l’accès à l’<strong>espace agent</strong> via ProConnect sera temporairement indisponible.
    <br/>Nous vous remercions pour votre compréhension et vous invitons à réessayer ultérieurement.`,
};

interface ITempIncidentBannerProps {
  isAgent: boolean;
}

export default function TempIncidentBanner({
  isAgent,
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

  if (
    !isDefaultIncidentEnabled &&
    !isProconnectIncidentEnabled &&
    !isPartnersDataIncidentEnabled &&
    !isProconnectMigrationEnabled
  ) {
    return null;
  }

  let message = TEMP_INCIDENT_BANNER.default;

  if (isPartnersDataIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.partnersData;
  } else if (isProconnectIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.proconnect;
  } else if (isProconnectMigrationEnabled) {
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
        <div
          className="fr-container"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </PrintNever>
  );
}
