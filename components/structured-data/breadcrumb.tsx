import React from 'react';
import { IUniteLegale } from '../../models';
import { getUrlFromDep } from '../../seo-scripts/page-tree-render';
import {
  getDepartementFromCodePostal,
  libelleFromDepartement,
} from '../../utils/labels';

const StructuredDataBreadcrumb: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  try {
    const naf = uniteLegale.activitePrincipale;
    const dep = getDepartementFromCodePostal(uniteLegale.siege.codePostal);
    const depUrl = getUrlFromDep(dep || '');

    if (!dep || !depUrl || !naf) {
      throw new Error();
    }

    return (
      <script
        type="application/ld+json"
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
      />
    );
  } catch {
    return null;
  }
};

export default StructuredDataBreadcrumb;
