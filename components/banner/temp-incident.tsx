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
  dgfip: `
  🚨 L'ensemble des endpoints relatif à la DGFIP (données financières) ne sont plus fonctionnels.
    Aucune date de rétablissement n'a été encore communiquée par la DGFIP.  
    Veuillez nous excuser pour la gêne occasionnée.`,
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
  const { isEnabled: isDgfipIncidentEnabled } = useFeatureFlag(
    "dgfip_incident_banner_displayed"
  );

  const shouldDisplayDgfipIncident = isDgfipIncidentEnabled && isAgent;

  if (
    !isDefaultIncidentEnabled &&
    !isProconnectIncidentEnabled &&
    !isPartnersDataIncidentEnabled &&
    !shouldDisplayDgfipIncident
  ) {
    return null;
  }

  let message = TEMP_INCIDENT_BANNER.default;

  if (isPartnersDataIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.partnersData;
  } else if (isProconnectIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.proconnect;
  } else if (shouldDisplayDgfipIncident) {
    message = TEMP_INCIDENT_BANNER.dgfip;
  }

  return (
    <PrintNever>
      <div
        aria-label="Incident en cours"
        className={styles.npsModal}
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
