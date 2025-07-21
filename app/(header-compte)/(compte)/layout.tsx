import AgentNavigation from '#components/espace-agent-components/agent-navigation';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { redirect } from 'next/navigation';

export default async function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect('/lp/agent-public');
  }

  return (
    <>
      <AgentNavigation />
      {children}
    </>
  );
}
