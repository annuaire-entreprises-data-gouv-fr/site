import { Metadata } from 'next';
import React from 'react';
import TextWrapper from '#components-ui/text-wrapper';
import AdministrationDescription from '#components/administrations/administration-description';
import { administrationsMetaData } from '#models/administrations';
import { IAdministrationMetaData } from '#models/administrations/types';
import { NextPageWithLayout } from 'pages/_app';

export const metadata: Metadata = {
  title: 'Liste des administrations partenaires de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/administration',
  },
};

const StatusPage: NextPageWithLayout<{
  allAdministrations: IAdministrationMetaData[];
}> = () => (
  <TextWrapper>
    <h1>Administrations partenaires</h1>
    <p>
      L’Annuaire des Entreprises est conçu en partenariat avec{' '}
      {Object.values(administrationsMetaData).length} administrations
      différentes, qui nous transmettent les données qu’elles possèdent sur les
      entreprises, les associations ou les services publics&nbsp;:
    </p>
    {Object.values(administrationsMetaData).map(({ slug }) => (
      <React.Fragment key={slug}>
        <AdministrationDescription slug={slug} />
      </React.Fragment>
    ))}
  </TextWrapper>
);

export default StatusPage;
