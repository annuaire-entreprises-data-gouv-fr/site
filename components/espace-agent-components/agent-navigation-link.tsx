"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
