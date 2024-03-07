import { GetServerSideProps } from 'next';
import AnnoncesBodacc from '#components/annonces-section/annonces/bodacc';
import AnnoncesJOAFESection from '#components/annonces-section/annonces/joafe';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { estDiffusible } from '#models/core/statut-diffusion';
import { IUniteLegale, isAssociation } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
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

const Annonces: NextPageWithLayout<IProps> = ({
  metadata: { session },
  uniteLegale,
}) => {
  return (
    <>
      <Meta
        title={`Annonces légales (BODACC, JOAFE) - ${uniteLegalePageTitle(
          uniteLegale,
          session
        )}`}
        description={uniteLegalePageDescription(uniteLegale, session)}
        canonical={`https://annuaire-entreprises.data.gouv.fr/annonces/${uniteLegale.siren}`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          ficheType={FICHE.ANNONCES}
          uniteLegale={uniteLegale}
          session={session}
        />
        {estDiffusible(uniteLegale) || isAgent(session) ? (
          <AnnoncesBodacc uniteLegale={uniteLegale} />
        ) : (
          <DonneesPriveesSection />
        )}
        {isAssociation(uniteLegale) && (
          <AnnoncesJOAFESection uniteLegale={uniteLegale} />
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

export default Annonces;
