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

const EntrepriseSection: React.FC<{
  uniteLegale: UniteLegale;
}> = ({ uniteLegale }) => (
  <div id="entreprise">
    <HorizontalSeparator />
    <p>
      L’entreprise {getCompanyTitle(uniteLegale)}{' '}
      {uniteLegale.categorie_juridique && (
        <>
          est une{' '}
          <b>
            {libelleFromCategoriesJuridiques(uniteLegale.categorie_juridique)}
          </b>{' '}
        </>
      )}
      {uniteLegale.etablissement_siege.date_creation && (
        <>
          crée le{' '}
          {formatDateLong(uniteLegale.etablissement_siege.date_creation)}
        </>
      )}{' '}
      {uniteLegale.etablissement_siege.geo_adresse && (
        <>
          et domicilié au{' '}
          <a href="#contact">{uniteLegale.etablissement_siege.geo_adresse}</a>
        </>
      )}
      .
    </p>
    <Section title={`Les informations sur cette entreprise`}>
      <TwoColumnTable
        body={[
          ['SIREN', formatNumbersFr(uniteLegale.etablissement_siege.siren)],
          [
            'Siège social',
            <>
              {formatSiret(uniteLegale.etablissement_siege.siret)}{' '}
              <a href={`/entreprise/${uniteLegale.etablissement_siege.siret}`}>
                (voir le siège social)
              </a>
            </>,
          ],
          [
            'Activité principale (siège)',
            fullLibelleFromCodeNaf(
              uniteLegale.etablissement_siege.activite_principale
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
  </div>
);

export default EntrepriseSection;
