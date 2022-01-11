import React from 'react';
import { Siren } from '../../utils/helpers/siren-and-siret';

const StructuredDataBreadcrumb: React.FC<{ siren: Siren }> = ({ siren }) => (
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
            "name": "Rechercher une entreprise",
            "item": "https://annuaire-entreprises.data.gouv.fr"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "${siren}",
            "item": "https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}"
          }]
        }`,
    }}
  />
);

export default StructuredDataBreadcrumb;
