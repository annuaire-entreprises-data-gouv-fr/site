import React from 'react';
import { UniteLegale } from '../../model';
import { formatDateLong, formatSiret } from '../../utils/formatting';
import { libelleFromCodeNaf } from '../../utils/helper';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../tag';

const EtablissementListeSection: React.FC<{
  uniteLegale: UniteLegale;
}> = ({ uniteLegale }) => (
  <div id="etablissements">
    <p>
      Cette entreprise possède {uniteLegale.etablissements.length}{' '}
      établissement(s) dont{' '}
      {
        uniteLegale.etablissements.filter(
          (etab) => etab.etat_administratif !== 'A'
        ).length
      }{' '}
      fermés.
    </p>
    <Section title="La liste des établissements de l'entreprise">
      <FullTable
        head={['SIRET', 'Activité (code NAF)', 'Adresse', 'Statut']}
        body={uniteLegale.etablissements.map((elem: any) => [
          <a href={`/etablissement/${elem.siret}`}>
            {formatSiret(elem.siret)}
          </a>,
          <>
            {elem.activite_principale} -{' '}
            {libelleFromCodeNaf(elem.activite_principale)}
          </>,
          elem.geo_adresse,
          <>
            {uniteLegale.statut_diffusion === 'N' ? (
              <Tag>non-diffusible</Tag>
            ) : (
              <>
                {elem.etablissement_siege === 'true' ? (
                  <Tag>siège social</Tag>
                ) : null}
                {elem.etat_administratif === 'A' ? null : (
                  <Tag className="closed">fermé</Tag>
                )}
              </>
            )}
          </>,
        ])}
      />
    </Section>
  </div>
);

export default EtablissementListeSection;
