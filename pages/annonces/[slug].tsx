import React from 'react';
import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import { IAnnoncesBodacc, IAnnoncesJO } from '../../models/annonces';
import { IUniteLegale } from '../../models';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import getAnnoncesFromSlug from '../../models/annonces';
import AnnoncesBodaccSection from '../../components/annonces-section/bodacc';
import AnnoncesJOSection from '../../components/annonces-section/jo';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  bodacc: IAnnoncesBodacc | IAPINotRespondingError;
  jo: IAnnoncesJO | IAPINotRespondingError | null;
}

const Annonces: React.FC<IProps> = ({ uniteLegale, bodacc, jo, metadata }) => (
  <Page
    small={true}
    title={`Annonces légales (BODACC) - ${uniteLegale.nomComplet}`}
    noIndex={true}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    <div className="content-container">
      <Title ficheType={FICHE.ANNONCES} uniteLegale={uniteLegale} />
      <AnnoncesBodaccSection uniteLegale={uniteLegale} bodacc={bodacc} />
      {jo && <AnnoncesJOSection uniteLegale={uniteLegale} jo={jo} />}
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);
    const { uniteLegale, bodacc, jo } = await getAnnoncesFromSlug(slug);

    return {
      props: {
        uniteLegale,
        bodacc,
        jo,
      },
    };
  }
);

export default Annonces;
