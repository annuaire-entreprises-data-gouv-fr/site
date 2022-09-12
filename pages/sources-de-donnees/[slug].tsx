import React, { Fragment } from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';

import {
  administrationsMetaData,
  EAdministration,
  IAdministrationMetaData,
  IAPIMonitorMetaData,
} from '../../models/administration';
import {
  redirectPageNotFound,
  redirectServerError,
} from '../../utils/redirects';
import { getMonitorsWithMetaData, IMonitoring } from '../../models/monitoring';
import ApiMonitoring from '../../components/api-monitoring';
import { HttpNotFound } from '../../clients/exceptions';

interface IProps extends IAdministrationMetaData {
  monitorings: (IMonitoring & IAPIMonitorMetaData)[];
}

const SourcesDeDonneesPage: React.FC<IProps> = ({
  long,
  slug,
  short,
  description,
  monitorings,
}) => (
  <Page
    small={true}
    title={long}
    canonical={`https://annuaire-entreprises.data.gouv.fr/sources-de-donnees/${slug}`}
  >
    <div className="content-container">
      <br />
      <a href="/sources-de-donnees">← Toutes les sources de données</a>
      <h1>{long}</h1>
      <p>{description}</p>
      {monitorings.length > 0 && (
        <>
          <h2>
            API de cette administration utilisée
            {monitorings.length > 1 ? 's' : ''} par l’Annuaire des Entreprises
          </h2>
          {monitorings.map((monitoring) => (
            <Fragment key={monitoring.id}>
              <h3>{monitoring.apiName}</h3>
              <ApiMonitoring {...monitoring} short={short} slug={slug} />
            </Fragment>
          ))}
        </>
      )}
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 40px;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug as EAdministration;

  try {
    const administration = Object.values(administrationsMetaData).find(
      //@ts-ignore
      (admin) => admin.slug === slug
    );
    if (administration === undefined) {
      throw new HttpNotFound(`${slug}`);
    }

    const monitorings = await getMonitorsWithMetaData(
      administration.apiMonitors || []
    );
    return {
      props: {
        ...administration,
        monitorings,
      },
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return redirectPageNotFound(
        `Administration ${slug} page does not exist`,
        {
          page: context.req.url,
        }
      );
    } else {
      return redirectServerError(e.toString());
    }
  }
};

export default SourcesDeDonneesPage;
