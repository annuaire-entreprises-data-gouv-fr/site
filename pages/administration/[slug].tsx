import React, { Fragment } from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ReactMarkdown from 'react-markdown';

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
import AdministrationApiMonitoring from '../../components/administration-api-monitoring';
import { HttpNotFound } from '../../clients/exceptions';
import { Section } from '../../components/section';

interface IProps extends IAdministrationMetaData {
  monitorings: (IMonitoring & IAPIMonitorMetaData)[];
}

const AdministrationPage: React.FC<IProps> = ({
  long,
  short,
  slug,
  description,
  monitorings,
  dataGouvLink,
}) => (
  <Page
    small={true}
    title={long}
    canonical={`https://annuaire-entreprises.data.gouv.fr/administration/${slug}`}
  >
    <div className="content-container">
      <br />
      <a href="/administration">← Toutes les administrations partenaires</a>
      <h1>{long}</h1>
      <ReactMarkdown children={description} />
      {(dataGouvLink || monitorings.length > 0) && (
        <h2 id="acces">Accéder aux données {short}</h2>
      )}
      {dataGouvLink && (
        <>
          <h3>En téléchargeant un jeu de données</h3>
          <p>
            Les données brutes sont téléchargeables, sous licence open-data.
            Pour y accéder, consultez{' '}
            <a href={dataGouvLink}>la page data.gouv.fr</a>.<br />
          </p>
        </>
      )}
      {monitorings.length > 0 && (
        <>
          <h2>En utilisant les API</h2>
          {monitorings.map((monitoring) => (
            <Fragment key={monitoring.id}>
              {monitoring.apiName && <h3>{monitoring.apiName}</h3>}
              {monitoring.apiGouvLink && (
                <p>
                  Les données sont accessibles par API. Pour y accéder,
                  consultez{' '}
                  <a href={monitoring.apiGouvLink}>la page api.gouv.fr</a>.
                </p>
              )}
              {monitoring && monitoring.series ? (
                <AdministrationApiMonitoring {...monitoring} />
              ) : (
                <Section title="Suivi des performances de l'API indisponible">
                  Notre service de suivi des performances est actuellement
                  hors-ligne. Nous sommes désolés pour ce dérangement.
                </Section>
              )}
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
      throw new HttpNotFound(404, `${slug}`);
    }

    const monitorings = await getMonitorsWithMetaData(
      administration.apiMonitors
    );
    return {
      props: {
        ...administration,
        monitorings,
      },
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      redirectPageNotFound(
        context.res,
        `Administration ${slug} page does not exist`,
        { page: context.req.url }
      );
    } else {
      redirectServerError(context.res, e);
    }
    return { props: {} };
  }
};

export default AdministrationPage;
