import React from 'react';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { MarcheInclusion } from '#components/administrations';
import { DataSectionServer } from '#components/section/data-section/server';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ICertifications } from '#models/certifications';
import { formatSiret } from '#utils/helpers';

export const EntrepriseInclusiveSection: React.FC<{
  entrepriseInclusive: ICertifications['entrepriseInclusive'];
}> = ({ entrepriseInclusive }) => {
  return (
    <DataSectionServer
      id="entreprise-inclusive"
      title="Entreprise Sociale Inclusive"
      sources={[EAdministration.MARCHE_INCLUSION]}
      data={entrepriseInclusive}
      notFoundInfo={
        <p>Nous n’avons pas retrouvé les informations de cette structure.</p>
      }
    >
      {(entrepriseInclusive) => (
        <>
          Cette structure est une{' '}
          <FAQLink tooltipLabel="Entreprise Sociale Inclusive">
            Une Entreprise Sociale Inclusive ou ESI, est une entreprise qui agit
            pour l’insertion sociale et professionnelle des personnes les plus
            éloignées de l’emploi.
          </FAQLink>
          .
          <p>
            Elle possède {entrepriseInclusive.length} établissement(s)
            enregistré(s) sur le <MarcheInclusion /> :
          </p>
          <FullTable
            head={[
              'Siret de l’établissement',
              'Catégorie',
              'Type de structure',
              'Plus d’informations',
            ]}
            body={entrepriseInclusive.map(
              ({ siret, marcheInclusionLink, type, category }) => {
                return [
                  <a href={`/etablissement/${siret}`}>{formatSiret(siret)}</a>,
                  category,
                  type,
                  <ButtonLink to={marcheInclusionLink} alt small>
                    ⇢&nbsp;Consulter
                  </ButtonLink>,
                ];
              }
            )}
          />
        </>
      )}
    </DataSectionServer>
  );
};
