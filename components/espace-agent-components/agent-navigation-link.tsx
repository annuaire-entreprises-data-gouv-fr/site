'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AgentNavigationLink({
  href,
  label,
  isBeta = false,
}: {
  href: string;
  label: string;
  isBeta: boolean;
}) {
  const pathname = usePathname();

  return (
    <Link
      className={'fr-nav__link'}
      aria-current={pathname === href ? 'page' : undefined}
      key={href}
      href={href}
    >
      {isBeta && (
        <span className="fr-badge fr-mr-1w fr-badge--new fr-badge--sm">
          Beta
        </span>
      )}
      {label}
    </Link>
  );
}
