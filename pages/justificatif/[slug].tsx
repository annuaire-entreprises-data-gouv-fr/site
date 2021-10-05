import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';
import getJustificatifs, { IJustificatifs } from '../../models/justificatifs';
import Immatriculations from '../../components/immatriculations';
import AvisSituationSection from '../../components/avis-de-situation-section';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import { isCaptchaCookieValid } from '../../utils/captcha';

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
      <Immatriculations
        immatriculationRNM={immatriculationRNM}
        immatriculationRNCS={immatriculationRNCS}
      />
      <AvisSituationSection uniteLegale={uniteLegale} />
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
  const captchaCookieIsValid = isCaptchaCookieValid(context.req, context.res);
  if (!captchaCookieIsValid) {
    return {
      redirect: {
        destination: `/captcha?url=${context.req.url}`,
        permanent: false,
      },
    };
  }

  //@ts-ignore
  const siren = context.params.slug as string;

  try {
    const justificatifs = await getJustificatifs(siren);

    return {
      props: justificatifs,
    };
  } catch (e) {
    redirectIfIssueWithSiren(context.res, e, siren, context.req);
    return { props: {} };
  }
};

export default JustificatifPage;
