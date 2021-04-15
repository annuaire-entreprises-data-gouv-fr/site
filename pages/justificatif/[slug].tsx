import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { NotASirenError, SirenNotFoundError } from '../../models';
import {
  redirectPageNotFound,
  redirectServerError,
  redirectSirenIntrouvable,
} from '../../utils/redirect';
import { Section } from '../../components/section';
import Title, { FICHE } from '../../components/title-section';
import getJustificatifs, { IJustificatifs } from '../../models/justificatifs';
import Immatriculations from '../../components/immatriculations';
import AvisSituation from '../../components/avis-situation';
import { EAdministration } from '../../models/administration';

const JustificatifPage: React.FC<IJustificatifs> = ({
  uniteLegale,
  immatriculationRNM,
  immatriculationRNCS,
}) => (
  <Page
    small={true}
    title={`Justificatif d’immatricuation - ${uniteLegale.nomComplet}`}
    noIndex={true}
  >
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.JUSTIFICATIFS} />
      <Section title="Avis de situation INSEE" source={EAdministration.INSEE}>
        <div className="description">
          Le siège social de cette entité possède un avis de situation au
          répertoire Sirene des entreprises.
        </div>
        <div className="layout-center">
          👉&nbsp;
          <AvisSituation siret={uniteLegale.siege.siret} />
        </div>
      </Section>
      <Immatriculations
        immatriculationRNM={immatriculationRNM}
        immatriculationRNCS={immatriculationRNCS}
      />
    </div>
    <style jsx>{`
      .separator {
        width: 10px;
        height: 10px;
      }
      .description {
        display: flex;
        margin-bottom: 20px;
        flex-direction: row;
      }
      .logo-wrapper {
        padding-left: 20px;
        width: calc(30% - 20px);
      }
      .logo-wrapper svg {
        width: 100%;
      }
      .content-container {
        margin: 20px auto 40px;
      }
      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .description {
          flex-direction: column;
        }
        .logo-wrapper {
          margin: 20px auto 0;
          padding: 0;
        }
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siren = context.params.slug as string;

  try {
    const justificatifs = await getJustificatifs(siren);

    return {
      props: justificatifs,
    };
  } catch (e) {
    if (e instanceof NotASirenError || e instanceof SirenNotFoundError) {
      redirectSirenIntrouvable(context.res, siren);
    } else {
      redirectServerError(context.res, e.message);
    }
    return { props: {} };
  }
};

export default JustificatifPage;
