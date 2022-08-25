import React from 'react';
import constants from '../../models/constants';
import { IEtablissement, IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatSiret, Siret } from '../../utils/helpers/siren-and-siret';
import IsActiveTag from '../../components-ui/is-active-tag';
import PageCounter from '../results-page-counter';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../../components-ui/tag';
import { formatDate } from '../../utils/helpers/formatting';

const EtablissementTable: React.FC<{
  etablissements: IEtablissement[];
  sieges: Siret[];
}> = ({ etablissements, sieges = [] }) => (
  <FullTable
    head={[
      'SIRET',
      'Activité (NAF/APE)',
      'Détails (nom, enseigne, adresse)',
      'Création',
      'Etat',
    ]}
    body={etablissements.map((etablissement: IEtablissement) => [
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
        {etablissement.estSiege && <Tag className="info">siège social</Tag>}
        {sieges.indexOf(etablissement.siret) > 0 && !etablissement.estSiege && (
          <Tag>ancien siège social</Tag>
        )}
      </>,
      (etablissement.estDiffusible && formatDate(etablissement.dateCreation)) ||
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
    ])}
  />
);

const EtablissementListeSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const etablissementsPerPage = constants.resultsPerPage.etablissements;

  const etablissementsOuverts = uniteLegale.etablissements
    .filter((e) => e.estActif && e.estDiffusible)
    .sort((a) => (a.estSiege ? -1 : 1));

  const etablissementsFermes = uniteLegale.etablissements.filter(
    (e) => !e.estActif && e.estDiffusible
  );
  const etablissementsNonDiffusibles = uniteLegale.etablissements.filter(
    (e) => !e.estDiffusible
  );
  return (
    <div id="etablissements">
      <p>
        Cette entité possède{' '}
        <b>
          {uniteLegale.nombreEtablissements ||
            uniteLegale.etablissements.length}{' '}
          établissement(s)
        </b>
        {uniteLegale.nombreEtablissementsOuverts && (
          <> dont {uniteLegale.nombreEtablissementsOuverts} sont en activité</>
        )}
        . Cliquez sur un n° siret pour obtenir plus d’information :
      </p>
      <Section
        title="La liste des établissements de l’entité"
        source={EAdministration.INSEE}
      >
        {etablissementsOuverts.length > 0 && (
          <>
            <h3>Etablissement(s) en activité :</h3>
            <EtablissementTable
              etablissements={etablissementsOuverts}
              sieges={uniteLegale.allSiegesSiret}
            />
          </>
        )}
        {etablissementsFermes.length > 0 && (
          <>
            <h3>Etablissement(s) fermé(s) :</h3>
            <EtablissementTable
              etablissements={etablissementsFermes}
              sieges={uniteLegale.allSiegesSiret}
            />
          </>
        )}
        {etablissementsNonDiffusibles.length > 0 && (
          <>
            <h3>Etablissement(s) non-diffusible(s) :</h3>
            <EtablissementTable
              etablissements={etablissementsNonDiffusibles}
              sieges={uniteLegale.allSiegesSiret}
            />
          </>
        )}
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
