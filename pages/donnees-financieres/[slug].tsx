import { GetServerSideProps } from 'next';
import React from 'react';
import { FinancesAssociationSection } from '#components/finances/association';
import { FinancesSocieteSection } from '#components/finances/societe';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IFinances, getFinancesFromSlug } from '#models/donnees-financieres';
import { isAssociation, isServicePublic } from '#models/index';
import { getCompanyPageTitle } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, IFinances {}

const FinancePage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  financesSociete,
  financesAssociation,
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
        {isAssociation(uniteLegale) ? (
          <>
            {/* <ComptesAssociationSection
              association={uniteLegale}
              comptesAssociation={[]}
            /> */}
            <FinancesAssociationSection
              financesAssociation={financesAssociation}
              financesSociete={financesSociete}
              uniteLegale={uniteLegale}
            />
          </>
        ) : isServicePublic(uniteLegale) ? null : (
          <FinancesSocieteSection
            financesSociete={financesSociete}
            uniteLegale={uniteLegale}
          />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const { uniteLegale, financesSociete, financesAssociation } =
      await getFinancesFromSlug(slug);

    return {
      props: {
        uniteLegale,
        financesSociete,
        financesAssociation,
        metadata: { useReact: true },
      },
    };
  }
);

export default FinancePage;
