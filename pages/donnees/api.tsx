import { GetStaticProps } from 'next';
import React from 'react';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import ApiMonitoring from '#components/api-monitoring';
import Meta from '#components/meta';
import { administrationsMetaData } from '#models/administrations';
import { IAdministrationsMetaData } from '#models/administrations/types';
import {
  IMonitoringWithMetaData,
  getMonitorsByAdministration,
} from '#models/monitoring';
import { IPropsWithMetadata } from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  monitors: {
    [key: string]: IMonitoringWithMetaData[];
  };
  administrationsMetaData: IAdministrationsMetaData;
}

const StatusPage: NextPageWithLayout<IProps> = ({
  monitors,
  administrationsMetaData,
}) => (
  <>
    <Meta
      title="Statut des API utilisées par l'Annuaire des Entreprises"
      noIndex
    />
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <script>
            // reload page every minute
            window.setTimeout(function() {window.location.reload()}, 60*1000)
          </script>
  `,
      }}
    />
    <div className="content-container">
      <h1>Statut des API utilisées</h1>
      <p>
        L’Annuaire des Entreprises utilise les données de différentes
        administrations en lien avec les entreprises, les associations et les
        services publics. Les <a href="/donnees/sources">données</a> sont
        accessibles par le biais de téléservices appelés API. Ces API sont{' '}
        <b>ouvertes à tous</b>.
      </p>
      <p>
        Cette page détaille la liste des API utilisées et leur disponibilité en
        temps réel&nbsp;:
      </p>
      <b>Sommaire</b>
      <ol>
        {Object.keys(monitors).map((administrationEnum) =>
          monitors[administrationEnum].map((monitor) => (
            <li key={monitor.apiSlug}>
              <a href={`#${monitor.apiSlug}`}>{monitor.apiName}</a>
            </li>
          ))
        )}
      </ol>
      {Object.keys(monitors).map((administrationEnum) => (
        <>
          <h2 id={administrationsMetaData[administrationEnum]?.slug}>
            {administrationsMetaData[administrationEnum]?.long}
          </h2>
          {monitors[administrationEnum].map((monitor) => (
            <React.Fragment key={monitor.apiName}>
              <h3 id={monitor.apiSlug}>{monitor.apiName}</h3>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <ApiMonitoring {...monitor} />
            </React.Fragment>
          ))}

          <HorizontalSeparator />
        </>
      ))}
    </div>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const monitors = await getMonitorsByAdministration();
  return {
    props: { monitors, administrationsMetaData: administrationsMetaData },
    revalidate: 30, // revalidate every 30 seconds
  };
};

export default StatusPage;
