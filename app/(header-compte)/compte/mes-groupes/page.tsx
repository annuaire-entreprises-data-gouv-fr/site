import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentNavigation from "#components/espace-agent-components/agent-navigation";
import { GroupManagement } from "#components/espace-agent-components/group-management";
import { getAgentGroups } from "#models/authentication/group";
import { rolesMetadataStore } from "#models/authentication/group/roles";
import { pluralize } from "#utils/helpers";
import getSession from "#utils/server-side-helper/get-session";

export const metadata: Metadata = {
  title: "Vos groupes au sein de l’Annuaire des Entreprises",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/mes-groupes",
  },
  robots: "noindex, nofollow",
};

const MesGroupesPage = async () => {
  const session = await getSession();

  if (!session?.user?.isSuperAgent) {
    return redirect("/compte/accueil");
  }

  const [roles, groups] = await Promise.all([
    rolesMetadataStore.getRoles(),
    getAgentGroups(),
  ]);

  return (
    <>
      <AgentNavigation />
      <h1>Mes groupes</h1>

      <p>
        <br />
        Seuls les administrateurs d’un groupe peuvent le modifier (renommer,
        ajouter ou supprimer un membre, ou changer son rôle).
        <br />
        <br />
        Vous faites partie de {groups.length} groupe{pluralize(groups)} :
      </p>
      <GroupManagement
        currentUserEmail={session!.user!.email}
        initialGroups={groups}
        roles={roles}
      />
    </>
  );
};

export default MesGroupesPage;
