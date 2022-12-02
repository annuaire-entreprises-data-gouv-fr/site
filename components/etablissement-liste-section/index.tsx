import React from 'react';
import constants from '../../models/constants';
import { IEtablissement, IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administrations';
import { formatSiret, Siret } from '../../utils/helpers/siren-and-siret';
import IsActiveTag from '../../components-ui/is-active-tag';
import PageCounter from '../search-results/results-pagination';
import { Section } from '../section';
import { FullTable } from '../table/full';
import { Tag } from '../../components-ui/tag';
import { formatDate } from '../../utils/helpers/formatting';

const EtablissementTable: React.FC<{
  label?: string;
  etablissements: IEtablissement[];
  sieges: Siret[];
}> = ({ label, etablissements, sieges = [] }) => {
  const plural = etablissements.length > 1 ? 's' : '';
  return (
    <>
      {label && (
        <h3>
          Etablissement{plural} {label}
          {plural}&nbsp;:
        </h3>
      )}

      <FullTable
        head={[
          'SIRET',
          'Activité (NAF/APE)',
          'Détails (nom, enseigne, adresse)',
          'Création',
          'Etat',
        ]}
        body={etablissements.map((etablissement: IEtablissement) => [
          <a href={`/etablissement/${etablissement.siret}`} rel="nofollow">
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
                {etablissement.estSiege && (
                  <Tag className="info">siège social</Tag>
                )}
                {sieges.indexOf(etablissement.siret) > 0 &&
                  !etablissement.estSiege && <Tag>ancien siège social</Tag>}
              </>
            )}
          </>,
          (etablissement.estDiffusible &&
            formatDate(etablissement.dateCreation)) ||
            '',
          <>
            <IsActiveTag
              state={etablissement.etatAdministratif}
              since={etablissement.dateFermeture}
            />
          </>,
        ])}
      />
    </>
  );
};

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

  const plural = nombreEtablissements > 1 ? 's' : '';
  const pluralBe = nombreEtablissementsOuverts > 1 ? 'sont' : 'est';

  return (
    <div id="etablissements">
      <p>
        Cette structure possède{' '}
        <b>
          {nombreEtablissements} établissement{plural}
        </b>
        {nombreEtablissementsOuverts && !usePagination && (
          <>
            {' '}
            dont {nombreEtablissementsOuverts} {pluralBe} en activité
          </>
        )}
        . Cliquez sur un n° siret pour obtenir plus d’information :
      </p>
      <Section
        title={`Etablissement${plural}`}
        sources={[EAdministration.INSEE]}
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
              anchor="#etablissements"
            />
          </>
        ) : (
          <>
            {nombreEtablissementsOuverts > 0 && (
              <>
                <EtablissementTable
                  label="actif"
                  etablissements={uniteLegale.etablissements.open}
                  sieges={uniteLegale.allSiegesSiret}
                />
              </>
            )}
            {uniteLegale.etablissements.unknown.length > 0 && (
              <>
                <EtablissementTable
                  label="non-diffusible"
                  etablissements={uniteLegale.etablissements.unknown}
                  sieges={uniteLegale.allSiegesSiret}
                />
              </>
            )}
            {uniteLegale.etablissements.closed.length > 0 && (
              <>
                <EtablissementTable
                  label="fermé"
                  etablissements={uniteLegale.etablissements.closed}
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
