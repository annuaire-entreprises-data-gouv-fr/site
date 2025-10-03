import ButtonLink from "#components-ui/button";
import constants from "#models/constants";
import AgentNavigationLink from "./agent-navigation-link";

export default async function AgentNavigation() {
  const navLinks = [
    { label: "Mon espace", href: "/compte/accueil" },
    { label: "Mes groupes", href: "/compte/mes-groupes" },
  ];
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "1rem 0",
      }}
    >
      <div style={{ display: "flex", gap: "2rem" }}>
        {navLinks.map(({ label, href }) => (
          <AgentNavigationLink href={href} key={href} label={label} />
        ))}
      </div>
      <div>
        <ButtonLink
          alt
          ariaLabel="Documentation"
          target="_blank"
          to={constants.links.documentation.home}
        >
          Documentation
        </ButtonLink>
      </div>
    </nav>
  );
}
