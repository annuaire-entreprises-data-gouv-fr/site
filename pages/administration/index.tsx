import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';

import { administrationsMetaData } from '../../models/administration';
import { redirectServerError } from '../../utils/redirects';
import getMonitoring, { IMonitoring } from '../../models/monitoring';
import AdministrationApiMonitoring from '../../components/administration-api-monitoring';
import { Section } from '../../components/section';

interface IMonitoringWithName extends IMonitoring {
  short: string;
  apiGouvLink?: string;
  slug: string;
  apiName: string;
}

interface IProps {
  monitors: IMonitoringWithName[];
}

const StatusPage: React.FC<IProps> = ({ monitors }) => (
  <Page
    small={true}
    title="Statut des API partenaires de l'Annuaire des Entreprises"
    canonical={`https://annuaire-entreprises.data.gouv.fr/administration}`}
  >
    <div className="content-container">
      <h1>Statut des API partenaires</h1>
      {monitors.map((monitor) => (
        <div key={monitor.short}>
          <h2>
            {monitor.apiName} (
            <a href={`/administration/${monitor.slug}`}>{monitor.short}</a>)
          </h2>
          {monitor.series ? (
            <AdministrationApiMonitoring {...monitor} />
          ) : (
            <Section title="Suivi des performances de l'API indisponible">
              Notre service de suivi des performances est actuellement
              hors-ligne. Nous sommes désolés pour ce dérangement.
            </Section>
          )}
          {monitor.apiGouvLink && (
            <i>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={monitor.apiGouvLink}
              >
                → Pour en savoir plus, consulter la page de cette API sur
                api.gouv.fr
              </a>
            </i>
          )}
        </div>
      ))}
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 50px;
      }
      .content-container > div {
        margin-bottom: 60px;
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
    const monitors = await Promise.all(
      Object.values(administrationsMetaData)
        .filter((admin) => !!admin.monitoringSlug)
        .map(
          (admin) =>
            new Promise(async (resolve) =>
              resolve({
                ...(await getMonitoring(admin.monitoringSlug)),
                short: admin.short,
                apiGouvLink: admin.apiGouvLink || null,
                slug: admin.slug,
                apiName: admin.apiName,
              })
            )
        )
    );

    return { props: { monitors } };
  } catch (e) {
    redirectServerError(context.res, e);

    return { props: {} };
  }
};

export default StatusPage;
