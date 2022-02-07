import React from 'react';

interface IProps {
  links: IBreadcrumbLink[];
}

export interface IBreadcrumbLink {
  to?: string;
  label: string;
}

const BreadCrumb: React.FC<IProps> = ({ links }) => (
  <nav role="navigation" className="fr-breadcrumb" aria-label="vous êtes ici :">
    <ol className="fr-breadcrumb__list">
      <li>
        <a className="fr-breadcrumb__link" href="/">
          Accueil
        </a>
      </li>
      {links.map((link, index) => (
        <li key={link.label}>
          {links.length > 0 && index === links.length - 1 ? (
            <a className="fr-breadcrumb__link" aria-current="page">
              {link.label}
            </a>
          ) : (
            <a className="fr-breadcrumb__link" href={link.to}>
              {link.label}
            </a>
          )}
        </li>
      ))}
    </ol>
    <style jsx>{`
      .fr-breadcrumb {
        display: inline-block;
        margin-bottom: 10px;
      }
    `}</style>
  </nav>
);

export default BreadCrumb;
