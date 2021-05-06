import React from 'react';
import { IMonitoring, IRatio } from '../../models/monitoring';
import InformationTooltip from '../information-tooltip';
import { Section } from '../section';

export const getUptimeColor = (ratio: IRatio) => {
  if (ratio.label === 'black') {
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
export const getUptimeLabel = (ratio: IRatio) => {
  if (ratio.label === 'black') {
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

const Metric: React.FC<{
  series: IRatio[];
}> = ({ series }) => (
  <div className="wrapper">
    <div className="uptime-chart">
      {series.map((serie, index) => (
        <div className={`serie ${index < 59 ? 'hide-mobile' : ''}`} key={index}>
          <InformationTooltip
            label={
              <>
                <b>{serie.date}</b>
                <br />
                {getUptimeLabel(serie)}
              </>
            }
          >
            <div
              className="serie"
              style={{
                backgroundColor: getUptimeColor(serie),
              }}
            ></div>
          </InformationTooltip>
        </div>
      ))}
    </div>
    <style jsx>{`
      .wrapper {
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
        height: 40px;
        width: 100%;
        margin: 0 1.5px;
        border-radius: 4px;
      }

      @media only screen and (min-width: 1px) and (max-width: 600px) {
        .hide-mobile {
          display: none;
        }
        .wrapper {
          flex-direction: column;
        }
        .uptime-chart {
          margin-top: 10px;
        }
      }
    `}</style>
  </div>
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
      <h3>Historique des trois derniers mois</h3>
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
