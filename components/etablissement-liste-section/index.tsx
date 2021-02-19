import React from 'react';
import { UniteLegale } from '../../models';
import { formatSiret } from '../../utils/helpers/formatting';
import { libelleFromCodeNaf } from '../../utils/helper';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../tag';

const EtablissementListeSection: React.FC<{
  uniteLegale: UniteLegale;
}> = ({ uniteLegale }) => {
  const closedEtablissement = uniteLegale.etablissements.filter(
    (etab) => etab.etat_administratif_etablissement !== 'A'
  ).length;
  return (
    <div id="etablissements">
      <p>
        Cette entité possède {uniteLegale.etablissements.length}{' '}
        établissement(s)
        {closedEtablissement > 0 && (
          <>
            {' '}
            dont{' '}
            {
              uniteLegale.etablissements.filter(
                (etab) => etab.etat_administratif_etablissement !== 'A'
              ).length
            }{' '}
            fermés.
          </>
        )}
      </p>
      <Section title="La liste des établissements de l’entité">
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
                  {elem.is_siege ? <Tag>siège social</Tag> : null}
                  {elem.etat_administratif_etablissement === 'A' ? null : (
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
};
export default EtablissementListeSection;
