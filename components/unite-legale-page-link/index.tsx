"use client";

import { type IUniteLegale, isAssociation } from "#models/core/types";

type IProp = {
  /**
   * The unite legale to use for the link label.
   */
  uniteLegale: IUniteLegale;
  /**
   * The href attribute for the link. Ex : /entreprise/123456789.
   */
  href: string;
  /**
   * If external link, the site name for the link label (ex: "le site de l'INSEE" / "association.gouv.fr").
   */
  siteName?: string;
};

export function UniteLegalePageLink({ uniteLegale, href, siteName }: IProp) {
  const linkLabel = isAssociation(uniteLegale)
    ? "la page de l’association"
    : "la page de l’entreprise";
  const siteDescription = siteName ? ` sur ${siteName}` : "";
  return (
    <>
      <a
        aria-label={`Voir ${linkLabel}${siteDescription}`}
        href={href}
        rel="noreferrer noopener"
        target="_blank"
      >
        {linkLabel}
      </a>
      {siteDescription}
    </>
  );
}
