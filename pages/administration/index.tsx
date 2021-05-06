import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';

import { administrationsMetaData } from '../../models/administration';
import { redirectServerError } from '../../utils/redirects';
import getMonitoring, { IMonitoring } from '../../models/monitoring';
import AdministrationApiMonitoring from '../../components/administration-api-monitoring';

interface IMonitoringWithName extends IMonitoring {
  long: string;
  apiGouvLink?: string;
  slug: string;
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
        <div key={monitor.long}>
          <h2>
            API <a href={`/administration/${monitor.slug}`}>{monitor.long}</a>
          </h2>
          <AdministrationApiMonitoring {...monitor} />
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
                long: admin.long,
                apiGouvLink: admin.apiGouvLink || null,
                slug: admin.slug,
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
