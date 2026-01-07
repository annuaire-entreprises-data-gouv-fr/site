"use client";

import { PrintNever } from "#components-ui/print-visibility";
import { useFeatureFlag } from "#hooks/use-feature-flag";
import constants from "#models/constants";
import styles from "./styles.module.css";

const TEMP_INCIDENT_BANNER = {
  message: `
  🚨 Nous rencontrons actuellement des difficultés techniques, le service peut être temporairement indisponible.
    Nos équipes sont mobilisées pour résoudre ce problème, nous vous prions de nous excuser pour la gêne occasionnée.`,
};

export default function TempIncidentBanner() {
  const { isEnabled } = useFeatureFlag("incident_banner_displayed");

  if (!isEnabled) {
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
