import React from 'react';

import { GetStaticProps } from 'next';
import Page from '../../layouts';

import {
  administrationsMetaData,
  IAdministrationMetaData,
} from '../../models/administrations';
import AdministrationDescription from '../../components/administrations/administration-description';

const StatusPage: React.FC<{
  allAdministrations: IAdministrationMetaData[];
}> = ({ allAdministrations }) => (
  <Page
    small={true}
    title="Statut des API partenaires de l'Annuaire des Entreprises"
    canonical={`https://annuaire-entreprises.data.gouv.fr/sources-de-donnees}`}
  >
    <div className="content-container">
      <h1>Administrations partenaires</h1>
      <p>
        L’Annuaire des Entreprises utilise les données de différentes
        administrations en charge des données des personnes morales :
      </p>
      {allAdministrations.map(({ slug }) => (
        <AdministrationDescription slug={slug} key={slug} />
      ))}
    </div>
  </Page>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { allAdministrations: Object.values(administrationsMetaData) },
  };
};

export default StatusPage;
