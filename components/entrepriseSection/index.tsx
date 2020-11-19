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
} from '../../utils/helper';
import HorizontalSeparator from '../horizontalSeparator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const entrepriseDescription = (uniteLegale: UniteLegale) => {
  if (uniteLegale.statut_diffusion === 'N') {
    return <></>;
  } else
    return (
      <>
        <>L’entreprise {uniteLegale.nom_complet}</>{' '}
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
            Cette entreprise possède{' '}
            <a href={`#etablissements`}>
              {uniteLegale.etablissements.length} établissement(s).
            </a>
          </>
        )}
      </>
    );
};

const EntrepriseSection: React.FC<{
  uniteLegale: UniteLegale;
}> = ({ uniteLegale }) => (
  <div id="entreprise">
    <p>{entrepriseDescription(uniteLegale)}</p>
    <Section title={`Les informations sur cette entreprise`}>
      <TwoColumnTable
        body={[
          ['SIREN', formatNumbersFr(uniteLegale.siren)],
          [
            'Siège social',
            uniteLegale.etablissement_siege &&
              uniteLegale.etablissement_siege.siret &&
              formatSiret((uniteLegale.etablissement_siege || {}).siret),
          ],
          [
            'Activité principale (siège)',
            fullLibelleFromCodeNaf(
              (uniteLegale.etablissement_siege || {}).activite_principale
            ),
          ],
          [
            'Nature juridique',
            libelleFromCategoriesJuridiques(uniteLegale.categorie_juridique),
          ],
          ['Date de création', formatDate(uniteLegale.date_creation)],
        ]}
      />
    </Section>
    <HorizontalSeparator />
  </div>
);

export default EntrepriseSection;
