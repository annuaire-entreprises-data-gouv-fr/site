import { GetServerSideProps } from 'next';
import AnnoncesAssociationSection from '#components/annonces-section/annonces-association';
import AnnoncesBodacc from '#components/annonces-section/bodacc';
import { ComptesAssociationSection } from '#components/annonces-section/comptes-association';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IAnnoncesAssociation, IAnnoncesBodacc } from '#models/annonces';
import { IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale, isAssociation } from '#models/index';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { getCompanyPageDescription, getCompanyPageTitle } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { useFetchComptesAssociation, useFetchJOAFE } from 'hooks';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  annoncesAssociation: IAnnoncesAssociation | IAPINotRespondingError;
  bodacc: IAnnoncesBodacc | IAPINotRespondingError | IAPILoading;
  uniteLegale: IUniteLegale;
}

const Annonces: NextPageWithLayout<IProps> = ({
  metadata: { session },
  uniteLegale,
}) => {
  const annoncesAssociation = useFetchJOAFE(uniteLegale);
  const comptesAssociation = useFetchComptesAssociation(uniteLegale);
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
        <AnnoncesBodacc uniteLegale={uniteLegale} />
        {isAssociation(uniteLegale) && (
          <>
            <AnnoncesAssociationSection
              association={uniteLegale}
              annoncesAssociation={annoncesAssociation}
            />

            <ComptesAssociationSection
              association={uniteLegale}
              comptesAssociation={comptesAssociation}
            />
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
