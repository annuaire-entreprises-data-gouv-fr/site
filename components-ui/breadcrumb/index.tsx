const Breadcrumb: React.FC<{ links: { href: string; label: string }[] }> = ({
  links,
}) => (
  <nav role="navigation" className="fr-breadcrumb" aria-label="vous êtes ici :">
    <div id="breadcrumb-1">
      <ol className="fr-breadcrumb__list">
        {links.map(({ label, href = '' }) => (
          <li>
            <a className="fr-breadcrumb__link" href={href}>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  </nav>
);

export default Breadcrumb;
