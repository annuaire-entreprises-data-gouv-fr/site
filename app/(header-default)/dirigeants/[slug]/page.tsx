import type { Metadata } from "next";
import { DonneesPriveesSection } from "#components/donnees-privees-section";
import Title from "#components/title-section";
import { FICHE } from "#components/title-section/tabs";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { estDiffusible } from "#models/core/diffusion";
import {
  type IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
} from "#models/core/types";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#utils/helpers";
import { cachedGetUniteLegale } from "#utils/server-side-helper/cached-methods";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/extract-params";
import getSession from "#utils/server-side-helper/get-session";
import DirigeantsAssociationSection from "./_component/sections/association/dirigeants";
import ElusSection from "./_component/sections/collectivite/elus-section";
import DPOSection from "./_component/sections/entreprise/dpo/section";
import DirigeantsEntrepriseSection from "./_component/sections/entreprise/entreprise-section";
import DirigeantSummary from "./_component/sections/entreprise/summary";
import ResponsablesServicePublicSection from "./_component/sections/service-public";

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  return {
    title: `Dirigeants - ${uniteLegalePageTitle(uniteLegale)}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: "noindex",
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
    return (
      <>
        <ElusSection uniteLegale={uniteLegale} />
        <ResponsablesServicePublicSection uniteLegale={uniteLegale} />
      </>
    );
  }

  // Service public
  if (isServicePublic(uniteLegale)) {
    return <ResponsablesServicePublicSection uniteLegale={uniteLegale} />;
  }

  // Association
  if (isAssociation(uniteLegale)) {
    return (
      <DirigeantsAssociationSection
        session={session}
        uniteLegale={uniteLegale}
      />
    );
  }
  // Entreprises & EI
  return (
    <DirigeantsEntrepriseSection session={session} uniteLegale={uniteLegale} />
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
          ficheType={FICHE.DIRIGEANTS}
          session={session}
          uniteLegale={uniteLegale}
        />
        <DirigeantSummary session={session} uniteLegale={uniteLegale} />
        <DirigeantsContent session={session} uniteLegale={uniteLegale} />
        <HorizontalSeparator />
        <DPOSection session={session} uniteLegale={uniteLegale} />
      </div>
    </>
  );
};

export default DirigeantsPage;
