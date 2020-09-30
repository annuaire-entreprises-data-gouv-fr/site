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
  getCompanyTitle,
  libelleFromCategoriesJuridiques,
} from '../../utils/helper';
import HorizontalSeparator from '../horizontalSeparator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const entrepriseDescription = (uniteLegale: UniteLegale) => {
  if (uniteLegale.statut_diffusion === 'N') {
    return '';
  }
  let description = `L’entreprise ${getCompanyTitle(uniteLegale)} `;

  if (uniteLegale.categorie_juridique) {
    description += (
      <>
        est une{' '}
        {libelleFromCategoriesJuridiques(uniteLegale.categorie_juridique)}
      </>
    );
  }
  if (uniteLegale.date_creation) {
    description += <>créee le {formatDateLong(uniteLegale.date_creation)}</>;
  }
  if (
    uniteLegale.etablissement_siege &&
    uniteLegale.etablissement_siege.geo_adresse
  ) {
    description += (
      <>
        et dont le siège est domicilié au{' '}
        <a
          href={`/rechercher/carte?siret=${uniteLegale.etablissement_siege.siret}`}
        >
          {uniteLegale.etablissement_siege.geo_adresse}
        </a>
      </>
    );
  }
  description += '.';
  return description;
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
              uniteLegale.etablissement_siege.siret && (
                <>
                  {formatSiret((uniteLegale.etablissement_siege || {}).siret)}{' '}
                  <a
                    href={`/entreprise/${
                      (uniteLegale.etablissement_siege || {}).siret
                    }`}
                  >
                    (voir le siège social)
                  </a>
                </>
              ),
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
