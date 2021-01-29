import React from 'react';
import { Etablissement, UniteLegale } from '../../model';
import {
  formatDate,
  formatDateLong,
  formatNumbersFr,
  formatSiret,
} from '../../utils/formatting';
import {
  fullLibelleFromCodeNaf,
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
} from '../../utils/helper';
import HorizontalSeparator from '../horizontalSeparator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const entrepriseDescription = (uniteLegale: UniteLegale) => (
  <>
    <>L’entité {uniteLegale.nom_complet}</>{' '}
    {uniteLegale.categorie_juridique && (
      <>
        est une{' '}
        <b>
          {libelleFromCategoriesJuridiques(uniteLegale.categorie_juridique)}
        </b>{' '}
      </>
    )}
    {uniteLegale.date_creation_entreprise && (
      <>
        créee le <b>{formatDateLong(uniteLegale.date_creation_entreprise)}</b>
      </>
    )}
    {uniteLegale.date_debut_activite &&
      uniteLegale.etablissement_siege &&
      uniteLegale.etablissement_siege.etat_administratif_etablissement !==
        'A' && (
        <>
          {' '}
          et fermée le <b>{formatDateLong(uniteLegale.date_debut_activite)}</b>
        </>
      )}
    {uniteLegale.etablissement_siege &&
      uniteLegale.etablissement_siege.geo_adresse && (
        <>
          , dont le siège est domicilié au{' '}
          <a
            href={`/rechercher/carte?siret=${uniteLegale.etablissement_siege.siret}`}
          >
            {uniteLegale.etablissement_siege.geo_adresse}
          </a>
        </>
      )}
    .{' '}
    {uniteLegale.etablissements && (
      <>
        Cette entité possède{' '}
        <a href={`#etablissements`}>
          {uniteLegale.etablissements.length} établissement(s).
        </a>
      </>
    )}
  </>
);

const EntrepriseSection: React.FC<{
  uniteLegale: UniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    ['Dénomination', uniteLegale.nom_complet],
    ['SIREN', formatNumbersFr(uniteLegale.siren)],
    [
      'SIRET du siège social',
      uniteLegale.etablissement_siege &&
        uniteLegale.etablissement_siege.siret &&
        formatSiret((uniteLegale.etablissement_siege || {}).siret),
    ],
    [
      'N° TVA Intracommunautaire',
      formatNumbersFr(uniteLegale.numero_tva_intra),
    ],
    [
      'Activité principale (siège social)',
      fullLibelleFromCodeNaf(
        (uniteLegale.etablissement_siege || {}).activite_principale
      ),
    ],
    [
      'Nature juridique',
      libelleFromCategoriesJuridiques(uniteLegale.categorie_juridique),
    ],
    [
      'Tranche effectif salarié de l’entité',
      libelleFromCodeEffectif(uniteLegale.tranche_effectif_salarie_entreprise),
    ],
    ['Date de création', formatDate(uniteLegale.date_creation_entreprise)],
    ['Date de dernière mise à jour', formatDate(uniteLegale.date_mise_a_jour)],
  ];
  if (
    uniteLegale.etablissement_siege.etat_administratif_etablissement !== 'A'
  ) {
    data.push([
      'Date de fermeture',
      formatDate(uniteLegale.date_debut_activite),
    ]);
  }

  return (
    <div id="entreprise">
      <p>{entrepriseDescription(uniteLegale)}</p>
      <Section title={`Les informations sur cette entité`}>
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default EntrepriseSection;
