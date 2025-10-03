import type React from "react";
import type { IUniteLegale } from "#models/core/types";
import {
  getDepartementFromCodePostal,
  getUrlFromDepartement,
  libelleFromDepartement,
} from "#utils/helpers/formatting/labels";

const StructuredDataBreadcrumb: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  try {
    const naf = uniteLegale.activitePrincipale;
    const dep = getDepartementFromCodePostal(uniteLegale.siege.codePostal);
    const depUrl = getUrlFromDepartement(dep || "");

    if (!dep || !depUrl || !naf) {
      throw new Error();
    }

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Entreprises par départements",
            "item": "https://annuaire-entreprises.data.gouv.fr/departements/index.html"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "${libelleFromDepartement(dep)}",
            "item": "https://annuaire-entreprises.data.gouv.fr/departements/${depUrl}/index.html"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "${naf}",
            "item": "https://annuaire-entreprises.data.gouv.fr/departements/${depUrl}/${naf}/1.html"
          }]
        }`,
        }}
        type="application/ld+json"
      />
    );
  } catch {
    return null;
  }
};

export default StructuredDataBreadcrumb;
