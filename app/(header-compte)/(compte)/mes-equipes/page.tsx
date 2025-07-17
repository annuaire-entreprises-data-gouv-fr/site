import { GroupManagement } from '#components/espace-agent-components/group-management';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { redirect } from 'next/navigation';

const MesEquipesPage = async () => {
  const session = await getSession();

  if (
    !hasRights(session, ApplicationRights.isAgent) ||
    !session?.user?.email ||
    !session?.user?.userId
  ) {
    return redirect('/lp/agent-public');
  }

  return (
    <>
      <h1>Mes équipes</h1>
      {/* <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <ButtonLink type="button">Nouvelle équipe</ButtonLink>
      </div> */}

      <GroupManagement
        currentUserEmail={session.user.email}
        currentUserSub={session.user.userId}
      />
    </>
  );
};

export default MesEquipesPage;
