import React from 'react';
import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import { IAnnoncesBodacc, IAnnoncesJO } from '../../models/annonces';
import { IUniteLegale } from '../../models';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import getAnnoncesFromSlug from '../../models/annonces';
import AnnoncesBodaccSection from '../../components/annonces-section/bodacc';
import AnnoncesJOSection from '../../components/annonces-section/jo';

interface IProps {
  uniteLegale: IUniteLegale;
  bodacc: IAnnoncesBodacc[] | IAPINotRespondingError;
  jo: IAnnoncesJO[] | IAPINotRespondingError;
}

const Annonces: React.FC<IProps> = ({ uniteLegale, bodacc, jo }) => (
  <Page
    small={true}
    title={`Annonces légales (BODACC) - ${uniteLegale.nomComplet}`}
    noIndex={true}
  >
    <div className="content-container">
      <Title ficheType={FICHE.ANNONCES} uniteLegale={uniteLegale} />
      <AnnoncesBodaccSection uniteLegale={uniteLegale} bodacc={bodacc} />
      {uniteLegale.association && (
        <AnnoncesJOSection uniteLegale={uniteLegale} jo={jo} />
      )}
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siren = context.params.slug as string;

  try {
    const { uniteLegale, bodacc, jo } = await getAnnoncesFromSlug(siren);

    return {
      props: {
        uniteLegale,
        bodacc,
        jo,
      },
    };
  } catch (e) {
    redirectIfIssueWithSiren(context.res, e, siren, context.req);
    return { props: {} };
  }
};

export default Annonces;
