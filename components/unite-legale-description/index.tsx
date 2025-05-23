import { IUniteLegale } from '#models/core/types';
import {
  capitalize,
  formatAge,
  formatDateLong,
  uniteLegaleLabelWithPronoun,
} from '#utils/helpers';
import { libelleCategorieEntrepriseForDescription } from '#utils/helpers/formatting/categories-entreprise';
import { libelleEffectifForDescription } from '#utils/helpers/formatting/codes-effectifs';
import React from 'react';
import { UniteLegaleEtablissementCountDescription } from './etablissement-count-description';

export const UniteLegaleDescription: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const ageCreation = uniteLegale.dateCreation
    ? formatAge(uniteLegale.dateCreation)
    : null;

  const ageFermeture = uniteLegale.dateFermeture
    ? formatAge(uniteLegale.dateFermeture)
    : null;

  return (
    <>
      <p>
        <>
          {capitalize(uniteLegaleLabelWithPronoun(uniteLegale))}{' '}
          {uniteLegale.nomComplet}
        </>
        {uniteLegale.dateCreation ? (
          <>
            {' '}
            a été créée le{' '}
            <strong>{formatDateLong(uniteLegale.dateCreation)}</strong>
            {ageCreation && <>, il y a {ageCreation}</>}.{' '}
          </>
        ) : (
          <> n’a pas de date de création connue. </>
        )}
        {uniteLegale.dateFermeture && (
          <>
            Elle a été fermée le{' '}
            <strong>{formatDateLong(uniteLegale.dateFermeture)}</strong>
            {ageFermeture && <>, il y a {ageFermeture}</>}.{' '}
          </>
        )}
        {uniteLegale.natureJuridique && (
          <>
            Sa forme juridique est{' '}
            <strong>{uniteLegale.libelleNatureJuridique}</strong>.{' '}
          </>
        )}
        {uniteLegale.libelleActivitePrincipale && (
          <>
            Son domaine d’activité est :{' '}
            {(uniteLegale.libelleActivitePrincipale || '').toLowerCase()}.
          </>
        )}
        {libelleCategorieEntrepriseForDescription(uniteLegale)}
        {libelleEffectifForDescription(uniteLegale)}
      </p>
      <p>
        {uniteLegale.siege && uniteLegale.siege.adresse && (
          <>
            Son{' '}
            <a href={`/etablissement/${uniteLegale.siege.siret}`}>
              siège social
            </a>{' '}
            est domicilié au{' '}
            <a href={`/etablissement/${uniteLegale.siege.siret}`}>
              {uniteLegale.siege.adresse}
            </a>
            .
          </>
        )}
        {uniteLegale.etablissements.all && (
          <>
            {' '}
            Elle possède{' '}
            <UniteLegaleEtablissementCountDescription
              uniteLegale={uniteLegale}
            />
            .
          </>
        )}
      </p>
    </>
  );
};
