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
          <>
            <span style={{ fontVariant: 'all-small-caps' }}>
              {(etablissement.enseigne || etablissement.denomination) && (
                <b>
                  {etablissement.enseigne || etablissement.denomination}
                  <br />
                </b>
              )}
              <>{etablissement.adresse}</>
            </span>
            {etablissement.estSiege && <Tag className="info">siège social</Tag>}
            {sieges.indexOf(etablissement.siret) > 0 &&
              !etablissement.estSiege && <Tag>ancien siège social</Tag>}
          </>
        )}
      </>,
      (etablissement.estDiffusible && formatDate(etablissement.dateCreation)) ||
        '',
      <>
        <IsActiveTag
          state={etablissement.etatAdministratif}
          since={etablissement.dateFermeture}
        />
      </>,
    ])}
  />
);

const EtablissementListeSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const {
    usePagination,
    nombreEtablissements,
    nombreEtablissementsOuverts,
    currentEtablissementPage,
  } = uniteLegale.etablissements;

  const totalPages = Math.ceil(
    nombreEtablissements / constants.resultsPerPage.etablissements
  );

  return (
    <div id="etablissements">
      <p>
        Cette entité possède <b>{nombreEtablissements} établissement(s)</b>
        {nombreEtablissementsOuverts && !usePagination && (
          <> dont {nombreEtablissementsOuverts} sont en activité</>
        )}
        . Cliquez sur un n° siret pour obtenir plus d’information :
      </p>
      <Section
        title="La liste des établissements de l’entité"
        source={EAdministration.INSEE}
      >
        {usePagination ? (
          <>
            <EtablissementTable
              etablissements={uniteLegale.etablissements.all}
              sieges={uniteLegale.allSiegesSiret}
            />
            <PageCounter
              currentPage={currentEtablissementPage || 1}
              totalPages={totalPages}
              querySuffix="#etablissements"
            />
          </>
        ) : (
          <>
            {nombreEtablissementsOuverts > 0 && (
              <>
                <h3>Etablissement(s) en activité :</h3>
                <EtablissementTable
                  etablissements={uniteLegale.etablissements.open}
                  sieges={uniteLegale.allSiegesSiret}
                />
              </>
            )}
            {uniteLegale.etablissements.closed.length > 0 && (
              <>
                <h3>Etablissement(s) fermé(s) :</h3>
                <EtablissementTable
                  etablissements={uniteLegale.etablissements.closed}
                  sieges={uniteLegale.allSiegesSiret}
                />
              </>
            )}
            {uniteLegale.etablissements.unknown.length > 0 && (
              <>
                <h3>Etablissement(s) non-diffusible(s) :</h3>
                <EtablissementTable
                  etablissements={uniteLegale.etablissements.unknown}
                  sieges={uniteLegale.allSiegesSiret}
                />
              </>
            )}
          </>
        )}
      </Section>
    </div>
  );
};
export default EtablissementListeSection;
