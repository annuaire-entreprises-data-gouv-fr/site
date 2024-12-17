import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import constants from '#models/constants';
import { IUniteLegale } from '#models/core/types';
import React from 'react';
import { EtablissementTable } from './table';

const EtablissementListeSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const {
    usePagination,
    nombreEtablissements,
    nombreEtablissementsOuverts,
    currentEtablissementPage,
  } = uniteLegale;

  const totalPages = Math.ceil(
    nombreEtablissements / constants.resultsPerPage.etablissements
  );

  const plural = nombreEtablissements > 1 ? 's' : '';
  const pluralBe = nombreEtablissementsOuverts > 1 ? 'sont' : 'est';

  const filteredEtablissements = uniteLegale.etablissements;

  return (
    <div id="etablissements">
      <p>
        Cette structure possède{' '}
        <strong>
          {nombreEtablissements} établissement{plural}
        </strong>
        {nombreEtablissementsOuverts && !usePagination ? (
          <>
            {' '}
            dont {nombreEtablissementsOuverts} {pluralBe} en activité
          </>
        ) : null}
        . Cliquez sur un n° SIRET pour obtenir plus d’information :
      </p>
      <Section
        title={`${nombreEtablissements} établissement${plural} de ${uniteLegale.nomComplet}`}
        sources={[EAdministration.INSEE]}
        lastModified={uniteLegale.dateDerniereMiseAJour}
      >
        <EtablissementFilters etablissements={filteredEtablissements} />
        <EtablissementTable uniteLegale={uniteLegale} />
      </Section>
    </div>
  );
};
export default EtablissementListeSection;
