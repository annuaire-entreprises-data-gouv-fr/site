'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AgentNavigationLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      className={'fr-nav__link'}
      aria-current={pathname === href ? 'page' : undefined}
      key={href}
      href={href}
    >
      {label}
    </Link>
  );
}
