import { TeamManagement } from '#components/espace-agent-components/team-management';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { Groups } from '#models/groups';
import getSession from '#utils/server-side-helper/app/get-session';
import { redirect } from 'next/navigation';

const MyTeamsPage = async () => {
  const session = await getSession();

  if (
    !hasRights(session, ApplicationRights.isAgent) ||
    !session?.user?.email ||
    !session?.user?.userId
  ) {
    return redirect('/lp/agent-public');
  }

  const groups = await Groups.find(session.user.email, session.user.userId);

  return (
    <>
      <h1>Mes équipes</h1>
      {/* <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <ButtonLink type="button">Nouvelle équipe</ButtonLink>
      </div> */}

      <TeamManagement groups={groups} currentUserEmail={session.user.email} />
    </>
  );
};

export default MyTeamsPage;
