import React from 'react';

import { GetServerSideProps } from 'next';
import { IUniteLegale } from '../../models';
import UniteLegaleSection from '../../components/unite-legale-section';
import EtablissementListeSection from '../../components/etablissement-liste-section';
import { FICHE } from '../../components/title-section';

import EtablissementSection from '../../components/etablissement-section';

import { NonDiffusibleSection } from '../../components/non-diffusible';
import {
  getUniteLegaleFromSlugForGoodBot,
  getUniteLegaleWithRNAFromSlug,
} from '../../models/unite-legale';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import AssociationSection from '../../components/association-section';
import isUserAgentABot from '../../utils/user-agent';
import PageEntreprise from '../../layouts/page-entreprise';
import StructuredDataBreadcrumb from '../../components/structured-data/breadcrumb';
import { IPropsWithSession, withSession } from '../../hocs/with-session';
import { withError } from '../../hocs/with-error';
import UsefulShortcuts from '../../components/useful-shortcuts';

interface IProps extends IPropsWithSession {
  uniteLegale: IUniteLegale;
}

const UniteLegalePage: React.FC<IProps> = ({ uniteLegale, session }) => (
  <PageEntreprise
    title={`${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
    canonical={
      uniteLegale.chemin &&
      `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`
    }
    description={`Toutes les informations officielles sur ${uniteLegale.nomComplet} :  Siren, Siret, NIC, APE/NAF, N° TVA, capital social, justificatif d’immatriculation, dirigeants, conventions collectives...`}
    noIndex={
      uniteLegale.estEntrepreneurIndividuel && uniteLegale.estActive === false
    }
    uniteLegale={uniteLegale}
    currentTab={FICHE.INFORMATION}
    session={session}
  >
    <StructuredDataBreadcrumb siren={uniteLegale.siren} />
    {uniteLegale.estDiffusible ? (
      <>
        <UniteLegaleSection uniteLegale={uniteLegale} />
        {uniteLegale.association && uniteLegale.association.id && (
          <AssociationSection uniteLegale={uniteLegale} />
        )}
        <UsefulShortcuts uniteLegale={uniteLegale} />
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
  </PageEntreprise>
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

export const getServerSideProps: GetServerSideProps = withError(
  withSession(async (context) => {
    //@ts-ignore
    const slug = context.params.slug as string;
    const pageParam = (context.query.page || '') as string;

    const siren = extractSiren(slug);

    if (siren.length === 14) {
      // 14 digits is not a siren -> but it may be a siret
      return {
        redirect: {
          destination: `/etablissement/${siren}`,
          permanent: false,
        },
      };
    }

    const page = parseIntWithDefaultValue(pageParam, 1);

    const forceSireneOuverteForDebug = (context.query
      .forceSireneOuverteForDebug || '') as string;
    const isABot = isUserAgentABot(context.req);

    const forceUseOfSireneOuverte = !!forceSireneOuverteForDebug || isABot;

    const uniteLegale = forceUseOfSireneOuverte
      ? await getUniteLegaleFromSlugForGoodBot(siren, page)
      : await getUniteLegaleWithRNAFromSlug(siren, page);

    return {
      props: {
        uniteLegale,
      },
    };
  })
);

export default UniteLegalePage;
