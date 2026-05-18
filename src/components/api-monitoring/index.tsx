import type React from "react";
import { Section } from "#/components/section";
import { Icon } from "#/components-ui/icon/wrapper";
import InformationTooltip from "#/components-ui/information-tooltip";
import constants from "#/models/constants";
import type { IMonitoringWithMetaData, IRatio } from "#/models/monitoring";
import styles from "./styles.module.css";

const getUptimeColorStyles = (ratio: IRatio) => {
  if (!ratio.wasMonitorUp) {
    return { backgroundColor: "#ccc" };
  }
  const uptimeNum = ratio.ratioNumber;

  if (uptimeNum >= 99.99) {
    return { backgroundColor: "#3bd671" };
  }
  if (uptimeNum >= 99) {
    return { backgroundColor: "#c2e34b", height: "50px", margin: 0 };
  }
  if (uptimeNum >= 95) {
    return { backgroundColor: "#f29030", height: "50px", margin: 0 }; // Orange
  }
  return { backgroundColor: "#df484a", height: "50px", margin: 0 };
};

const getUptimeLabel = (ratio: IRatio) => {
  if (!ratio.wasMonitorUp) {
    return "pas de données";
  }
  const uptimeNum = ratio.ratioNumber;
  const formattedRation = ratio.ratioNumber.toFixed(2);
  if (uptimeNum >= 99.99) {
    return "service en état de fonctionnement";
  }
  if (uptimeNum >= 99) {
    return `${formattedRation}% : service faiblement perturbé`;
  }
  if (uptimeNum >= 95) {
    return `${formattedRation}% : service très perturbé`; // Orange
  }
  return `${formattedRation}% : service extrêmement perturbé`;
};

const getHideClasses = (index: number) => {
  if (index > 70) {
    return "";
  }
  if (index > 50) {
    return styles["hide-mobile"];
  }
  return `${styles["hide-mobile"]} ${styles["hide-tablet"]}`;
};

const Metric: React.FC<{
  series: IRatio[];
}> = ({ series }) => (
  <div className={styles["series-wrapper"]}>
    <div className={styles["uptime-chart"]}>
      {series.map((serie, index) => (
        <div
          className={`${getHideClasses(index)} ${styles.series}`}
          key={index}
        >
          <InformationTooltip
            ariaRelation="labelledby"
            horizontalOrientation={index < 76 ? "left" : "right"}
            inlineBlock={false}
            label={
              <>
                <strong>{serie.date}</strong>
                <br />
                {getUptimeLabel(serie)}
              </>
            }
            tabIndex={0}
            width={170}
          >
            <div
              className={styles["serie-rectangle"]}
              style={getUptimeColorStyles(serie)}
            />
          </InformationTooltip>
        </div>
      ))}
    </div>
  </div>
);

const RobotTooltip = () => (
  <InformationTooltip
    ariaRelation="labelledby"
    horizontalOrientation="right"
    label="Ces données sont obtenues via un robot qui interroge la source de données toutes les minutes"
    tabIndex={0}
  >
    <Icon color={constants.colors.frBlue} size={12} slug="information" />
  </InformationTooltip>
);

const ApiMonitoring: React.FC<IMonitoringWithMetaData> = ({
  isOnline,
  series,
  uptime,
  apiDocumentationLink,
}) => (
  <>
    {series ? (
      <Section
        title={`Disponibilité : l’API est actuellement ${
          isOnline ? "en ligne ✅" : "hors-ligne 🛑"
        }`}
      >
        {isOnline ? (
          <p>
            L’API fonctionne normalement, vous ne devriez pas rencontrer de
            problème en accédant aux données.
          </p>
        ) : (
          <p>
            L’API est actuellement hors-service et l’accès aux données est
            fortement perturbé, voire impossible.
          </p>
        )}
        <div className={styles["metrics-title"]}>
          <h3>
            Historique de disponibilité <RobotTooltip />
          </h3>
          <Metric series={series} />
          <h3>Statistiques moyennes</h3>
          <div className={styles["mean-stats"]}>
            <div>
              <strong>24h</strong>
              <span>{uptime.day}%</span>
            </div>
            <div>
              <strong>7 jours</strong>
              <span>{uptime.week}%</span>
            </div>
            <div>
              <strong>30 jours</strong>
              <span>{uptime.month}%</span>
            </div>
          </div>
        </div>

        {apiDocumentationLink && (
          <i>
            <br />
            Envie de réutiliser cette API ?{" "}
            {apiDocumentationLink && (
              <a
                href={apiDocumentationLink}
                rel="noreferrer noopener"
                target="_blank"
              >
                Consulter la documentation
              </a>
            )}
          </i>
        )}
      </Section>
    ) : (
      <Section title="Suivi des performances de l'API indisponible">
        Notre service de suivi des performances est actuellement hors-ligne.
        Nous sommes désolés pour ce dérangement.
      </Section>
    )}
  </>
);

export default ApiMonitoring;
