import React from 'react';
import { UniteLegale } from '../../model';
import { formatDateLong, formatSiret } from '../../utils/formatting';
import { libelleFromCodeNaf } from '../../utils/helper';
import HorizontalSeparator from '../horizontalSeparator';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../tag';

const EtablissementListeSection: React.FC<{
  uniteLegale: UniteLegale;
}> = ({ uniteLegale }) => (
  <div id="etablissements">
    <HorizontalSeparator />
    <p>
      Cette entreprise possède XX établissement
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
    <Section title="La liste des établissements de l'entreprise">
      <FullTable
        head={['SIRET', 'Activité (code NAF)', 'Adresse', 'Statut']}
        body={uniteLegale.etablissements.map((elem: any) => [
          <a href={`/entreprise/${elem.siret}`}>{formatSiret(elem.siret)}</a>,
          <>
            {elem.activite_principale} -{' '}
            {libelleFromCodeNaf(elem.activite_principale)}
          </>,
          elem.geo_adresse,
          <>
            {elem.etablissement_siege === 'true' ? (
              <Tag>siège social</Tag>
            ) : null}
            {elem.etat_administratif === 'A' ? null : (
              <Tag className="closed">fermé</Tag>
            )}
          </>,
        ])}
      />
    </Section>
  </div>
);

export default EtablissementListeSection;
