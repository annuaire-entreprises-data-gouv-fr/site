import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';

import {
  getAllMonitorsWithMetaData,
  IMonitoring,
} from '../../models/monitoring';
import ApiMonitoring from '../../components/api-monitoring';
import { escapeTerm, trimWhitespace } from '../../utils/helpers/formatting';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import TextWrapper from '../../components-ui/text-wrapper';

export interface IMonitoringWithName extends IMonitoring {
  short: string;
  apiGouvLink?: string;
  dataGouvLink?: string;
  slug: string;
  apiName: string;
  data?: string[];
}

interface IProps extends IPropsWithMetadata {
  monitors: IMonitoringWithName[];
}

const simplify = (str: string) => escapeTerm(trimWhitespace(str));

const StatusPage: React.FC<IProps> = ({ monitors, metadata }) => (
  <Page
    small={true}
    title="Statut des API partenaires de l'Annuaire des Entreprises"
    canonical={`https://annuaire-entreprises.data.gouv.fr/sources-de-donnees}`}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    <TextWrapper>
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
          <h2 id={simplify(monitor.apiName)}>
            {monitor.apiName} (
            <a href={`/sources-de-donnees/${monitor.slug}`}>{monitor.short}</a>)
          </h2>
          <ApiMonitoring {...monitor} />
          <div>
            {monitor.short} :{' '}
            <a href={`/sources-de-donnees/${monitor.slug}`}>
              voir toutes les API de cette adminstration
            </a>
            .
          </div>
        </React.Fragment>
      ))}
    </TextWrapper>
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async () => {
    const monitors = await getAllMonitorsWithMetaData();
    return {
      props: { monitors },
    };
  }
);

export default StatusPage;
