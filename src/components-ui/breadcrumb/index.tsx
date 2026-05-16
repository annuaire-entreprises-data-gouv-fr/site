import type { ComponentProps } from "react";
import { Link } from "#/components/Link";

interface IBreadcrumbLink extends ComponentProps<typeof Link> {
  label: string;
}

const Breadcrumb: React.FC<{
  links: IBreadcrumbLink[];
}> = ({ links }) => (
  <nav aria-label="vous êtes ici :" className="fr-breadcrumb">
    <div id="breadcrumb-1">
      <ol className="fr-breadcrumb__list">
        {links.map(({ label, hash, params, to }) => (
          <li key={label}>
            <Link
              activeOptions={{ exact: true }}
              className="fr-breadcrumb__link"
              hash={hash}
              params={params}
              to={to}
            >
              {label}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  </nav>
);

export default Breadcrumb;
