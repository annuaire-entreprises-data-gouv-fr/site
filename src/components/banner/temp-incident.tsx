import { useMemo } from "react";
import { PrintNever } from "#/components-ui/print-visibility";
import { useFeatureFlag } from "#/hooks/use-feature-flag";
import constants from "#/models/constants";
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
  const { isEnabled: isInseeIncidentEnabled } = useFeatureFlag(
    "insee_incident_banner_displayed"
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
      insee: `
  🚨 Notre partenaire l’Insee rencontre actuellement des perturbations pouvant affecter le téléchargement des avis de situation.
  Si votre demande échoue, nous vous invitons à réessayer ultérieurement.`,
    }),
    []
  );

  if (
    !(
      isDefaultIncidentEnabled ||
      isProconnectIncidentEnabled ||
      isPartnersDataIncidentEnabled ||
      isInseeIncidentEnabled
    )
  ) {
    return null;
  }

  let message: React.ReactNode = TEMP_INCIDENT_BANNER.default;

  if (isPartnersDataIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.partnersData;
  } else if (isProconnectIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.proconnect;
  } else if (isInseeIncidentEnabled) {
    message = TEMP_INCIDENT_BANNER.insee;
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
