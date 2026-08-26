import { createFileRoute } from "@tanstack/react-router";
import EspaceAgentSummarySection from "#/components/espace-agent-components/summary-section";
import EtablissementListeSection from "#/components/etablissement-liste-section";
import EtablissementSection from "#/components/etablissement-section";
import FondationInseeSection from "#/components/screens/fondation.$slug/insee-section";
import FondationSummarySection from "#/components/screens/fondation.$slug/summary-section";
import { TitleFondation } from "#/components/title-fondation-section";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { HeaderDefaultError } from "./-error";
import { Route as FondationLayoutRoute } from "./route";

export const Route = createFileRoute("/_header-fondation/fondation/$slug")({
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { fondation, uniteLegale } = FondationLayoutRoute.useLoaderData();
  const { user } = useAuth();

  return (
    <div className="content-container">
      <TitleFondation
        fondation={fondation}
        uniteLegale={uniteLegale}
        user={user}
      />
      <FondationSummarySection
        fondation={fondation}
        uniteLegale={uniteLegale}
        user={user}
      />
      {!!uniteLegale && (
        <>
          <FondationInseeSection uniteLegale={uniteLegale} user={user} />
          {hasRights({ user }, ApplicationRights.isAgent) && (
            <EspaceAgentSummarySection uniteLegale={uniteLegale} user={user} />
          )}
          <HorizontalSeparator />
          {uniteLegale.siege && (
            <EtablissementSection
              etablissement={uniteLegale.siege}
              uniteLegale={uniteLegale}
              usedInEntreprisePage={true}
              user={user}
              withDenomination={false}
            />
          )}
          <EtablissementListeSection uniteLegale={uniteLegale} />
        </>
      )}
    </div>
  );
}
