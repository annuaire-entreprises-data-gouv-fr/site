"use client";

import type React from "react";
import { useState } from "react";
import { MSS } from "#components/administrations";
import LocalPageCounter from "#components/search-results/results-pagination/local-pagination";
import { DataSectionClient } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import { Tag } from "#components-ui/tag";
import { useFetchFiness } from "#hooks/fetch/finess";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import type { IFiness } from "#models/finess/type";
import { formatIntFr, formatSiret } from "#utils/helpers";
import styles from "./style.module.css";

const formatFinessData = (data: IFiness[]) => {
  const body = [] as any[];

  data.forEach((finessJuridiqueEntity) => {
    if (finessJuridiqueEntity.finessEtablissements.length > 0) {
      body.push([
        <Tag>{finessJuridiqueEntity.idFinessJuridique}</Tag>,
        <Tag color="info">Juridique</Tag>,
        <div>
          <a href={`/entreprise/${finessJuridiqueEntity.siren}`}>
            {formatIntFr(finessJuridiqueEntity.siren)}
          </a>
          {" ∙ "}
          {finessJuridiqueEntity.raisonSociale}
        </div>,
        <ButtonLink
          small
          target="_blank"
          to={`https://finess.esante.gouv.fr/fininter/jsp/actionDetailEtablissement.do?noFiness=${finessJuridiqueEntity.idFinessJuridique}`}
        >
          Consulter
        </ButtonLink>,
      ]);
    }

    finessJuridiqueEntity.finessEtablissements.forEach((etab, index) =>
      body.push([
        <div
          className={
            styles.firstCell +
            ` ${index === finessJuridiqueEntity.finessEtablissements.length - 1 && styles.last}`
          }
        >
          <Tag>{etab.idFinessGeo}</Tag>
        </div>,
        <Tag color="new">Etablissement</Tag>,
        <>
          <a href={`/etablissement/${etab.siret}`}>{formatSiret(etab.siret)}</a>
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
        </>,
        <ButtonLink
          alt
          small
          target="_blank"
          to={`https://finess.esante.gouv.fr/fininter/jsp/actionDetailEtablissement.do?noFiness=${etab.idFinessGeo}`}
        >
          Consulter
        </ButtonLink>,
      ])
    );
  });

  return body;
};

const FinessSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const response = useFetchFiness(uniteLegale, currentPage);

  return (
    <>
      <DataSectionClient
        data={response}
        id="finess"
        sources={[EAdministration.MSS]}
        title={"Établissement Sanitaire et Social (FINESS)"}
      >
        {(finessList) => (
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
                Le Fichier National des Etablissements Sanitaires et Sociaux
                regroupe l’ensemble des établissements sanitaires, sociaux,
                médico-sociaux, et de formation aux professions de ces secteurs
              </FAQLink>
              , tenu par le <MSS />.
              <br />
            </div>
            <br />
            {finessList.etablissementsMeta.total > 100 && (
              <LocalPageCounter
                compact={true}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={Math.ceil(
                  finessList.etablissementsMeta.total /
                    finessList.etablissementsMeta.page_size
                )}
              />
            )}
            {finessList.data.length > 0 && (
              <FullTable
                body={formatFinessData(finessList.data)}
                head={["Numéro Finess", "Type", "Détails", "Fiche Finess"]}
                verticalAlign="top"
              />
            )}
          </>
        )}
      </DataSectionClient>
    </>
  );
};

export default FinessSection;
