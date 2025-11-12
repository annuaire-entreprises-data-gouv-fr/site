"use client";

import React, { useMemo } from "react";
import {
  getAgentOpqibiAction,
  getAgentQualibatAction,
  getAgentQualifelecAction,
} from "server-actions/agent/data-fetching";
import NonRenseigne from "#components/non-renseigne";
import { ProtectedInlineData } from "#components/protected-inline-data";
import { Loader } from "#components-ui/loader";
import { useServerActionData } from "#hooks/fetch/use-server-action-data";
import type { ISession } from "#models/authentication/user/session";
import { hasAnyError, isDataLoading } from "#models/data-fetching";
import type { IUniteLegale } from "../../../models/core/types";
import {
  checkHasLabelsAndCertificates,
  LabelsAndCertificatesBadgesSection,
} from ".";
import { LabelWithLinkToSection } from "./label-with-link-to-section";

export const ProtectedCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const hasOtherCertificates = checkHasLabelsAndCertificates(uniteLegale);

  const opqibiInput = useMemo(
    () => ({ siren: uniteLegale.siren }),
    [uniteLegale.siren]
  );
  const qualibatInput = useMemo(
    () => ({ siret: uniteLegale.siege.siret }),
    [uniteLegale.siege.siret]
  );
  const qualifelecInput = qualibatInput;
  const protectedCertificates = [
    {
      data: useServerActionData(getAgentOpqibiAction, session, opqibiInput),
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
      data: useServerActionData(getAgentQualibatAction, session, qualibatInput),
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
      data: useServerActionData(
        getAgentQualifelecAction,
        session,
        qualifelecInput
      ),
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

  // loading state
  const anythingIsStillLoading = !!protectedCertificates.find(
    (maybeLoadingState) => isDataLoading(maybeLoadingState.data)
  );

  if (anythingIsStillLoading) {
    return <Loader />;
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
