import React from 'react';
import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import {
  IAnnoncesBodacc,
  IAnnoncesAssociation,
  IComptesAssociation,
} from '../../models/annonces';
import { IUniteLegale } from '../../models';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import { getAnnoncesFromSlug } from '../../models/annonces';
import AnnoncesBodaccSection from '../../components/annonces-section/bodacc';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';
import { isAssociation } from '../../models';
import AnnoncesAssociationSection from '../../components/annonces-section/annonces-association';
import { ComptesAssociationSection } from '../../components/annonces-section/comptes-association';

interface IProps extends IPropsWithMetadata {
  annoncesAssociation: IAnnoncesAssociation | IAPINotRespondingError | null;
  bodacc: IAnnoncesBodacc | IAPINotRespondingError;
  comptesAssociation: IComptesAssociation | IAPINotRespondingError | null;
  uniteLegale: IUniteLegale;
}

const Annonces: React.FC<IProps> = ({
  annoncesAssociation,
  bodacc,
  comptesAssociation,
  metadata,
  uniteLegale,
}) => {
  return (
    <Page
      small={true}
      title={`Annonces légales (BODACC) - ${uniteLegale.nomComplet}`}
      noIndex={true}
      isBrowserOutdated={metadata.isBrowserOutdated}
    >
      <div className="content-container">
        <Title ficheType={FICHE.ANNONCES} uniteLegale={uniteLegale} />
        <AnnoncesBodaccSection uniteLegale={uniteLegale} bodacc={bodacc} />
        {isAssociation(uniteLegale) && (
          <>
            {annoncesAssociation && (
              <AnnoncesAssociationSection
                uniteLegale={uniteLegale}
                annoncesAssociation={annoncesAssociation}
              />
            )}
            {comptesAssociation && (
              <ComptesAssociationSection
                uniteLegale={uniteLegale}
                comptesAssociation={comptesAssociation}
              />
            )}
          </>
        )}
      </div>
    </Page>
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
