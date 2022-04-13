import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IEtablissement, IUniteLegale } from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import Title, { FICHE } from '../../components/title-section';
import { NonDiffusibleSection } from '../../components/non-diffusible';
import {
  getEtablissementWithUniteLegaleFromSlug,
  getEtablissementWithUniteLegaleFromSlugForGoodBot,
} from '../../models/etablissement';
import { redirectIfIssueWithSiretOrSiren } from '../../utils/redirects/routers';
import { TitleEtablissementWithDenomination } from '../../components/title-etablissement-section';
import isUserAgentABot from '../../utils/user-agent';
import { shouldNotIndex } from '../../utils/helpers/checks';

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

const EtablissementPage: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
}) => (
  <Page
    small={true}
    title={`Etablissement - ${uniteLegale.nomComplet} - ${etablissement.siret}`}
    noIndex={shouldNotIndex(uniteLegale)}
  >
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

  const forceSireneOuverteForDebug = (context.query
    .forceSireneOuverteForDebug || '') as string;
  const isABot = isUserAgentABot(context.req);

  try {
    const forceUseOfSireneOuverte = !!forceSireneOuverteForDebug || isABot;
    const etablissementWithUniteLegale = forceUseOfSireneOuverte
      ? await getEtablissementWithUniteLegaleFromSlugForGoodBot(siret)
      : await getEtablissementWithUniteLegaleFromSlug(siret);

    return {
      props: {
        ...etablissementWithUniteLegale,
      },
    };
  } catch (e: any) {
    return redirectIfIssueWithSiretOrSiren(e, siret, context.req);
  }
};

export default EtablissementPage;
