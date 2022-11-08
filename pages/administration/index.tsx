import React from 'react';

import { GetStaticProps } from 'next';
import Page from '../../layouts';

import {
  administrationsMetaData,
  IAdministrationMetaData,
} from '../../models/administrations';
import AdministrationDescription from '../../components/administrations/administration-description';
import TextWrapper from '../../components-ui/text-wrapper';

const StatusPage: React.FC<{
  allAdministrations: IAdministrationMetaData[];
}> = ({ allAdministrations }) => (
  <Page
    small={true}
    title="Administrations partenaires de l'Annuaire des Entreprises"
  >
    <TextWrapper>
      <h1>Administrations partenaires</h1>
      <p>
        L’Annuaire des Entreprises utilise les données de différentes
        administrations en charge des données des personnes morales :
      </p>
      {allAdministrations.map(({ slug }) => (
        <AdministrationDescription slug={slug} key={slug} />
      ))}
    </TextWrapper>
  </Page>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { allAdministrations: Object.values(administrationsMetaData) },
  };
};

export default StatusPage;
