"use client";

import type React from "react";
import { MSS } from "#components/administrations";
import { DataSectionClient } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import { Tag } from "#components-ui/tag";
import { useFetchFiness } from "#hooks/fetch/finess";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { formatSiret } from "#utils/helpers";

const FinessSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = useFetchFiness(uniteLegale);

  return (
    <>
      <DataSectionClient
        data={data}
        id="finess"
        sources={[EAdministration.MSS]}
        title={"Établissement Sanitaire et Social (FINESS)"}
      >
        {(data) => (
          <>
            <div>
              Cette structure est présente dans le{" "}
              <a
                href="https://finess.esante.gouv.fr"
                rel="noopener"
                target="_blank"
              >
                fichier
              </a>{" "}
              <FAQLink tooltipLabel="Finess">
                Le FIchier National des Etablissements Sanitaires et Sociaux
                regroupe l’ensemble des établissements sanitaires, sociaux,
                médico-sociaux, et de formation aux professions de ces secteurs
              </FAQLink>
              , tenu par le <MSS />.
              <br />
              <p>
                Elle possède {Object.keys(data).length} numéro(s) Finess :{" "}
                {Object.keys(data).map((k) => (
                  <Tag>{k}</Tag>
                ))}
              </p>
            </div>
            <br />
            <FullTable
              body={data.map((finessEntity) => [
                <Tag>{aggregatedEtabForAnIdFiness[0].idFiness}</Tag>,
                <>
                  {aggregatedEtabForAnIdFiness.map((etab, index) => (
                    <div>
                      <a href={`/etablissement/${etab.siret}`}>
                        {formatSiret(etab.siret)}
                      </a>
                      {" ∙ "}
                      <strong>{etab.raisonSociale}</strong>
                      <br />
                      <i>{etab.category}</i>
                      <br />
                      {etab.adresse}
                      {etab.phone && (
                        <>
                          {" "}
                          ∙ tél : <a href={`tel:${etab.phone}`}>{etab.phone}</a>
                        </>
                      )}
                      {index > 0 && (
                        <>
                          <br />
                          <br />
                        </>
                      )}
                    </div>
                  ))}
                </>,
                <ButtonLink
                  alt
                  small
                  target="_blank"
                  to={`https://finess.esante.gouv.fr/fininter/jsp/actionDetailEtablissement.do?noFiness=${aggregatedEtabForAnIdFiness[0].idFiness}`}
                >
                  Consulter
                </ButtonLink>,
              ])}
              head={["Numéro Finess", "Détails", "Fiche Finess"]}
              verticalAlign="top"
            />
          </>
        )}
      </DataSectionClient>
    </>
  );
};

export default FinessSection;
