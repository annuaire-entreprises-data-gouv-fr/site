import { Link } from "#components/Link";

const Breadcrumb: React.FC<{ links: { href: string; label: string }[] }> = ({
  links,
}) => (
  <nav aria-label="vous êtes ici :" className="fr-breadcrumb" role="navigation">
    <div id="breadcrumb-1">
      <ol className="fr-breadcrumb__list">
        {links.map(({ label, href = "" }, index) => (
          <li key={href + index}>
            <Link className="fr-breadcrumb__link" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  </nav>
);

export default Breadcrumb;
