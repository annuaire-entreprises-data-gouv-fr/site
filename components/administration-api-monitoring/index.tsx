import React from 'react';
import { IMonitoring } from '../../models/monitoring';
import InformationTooltip from '../information-tooltip';
import { Section } from '../section';

export const getUptimeColor = (uptime: number) => {
  if (uptime >= 98) {
    return '#19ae4d';
  } else if (uptime >= 90) {
    return '#ffcb00'; // Orange
  }
  return '#d00';
};
export const getUptimeLabel = (uptime: number) => {
  if (uptime >= 98) {
    return 'haute disponibilité';
  } else if (uptime >= 90) {
    return 'disponibilité médiocre'; // Orange
  }
  return 'très mauvaise disponibilité';
};

export const getResponseTimeColor = (responseTime: number) => {
  if (responseTime < 300) {
    return '#2fcc66';
  } else if (responseTime < 600) {
    return '#ffcb00'; // Orange
  }
  return '#d00';
};

export const getResponseTimeLabel = (responseTime: number) => {
  if (responseTime < 300) {
    return 'rapidement 🐎';
  } else if (responseTime < 600) {
    return 'lentement 🐢'; // Orange
  }
  return 'très lentement 🐌';
};

const Metric: React.FC<{
  uptime: number;
  responseTime: number;
  series?: number[];
}> = ({ uptime, responseTime, series }) => (
  <div className="wrapper">
    <div className="metrics">
      <div>
        Disponiblité moyenne :{' '}
        <InformationTooltip
          label={`Ce service fait preuve d’une ${getUptimeLabel(uptime)}`}
        >
          <b style={{ color: getUptimeColor(uptime) }}>{uptime} %</b>
        </InformationTooltip>
      </div>
      <div>
        Temps moyen de réponse :{' '}
        <InformationTooltip
          label={`Ce service répond ${getResponseTimeLabel(responseTime)}`}
        >
          <b style={{ color: getResponseTimeColor(responseTime) }}>
            {responseTime} ms
          </b>
        </InformationTooltip>
      </div>
    </div>
    <div className="uptime-chart">
      {series ? (
        series.map((serie, index) => (
          <div
            className="serie"
            key={index}
            style={{ backgroundColor: getUptimeColor(serie) }}
          ></div>
        ))
      ) : (
        <div className="serie layout-center">
          <i>Pas de graphe sur cette période</i>
        </div>
      )}
    </div>
    <style jsx>{`
      .wrapper {
        display: flex;
        flex-direction: row;
      }
      .metrics {
        flex-shrink: 0;
        padding-right: 30px;
        font-size: 0.9rem;
      }
      i {
        font-size: 0.9rem;
      }
      .uptime-chart {
        flex-grow: 1;
        display: flex;
        background-color: #f3f3f3;
        margin: 0;
      }
      .uptime-chart > div {
        flex-grow: 1;
      }

      .serie {
        height: 40px;
        border-left: 0.5px solid #fff;
      }

      @media only screen and (min-width: 1px) and (max-width: 600px) {
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
  responseTime,
  uptime,
  series,
}) => (
  <Section
    title={`Disponiblité : l’API est actuellement ${
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
      <h3>Historique</h3>
      <div className="tabbed">
        <input type="radio" id="tab1" name="css-tabs2" defaultChecked />
        <input type="radio" id="tab2" name="css-tabs2" />
        <input type="radio" id="tab3" name="css-tabs2" />
        <input type="radio" id="tab4" name="css-tabs2" />
        <ul className="tabs">
          <li className="tab">
            <label htmlFor="tab1">aujourd'hui</label>
          </li>
          <li className="tab">
            <label htmlFor="tab2">7 jours</label>
          </li>
          <li className="tab">
            <label htmlFor="tab3">30 jours</label>
          </li>
          <li className="tab">
            <label htmlFor="tab4">1 an</label>
          </li>
        </ul>
        <div className="tab-content layout-center">
          <Metric uptime={uptime.day} responseTime={responseTime.day} />
        </div>
        <div className="tab-content layout-center">
          <Metric
            uptime={uptime.week}
            responseTime={responseTime.week}
            series={series.week}
          />
        </div>
        <div className="tab-content layout-center">
          <Metric
            uptime={uptime.month}
            responseTime={responseTime.month}
            series={series.month}
          />
        </div>
        <div className="tab-content layout-center">
          <Metric
            uptime={uptime.year}
            responseTime={responseTime.year}
            series={series.year}
          />
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
      .tabbed {
        margin: 0;
        margin-top: -25px;
        padding-bottom: 16px;
      }

      .tabbed [type='radio'] {
        /* hiding the inputs */
        display: none;
      }

      .tabs {
        display: flex;
        align-items: stretch;
        justify-content: end;
        list-style: none;
        padding: 0;
        margin-top: 0;
      }
      .tab > label {
        display: block;
        font-size: 0.9rem;
        font-weight: bold;
        margin: 0 5px;
        color: #000091;
        cursor: pointer;
      }

      .tab:hover label {
        border-top-color: #333;
        text-decoration: underline;
        color: #333;
      }

      .tab-content {
        display: none;
        color: #777;
      }

      /* As we cannot replace the numbers with variables or calls to element properties, the number of this selector parts is our tab count limit */
      .tabbed
        [type='radio']:nth-of-type(1):checked
        ~ .tabs
        .tab:nth-of-type(1)
        label,
      .tabbed
        [type='radio']:nth-of-type(2):checked
        ~ .tabs
        .tab:nth-of-type(2)
        label,
      .tabbed
        [type='radio']:nth-of-type(3):checked
        ~ .tabs
        .tab:nth-of-type(3)
        label,
      .tabbed
        [type='radio']:nth-of-type(4):checked
        ~ .tabs
        .tab:nth-of-type(4)
        label {
        color: #222;
        text-decoration: underline;
      }

      .tabbed
        [type='radio']:nth-of-type(1):checked
        ~ .tab-content:nth-of-type(1),
      .tabbed
        [type='radio']:nth-of-type(2):checked
        ~ .tab-content:nth-of-type(2),
      .tabbed
        [type='radio']:nth-of-type(3):checked
        ~ .tab-content:nth-of-type(3),
      .tabbed
        [type='radio']:nth-of-type(4):checked
        ~ .tab-content:nth-of-type(4) {
        display: block;
      }
    `}</style>
  </Section>
);
export default AdministrationApiMonitoring;
