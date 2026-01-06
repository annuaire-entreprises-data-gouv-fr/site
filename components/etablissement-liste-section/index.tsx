import type React from "react";
import { Link } from "#components/Link";
import NonRenseigne from "#components/non-renseigne";
import PageCounter from "#components/search-results/results-pagination";
import { Section } from "#components/section";
import { FullTable } from "#components/table/full";
import { Tag } from "#components-ui/tag";
import IsActiveTag from "#components-ui/tag/is-active-tag";
import { EAdministration } from "#models/administrations/EAdministration";
import constants from "#models/constants";
import { estNonDiffusibleStrict } from "#models/core/diffusion";
import type { IEtablissement, IUniteLegale } from "#models/core/types";
import { formatDate, formatSiret, pluralize } from "#utils/helpers";

const EtablissementTable: React.FC<{
  label?: string;
  labelWithoutPlural?: boolean;
  etablissements: IEtablissement[];
}> = ({ label, labelWithoutPlural, etablissements }) => {
  const plural = pluralize(etablissements);
  return (
    <>
      {label && (
        <h3>
          Etablissement{plural} {label}
          {labelWithoutPlural ? "" : plural}&nbsp;:
        </h3>
      )}

      <FullTable
        body={etablissements.map((etablissement: IEtablissement) => [
          <Link href={`/etablissement/${etablissement.siret}`}>
            {formatSiret(etablissement.siret)}
          </Link>,
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
                <span style={{ fontVariant: "all-small-caps" }}>
                  {(etablissement.enseigne || etablissement.denomination) && (
                    <Link href={`/etablissement/${etablissement.siret}`}>
                      <strong>
                        {etablissement.enseigne || etablissement.denomination}
                        <br />
                      </strong>
                    </Link>
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
            "",
          <>
            <IsActiveTag
              etatAdministratif={etablissement.etatAdministratif}
              since={etablissement.dateFermeture}
              statutDiffusion={etablissement.statutDiffusion}
            />
          </>,
        ])}
        head={[
          "SIRET",
          "Activité (NAF/APE)",
          "Détails (nom, enseigne, adresse)",
          "Création",
          "État",
        ]}
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

  const plural = nombreEtablissements > 1 ? "s" : "";
  const pluralBe = nombreEtablissementsOuverts > 1 ? "sont" : "est";

  return (
    <div id="etablissements">
      <p>
        Cette structure possède{" "}
        <strong>
          {nombreEtablissements} établissement{plural}
        </strong>
        {nombreEtablissementsOuverts && !usePagination ? (
          <>
            {" "}
            dont {nombreEtablissementsOuverts} {pluralBe} en activité
          </>
        ) : null}
        . Cliquez sur un n° SIRET pour obtenir plus d’information :
      </p>
      <Section
        lastModified={uniteLegale.dateDerniereMiseAJour}
        sources={[EAdministration.INSEE]}
        title={`${nombreEtablissements} établissement${plural} de ${uniteLegale.nomComplet}`}
      >
        {usePagination ? (
          <>
            <EtablissementTable
              etablissements={uniteLegale.etablissements.all}
            />
            <PageCounter
              currentPage={currentEtablissementPage || 1}
              totalPages={totalPages}
              urlComplement="#etablissements"
            />
          </>
        ) : (
          <>
            {uniteLegale.etablissements.open.length > 0 && (
              <EtablissementTable
                etablissements={uniteLegale.etablissements.open}
                label="en activité"
                labelWithoutPlural={true}
              />
            )}
            {uniteLegale.etablissements.unknown.length > 0 && (
              <EtablissementTable
                etablissements={uniteLegale.etablissements.unknown}
                label="non-diffusible"
              />
            )}
            {uniteLegale.etablissements.closed.length > 0 && (
              <EtablissementTable
                etablissements={uniteLegale.etablissements.closed}
                label="fermé"
              />
            )}
          </>
        )}
      </Section>
    </div>
  );
};
export default EtablissementListeSection;
