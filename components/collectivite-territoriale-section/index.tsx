import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { ICollectiviteTerritoriale } from '#models/core/types';

const CollectiviteTerritorialeSection: React.FC<{
  uniteLegale: ICollectiviteTerritoriale;
}> = ({ uniteLegale }) => {
  const {
    colter: { codeColter = '', codeInsee = '', elus = [], niveau = '' },
  } = uniteLegale;

  const data = [
    [
      <FAQLink
        to="https://www.insee.fr/fr/information/2560452"
        tooltipLabel="Code Insee"
      >
        Le Code Insee ou Code Officiel Géographique (COG) est utilisé par
        l’Insee pour désigner une commune
      </FAQLink>,
      codeInsee,
    ],
    [
      'Type',
      niveau === 'particulier' ? (
        <FAQLink
          to="https://www.insee.fr/fr/information/3528272"
          tooltipLabel={niveau}
        >
          {uniteLegale.nomComplet} est une collectivité territoriale à statut
          particulier
        </FAQLink>
      ) : (
        niveau
      ),
    ],
    [
      'Élus',
      elus.length > 0 ? (
        <a href={`/elus/${uniteLegale.siren}`}>
          → voir les {elus.length} élu(s)
        </a>
      ) : (
        ''
      ),
    ],
  ];

  return (
    <>
      <Section
        title={`Collectivité territoriale`}
        sources={[
          EAdministration.INSEE,
          EAdministration.MI,
          EAdministration.DINUM,
        ]}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
};

export default CollectiviteTerritorialeSection;
