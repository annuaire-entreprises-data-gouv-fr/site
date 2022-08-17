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
import AdministrationApiMonitoring from '../../components/administration-api-monitoring';
import { HttpNotFound } from '../../clients/exceptions';

interface IProps extends IAdministrationMetaData {
  monitorings: (IMonitoring & IAPIMonitorMetaData)[];
}

const AdministrationPage: React.FC<IProps> = ({
  long,
  slug,
  short,
  description,
  contact,
  monitorings,
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
      <p>{description}</p>
      <h2>Corriger une erreur dans les données</h2>
      <p>
        Vous avez repéré une erreur ? Les données de cette administration ne
        sont pas à jour ?{' '}
        <a href={contact}>
          👉 Contactez l’administration pour demander une correction
        </a>
        .
      </p>
      {monitorings.length > 0 && (
        <>
          <h2>API utilisée par l’Annuaire des Entreprises</h2>
          {monitorings.map((monitoring) => (
            <Fragment key={monitoring.id}>
              <h3>{monitoring.apiName}</h3>
              <AdministrationApiMonitoring
                {...monitoring}
                short={short}
                slug={slug}
              />
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
      return redirectPageNotFound(
        `Administration ${slug} page does not exist`,
        {
          page: context.req.url,
        }
      );
    } else {
      return redirectServerError(e);
    }
  }
};

export default AdministrationPage;
