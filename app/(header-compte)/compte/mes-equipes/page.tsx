import AgentNavigation from '#components/espace-agent-components/agent-navigation';
import { GroupManagement } from '#components/espace-agent-components/group-management';
import { Groups } from '#models/authentication/group/groups';
import { dRolesStore } from '#models/authentication/group/roles';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Vos équipes de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/mes-equipes',
  },
  robots: 'noindex, nofollow',
};

const MesEquipesPage = async () => {
  const session = await getSession();

  if (!session?.user || !hasRights(session, ApplicationRights.administrateur)) {
    return redirect('/compte/accueil');
  }

  const [roles, groups] = await Promise.all([
    dRolesStore.getRoles(),
    Groups.find(session.user.email, session.user.proConnectSub),
  ]);

  return (
    <>
      <AgentNavigation />
      <h1>Mes équipes</h1>

      <p>
        <br />
        Seuls les administrateurs d’équipe peuvent les modifier (renommer,
        ajouter ou supprimer un membre, ou changer son rôle).
        <br />
        <br />
        Vous faites partie de {groups.length} équipes :
      </p>
      <GroupManagement
        currentUserEmail={session!.user!.email}
        roles={roles}
        initialGroups={groups}
      />
    </>
  );
};

export default MesEquipesPage;
