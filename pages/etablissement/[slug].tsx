import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IEtablissement, IUniteLegale } from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import Title, { FICHE } from '../../components/title-section';
import { NonDiffusibleSection } from '../../components/non-diffusible';
import { getEtablissementWithUniteLegaleFromSlug } from '../../models/etablissement';
import { redirectIfIssueWithSiretOrSiren } from '../../utils/redirects/routers';
import { TitleEtablissementWithDenomination } from '../../components/title-etablissement-section';
import isUserAgentABot from '../../utils/user-agent';
import { shouldNotIndex } from '../../utils/helpers/checks';
import MatomoEventRedirected from '../../components/matomo-event/search-redirected';

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  redirected: boolean;
}

const EtablissementPage: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  redirected,
}) => (
  <Page
    small={true}
    title={`Etablissement - ${uniteLegale.nomComplet} - ${etablissement.siret}`}
    noIndex={shouldNotIndex(uniteLegale)}
  >
    {redirected && <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />}
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.INFORMATION} />
      <TitleEtablissementWithDenomination
        uniteLegale={uniteLegale}
        etablissement={etablissement}
      />
      <br />
      {etablissement.estDiffusible ? (
        <EtablissementSection
          etablissement={etablissement}
          uniteLegale={uniteLegale}
          withDenomination={true}
        />
      ) : (
        <>
          <p>
            Cet établissement est <b>non-diffusible.</b>
          </p>
          <NonDiffusibleSection />
        </>
      )}
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 40px;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siret = context.params.slug as string;

  const referer = context.req.headers.referer;
  const redirected = !!referer && !!context.query.redirected;

  const isABotParam = (context.query.isABot || '') as string;
  const isABotUA = isUserAgentABot(context.req);

  try {
    const isBot = !!isABotParam || isABotUA;
    const etablissementWithUniteLegale =
      await getEtablissementWithUniteLegaleFromSlug(siret, isBot);

    return {
      props: {
        ...etablissementWithUniteLegale,
        redirected,
      },
    };
  } catch (e: any) {
    return redirectIfIssueWithSiretOrSiren(e, siret, context.req);
  }
};

export default EtablissementPage;
