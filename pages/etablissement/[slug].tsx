import React from 'react';

import { GetServerSideProps } from 'next';
import { IEtablissement, IUniteLegale } from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import { FICHE } from '../../components/title-section';
import { NonDiffusibleSection } from '../../components/non-diffusible';
import {
  getEtablissementWithUniteLegaleFromSlug,
  getEtablissementWithUniteLegaleSireneOuverteFromSlug,
} from '../../models/etablissement';
import { redirectIfIssueWithSiretOrSiren } from '../../utils/redirects/routers';
import { TitleEtablissementWithDenomination } from '../../components/title-etablissement-section';
import isUserAgentABot from '../../utils/user-agent';
import PageEntreprise from '../../layouts/page-entreprise';
import { IPropsWithSession, withSession } from '../../hocs/with-session';

interface IProps extends IPropsWithSession {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

const EtablissementPage: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  session,
}) => (
  <PageEntreprise
    title={`Etablissement - ${uniteLegale.nomComplet} - ${etablissement.siret}`}
    uniteLegale={uniteLegale}
    currentTab={FICHE.INFORMATION}
    session={session}
  >
    <TitleEtablissementWithDenomination
      uniteLegale={uniteLegale}
      etablissement={etablissement}
    />
    <br />
    {etablissement.estDiffusible ? (
      <EtablissementSection
        etablissement={etablissement}
        uniteLegale={uniteLegale}
      />
    ) : (
      <>
        <p>
          Cet établissement est <b>non-diffusible.</b>
        </p>
        <NonDiffusibleSection />
      </>
    )}
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = withSession(
  async (context) => {
    //@ts-ignore
    const siret = context.params.slug as string;

    const forceSireneOuverteForDebug = (context.query
      .forceSireneOuverteForDebug || '') as string;
    const isABot = isUserAgentABot(context.req);

    try {
      const forceUseOfSireneOuverte = !!forceSireneOuverteForDebug || isABot;
      const etablissementWithUniteLegale = forceUseOfSireneOuverte
        ? await getEtablissementWithUniteLegaleSireneOuverteFromSlug(siret)
        : await getEtablissementWithUniteLegaleFromSlug(siret);

      return {
        props: {
          ...etablissementWithUniteLegale,
        },
      };
    } catch (e: any) {
      return redirectIfIssueWithSiretOrSiren(e, siret, context.req);
    }
  }
);

export default EtablissementPage;
