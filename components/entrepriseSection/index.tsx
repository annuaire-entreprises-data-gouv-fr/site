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
  tvaIntracommunautaire,
} from '../../utils/helper';
import HorizontalSeparator from '../horizontalSeparator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const entrepriseDescription = (uniteLegale: UniteLegale) => (
  <>
    <>La société {uniteLegale.nom_complet}</>{' '}
    {uniteLegale.categorie_juridique && (
      <>
        est une{' '}
        <b>
          {libelleFromCategoriesJuridiques(uniteLegale.categorie_juridique)}
        </b>{' '}
      </>
    )}
    {uniteLegale.date_creation && (
      <>
        créee le <b>{formatDateLong(uniteLegale.date_creation)}</b>{' '}
      </>
    )}
    {uniteLegale.etablissement_siege &&
      uniteLegale.etablissement_siege.geo_adresse && (
        <>
          et dont le siège est domicilié au{' '}
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
        Cette société possède{' '}
        <a href={`#etablissements`}>
          {uniteLegale.etablissements.length} établissement(s).
        </a>
      </>
    )}
  </>
);

const EntrepriseSection: React.FC<{
  uniteLegale: UniteLegale;
}> = ({ uniteLegale }) => (
  <div id="entreprise">
    <p>{entrepriseDescription(uniteLegale)}</p>
    <Section title={`Les informations sur cette société`}>
      <TwoColumnTable
        body={[
          ['SIREN', formatNumbersFr(uniteLegale.siren)],
          [
            'SIRET du siège social',
            uniteLegale.etablissement_siege &&
              uniteLegale.etablissement_siege.siret &&
              formatSiret((uniteLegale.etablissement_siege || {}).siret),
          ],
          [
            'N° TVA Intracommunautaire',
            formatNumbersFr(tvaIntracommunautaire(uniteLegale.siren)),
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
          ['Date de création', formatDate(uniteLegale.date_creation)],
          [
            'Date de dernière mise à jour',
            formatDate(uniteLegale.date_mise_a_jour),
          ],
          [
            'Tranche effectif salarié de l’entreprise',
            libelleFromCodeEffectif(
              uniteLegale.tranche_effectif_salarie_entreprise
            ),
          ],
        ]}
      />
    </Section>
    <HorizontalSeparator />
  </div>
);

export default EntrepriseSection;
