import { GetServerSideProps } from 'next';
import React from 'react';
import AnnoncesAssociationSection from '#components/annonces-section/annonces-association';
import AnnoncesBodaccSection from '#components/annonces-section/bodacc';
import { ComptesAssociationSection } from '#components/annonces-section/comptes-association';
import Meta from '#components/meta';
import Title, { FICHE } from '#components/title-section';
import {
  IAnnoncesBodacc,
  IAnnoncesAssociation,
  IComptesAssociation,
} from '#models/annonces';
import { getAnnoncesFromSlug } from '#models/annonces';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { isAssociation, IUniteLegale } from '#models/index';
import {
  getCompanyPageDescription,
  getCompanyPageTitle,
} from '#utils/helpers/get-company-page-title';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  annoncesAssociation: IAnnoncesAssociation | IAPINotRespondingError | null;
  bodacc: IAnnoncesBodacc | IAPINotRespondingError;
  comptesAssociation: IComptesAssociation | IAPINotRespondingError | null;
  uniteLegale: IUniteLegale;
}

const Annonces: NextPageWithLayout<IProps> = ({
  annoncesAssociation,
  bodacc,
  comptesAssociation,
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
        noIndex={true}
      />
      <div className="content-container">
        <Title
          ficheType={FICHE.ANNONCES}
          uniteLegale={uniteLegale}
          session={session}
        />
        <AnnoncesBodaccSection uniteLegale={uniteLegale} bodacc={bodacc} />
        {isAssociation(uniteLegale) && (
          <>
            {annoncesAssociation && (
              <AnnoncesAssociationSection
                association={uniteLegale}
                annoncesAssociation={annoncesAssociation}
              />
            )}
            {comptesAssociation && (
              <ComptesAssociationSection
                association={uniteLegale}
                comptesAssociation={comptesAssociation}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);
    const { uniteLegale, bodacc, comptesAssociation, annoncesAssociation } =
      await getAnnoncesFromSlug(slug);
    return {
      props: {
        annoncesAssociation,
        bodacc,
        comptesAssociation,
        uniteLegale,
      },
    };
  }
);

export default Annonces;
