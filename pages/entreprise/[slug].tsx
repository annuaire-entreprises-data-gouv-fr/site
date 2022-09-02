import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IUniteLegale } from '../../models';
import UniteLegaleSection from '../../components/unite-legale-section';
import EtablissementListeSection from '../../components/etablissement-liste-section';
import Title, { FICHE } from '../../components/title-section';

import EtablissementSection from '../../components/etablissement-section';

import { NonDiffusibleSection } from '../../components/non-diffusible';
import { getUniteLegaleFromSlug } from '../../models/unite-legale';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import AssociationSection from '../../components/association-section';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import isUserAgentABot from '../../utils/user-agent';
import StructuredDataBreadcrumb from '../../components/structured-data/breadcrumb';
import { shouldNotIndex } from '../../utils/helpers/checks';
import UsefulShortcuts from '../../components/useful-shortcuts';
import MatomoEventRedirected from '../../components/matomo-event/search-redirected';

interface IProps {
  uniteLegale: IUniteLegale;
  redirected: true;
}

const UniteLegalePage: React.FC<IProps> = ({ uniteLegale, redirected }) => (
  <Page
    small={true}
    title={`${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
    canonical={
      uniteLegale.chemin &&
      `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`
    }
    description={`Toutes les informations officielles sur ${uniteLegale.nomComplet} :  Siren, Siret, NIC, APE/NAF, N° TVA, capital social, justificatif d’immatriculation, dirigeants, conventions collectives...`}
    noIndex={shouldNotIndex(uniteLegale)}
  >
    {redirected && <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />}
    <StructuredDataBreadcrumb siren={uniteLegale.siren} />
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.INFORMATION} />
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
              withDenomination={false}
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

  const referer = context.req.headers.referer;
  const redirected = !!referer && !!context.query.redirected;

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

  const pageParam = (context.query.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);

  const isABotParam = (context.query.isABot || '') as string;
  const isABotUA = isUserAgentABot(context.req);
  try {
    const isBot = !!isABotParam || isABotUA;

    const uniteLegale = await getUniteLegaleFromSlug(siren, {
      page,
      isBot,
    });

    return {
      props: {
        uniteLegale,
        redirected,
      },
    };
  } catch (e: any) {
    return redirectIfIssueWithSiren(e, siren, context.req);
  }
};

export default UniteLegalePage;
