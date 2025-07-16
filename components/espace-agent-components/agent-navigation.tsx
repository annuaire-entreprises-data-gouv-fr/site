'use client';

import ButtonLink from '#components-ui/button';
import constants from '#models/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AgentNavigation() {
  const pathname = usePathname();
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
          <Link
            className={'fr-nav__link'}
            aria-current={pathname === href ? 'page' : undefined}
            key={href}
            href={href}
          >
            {label}
          </Link>
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
