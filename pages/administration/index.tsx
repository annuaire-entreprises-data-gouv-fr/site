import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';

import { redirectServerError } from '../../utils/redirects';
import {
  getAllMonitorsWithMetaData,
  IMonitoring,
} from '../../models/monitoring';
import AdministrationApiMonitoring from '../../components/administration-api-monitoring';
import { escapeTerm, trimWhitespace } from '../../utils/helpers/formatting';

export interface IMonitoringWithName extends IMonitoring {
  short: string;
  apiGouvLink?: string;
  dataGouvLink?: string;
  slug: string;
  apiName: string;
  data?: string[];
}

interface IProps {
  monitors: IMonitoringWithName[];
}

const simplify = (str: string) => escapeTerm(trimWhitespace(str));

const StatusPage: React.FC<IProps> = ({ monitors }) => (
  <Page
    small={true}
    title="Statut des API partenaires de l'Annuaire des Entreprises"
    canonical={`https://annuaire-entreprises.data.gouv.fr/administration}`}
  >
    <div className="content-container">
      <h1>Sources de données & statut des API</h1>
      <p>
        L’Annuaire des Entreprises utilise les données de différentes
        administrations en lien avec les personnes morales. Les données sont
        accessibles par le biais d’API ouvertes. Cette page détaille l’origine
        des données et la disponibilité de chaque API&nbsp;:
      </p>
      <b>Sommaire</b>
      <ul>
        {monitors.map((monitor) => (
          <li key={`link-${simplify(monitor.apiName)}`}>
            <a href={`#${simplify(monitor.apiName)}`}>{monitor.apiName}</a>
          </li>
        ))}
      </ul>
      {monitors.map((monitor) => (
        <React.Fragment key={monitor.apiName}>
          <h2 id={simplify(monitor.apiName)}>{monitor.apiName}</h2>
          <AdministrationApiMonitoring {...monitor} />
        </React.Fragment>
      ))}
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 50px;
      }
      i {
        font-size: 0.9rem;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  try {
    const monitors = await getAllMonitorsWithMetaData();
    return {
      props: { monitors },
    };
  } catch (e: any) {
    return redirectServerError(e);
  }
};

export default StatusPage;
