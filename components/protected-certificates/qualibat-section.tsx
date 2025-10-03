"use client";

import ButtonLink from "#components-ui/button";
import { DataSectionClient } from "#components/section/data-section";
import { TwoColumnTable } from "#components/table/simple";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { formatDateLong } from "#utils/helpers";
import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";

export const QualibatSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const qualibat = useAPIRouteData(
    APIRoutesPaths.EspaceAgentQualibat,
    uniteLegale.siege.siret,
    session
  );
  return (
    <DataSectionClient
      title="Certificat Qualibat"
      id="qualibat"
      isProtected
      sources={[EAdministration.QUALIBAT]}
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{" "}
          <a
            target="_blank"
            rel="noreferrer"
            aria-label="En savoir plus sur les certificats Qualibat, nouvelle fenêtre"
            href="https://www.qualibat.com/qualification-des-competences/"
          >
            certificat Qualibat
          </a>
          .
        </>
      }
      data={qualibat}
    >
      {(qualibat) => (
        <>
          <p>
            Cette entreprise possède un{" "}
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="En savoir plus sur les certificats Qualibat, nouvelle fenêtre"
              href="https://www.qualibat.com/qualification-des-competences/"
            >
              certificat Qualibat
            </a>{" "}
            valide.
          </p>
          <TwoColumnTable
            body={[
              ...(qualibat.dateEmission && qualibat.dateFinValidite
                ? [
                    [
                      "Validité",
                      `Du ${formatDateLong(
                        qualibat.dateEmission
                      )} au ${formatDateLong(qualibat.dateFinValidite)}`,
                    ],
                  ]
                : []),
              ...(qualibat.informationsAdditionnelles
                ? [
                    [
                      "Qualification",
                      qualibat.informationsAdditionnelles.certifications
                        .map((c) => c.libelle)
                        .join(", "),
                    ],
                    [
                      "Assurance responsabilité civile",
                      `${qualibat.informationsAdditionnelles.assuranceResponsabiliteCivile.nom} (n° ${qualibat.informationsAdditionnelles.assuranceResponsabiliteCivile.identifiant})`,
                    ],
                    [
                      "Assurance décennale",
                      `${qualibat.informationsAdditionnelles.assuranceResponsabiliteTravaux.nom} (n° ${qualibat.informationsAdditionnelles.assuranceResponsabiliteTravaux.identifiant})`,
                    ],
                  ]
                : []),
              [
                "Certificat",
                <ButtonLink
                  target="_blank"
                  alt
                  small
                  to={qualibat.documentUrl}
                  ariaLabel="Télécharger le PDF, nouvelle fenêtre"
                >
                  Télécharger le PDF
                </ButtonLink>,
              ],
            ]}
          />
        </>
      )}
    </DataSectionClient>
  );
};
