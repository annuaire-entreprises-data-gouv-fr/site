import { PrintNever } from "#components-ui/print-visibility";
import constants from "#models/constants";
import styles from "./styles.module.css";

const TEMP_INCIDENT_BANNER = {
  message: `
  ⚠️ Notre partenaire ProConnect est en cours de mise à jour. Durant cette période, il est possible que les agents publics rencontrent des difficultés à se connecter.
  Nos équipes sont mobilisées pour résoudre ce problème, nous vous prions de nous excuser pour la gêne occasionnée.`,
  shouldDisplay: false,
};

export default function TempIncidentBanner() {
  if (!TEMP_INCIDENT_BANNER.shouldDisplay) {
    return null;
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
        <div className="fr-container">{TEMP_INCIDENT_BANNER.message}</div>
      </div>
    </PrintNever>
  );
}
