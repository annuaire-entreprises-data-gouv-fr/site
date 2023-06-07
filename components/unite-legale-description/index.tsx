import React from 'react';
import { estActif } from '#models/etat-administratif';
import { IUniteLegale } from '#models/index';
import { getAdresseUniteLegale, getNomComplet } from '#models/statut-diffusion';
import { formatAge, formatDateLong } from '#utils/helpers';
import {
  getCompanyLabel,
  getCompanyPronoun,
} from '#utils/helpers/get-company-page-title';
import { ISession } from '#utils/session';

export const UniteLegaleDescription: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const { nombreEtablissements, nombreEtablissementsOuverts, usePagination } =
    uniteLegale.etablissements;

  const hasOpenEtablissements = nombreEtablissementsOuverts > 0;

  const plural = nombreEtablissements > 1 ? 's' : '';
  const pluralBe = nombreEtablissementsOuverts > 1 ? 'sont' : 'est';

  const ageCreation = formatAge(uniteLegale.dateCreation);
  const ageFermeture = !estActif(uniteLegale)
    ? formatAge(uniteLegale.dateDebutActivite)
    : undefined;

  return (
    <>
      <p>
        <>
          {getCompanyPronoun(uniteLegale)}
          {getCompanyLabel(uniteLegale)} {getNomComplet(uniteLegale, session)}
        </>
        {uniteLegale.dateCreation && (
          <>
            {' '}
            a été créée le <b>{formatDateLong(uniteLegale.dateCreation)}</b>
            {ageCreation && <>, il y a {ageCreation}</>}.{' '}
          </>
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
            Son domaine d’activité est : {uniteLegale.libelleActivitePrincipale}
            .
          </>
        )}
        {uniteLegale.anneeCategorieEntreprise &&
          uniteLegale.libelleCategorieEntreprise && (
            <>
              {' '}
              En {uniteLegale.anneeCategorieEntreprise}, elle était catégorisée{' '}
              <b>{uniteLegale.libelleCategorieEntreprise}</b>
              {uniteLegale.libelleTrancheEffectif &&
              uniteLegale.trancheEffectif !== 'NN' ? (
                <> et possédait {uniteLegale.libelleTrancheEffectif}</>
              ) : (
                <> et ne possédait pas de salariés</>
              )}
              .
            </>
          )}
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
            <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
              {nombreEtablissements} établissement{plural}
            </a>
            {hasOpenEtablissements &&
              !usePagination &&
              nombreEtablissements !== nombreEtablissementsOuverts && (
                <b>
                  {' '}
                  dont {nombreEtablissementsOuverts} {pluralBe} en activité
                </b>
              )}
            .
          </>
        )}
      </p>
    </>
  );
};
