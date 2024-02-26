import { GetServerSideProps } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import ConformiteSection from '#components/espace-agent-components/conformite-section';
import DocumentActesSection from '#components/espace-agent-components/documents/document-actes';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IUniteLegale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isAgent, isSuperAgent } from '#utils/session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  redirected: boolean;
}

const UniteLegaleForAgentPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  metadata: { session },
}) => (
  <>
    <Meta
      title={uniteLegalePageTitle(uniteLegale, session)}
      description={uniteLegalePageDescription(uniteLegale, session)}
      noIndex={true}
      canonical={`https://annuaire-entreprises.data.gouv.fr/documents/${
        uniteLegale.chemin || uniteLegale.siren
      }`}
    />
    <div className="content-container">
      <Title
        uniteLegale={uniteLegale}
        ficheType={FICHE.DOCUMENTS}
        session={session}
      />
      {isSuperAgent(session) && (
        <>
          <ConformiteSection uniteLegale={uniteLegale} />
          <HorizontalSeparator />
        </>
      )}
      <DocumentActesSection
        uniteLegale={uniteLegale}
        isAgent={isAgent(session)}
      />
    </div>
  </>
);

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

export default UniteLegaleForAgentPage;
