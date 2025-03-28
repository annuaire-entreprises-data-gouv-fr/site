import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { estDiffusible } from '#models/core/diffusion';
import {
  isAssociation,
  isCollectiviteTerritoriale,
  isEntrepreneurIndividuel,
  isServicePublic,
  IUniteLegale,
} from '#models/core/types';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import DirigeantsAssociationSection from './_component/sections/association/dirigeants';
import ElusSection from './_component/sections/collectivite/elus-section';
import DirigeantsEntrepreneurIndividuelSection from './_component/sections/entrepreneur-individuel/entrepreneur-section';
import DirigeantsEntrepriseSection from './_component/sections/entreprise/entreprise-section';
import DirigeantSummary from './_component/sections/entreprise/summary';
import ResponsablesServicePublicSection from './_component/sections/service-public';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  return {
    title: `Dirigeants - ${uniteLegalePageTitle(uniteLegale)}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: 'noindex',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`,
    },
  };
};

const DirigeantsContent = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  // Non diffusible
  if (
    !estDiffusible(uniteLegale) &&
    !hasRights(session, ApplicationRights.nonDiffusible)
  ) {
    return <DonneesPriveesSection title="Dirigeant(s)" />;
  }

  // Collectivité territoriale
  if (isCollectiviteTerritoriale(uniteLegale)) {
    return <ElusSection uniteLegale={uniteLegale} />;
  }

  // Service public
  if (isServicePublic(uniteLegale)) {
    return <ResponsablesServicePublicSection uniteLegale={uniteLegale} />;
  }

  // Association
  if (isAssociation(uniteLegale)) {
    return (
      <DirigeantsAssociationSection
        uniteLegale={uniteLegale}
        session={session}
      />
    );
  }

  // Entrepreneur individuel
  if (isEntrepreneurIndividuel(uniteLegale)) {
    return (
      <DirigeantsEntrepreneurIndividuelSection
        uniteLegale={uniteLegale}
        session={session}
      />
    );
  }

  // Entreprises (hors EI)
  return (
    <DirigeantsEntrepriseSection uniteLegale={uniteLegale} session={session} />
  );
};

const DirigeantsPage = async (props: AppRouterProps) => {
  const { slug, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  const session = await getSession();

  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DIRIGEANTS}
          session={session}
        />
        <DirigeantSummary uniteLegale={uniteLegale} />
        <DirigeantsContent uniteLegale={uniteLegale} session={session} />
      </div>
    </>
  );
};

export default DirigeantsPage;
