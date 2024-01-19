import React from 'react';
import { estActif } from '#models/etat-administratif';
import { IUniteLegale } from '#models/index';
import { getAdresseUniteLegale, getNomComplet } from '#models/statut-diffusion';
import {
  capitalize,
  formatAge,
  formatDateLong,
  uniteLegaleLabelWithPronoun,
} from '#utils/helpers';
import { libelleCategorieEntrepriseForDescription } from '#utils/helpers/formatting/categories-entreprise';
import { libelleEffectifForDescription } from '#utils/helpers/formatting/codes-effectifs';
import { ISession } from '#utils/session';
import { UniteLegaleEtablissementCountDescription } from './etablissement-count-description';

export const UniteLegaleDescription: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const ageCreation = uniteLegale.dateCreation
    ? formatAge(uniteLegale.dateCreation)
    : null;

  const ageFermeture =
    uniteLegale.dateDebutActivite && !estActif(uniteLegale)
      ? formatAge(uniteLegale.dateDebutActivite)
      : null;

  return (
    <>
      <p>
        <>
          {capitalize(uniteLegaleLabelWithPronoun(uniteLegale))}{' '}
          {getNomComplet(uniteLegale, session)}
        </>
        {uniteLegale.dateCreation ? (
          <>
            {' '}
            a été créée le <b>{formatDateLong(uniteLegale.dateCreation)}</b>
            {ageCreation && <>, il y a {ageCreation}</>}.{' '}
          </>
        ) : (
          <> n’a pas de date de création connue. </>
        )}
        {uniteLegale.dateDebutActivite && !estActif(uniteLegale) && (
          <>
            Elle a été fermée le{' '}
            <b>{formatDateLong(uniteLegale.dateDebutActivite)}</b>
            {ageFermeture && <>, il y a {ageFermeture}</>}.{' '}
          </>
        )}
        {uniteLegale.natureJuridique && (
          <>
            Sa forme juridique est <b>{uniteLegale.libelleNatureJuridique}</b>.{' '}
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
            <a href={`/carte/${uniteLegale.siege.siret}`}>
              {getAdresseUniteLegale(uniteLegale, session)}
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
