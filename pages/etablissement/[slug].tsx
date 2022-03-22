import React from 'react';

import { GetServerSideProps } from 'next';
import { IEtablissement, IUniteLegale } from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import { FICHE } from '../../components/title-section';
import { NonDiffusibleSection } from '../../components/non-diffusible';
import {
  getEtablissementWithUniteLegaleFromSlug,
  getEtablissementWithUniteLegaleFromSlugForGoodBot,
} from '../../models/etablissement';
import { TitleEtablissementWithDenomination } from '../../components/title-etablissement-section';
import isUserAgentABot from '../../utils/user-agent';
import PageEntreprise from '../../layouts/page-entreprise';
import { IPropsWithSession, withSession } from '../../hocs/with-session';
import { withError } from '../../hocs/with-error';
import { shouldNotIndex } from '../../utils/helpers/checks';

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
    noIndex={shouldNotIndex(uniteLegale)}
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

export const getServerSideProps: GetServerSideProps = withError(
  withSession(async (context) => {
    //@ts-ignore
    const siret = context.params.slug as string;

    const forceSireneOuverteForDebug = (context.query
      .forceSireneOuverteForDebug || '') as string;
    const isABot = isUserAgentABot(context.req);

    const forceUseOfSireneOuverte = !!forceSireneOuverteForDebug || isABot;
    const etablissementWithUniteLegale = forceUseOfSireneOuverte
      ? await getEtablissementWithUniteLegaleFromSlugForGoodBot(siret)
      : await getEtablissementWithUniteLegaleFromSlug(siret);

    return {
      props: {
        ...etablissementWithUniteLegale,
      },
    };
  })
);

export default EtablissementPage;
