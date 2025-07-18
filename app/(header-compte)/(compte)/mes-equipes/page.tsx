import { getRoles } from '#clients/api-d-roles';
import { GroupManagement } from '#components/espace-agent-components/group-management';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { Groups } from '#models/groups';
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

  if (
    !hasRights(session, ApplicationRights.isAgent) ||
    !session?.user?.email ||
    !session?.user?.userId
  ) {
    return redirect('/lp/agent-public');
  }

  const roles = await getRoles();
  const groups = await Groups.find(session!.user!.email, session!.user!.userId);

  return (
    <>
      <h1>Mes équipes</h1>
      {/* <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <ButtonLink type="button">Nouvelle équipe</ButtonLink>
      </div> */}

      <GroupManagement
        currentUserEmail={session.user.email}
        roles={roles}
        initialGroups={groups}
      />
    </>
  );
};

export default MesEquipesPage;
