import React from 'react';
import { IMonitoring, IRatio } from '../../models/monitoring';
import InformationTooltip from '../information-tooltip';
import { Section } from '../section';

const getUptimeColor = (ratio: IRatio) => {
  if (!ratio.isActive) {
    return '#ddd';
  }
  const uptimeNum = parseFloat(ratio.ratio);

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
  if (!ratio.isActive) {
    return 'Aucune donnée sur cette période.';
  }
  const uptimeNum = parseFloat(ratio.ratio);
  if (uptimeNum >= 99.99) {
    return 'service en état de fonctionnement';
  } else if (uptimeNum >= 99) {
    return `${ratio.ratio}% : service faiblement perturbé`;
  } else if (uptimeNum >= 95) {
    return `${ratio.ratio}% : service très perturbé`; // Orange
  }
  return `${ratio.ratio}% : service extrêmement perturbé`;
};

const getHideClasses = (index: number) => {
  if (index > 70) {
    return '';
  } else if (index > 50) {
    return 'hide-mobile';
  } else {
    return 'hide-mobile hide-tablet';
  }
};

const Metric: React.FC<{
  series: IRatio[];
}> = ({ series }) => (
  <div className="series-wrapper">
    <div className="uptime-chart">
      {series.map((serie, index) => (
        <div className={`serie ${getHideClasses(index)}`} key={index}>
          <InformationTooltip
            orientation={index < 76 ? 'left' : 'right'}
            width={170}
            inlineBlock={false}
            label={
              <>
                <b>{serie.date}</b>
                <br />
                {getUptimeLabel(serie)}
              </>
            }
          >
            <div
              className="serie-rectangle"
              style={{
                backgroundColor: getUptimeColor(serie),
              }}
            ></div>
          </InformationTooltip>
        </div>
      ))}
    </div>
    <style jsx>{`
      .series-wrapper {
        display: flex;
        flex-direction: row;
      }
      .uptime-chart {
        flex-grow: 1;
        display: flex;
        margin: 0;
      }
      .uptime-chart > div {
        flex-grow: 1;
      }

      .serie {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .serie-rectangle {
        border-radius: 6px;
        height: 40px;
        margin: 3px 0;
        transition: 100ms opacity ease-in-out;
        border: 2px solid #fff;
      }
      .serie-rectangle:hover {
        margin: 0;
        opacity: 0.6;
        height: 46px;
      }

      @media only screen and (min-width: 550px) and (max-width: 700px) {
        .hide-tablet {
          display: none;
        }
      }
      @media only screen and (min-width: 1px) and (max-width: 550px) {
        .hide-mobile {
          display: none;
        }
      }
    `}</style>
  </div>
);

const RobotTooltip = () => (
  <>
    <InformationTooltip
      orientation="right"
      label="Ces données sont obtenues via un robot qui interroge la source de données toutes les 5 minutes"
    >
      <span className="fr-fi-information-line"></span>
    </InformationTooltip>
    <style jsx>{`
      span.fr-fi-information-line:before {
        font-size: 1rem !important;
      }
    `}</style>
  </>
);

const AdministrationApiMonitoring: React.FC<IMonitoring> = ({
  isOnline,
  series,
  uptime,
}) => (
  <Section
    title={`Disponibilité : l’API est actuellement ${
      isOnline ? 'en ligne ✅' : 'hors-ligne 🛑'
    }`}
  >
    {isOnline ? (
      <p>
        L’API fonctionne normalement, vous ne devriez pas rencontrer de problème
        en accèdant aux données.
      </p>
    ) : (
      <p>
        L’API est actuellement hors-service et l’accès aux données est fortement
        perturbé, voir impossible.
      </p>
    )}
    <div className="metrics-title">
      <h3>
        Historique de disponibilité <RobotTooltip />
      </h3>
      <br />
      <Metric series={series} />
      <h3>Statistiques moyennes</h3>
      <br />
      <div className="mean-stats">
        <div>
          <b>24h</b>
          <span>{uptime.day}%</span>
        </div>
        <div>
          <b>7 jours</b>
          <span>{uptime.week}%</span>
        </div>
        <div>
          <b>30 jours</b>
          <span>{uptime.month}%</span>
        </div>
        <div>
          <b>3 mois</b>
          <span>{uptime.trimester}%</span>
        </div>
      </div>
    </div>

    <style jsx>{`
      .metrics-title {
        display: block;
        margin-bottom: 10px;
      }
      .metrics-title h3 {
        margin-bottom: 0;
      }
      .mean-stats {
        display: flex;
        justify-content: space-between;
      }
      .mean-stats > div {
        width: 24%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .mean-stats > div b {
        font-size: 1.1rem;
        line-height: 2.2rem;
      }
      .mean-stats > div:not(:last-of-type) {
        border-right: 2px solid #dfdff1;
      }
    `}</style>
  </Section>
);
export default AdministrationApiMonitoring;
