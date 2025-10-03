"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
      aria-current={pathname === href ? "page" : undefined}
      className={"fr-nav__link"}
      href={href}
      key={href}
    >
      {label}
    </Link>
  );
}
