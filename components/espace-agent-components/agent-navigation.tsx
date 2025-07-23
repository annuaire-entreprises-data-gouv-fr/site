import ButtonLink from '#components-ui/button';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import constants from '#models/constants';
import getSession from '#utils/server-side-helper/app/get-session';
import { redirect } from 'next/navigation';
import AgentNavigationLink from './agent-navigation-link';

export default async function AgentNavigation() {
  const session = await getSession();

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect('/lp/agent-public');
  }

  const navLinks = [
    { label: 'Mon espace', href: '/mon-espace' },
    { label: 'Mes équipes', href: '/mes-equipes' },
  ];
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem 0',
      }}
    >
      <div style={{ display: 'flex', gap: '2rem' }}>
        {navLinks.map(({ label, href }) => (
          <AgentNavigationLink href={href} label={label} key={href} />
        ))}
      </div>
      <div>
        <ButtonLink
          to={constants.links.documentation.home}
          target="_blank"
          alt
          ariaLabel="Documentation"
        >
          Documentation
        </ButtonLink>
      </div>
    </nav>
  );
}
