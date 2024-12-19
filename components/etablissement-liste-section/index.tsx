'use client';

import { EtablissementsMap } from '#components/map/map-etablissement';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import constants from '#models/constants';
import { IUniteLegale } from '#models/core/types';
import { uniteLegaleLabelWithPronounContracted } from '#utils/helpers';
import React, { useState } from 'react';
import { EtablissementFilters } from './filters';
import { EtablissementsTable } from './table';

const EtablissementListeSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const [filteredEtablissements, setFilteredEtablissements] = useState(
    uniteLegale.etablissements
  );

  const [showMap, toggleMap] = useState(false);

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

  return (
    <Section
      id="etablissements"
      title={`${nombreEtablissements} établissement${plural} de ${uniteLegale.nomComplet}`}
      sources={[EAdministration.INSEE]}
      lastModified={uniteLegale.dateDerniereMiseAJour}
    >
      <p>
        Cette structure possède{' '}
        <strong>
          {nombreEtablissements} établissement{plural}
        </strong>
        {nombreEtablissementsOuverts ? (
          <>
            {' '}
            dont {nombreEtablissementsOuverts} {pluralBe} en activité
          </>
        ) : null}
        .
      </p>
      <p>
        Sauf mention contraire, l’activité principale des établissements est
        celle {uniteLegaleLabelWithPronounContracted(uniteLegale)}
        {' : '}
        <i>
          {uniteLegale.libelleActivitePrincipale} (
          {uniteLegale.activitePrincipale})
        </i>
        .
      </p>
      <p>
        Cliquez sur un n° SIRET pour obtenir plus d’information, filtrez par
        état administratif ou affichez sur une carte :
      </p>
      <EtablissementFilters
        allEtablissements={uniteLegale.etablissements}
        setFilteredEtablissements={setFilteredEtablissements}
        toggleMap={() => toggleMap(!showMap)}
      />
      {showMap ? (
        <EtablissementsMap etablissements={filteredEtablissements} />
      ) : (
        <EtablissementsTable
          etablissements={filteredEtablissements}
          uniteLegale={uniteLegale}
        />
      )}
    </Section>
  );
};
export default EtablissementListeSection;
