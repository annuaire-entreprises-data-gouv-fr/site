import AgentNavigation from '#components/espace-agent-components/agent-navigation';
import { GroupManagement } from '#components/espace-agent-components/group-management';
import { Groups } from '#models/authentication/group/groups';
import { dRolesStore } from '#models/authentication/group/roles';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vos équipes de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/mes-equipes',
  },
  robots: 'noindex, nofollow',
};

const MesEquipesPage = async () => {
  const session = await getSession();

  const roles = await dRolesStore.getRoles();
  const groups = await Groups.find(session!.user!.email, session!.user!.userId);

  return (
    <>
      <AgentNavigation />
      <h1>Mes équipes</h1>
      {/* <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <ButtonLink type="button">Nouvelle équipe</ButtonLink>
      </div> */}

      <GroupManagement
        currentUserEmail={session!.user!.email}
        roles={roles}
        initialGroups={groups}
      />
    </>
  );
};

export default MesEquipesPage;
