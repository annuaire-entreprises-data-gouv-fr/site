import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import { libelleFromCodeNaf } from '../../utils/labels';
import IsActiveTag from '../is-active-tag';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../tag';

const EtablissementListeSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const closedEtablissement = uniteLegale.etablissements.filter(
    (etablissement) => etablissement.estActif === false
  ).length;
  return (
    <div id="etablissements">
      <p>
        Cette entité possède {uniteLegale.etablissements.length}{' '}
        établissement(s)
        {closedEtablissement > 0 && <> dont {closedEtablissement} fermés</>} :
      </p>
      <Section
        title="La liste des établissements de l’entité"
        source={EAdministration.INSEE}
      >
        <FullTable
          head={['SIRET', 'Activité (code NAF)', 'Adresse', 'Statut']}
          body={uniteLegale.etablissements.map(
            (etablissement: IEtablissement) => [
              <a href={`/etablissement/${etablissement.siret}`}>
                {formatSiret(etablissement.siret)}
              </a>,
              <>{libelleFromCodeNaf(etablissement.activitePrincipale)}</>,
              etablissement.adresse,
              <>
                {!uniteLegale.estDiffusible ? (
                  <Tag>non-diffusible</Tag>
                ) : (
                  <>
                    {etablissement.estSiege && <Tag>siège social</Tag>}
                    {!etablissement.estActif && (
                      <IsActiveTag isActive={etablissement.estActif} />
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
