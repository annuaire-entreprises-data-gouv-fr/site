import React from 'react';
import { IUniteLegale } from '../../models';
import { formatDateLong } from '../../utils/helpers/formatting';

export const UnitLegaleDescription: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  const { nombreEtablissements, nombreEtablissementsOuverts, usePagination } =
    uniteLegale.etablissements;

  const hasOpenEtablissements = nombreEtablissementsOuverts > 0;

  const plural = nombreEtablissements > 1 ? 's' : '';
  const pluralBe = nombreEtablissementsOuverts > 1 ? 'sont' : 'est';

  return (
    <p>
      <>L’unité légale {uniteLegale.nomComplet}</>{' '}
      {uniteLegale.dateCreation && (
        <>
          a été créée le <b>{formatDateLong(uniteLegale.dateCreation)}</b>.{' '}
        </>
      )}
      {uniteLegale.dateDebutActivite && !uniteLegale.estActive && (
        <>
          Elle a été fermée le{' '}
          <b>{formatDateLong(uniteLegale.dateDebutActivite)}</b>.{' '}
        </>
      )}
      {uniteLegale.natureJuridique && (
        <>
          Sa forme juridique est <b>{uniteLegale.libelleNatureJuridique}</b>.{' '}
        </>
      )}
      {uniteLegale.siege && uniteLegale.siege.adresse && (
        <>
          Son siège social est domicilié au {uniteLegale.siege.adresse} (
          <a href={`/carte/${uniteLegale.siege.siret}`}>voir sur la carte</a>)
        </>
      )}
      .{' '}
      {uniteLegale.etablissements.all && (
        <>
          Elle possède {nombreEtablissements} établissement{plural}
          {hasOpenEtablissements && !usePagination && (
            <b>
              {' '}
              dont {nombreEtablissementsOuverts} {pluralBe} en activité
            </b>
          )}{' '}
          (
          <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
            voir la liste
          </a>
          ).
        </>
      )}
    </p>
  );
};
