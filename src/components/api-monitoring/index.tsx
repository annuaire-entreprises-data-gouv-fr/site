import type React from "react";
import { Section } from "#/components/section";
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

const Metric = ({ series }: { series: IRatio[] }) => (
  <>
    <div aria-hidden="true" className={styles["series-wrapper"]}>
      <div className={styles["uptime-chart"]}>
        {series.map((serie, index) => (
          <div
            className={`${getHideClasses(index)} ${styles.series}`}
            key={serie.date}
          >
            <div
              className={styles["serie-rectangle"]}
              style={getUptimeColorStyles(serie)}
            />
          </div>
        ))}
      </div>
    </div>
    <details>
      <summary>Consulter l’historique de disponibilité dans un tableau</summary>
      <div className="fr-table">
        <table>
          <caption>Historique de disponibilité</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Disponibilité</th>
            </tr>
          </thead>
          <tbody>
            {series.map((serie) => (
              <tr key={serie.date}>
                <th scope="row">{serie.date}</th>
                <td>{getUptimeLabel(serie)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  </>
);

const ApiMonitoring: React.FC<IMonitoringWithMetaData> = ({
  apiName,
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
        titleLevel="h4"
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
          <h5>Historique de disponibilité</h5>
          <p>
            Ces données sont obtenues via un robot qui interroge la source de
            données toutes les minutes.
          </p>
          <Metric series={series} />
          <h5>Statistiques moyennes</h5>
          <dl className={styles["mean-stats"]}>
            <div>
              <dt>24h</dt>
              <dd>{uptime.day}%</dd>
            </div>
            <div>
              <dt>7 jours</dt>
              <dd>{uptime.week}%</dd>
            </div>
            <div>
              <dt>30 jours</dt>
              <dd>{uptime.month}%</dd>
            </div>
          </dl>
        </div>

        {apiDocumentationLink && (
          <i>
            <br />
            Envie de réutiliser cette API ?{" "}
            {apiDocumentationLink && (
              <a
                aria-label={`Consulter la documentation de ${apiName} — nouvelle fenêtre`}
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
      <Section
        title="Suivi des performances de l'API indisponible"
        titleLevel="h4"
      >
        Notre service de suivi des performances est actuellement hors-ligne.
        Nous sommes désolés pour ce dérangement.
      </Section>
    )}
  </>
);

export default ApiMonitoring;
