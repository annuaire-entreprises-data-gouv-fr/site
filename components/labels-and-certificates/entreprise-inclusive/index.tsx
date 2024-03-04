import React from 'react';
import ButtonLink from '#components-ui/button';
import { ServerDataSection } from '#components/section/server-data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IEntrepriseInclusive } from '#models/certifications/entreprise-inclusive';
import { formatSiret } from '#utils/helpers';

export const EntrepriseInclusiveSection: React.FC<{
  entrepriseInclusive: IEntrepriseInclusive | IAPINotRespondingError;
}> = ({ entrepriseInclusive }) => {
  return (
    <ServerDataSection
      id="entreprise-inclusive"
      title="Entreprise Inclusive"
      sources={[EAdministration.MARCHE_INCLUSION]}
      data={entrepriseInclusive}
      notFoundInfo={
        <p>Nous n’avons pas retrouvé les informations de cette structure.</p>
      }
    >
      {({ siret, marcheInclusionLink, type }) => (
        <FullTable
          head={[
            'Siret de l’établissement',
            'Type de structure',
            'Lien vers le marché',
          ]}
          body={[
            [
              <a href={`/etablissement/${siret}`}>{formatSiret(siret)}</a>,
              type,
              <ButtonLink to={marcheInclusionLink} alt small>
                Consulter la page
              </ButtonLink>,
            ],
          ]}
        />
      )}
    </ServerDataSection>
  );
};
