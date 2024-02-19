import { GetServerSideProps } from 'next';
import ConventionsCollectivesSection from '#components/conventions-collectives-section';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  ICCWithMetadata,
  getCCMetadata,
} from '#models/conventions-collectives-list';
import { IUniteLegale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsPageRouter from '#utils/server-side-props-helper/extract-params-page-router';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  ccWithMetadata: ICCWithMetadata[] | IAPINotRespondingError;
}

const ConventionsCollectives: NextPageWithLayout<IProps> = ({
  uniteLegale,
  ccWithMetadata,
  metadata: { session },
}) => (
  <>
    <Meta
      noIndex={true}
      title={`Conventions collectives - ${uniteLegalePageTitle(
        uniteLegale,
        session
      )}`}
      description={uniteLegalePageDescription(uniteLegale, session)}
      canonical={`https://annuaire-entreprises.data.gouv.fr/divers/${uniteLegale.siren}`}
    />
    <div className="content-container">
      <Title
        ficheType={FICHE.DIVERS}
        uniteLegale={uniteLegale}
        session={session}
      />
      <ConventionsCollectivesSection ccWithMetadata={ccWithMetadata} />
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot } = extractParamsPageRouter(context);

    const uniteLegale = await getUniteLegaleFromSlug(slug, { isBot });

    const ccWithMetadata = await getCCMetadata(
      uniteLegale.conventionsCollectives
    );

    return {
      props: {
        uniteLegale,
        ccWithMetadata,
      },
    };
  }
);

export default ConventionsCollectives;
