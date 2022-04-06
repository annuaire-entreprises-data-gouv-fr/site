import React from 'react';
import constants from '../../models/constants';
import { IEtablissement, IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import IsActiveTag from '../is-active-tag';
import PageCounter from '../results-page-counter';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../tag';

const EtablissementListeSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const etablissementsPerPage = constants.resultsPerPage.etablissements;
  return (
    <div id="etablissements">
      <p>
        Cette entité possède{' '}
        {uniteLegale.nombreEtablissements || uniteLegale.etablissements.length}{' '}
        établissement(s) :
      </p>
      <Section
        title="La liste des établissements de l’entité"
        source={EAdministration.INSEE}
      >
        <FullTable
          head={[
            'SIRET',
            'Activité (NAF/APE)',
            'Détails (adresse, enseigne)',
            'Statut',
          ]}
          body={uniteLegale.etablissements.map(
            (etablissement: IEtablissement) => [
              //eslint-disable-next-line
              <a href={`/etablissement/${etablissement.siret}`}>
                {formatSiret(etablissement.siret)}
              </a>,
              <>
                {!etablissement.estDiffusible ? (
                  <i>Non renseigné</i>
                ) : (
                  etablissement.libelleActivitePrincipale
                )}
              </>,
              !etablissement.estDiffusible ? (
                <i>Non renseigné</i>
              ) : (
                <>
                  {etablissement.enseigne && (
                    <b>
                      {etablissement.enseigne}
                      <br />
                    </b>
                  )}
                  <>{etablissement.adresse}</>
                </>
              ),
              <>
                {etablissement.estSiege && <Tag>siège social</Tag>}
                {!etablissement.estActif && (
                  <IsActiveTag isActive={etablissement.estActif} />
                )}
                {!etablissement.estDiffusible && <Tag>non-diffusible</Tag>}
              </>,
            ]
          )}
        />
        {uniteLegale.nombreEtablissements > etablissementsPerPage && (
          <PageCounter
            currentPage={uniteLegale.currentEtablissementPage || 1}
            totalPages={Math.ceil(
              uniteLegale.nombreEtablissements / etablissementsPerPage
            )}
          />
        )}
      </Section>
    </div>
  );
};
export default EtablissementListeSection;
