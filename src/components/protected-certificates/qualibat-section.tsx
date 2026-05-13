import { useMemo } from "react";
import { DataSectionClient } from "#/components/section/data-section";
import { TwoColumnTable } from "#/components/table/simple";
import ButtonLink from "#/components-ui/button";
import { useServerActionData } from "#/hooks/fetch/use-server-action-data";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { getEspaceAgentQualibat } from "#/server-functions/agent/data-fetching";
import { formatDateLong } from "#/utils/helpers";

export const QualibatSection: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
  const input = useMemo(
    () => ({ siret: uniteLegale.siege.siret }),
    [uniteLegale.siege.siret]
  );
  const qualibat = useServerActionData(
    getEspaceAgentQualibat,
    user,
    input,
    ApplicationRights.protectedCertificats
  );
  return (
    <DataSectionClient
      data={qualibat}
      id="qualibat"
      isProtected
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{" "}
          <a
            aria-label="En savoir plus sur les certificats Qualibat, nouvelle fenêtre"
            href="https://www.qualibat.com/qualification-des-competences/"
            rel="noreferrer"
            target="_blank"
          >
            certificat Qualibat
          </a>
          .
        </>
      }
      sources={[EAdministration.QUALIBAT]}
      title="Certificat Qualibat"
    >
      {(qualibat) => (
        <>
          <p>
            Cette entreprise possède un{" "}
            <a
              aria-label="En savoir plus sur les certificats Qualibat, nouvelle fenêtre"
              href="https://www.qualibat.com/qualification-des-competences/"
              rel="noreferrer"
              target="_blank"
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
                  alt
                  ariaLabel="Télécharger le PDF, nouvelle fenêtre"
                  small
                  target="_blank"
                  to={qualibat.documentUrl}
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
