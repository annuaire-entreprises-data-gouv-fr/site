import { useLocation } from "@tanstack/react-router";
import { Link } from "#/components/Link";

export default function AgentNavigationLink({
  id,
  href,
  label,
}: {
  id: string;
  href: string;
  label: string;
}) {
  const pathname = useLocation().pathname;

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
