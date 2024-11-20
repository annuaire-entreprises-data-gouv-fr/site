import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import ApiMonitoring from '#components/api-monitoring';
import { administrationsMetaData } from '#models/administrations';
import { IAdministrationsMetaData } from '#models/administrations/types';
import {
  IMonitoringWithMetaData,
  getMonitorsByAdministration,
} from '#models/monitoring';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import React from 'react';

interface IProps {
  monitors: {
    [key: string]: IMonitoringWithMetaData[];
  };
  administrationsMetaData: IAdministrationsMetaData;
}

async function fetchStatusData(): Promise<IProps> {
  const monitors = await getMonitorsByAdministration();
  return {
    monitors,
    administrationsMetaData,
  };
}

export const metadata: Metadata = {
  title: 'Statut des API utilisées par l’Annuaire des Entreprises',
  robots: 'noindex, nofollow',
};

export default async function StatusPage() {
  const { monitors, administrationsMetaData } = await unstable_cache(
    () => fetchStatusData(),
    ['monitoring'],
    {
      revalidate: 45,
    }
  )();

  return (
    <>
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
          <strong>ouvertes à tous</strong>.
        </p>
        <p>
          Cette page détaille la liste des API utilisées et leur disponibilité
          en temps réel&nbsp;:
        </p>
        <strong>Sommaire</strong>
        <ol>
          {Object.keys(monitors).map((administrationEnum) =>
            monitors[administrationEnum].map((monitor) => (
              <li key={monitor.apiSlug}>
                <span
                  style={{ color: monitor.isOnline ? '#3bd671' : '#f29030' }}
                >
                  ●
                </span>{' '}
                <a href={`#${monitor.apiSlug}`}>{monitor.apiName}</a>
              </li>
            ))
          )}
        </ol>
        {Object.keys(monitors).map((administrationEnum) => (
          <React.Fragment key={administrationEnum}>
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
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
