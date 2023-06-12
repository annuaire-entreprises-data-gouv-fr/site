import { GetServerSideProps } from 'next';
import React from 'react';
import { BilansFinanciersSection } from '#components/bilans-financiers-section';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import {
  getDonneesFinancieresFromSlug,
  IDonneesFinancieres,
} from '#models/donnees-financieres';
import { getCompanyPageTitle } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, IDonneesFinancieres {}

const FinancePage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  bilansFinanciers,
  metadata: { session },
}) => {
  return (
    <>
      <Meta
        title={`Données financières - ${getCompanyPageTitle(
          uniteLegale,
          session
        )}`}
        canonical={`https://annuaire-entreprises.data.gouv.fr/donnees-financieres/${uniteLegale.siren}`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          ficheType={FICHE.FINANCES}
          uniteLegale={uniteLegale}
          session={session}
        />
        <BilansFinanciersSection
          bilansFinanciers={bilansFinanciers}
          uniteLegale={uniteLegale}
        />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const { uniteLegale, bilansFinanciers } =
      await getDonneesFinancieresFromSlug(slug);

    return {
      props: {
        uniteLegale,
        bilansFinanciers,
        metadata: { useReact: true },
      },
    };
  }
);

export default FinancePage;
