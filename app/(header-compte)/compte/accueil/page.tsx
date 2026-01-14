import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentNavigation from "#components/espace-agent-components/agent-navigation";
import { CardHabilitation } from "#components/espace-agent-components/card-habilitation";
import { HabilitationsTable } from "#components/espace-agent-components/habilitations-table";
import { getAgentGroups } from "#models/authentication/group";
import { getAgentFullName } from "#models/authentication/user/helpers";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import getSession from "#utils/server-side-helper/get-session";

export const metadata: Metadata = {
  title: "Votre compte utilisateur de l’Annuaire des Entreprises",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/compte/accueil",
  },
  robots: "noindex, nofollow",
};

const CompteAgentAccueil = async () => {
  const session = await getSession();

  if (!session?.user || !hasRights(session, ApplicationRights.isAgent)) {
    return redirect("/lp/agent-public");
  }

  const groups = await getAgentGroups({ allowProConnectRedirection: true });

  return (
    <>
      <AgentNavigation />
      <section className="fr-grid-row fr-mt-5w">
        <div className="fr-col-md-7 fr-col-12">
          <h1 className="fr-h1 fr-mt-0">
            Bonjour {getAgentFullName(session)},
          </h1>
          <HabilitationsTable groups={groups} session={session} />
        </div>
        <div className="fr-col-md-1 fr-col-12" />
        <div className="fr-col-md-4 fr-col-12">
          <CardHabilitation groups={groups} />
        </div>
      </section>
    </>
  );
};

export default CompteAgentAccueil;
