import React from 'react';
import IsActiveTag from '#components-ui/is-active-tag';
import { Tag } from '#components-ui/tag';
import PageCounter from '#components/search-results/results-pagination';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import constants from '#models/constants';
import { IEtablissement, IUniteLegale } from '#models/index';
import {
  estNonDiffusible,
  getAdresseEtablissement,
  getDenominationEtablissement,
  getEnseigneEtablissement,
  getNomComplet,
} from '#models/statut-diffusion';
import { Siret, formatDate, formatSiret } from '#utils/helpers';
import { ISession } from '#utils/session';

const EtablissementTable: React.FC<{
  label?: string;
  etablissements: IEtablissement[];
  sieges: Siret[];
  session: ISession | null;
}> = ({ label, etablissements, sieges = [], session }) => {
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
          'État',
        ]}
        body={etablissements.map((etablissement: IEtablissement) => [
          <a href={`/etablissement/${etablissement.siret}`}>
            {formatSiret(etablissement.siret)}
          </a>,
          <>
            {estNonDiffusible(etablissement) ? (
              <i>Non renseigné</i>
            ) : (
              etablissement.libelleActivitePrincipale
            )}
          </>,
          <>
            {estNonDiffusible(etablissement) ? (
              <i>Non renseigné</i>
            ) : (
              <>
                <span style={{ fontVariant: 'all-small-caps' }}>
                  {(etablissement.enseigne || etablissement.denomination) && (
                    <a href={`/etablissement/${etablissement.siret}`}>
                      <b>
                        {getEnseigneEtablissement(etablissement, session) ||
                          getDenominationEtablissement(etablissement, session)}
                        <br />
                      </b>
                    </a>
                  )}
                  <>{getAdresseEtablissement(etablissement, session)}</>
                </span>
                {etablissement.estSiege && <Tag color="info">siège social</Tag>}
                {sieges.indexOf(etablissement.siret) > 0 &&
                  !etablissement.estSiege && <Tag>ancien siège social</Tag>}
              </>
            )}
          </>,
          (!estNonDiffusible(etablissement) &&
            formatDate(etablissement.dateCreation)) ||
            '',
          <>
            <IsActiveTag
              etatAdministratif={etablissement.etatAdministratif}
              statutDiffusion={etablissement.statutDiffusion}
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
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
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
        {nombreEtablissementsOuverts && !usePagination ? (
          <>
            {' '}
            dont {nombreEtablissementsOuverts} {pluralBe} en activité
          </>
        ) : null}
        . Cliquez sur un n° SIRET pour obtenir plus d’information :
      </p>
      <Section
        title={`${nombreEtablissements} établissement${plural} de ${getNomComplet(
          uniteLegale,
          session
        )}`}
        sources={[EAdministration.INSEE]}
      >
        {usePagination ? (
          <>
            <EtablissementTable
              etablissements={uniteLegale.etablissements.all}
              sieges={uniteLegale.allSiegesSiret}
              session={session}
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
                  session={session}
                />
              </>
            )}
            {uniteLegale.etablissements.unknown.length > 0 && (
              <>
                <EtablissementTable
                  label="non-diffusible"
                  etablissements={uniteLegale.etablissements.unknown}
                  sieges={uniteLegale.allSiegesSiret}
                  session={session}
                />
              </>
            )}
            {uniteLegale.etablissements.closed.length > 0 && (
              <>
                <EtablissementTable
                  label="fermé"
                  etablissements={uniteLegale.etablissements.closed}
                  sieges={uniteLegale.allSiegesSiret}
                  session={session}
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
