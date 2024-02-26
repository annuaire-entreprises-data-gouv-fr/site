import React from 'react';
import { IUniteLegale } from '#models/core/types';

export const UniteLegaleEtablissementCountDescription: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { nombreEtablissements, nombreEtablissementsOuverts, usePagination } =
    uniteLegale.etablissements;

  const hasOpenEtablissements = nombreEtablissementsOuverts > 0;

  const plural = nombreEtablissements > 1 ? 's' : '';
  const pluralBe = nombreEtablissementsOuverts > 1 ? 'sont' : 'est';

  return (
    <>
      <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
        {nombreEtablissements} établissement{plural}
      </a>
      {hasOpenEtablissements &&
        !usePagination &&
        nombreEtablissements !== nombreEtablissementsOuverts && (
          <strong>
            {' '}
            dont {nombreEtablissementsOuverts} {pluralBe} en activité
          </strong>
        )}
    </>
  );
};
