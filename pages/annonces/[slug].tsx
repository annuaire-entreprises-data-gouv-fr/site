import React from 'react';
import { GetServerSideProps } from 'next';
import { FICHE } from '../../components/title-section';

import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import { IAnnoncesBodacc, IAnnoncesJO } from '../../models/annonces';
import { IUniteLegale } from '../../models';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import getAnnoncesFromSlug from '../../models/annonces';
import AnnoncesBodaccSection from '../../components/annonces-section/bodacc';
import AnnoncesJOSection from '../../components/annonces-section/jo';
import PageEntreprise from '../../layouts/page-entreprise';
import {
  IDirigeantSession,
  withDirigeantSession,
} from '../../hocs/with-dirigeant-session';

interface IProps {
  uniteLegale: IUniteLegale;
  bodacc: IAnnoncesBodacc | IAPINotRespondingError;
  jo: IAnnoncesJO | IAPINotRespondingError | null;
  dirigeantSession: IDirigeantSession;
}

const Annonces: React.FC<IProps> = ({
  uniteLegale,
  bodacc,
  jo,
  dirigeantSession,
}) => (
  <PageEntreprise
    title={`Annonces légales (BODACC) - ${uniteLegale.nomComplet}`}
    noIndex={true}
    uniteLegale={uniteLegale}
    currentTab={FICHE.ANNONCES}
    dirigeantSession={dirigeantSession}
  >
    <AnnoncesBodaccSection uniteLegale={uniteLegale} bodacc={bodacc} />
    {jo && <AnnoncesJOSection uniteLegale={uniteLegale} jo={jo} />}
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = withDirigeantSession(
  async (context) => {
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
    } catch (e: any) {
      return redirectIfIssueWithSiren(e, siren, context.req);
    }
  }
);

export default Annonces;
