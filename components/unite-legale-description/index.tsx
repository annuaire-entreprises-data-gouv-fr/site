import React from 'react';
import { estActif } from '#models/etat-administratif';
import { IUniteLegale } from '#models/index';
import { getAdresseUniteLegale, getNomComplet } from '#models/statut-diffusion';
import { formatDateLong } from '#utils/helpers';
import {
  getCompanyLabel,
  getCompanyPronoun,
} from '#utils/helpers/get-company-page-title';

export const UniteLegaleDescription: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { nombreEtablissements, nombreEtablissementsOuverts, usePagination } =
    uniteLegale.etablissements;

  const hasOpenEtablissements = nombreEtablissementsOuverts > 0;

  const plural = nombreEtablissements > 1 ? 's' : '';
  const pluralBe = nombreEtablissementsOuverts > 1 ? 'sont' : 'est';

  return (
    <p>
      {`${getCompanyPronoun(uniteLegale)}${getCompanyLabel(
        uniteLegale
      )} ${getNomComplet(uniteLegale)} `}
      {uniteLegale.dateCreation && (
        <>
          a été créée le <b>{formatDateLong(uniteLegale.dateCreation)}</b>.{' '}
        </>
      )}
      {uniteLegale.dateDebutActivite && !estActif(uniteLegale) && (
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
          Son{' '}
          <a href={`/etablissement/${uniteLegale.siege.siret}`}>siège social</a>{' '}
          est domicilié au{' '}
          <a href={`/carte/${uniteLegale.siege.siret}`}>
            {getAdresseUniteLegale(uniteLegale)}
          </a>
          {'. '}
        </>
      )}
      {uniteLegale.etablissements.all && (
        <>
          Elle possède{' '}
          <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
            {nombreEtablissements} établissement{plural}
          </a>
          {hasOpenEtablissements && !usePagination && (
            <b>
              {' '}
              dont {nombreEtablissementsOuverts} {pluralBe} en activité
            </b>
          )}
          .
        </>
      )}
    </p>
  );
};
