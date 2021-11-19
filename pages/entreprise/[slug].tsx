import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IUniteLegale } from '../../models';
import UniteLegaleSection from '../../components/unite-legale-section';
import EtablissementListeSection from '../../components/etablissement-liste-section';
import Title, { FICHE } from '../../components/title-section';

import EtablissementSection from '../../components/etablissement-section';

import { NonDiffusibleSection } from '../../components/non-diffusible';
import {
  getUniteLegaleSireneOuverteFromSlug,
  getUniteLegaleWithRNAFromSlug,
} from '../../models/unite-legale';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import AssociationSection from '../../components/association-section';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import redirect from '../../utils/redirects';
import isUserAgentABot from '../../utils/user-agent';

interface IProps {
  uniteLegale: IUniteLegale;
}

const UniteLegalePage: React.FC<IProps> = ({ uniteLegale }) => (
  <Page
    small={true}
    title={`${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
    canonical={
      uniteLegale.chemin &&
      `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`
    }
    noIndex={
      uniteLegale.estEntrepreneurIndividuel && uniteLegale.estActive === false
    }
  >
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.INFORMATION} />
      {uniteLegale.estDiffusible ? (
        <>
          <UniteLegaleSection uniteLegale={uniteLegale} />
          {uniteLegale.association && uniteLegale.association.id && (
            <AssociationSection uniteLegale={uniteLegale} />
          )}
          {uniteLegale.siege && (
            <EtablissementSection
              uniteLegale={uniteLegale}
              etablissement={uniteLegale.siege}
              usedInEntreprisePage={true}
            />
          )}
          <EtablissementListeSection uniteLegale={uniteLegale} />
        </>
      ) : (
        <NonDiffusibleSection />
      )}
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 40px;
      }
    `}</style>
  </Page>
);

const extractSiren = (slug: string) => {
  if (!slug) {
    return '';
  }
  // match a string that ends with either 9 digit or 14 like a siren or a siret
  // we dont use a $ end match as there might be " or %22 at the end
  const matches = slug.matchAll(/\d{14}|\d{9}/g);
  const m = Array.from(matches, (m) => m[0]);
  if (m && m.length > 0) {
    return m[m.length - 1]; // last occurence of match
  }
  return '';
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug as string;
  const pageParam = (context.query.page || '') as string;

  const siren = extractSiren(slug);
  if (siren.length === 14) {
    // 14 digits is not a siren -> but it may be a siret
    redirect(context.res, `/etablissement/${siren}`);
    return { props: {} };
  }

  const page = parseIntWithDefaultValue(pageParam, 1);

  const forceSireneOuverteForDebug = (context.query
    .forceSireneOuverteForDebug || '') as string;
  const isABot = isUserAgentABot(context.req);

  try {
    const forceUseOfSireneOuverte = !!forceSireneOuverteForDebug || isABot;

    const uniteLegale = forceUseOfSireneOuverte
      ? await getUniteLegaleSireneOuverteFromSlug(siren, page)
      : await getUniteLegaleWithRNAFromSlug(siren, page);

    return {
      props: {
        uniteLegale,
      },
    };
  } catch (e) {
    redirectIfIssueWithSiren(context.res, e, siren, context.req);
    return { props: {} };
  }
};

export default UniteLegalePage;
