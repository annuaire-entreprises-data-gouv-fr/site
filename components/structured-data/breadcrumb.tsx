import type { IUniteLegale } from "#models/core/types";
import {
  getDepartementFromCodePostal,
  getUrlFromDepartement,
  libelleFromDepartement,
} from "#utils/helpers/formatting/labels";
import { getNonce } from "#utils/server-side-helper/headers/nonce";

const StructuredDataBreadcrumb = async ({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) => {
  try {
    const naf = uniteLegale.activitePrincipale;
    const dep = getDepartementFromCodePostal(uniteLegale.siege.codePostal);
    const depUrl = getUrlFromDepartement(dep || "");

    if (!dep || !depUrl || !naf) {
      throw new Error();
    }

    const nonce = await getNonce();
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
        nonce={nonce}
        type="application/ld+json"
      />
    );
  } catch {
    return null;
  }
};

export default StructuredDataBreadcrumb;
