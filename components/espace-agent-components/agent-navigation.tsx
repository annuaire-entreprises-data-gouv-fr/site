import ButtonLink from '#components-ui/button';
import constants from '#models/constants';
import AgentNavigationLink from './agent-navigation-link';

export default async function AgentNavigation() {
  const navLinks = [
    { label: 'Mon espace', href: '/compte/accueil' },
    { label: 'Mes équipes', href: '/compte/mes-equipes' },
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
