import { PrintNever } from "#components-ui/print-visibility";
import constants from "#models/constants";
import styles from "./styles.module.css";

const TEMP_INCIDENT_BANNER_MESSAGE = `
        🚨 Nous rencontrons actuellement des difficultés techniques, le service peut être temporairement indisponible.
        Nos équipes sont mobilisées pour résoudre ce problème, nous vous prions de nous excuser
        pour la gêne occasionnée.`;

const DISPLAY_INCIDENT_BANNER = false;

export default function TempIncidentBanner() {
  if (!DISPLAY_INCIDENT_BANNER) {
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
        <div className="fr-container">{TEMP_INCIDENT_BANNER_MESSAGE}</div>
      </div>
    </PrintNever>
  );
}
