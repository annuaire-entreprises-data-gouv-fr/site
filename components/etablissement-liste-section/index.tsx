import React from 'react';
import IsActiveTag from '#components-ui/is-active-tag';
import { Tag } from '#components-ui/tag';
import NonRenseigne from '#components/non-renseigne';
import PageCounter from '#components/search-results/results-pagination';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import constants from '#models/constants';
import { estNonDiffusibleStrict } from '#models/core/diffusion';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import { formatDate, formatSiret } from '#utils/helpers';

const EtablissementTable: React.FC<{
  label?: string;
  etablissements: IEtablissement[];
}> = ({ label, etablissements }) => {
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
            {estNonDiffusibleStrict(etablissement) ? (
              <NonRenseigne />
            ) : (
              etablissement.libelleActivitePrincipale
            )}
          </>,
          <>
            {estNonDiffusibleStrict(etablissement) ? (
              <NonRenseigne />
            ) : (
              <>
                <span style={{ fontVariant: 'all-small-caps' }}>
                  {(etablissement.enseigne || etablissement.denomination) && (
                    <a href={`/etablissement/${etablissement.siret}`}>
                      <strong>
                        {etablissement.enseigne || etablissement.denomination}
                        <br />
                      </strong>
                    </a>
                  )}
                  <>{etablissement.adresse}</>
                </span>
                {etablissement.estSiege ? (
                  <Tag color="info">siège social</Tag>
                ) : etablissement.ancienSiege ? (
                  <Tag>ancien siège social</Tag>
                ) : null}
              </>
            )}
          </>,
          (!estNonDiffusibleStrict(etablissement) &&
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
        <strong>
          {nombreEtablissements} établissement{plural}
        </strong>
        {nombreEtablissementsOuverts && !usePagination ? (
          <>
            {' '}
            dont {nombreEtablissementsOuverts} {pluralBe} en activité
          </>
        ) : null}
        . Cliquez sur un n° SIRET pour obtenir plus d’information :
      </p>
      <Section
        title={`${nombreEtablissements} établissement${plural} de ${uniteLegale.nomComplet}`}
        sources={[EAdministration.INSEE]}
        lastModified={uniteLegale.dateDerniereMiseAJour}
      >
        {usePagination ? (
          <>
            <EtablissementTable
              etablissements={uniteLegale.etablissements.all}
            />
            <PageCounter
              currentPage={currentEtablissementPage || 1}
              totalPages={totalPages}
              anchor="#etablissements"
            />
          </>
        ) : (
          <>
            {uniteLegale.etablissements.open.length > 0 && (
              <EtablissementTable
                label="actif"
                etablissements={uniteLegale.etablissements.open}
              />
            )}
            {uniteLegale.etablissements.unknown.length > 0 && (
              <EtablissementTable
                label="non-diffusible"
                etablissements={uniteLegale.etablissements.unknown}
              />
            )}
            {uniteLegale.etablissements.closed.length > 0 && (
              <EtablissementTable
                label="fermé"
                etablissements={uniteLegale.etablissements.closed}
              />
            )}
          </>
        )}
      </Section>
    </div>
  );
};
export default EtablissementListeSection;
