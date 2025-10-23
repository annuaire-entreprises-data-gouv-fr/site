import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentNavigation from "#components/espace-agent-components/agent-navigation";
import { CardHabilitation } from "#components/espace-agent-components/card-habilitation";
import { getAgentFullName } from "#models/authentication/user/helpers";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import getSession from "#utils/server-side-helper/app/get-session";

export const metadata: Metadata = {
  title: "Votre compte utilisateur de l’Annuaire des Entreprises",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/compte/accueil",
  },
  robots: "noindex, nofollow",
};

const CompteAgentAccueil = async () => {
  const session = await getSession();

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect("/lp/agent-public");
  }

  const appRights = Object.values(ApplicationRights)
    .filter((scope) => scope !== ApplicationRights.isAgent)
    .map((scope) => [scope, hasRights(session, scope)])
    .filter(([a, b]) => b);

  return (
    <>
      <AgentNavigation />
      <section className="fr-grid-row fr-mt-5w">
        <div className="fr-col-md-8 fr-col-12">
          <h1 className="fr-h1 fr-mt-0">
            Bonjour {getAgentFullName(session)},
          </h1>
          <h2 className="fr-h2">Vos accès</h2>
        </div>
        <div className="fr-col-md-4 fr-col-12">
          <CardHabilitation />
        </div>
      </section>
    </>
  );
};

export default CompteAgentAccueil;
