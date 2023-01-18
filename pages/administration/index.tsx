import { GetStaticProps } from 'next';
import React from 'react';
import AdministrationDescription from '#components/administrations/administration-description';
import Meta from '#components/meta';
import TextWrapper from '#components-ui/text-wrapper';
import {
  administrationsMetaData,
  IAdministrationMetaData,
} from '#models/administrations';
import { NextPageWithLayout } from 'pages/_app';

const StatusPage: NextPageWithLayout<{
  allAdministrations: IAdministrationMetaData[];
}> = ({ allAdministrations }) => (
  <>
    <Meta title="Administrations partenaires de l'Annuaire des Entreprises" />
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
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { allAdministrations: Object.values(administrationsMetaData) },
  };
};

export default StatusPage;
