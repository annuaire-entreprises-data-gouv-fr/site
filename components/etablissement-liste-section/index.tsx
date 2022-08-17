import React from 'react';
import constants from '../../models/constants';
import { IEtablissement, IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import IsActiveTag from '../../components-ui/is-active-tag';
import PageCounter from '../results-page-counter';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../../components-ui/tag';
import { formatDate } from '../../utils/helpers/formatting';

const EtablissementListeSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const etablissementsPerPage = constants.resultsPerPage.etablissements;
  return (
    <div id="etablissements">
      <p>
        Cette entité possède{' '}
        <b>
          {uniteLegale.nombreEtablissements ||
            uniteLegale.etablissements.length}{' '}
          établissement(s)
        </b>
        . Cliquez sur un n° siret pour obtenir plus d’information :
      </p>
      <Section
        title="La liste des établissements de l’entité"
        source={EAdministration.INSEE}
      >
        <FullTable
          head={[
            'SIRET',
            'Activité (NAF/APE)',
            'Détails (nom, enseigne, adresse)',
            'Création',
            'Etat',
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
              <>
                {!etablissement.estDiffusible ? (
                  <i>Non renseigné</i>
                ) : (
                  <span style={{ fontVariant: 'all-small-caps' }}>
                    {(etablissement.enseigne || etablissement.denomination) && (
                      <b>
                        {etablissement.enseigne || etablissement.denomination}
                        <br />
                      </b>
                    )}
                    <>{etablissement.adresse}</>
                  </span>
                )}
                {etablissement.estSiege && (
                  <Tag className="info">siège social</Tag>
                )}
                {uniteLegale.allSiegesSiret.indexOf(etablissement.siret) > -1 &&
                  !etablissement.estSiege && <Tag>ancien siège social</Tag>}
              </>,
              (etablissement.estDiffusible &&
                formatDate(etablissement.dateCreation)) ||
                '',
              <>
                {!etablissement.estDiffusible ? (
                  <Tag className="unknown">Non-diffusible</Tag>
                ) : etablissement.dateFermeture ? (
                  <Tag className="closed">
                    fermé&nbsp;le&nbsp;{formatDate(etablissement.dateFermeture)}
                  </Tag>
                ) : (
                  <IsActiveTag etat={etablissement.etatAdministratif} />
                )}
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
