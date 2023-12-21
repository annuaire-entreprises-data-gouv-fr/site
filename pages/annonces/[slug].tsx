import { GetServerSideProps } from 'next';
import AnnoncesAssociationSection from '#components/annonces-section/annonces-association';
import AnnoncesBodacc from '#components/annonces-section/bodacc';
import { ComptesAssociationSection } from '#components/annonces-section/comptes-association';
import Meta from '#components/meta';
import { DonneesPriveesSection } from '#components/non-diffusible';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IUniteLegale, isAssociation } from '#models/index';
import { estDiffusible } from '#models/statut-diffusion';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { getCompanyPageDescription, getCompanyPageTitle } from '#utils/helpers';
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

const Annonces: NextPageWithLayout<IProps> = ({
  metadata: { session },
  uniteLegale,
}) => {
  return (
    <>
      <Meta
        title={`Annonces légales (BODACC, JOAFE) - ${getCompanyPageTitle(
          uniteLegale,
          session
        )}`}
        description={getCompanyPageDescription(uniteLegale, session)}
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
          <>
            <AnnoncesAssociationSection uniteLegale={uniteLegale} />
            <ComptesAssociationSection uniteLegale={uniteLegale} />
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

export default Annonces;
