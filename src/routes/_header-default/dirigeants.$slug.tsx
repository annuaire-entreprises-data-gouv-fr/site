import { createFileRoute } from "@tanstack/react-router";
import { DonneesPriveesSection } from "#/components/donnees-privees-section";
import DirigeantsAssociationSection from "#/components/screens/dirigeants.$slug/sections/association/dirigeants";
import ElusSection from "#/components/screens/dirigeants.$slug/sections/collectivite/elus-section";
import DPOSection from "#/components/screens/dirigeants.$slug/sections/entreprise/dpo/section";
import DirigeantsEntrepriseSection from "#/components/screens/dirigeants.$slug/sections/entreprise/entreprise-section";
import DirigeantSummary from "#/components/screens/dirigeants.$slug/sections/entreprise/summary";
import ResponsablesServicePublicSection from "#/components/screens/dirigeants.$slug/sections/service-public";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { useAuth } from "#/contexts/auth.context";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estDiffusible } from "#/models/core/diffusion";
import {
  type IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
} from "#/models/core/types";
import { meta } from "#/seo";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/dirigeants/$slug")({
  loader: async ({ params }) => {
    const uniteLegale = await getUniteLegaleFromSlugFn({
      data: { slug: params.slug },
    });

    return { uniteLegale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`;
    return {
      meta: meta({
        title: `Dirigeants - ${uniteLegalePageTitle(uniteLegale)}`,
        description: uniteLegalePageDescription(uniteLegale),
        robots: "noindex",
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { uniteLegale } = Route.useLoaderData();

  const { user } = useAuth();

  return (
    <div className="content-container">
      <Title
        ficheType={FICHE.DIRIGEANTS}
        uniteLegale={uniteLegale}
        user={user}
      />
      <DirigeantSummary uniteLegale={uniteLegale} user={user} />
      <DirigeantsContent uniteLegale={uniteLegale} user={user} />
      <HorizontalSeparator />
      <DPOSection uniteLegale={uniteLegale} />
    </div>
  );
}

const DirigeantsContent = ({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) => {
  // Non diffusible
  if (
    !estDiffusible(uniteLegale) &&
    !hasRights({ user }, ApplicationRights.nonDiffusible)
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
    return <DirigeantsAssociationSection uniteLegale={uniteLegale} />;
  }
  // Entreprises & EI
  return <DirigeantsEntrepriseSection uniteLegale={uniteLegale} user={user} />;
};
