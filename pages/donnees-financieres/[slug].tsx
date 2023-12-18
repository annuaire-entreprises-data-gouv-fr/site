import { GetServerSideProps } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import DocumentBilansSection from '#components/espace-agent-components/documents/bilans';
import { FinancesSocieteSection } from '#components/finances-section/societe';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IUniteLegale, isAssociation, isServicePublic } from '#models/index';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { getCompanyPageTitle } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isAgent } from '#utils/session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
}

const FinancePage: NextPageWithLayout<IProps> = ({
  uniteLegale,
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
        {/* We use to have finances for association but data disappeared from open data API. Code still exists in <FinancesAssociationSection /> */}
        {isAssociation(uniteLegale) || isServicePublic(uniteLegale) ? null : (
          <>
            <FinancesSocieteSection uniteLegale={uniteLegale} />
            {isAgent(session) && (
              <>
                <HorizontalSeparator />
                <DocumentBilansSection uniteLegale={uniteLegale} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot } = extractParamsFromContext(context);

    const uniteLegale = await getUniteLegaleFromSlug(slug, { isBot });

    return {
      props: {
        uniteLegale,
        metadata: { useReact: true },
      },
    };
  }
);

export default FinancePage;
