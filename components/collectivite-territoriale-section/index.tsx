import FAQLink from '#components-ui/faq-link';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { ICollectiviteTerritoriale } from '#models/core/types';
import React from 'react';

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
        <a href={`/dirigeants/${uniteLegale.siren}`}>
          → voir les {elus.length} élu(s)
        </a>
      ) : (
        ''
      ),
    ],
  ];

  const shouldDisplayCollectiviteLink = codeInsee && niveau === 'commune';
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
        {shouldDisplayCollectiviteLink && (
          <>
            <br />
            Retrouvez plus d&apos;informations sur la{' '}
            <a
              target="_blank"
              href={`https://collectivite.fr/${codeInsee}`}
              rel="noopener"
            >
              fiche collectivites.fr
            </a>
            .
          </>
        )}
      </Section>
    </>
  );
};

export default CollectiviteTerritorialeSection;
