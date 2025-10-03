import type React from "react";
import routes from "#clients/routes";
import { EDUCNAT } from "#components/administrations";
import ResultsPagination from "#components/search-results/results-pagination";
import { DataSection } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import { Tag } from "#components-ui/tag";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import type { IEtablissementsScolaires } from "#models/etablissements-scolaires";
import { pluralize } from "#utils/helpers";

export const EtablissementsScolairesSection: React.FC<{
  etablissements: IEtablissementsScolaires | IAPINotRespondingError;
}> = ({ etablissements }) => (
  <DataSection
    data={etablissements}
    notFoundInfo={
      <p>
        Nous n’avons pas retrouvé les établissements scolaires de cette entité
        dans l’annuaire de l’
        <EDUCNAT />. En revanche, vous pouvez peut-être les retrouver grâce au{" "}
        <a href={routes.educationNationale.site}>
          moteur de recherche de l’
          <EDUCNAT />
        </a>
        .
      </p>
    }
    sources={[EAdministration.EDUCATION_NATIONALE]}
    title="Annuaire de l’Education Nationale"
  >
    {(etablissements) => {
      const plural = pluralize(etablissements.results);
      return (
        <>
          <p>
            Cette structure possède{" "}
            <strong>{etablissements.resultCount}</strong> établissement
            {plural} scolaire{plural}&nbsp;:
          </p>
          <FullTable
            body={etablissements.results.map(
              ({
                adresse,
                codePostal,
                libelleAcademie,
                mail,
                nombreEleves,
                nomCommune,
                nomEtablissement,
                telephone,
                uai,
                zone,
              }) => [
                <Tag>{uai}</Tag>,
                `${libelleAcademie} ${zone ? `- zone ${zone}` : null}`,
                <>
                  {nomEtablissement}
                  <br />
                  {adresse}, {codePostal}, {nomCommune}
                </>,
                <>
                  <a href={`mailto:${mail}`}>{mail}</a>
                  <br />
                  <a href={`tel:${telephone}`}>{telephone}</a>
                </>,
                nombreEleves,
              ]
            )}
            head={["N° UAI", "Académie", "Détails", "Contact", "Nb d’élèves"]}
          />
          {etablissements.pageCount > 1 && (
            <ResultsPagination
              compact={true}
              currentPage={etablissements.currentPage}
              totalPages={etablissements.pageCount}
            />
          )}
        </>
      );
    }}
  </DataSection>
);
