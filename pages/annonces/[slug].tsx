import React from 'react';
import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';
import AnnoncesBodaccSection from '../../components/annonces-bodacc-section';

import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import { getUniteLegaleFromSlug } from '../../models/unite-legale';
import getAnnoncesBodaccFromSlug, {
  IAnnoncesBodacc,
} from '../../models/annonces-bodacc';
import { IUniteLegale } from '../../models';
import { IAPINotRespondingError } from '../../models/api-not-responding';

interface IProps {
  uniteLegale: IUniteLegale;
  annonces: IAnnoncesBodacc[] | IAPINotRespondingError;
}

const Annonces: React.FC<IProps> = ({ uniteLegale, annonces }) => (
  <Page
    small={true}
    title={`Annonces légales (BODACC) - ${uniteLegale.nomComplet}`}
    noIndex={true}
  >
    <div className="content-container">
      <Title ficheType={FICHE.ANNONCES} uniteLegale={uniteLegale} />
      <AnnoncesBodaccSection uniteLegale={uniteLegale} annonces={annonces} />
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siren = context.params.slug as string;

  try {
    const [uniteLegale, annonces] = await Promise.all([
      getUniteLegaleFromSlug(siren),
      getAnnoncesBodaccFromSlug(siren),
    ]);

    return {
      props: {
        uniteLegale,
        annonces,
      },
    };
  } catch (e) {
    redirectIfIssueWithSiren(context.res, e, siren, context.req);
    return { props: {} };
  }
};

export default Annonces;
