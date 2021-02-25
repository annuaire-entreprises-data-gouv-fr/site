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
  const closedEtablissement = uniteLegale.etablissementList.filter(
    (etablissement) => etablissement.isActive
  ).length;
  return (
    <div id="etablissements">
      <p>
        Cette entité possède {uniteLegale.etablissementList.length}{' '}
        établissement(s)
        {closedEtablissement > 0 && (
          <>
            {' '}
            dont{' '}
            {
              uniteLegale.etablissementList.filter(
                (etablissement) => etablissement.isActive
              ).length
            }{' '}
            fermés.
          </>
        )}
      </p>
      <Section title="La liste des établissements de l’entité">
        <FullTable
          head={['SIRET', 'Activité (code NAF)', 'Adresse', 'Statut']}
          body={uniteLegale.etablissementList.map(
            (etablissement: IEtablissement) => [
              <a href={`/etablissement/${etablissement.siret}`}>
                {formatSiret(etablissement.siret)}
              </a>,
              <>
                {etablissement.mainActivity} -{' '}
                {libelleFromCodeNaf(etablissement.mainActivityLabel)}
              </>,
              etablissement.adress,
              <>
                {!uniteLegale.isDiffusible ? (
                  <Tag>non-diffusible</Tag>
                ) : (
                  <>
                    {etablissement.isSiege ? <Tag>siège social</Tag> : null}
                    {etablissement.isActive ? null : (
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
