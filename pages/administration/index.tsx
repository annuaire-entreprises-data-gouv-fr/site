import { GetStaticProps } from 'next';
import React from 'react';
import TextWrapper from '#components-ui/text-wrapper';
import AdministrationDescription from '#components/administrations/administration-description';
import {
  administrationsMetaData,
  IAdministrationMetaData,
} from '#models/administrations';
import Page from '../../layouts';

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
