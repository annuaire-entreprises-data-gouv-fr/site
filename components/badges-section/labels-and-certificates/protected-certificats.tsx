import React from "react";
import {
  getOpqibiFetcher,
  getQualibatFetcher,
  getQualifelecFetcher,
} from "server-fetch/agent";
import NonRenseigne from "#components/non-renseigne";
import { ProtectedInlineData } from "#components/protected-inline-data";
import { hasAnyError } from "#models/data-fetching";
import type { IUniteLegale } from "../../../models/core/types";
import {
  checkHasLabelsAndCertificates,
  LabelsAndCertificatesBadgesSection,
} from ".";
import { LabelWithLinkToSection } from "./label-with-link-to-section";

export const ProtectedCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = async ({ uniteLegale }) => {
  const hasOtherCertificates = checkHasLabelsAndCertificates(uniteLegale);

  const [opqibi, qualibat, qualifelec] = await Promise.all([
    getOpqibiFetcher(uniteLegale.siren),
    getQualibatFetcher(uniteLegale.siege.siret),
    getQualifelecFetcher(uniteLegale.siege.siret),
  ]);

  const protectedCertificates = [
    {
      data: opqibi,
      render: (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure possède une certification délivrée par l'association OPQIBI, attestant de ses différentes qualifications d'ingénierie"
          label="OPQIBI - Ingénierie"
          sectionId="opqibi"
          siren={uniteLegale.siren}
        />
      ),
    },
    {
      data: qualibat,
      render: (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure a obtenue un label de fiabilité QUALIBAT, garantissant sa qualification dans le bâtiment"
          label="QUALIBAT - Bâtiment"
          sectionId="qualibat"
          siren={uniteLegale.siren}
        />
      ),
    },
    {
      data: qualifelec,
      render: (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure est certifiée par QUALIFELEC, attestant de ses qualifications dans le domaine du génie électrique et énergétique"
          label="QUALIFELEC - Génie électrique"
          sectionId="qualifelec"
          siren={uniteLegale.siren}
        />
      ),
    },
  ];

  // either errors we ignore or 404
  const everythingIsNotResponding = !protectedCertificates.find(
    (maybeHasResponded) => !hasAnyError(maybeHasResponded.data)
  );

  if (everythingIsNotResponding) {
    return hasOtherCertificates ? (
      <LabelsAndCertificatesBadgesSection uniteLegale={uniteLegale} />
    ) : (
      <NonRenseigne />
    );
  }

  return (
    <>
      <LabelsAndCertificatesBadgesSection uniteLegale={uniteLegale} />

      <ProtectedInlineData>
        {protectedCertificates.map((certificate, index) =>
          hasAnyError(certificate.data) ? null : (
            <React.Fragment key={index}>{certificate.render}</React.Fragment>
          )
        )}
      </ProtectedInlineData>
    </>
  );
};
