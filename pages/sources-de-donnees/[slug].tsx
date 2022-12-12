import { GetServerSideProps } from 'next';
import React, { Fragment } from 'react';
import { HttpNotFound } from '#clients/exceptions';
import ApiMonitoring from '#components/api-monitoring';
import {
  administrationsMetaData,
  IAdministrationMetaData,
  IAPIMonitorMetaData,
} from '#models/administrations';
import { getMonitorsWithMetaData, IMonitoring } from '#models/monitoring';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IAdministrationMetaData, IPropsWithMetadata {
  monitorings: (IMonitoring & IAPIMonitorMetaData)[];
}

const SourcesDeDonneesPage: React.FC<IProps> = ({
  long,
  slug,
  short,
  description,
  monitorings,
  metadata,
}) => (
  <Page
    small={true}
    title={`Statut des API : ${long}`}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    <div className="content-container">
      <br />
      <a href="/sources-de-donnees">← Toutes les sources de données</a>
      <h1>Statut des API : {long}</h1>
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
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    //@ts-ignore
    const { slug } = extractParamsFromContext(context);

    const administration = Object.values(administrationsMetaData).find(
      //@ts-ignore
      (admin) => admin.slug === slug
    );
    if (administration === undefined) {
      throw new HttpNotFound(`Source de donnée ${slug} page does not exist`);
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
  }
);

export default SourcesDeDonneesPage;
