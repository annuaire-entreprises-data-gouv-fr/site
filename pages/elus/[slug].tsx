import { GetServerSideProps } from 'next';
import ElusSection from '#components/dirigeants-section/elus-section';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { getNomComplet } from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import extractParamsPageRouter from '#utils/server-side-helper/page/extract-params';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-helper/page/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
}

const ElusPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  metadata: { session },
}) => {
  return (
    <>
      <Meta
        title={`Élus de ${getNomComplet(uniteLegale, session)} - ${
          uniteLegale.siren
        }`}
        canonical={`https://annuaire-entreprises.data.gouv.fr/elus/${uniteLegale.siren}`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.ELUS}
          session={session}
        />
        <ElusSection uniteLegale={uniteLegale} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot } = extractParamsPageRouter(context);
    const uniteLegale = await getUniteLegaleFromSlug(slug, { isBot });

    return {
      props: { uniteLegale },
    };
  }
);

export default ElusPage;
