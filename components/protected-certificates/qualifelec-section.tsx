"use client";

import { useMemo } from "react";
import { getAgentQualifelecAction } from "server-actions/agent/data-fetching";
import { DataSectionClient } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import { useServerActionData } from "#hooks/fetch/use-server-action-data";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { formatDate, formatDateLong } from "#utils/helpers";

export function QualifelecSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const input = useMemo(
    () => ({ siret: uniteLegale.siege.siret }),
    [uniteLegale.siege.siret]
  );
  const qualifelec = useServerActionData(
    getAgentQualifelecAction,
    session,
    input
  );
  return (
    <DataSectionClient
      data={qualifelec}
      id="qualifelec"
      isProtected
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{" "}
          <a
            aria-label="En savoir plus sur les certificats Qualifelec, nouvelle fenêtre"
            href="https://www.qualifelec.fr/pourquoi-choisir-une-entreprise-qualifelec/le-certificat-qualifelec-la-meilleure-des-recommandations/"
            rel="noreferrer"
            target="_blank"
          >
            certificat Qualifelec
          </a>
          .
        </>
      }
      sources={[EAdministration.QUALIFELEC]}
      title="Certificats Qualifelec"
    >
      {(qualifelec) => (
        <>
          <p>
            Cette entreprise possède un ou plusieurs{" "}
            <a
              aria-label="En savoir plus sur les certificats Qualifelec, nouvelle fenêtre"
              href="https://www.qualifelec.fr/pourquoi-choisir-une-entreprise-qualifelec/le-certificat-qualifelec-la-meilleure-des-recommandations/"
              rel="noreferrer"
              target="_blank"
            >
              certificats Qualifelec
            </a>{" "}
            valides.
          </p>
          <FullTable
            body={qualifelec.map((c) => [
              c.numero,
              c.qualification.label,
              `Du ${formatDate(c.dateDebut)} au ${formatDate(c.dateFin)}`,
              <ul>
                <li>
                  Assurance civile : {c.assuranceCivile.nom} (du{" "}
                  {formatDateLong(c.assuranceCivile.dateDebut)} au{" "}
                  {formatDateLong(c.assuranceCivile.dateFin)})
                </li>
                <li>
                  Assurance décennale : {c.assuranceDecennale.nom} (du{" "}
                  {formatDateLong(c.assuranceDecennale.dateDebut)} au{" "}
                  {formatDateLong(c.assuranceDecennale.dateFin)})
                </li>
              </ul>,

              <ButtonLink
                alt
                ariaLabel="Télécharger le certificat Qualifelec, nouvelle fenêtre"
                small
                target="_blank"
                to={c.documentUrl}
              >
                Télécharger
              </ButtonLink>,
            ])}
            head={[
              "N°",
              "Qualification",
              "Validité",
              "Assurances",
              "Certificat",
            ]}
            verticalAlign="top"
          />
        </>
      )}
    </DataSectionClient>
  );
}
