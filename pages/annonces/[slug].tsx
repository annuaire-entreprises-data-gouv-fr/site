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
import { IPropsWithSession, withSession } from '../../hocs/with-session';

interface IProps extends IPropsWithSession {
  uniteLegale: IUniteLegale;
  bodacc: IAnnoncesBodacc | IAPINotRespondingError;
  jo: IAnnoncesJO | IAPINotRespondingError | null;
}

const Annonces: React.FC<IProps> = ({ uniteLegale, bodacc, jo, session }) => (
  <PageEntreprise
    title={`Annonces légales (BODACC) - ${uniteLegale.nomComplet}`}
    noIndex={true}
    uniteLegale={uniteLegale}
    currentTab={FICHE.ANNONCES}
    session={session}
  >
    <AnnoncesBodaccSection uniteLegale={uniteLegale} bodacc={bodacc} />
    {jo && <AnnoncesJOSection uniteLegale={uniteLegale} jo={jo} />}
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = withSession(
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
