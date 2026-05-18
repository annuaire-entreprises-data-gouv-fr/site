import { useLocation } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Link } from "#/components/Link";

export default function AgentNavigationLink({
  id,
  to,
  label,
}: {
  id: string;
  to: ComponentProps<typeof Link>["to"];
  label: string;
}) {
  const pathname = useLocation().pathname;

  return (
    <Link
      aria-selected={pathname === to}
      className="fr-tabs__tab"
      id={id}
      key={to}
      role="tab"
      to={to}
    >
      {label}
    </Link>
  );
}
