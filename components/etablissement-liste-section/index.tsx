import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import { libelleFromCodeNaf } from '../../utils/labels';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../tag';

const EtablissementListeSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const closedEtablissement = uniteLegale.etablissements.filter(
    (etablissement) => etablissement.estActif
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
                (etablissement) => !etablissement.estActif
              ).length
            }{' '}
            fermés.
          </>
        )}
      </p>
      <Section title="La liste des établissements de l’entité">
        <FullTable
          head={['SIRET', 'Activité (code NAF)', 'Adresse', 'Statut']}
          body={uniteLegale.etablissements.map(
            (etablissement: IEtablissement) => [
              <a href={`/etablissement/${etablissement.siret}`}>
                {formatSiret(etablissement.siret)}
              </a>,
              <>
                {etablissement.activitePrincipale} -{' '}
                {libelleFromCodeNaf(etablissement.activitePrincipale)}
              </>,
              etablissement.adresse,
              <>
                {!uniteLegale.estDiffusible ? (
                  <Tag>non-diffusible</Tag>
                ) : (
                  <>
                    {etablissement.estSiege ? <Tag>siège social</Tag> : null}
                    {etablissement.estActif ? null : (
                      <Tag className="closed">fermé</Tag>
                    )}
                  </>
                )}
              </>,
            ]
          )}
        />
      </Section>
    </div>
  );
};
export default EtablissementListeSection;
