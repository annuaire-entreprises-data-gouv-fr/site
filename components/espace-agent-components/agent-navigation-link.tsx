"use client";

import { usePathname } from "next/navigation";
import { Link } from "#components/Link";

export default function AgentNavigationLink({
  id,
  href,
  label,
}: {
  id: string;
  href: string;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      aria-selected={pathname === href}
      className="fr-tabs__tab"
      href={href}
      id={id}
      key={href}
      role="tab"
    >
      {label}
    </Link>
  );
}
