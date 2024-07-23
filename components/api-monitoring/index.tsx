import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { Section } from '#components/section';
import constants from '#models/constants';
import { IMonitoringWithMetaData, IRatio } from '#models/monitoring';
import styles from './styles.module.css';

const getUptimeColor = (ratio: IRatio) => {
  const uptimeNum = ratio.ratioNumber;

  if (uptimeNum >= 99.99) {
    return '#3bd671';
  } else if (uptimeNum >= 99) {
    return '#c2e34b';
  } else if (uptimeNum >= 95) {
    return '#f29030'; // Orange
  }
  return '#df484a';
};

const getUptimeLabel = (ratio: IRatio) => {
  const uptimeNum = ratio.ratioNumber;
  const formattedRation = ratio.ratioNumber.toFixed(2);
  if (uptimeNum >= 99.99) {
    return 'service en état de fonctionnement';
  } else if (uptimeNum >= 99) {
    return `${formattedRation}% : service faiblement perturbé`;
  } else if (uptimeNum >= 95) {
    return `${formattedRation}% : service très perturbé`; // Orange
  }
  return `${formattedRation}% : service extrêmement perturbé`;
};

const getHideClasses = (index: number) => {
  if (index > 70) {
    return '';
  } else if (index > 50) {
    return styles['hide-mobile'];
  } else {
    return `${styles['hide-mobile']} ${styles['hide-tablet']}`;
  }
};

const Metric: React.FC<{
  series: IRatio[];
}> = ({ series }) => (
  <div className={styles['series-wrapper']}>
    <div className={styles['uptime-chart']}>
      {series.map((serie, index) => (
        <div
          className={`${getHideClasses(index)} ${styles.series}`}
          key={index}
        >
          <InformationTooltip
            horizontalOrientation={index < 76 ? 'left' : 'right'}
            width={170}
            tabIndex={0}
            ariaRelation="labelledby"
            inlineBlock={false}
            label={
              <>
                <strong>{serie.date}</strong>
                <br />
                {getUptimeLabel(serie)}
              </>
            }
          >
            <div
              className={styles['serie-rectangle']}
              style={{
                backgroundColor: getUptimeColor(serie),
              }}
            ></div>
          </InformationTooltip>
        </div>
      ))}
    </div>
  </div>
);

const RobotTooltip = () => (
  <InformationTooltip
    horizontalOrientation="right"
    tabIndex={0}
    ariaRelation="labelledby"
    label="Ces données sont obtenues via un robot qui interroge la source de données toutes les minutes"
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
    {!series ? (
      <Section title="Suivi des performances de l'API indisponible">
        Notre service de suivi des performances est actuellement hors-ligne.
        Nous sommes désolés pour ce dérangement.
      </Section>
    ) : (
      <Section
        title={`Disponibilité : l’API est actuellement ${
          isOnline ? 'en ligne ✅' : 'hors-ligne 🛑'
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
        <div className={styles['metrics-title']}>
          <h3>
            Historique de disponibilité <RobotTooltip />
          </h3>
          <Metric series={series} />
          <h3>Statistiques moyennes</h3>
          <div className={styles['mean-stats']}>
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
            Envie de réutiliser cette API ?{' '}
            {apiDocumentationLink && (
              <a
                href={apiDocumentationLink}
                target="_blank"
                rel="noreferrer noopener"
              >
                Consulter la documentation
              </a>
            )}
          </i>
        )}
      </Section>
    )}
  </>
);

export default ApiMonitoring;
