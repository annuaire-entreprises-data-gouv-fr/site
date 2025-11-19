"use client";

import { TwoColumnTable } from "#components/table/simple";
import ButtonLink from "#components-ui/button";
import type { IQualibat } from "#models/espace-agent/certificats/qualibat";
import { formatDateLong } from "#utils/helpers";

type QualibatContentProps = {
  data: IQualibat;
};

export function QualibatContent({ data: qualibat }: QualibatContentProps) {
  return (
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
  );
}
