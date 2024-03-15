import { GetServerSideProps } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import ComptesBodacc from '#components/annonces-section/comptes/bodacc';
import { ComptesAssociationSection } from '#components/annonces-section/comptes/dca';
import DocumentBilansSection from '#components/espace-agent-components/documents/document-bilans';
import { FinancesSocieteSection } from '#components/finances-section/societe';
import Meta from '#components/meta/meta-client';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IUniteLegale, isAssociation } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { uniteLegalePageTitle } from '#utils/helpers';
import extractParamsPageRouter from '#utils/server-side-helper/page/extract-params';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-helper/page/post-server-side-props';
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
        title={`Données financières - ${uniteLegalePageTitle(
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
        {isAssociation(uniteLegale) ? null : (
          <>
            <FinancesSocieteSection uniteLegale={uniteLegale} />
            <HorizontalSeparator />
            <DocumentBilansSection
              uniteLegale={uniteLegale}
              isAgent={isAgent(session)}
            />
          </>
        )}
        {isAssociation(uniteLegale) ? (
          <ComptesAssociationSection uniteLegale={uniteLegale} />
        ) : (
          <ComptesBodacc uniteLegale={uniteLegale} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot } = extractParamsPageRouter(context);

    const uniteLegale = await getUniteLegaleFromSlug(slug, { isBot });

    return {
      props: {
        uniteLegale,
      },
    };
  }
);

export default FinancePage;
