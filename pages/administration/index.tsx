import { GetStaticProps } from 'next';
import React from 'react';
import TextWrapper from '#components-ui/text-wrapper';
import AdministrationDescription from '#components/administrations/administration-description';
import Meta from '#components/meta';
import { administrationsMetaData } from '#models/administrations';
import { IAdministrationMetaData } from '#models/administrations/types';
import { NextPageWithLayout } from 'pages/_app';

const StatusPage: NextPageWithLayout<{
  allAdministrations: IAdministrationMetaData[];
}> = ({ allAdministrations }) => (
  <>
    <Meta
      title="Liste des administrations partenaires de l'Annuaire des Entreprises"
      canonical="https://annuaire-entreprises.data.gouv.fr/administration"
    />
    <TextWrapper>
      <h1>Administrations partenaires</h1>
      <p>
        L’Annuaire des Entreprises est conçu en partenariat avec{' '}
        {allAdministrations.length} administrations différentes, qui nous
        transmettent les données qu’elles possèdent sur les entreprises, les
        associations ou les services publics&nbsp;:
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
