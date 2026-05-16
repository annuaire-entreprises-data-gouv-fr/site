import React, { useMemo } from "react";
import NonRenseigne from "#/components/non-renseigne";
import { ProtectedInlineData } from "#/components/protected-inline-data";
import { Loader } from "#/components-ui/loader";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { hasAnyError, isDataLoading } from "#/models/data-fetching";
import {
  getAgentOpqibiFn,
  getAgentQualibatFn,
  getAgentQualifelecFn,
} from "#/server-functions/agent/data-fetching";
import type { IUniteLegale } from "../../../models/core/types";
import {
  checkHasLabelsAndCertificates,
  LabelsAndCertificatesBadgesSection,
} from ".";
import { LabelWithLinkToSection } from "./label-with-link-to-section";

export const ProtectedCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const hasOtherCertificates = checkHasLabelsAndCertificates(uniteLegale);

  const getAgentOpqibiInput = useMemo(
    () => ({ siren: uniteLegale.siren }),
    [uniteLegale.siren]
  );
  const getAgentQualibatInput = useMemo(
    () => ({ siret: uniteLegale.siege.siret }),
    [uniteLegale.siege.siret]
  );
  const getAgentQualifelecInput = useMemo(
    () => ({ siret: uniteLegale.siege.siret }),
    [uniteLegale.siege.siret]
  );
  const protectedCertificates = [
    {
      data: useServerFnData(
        getAgentOpqibiFn,
        getAgentOpqibiInput,
        ApplicationRights.protectedCertificats
      ),
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
      data: useServerFnData(
        getAgentQualibatFn,
        getAgentQualibatInput,
        ApplicationRights.protectedCertificats
      ),
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
      data: useServerFnData(
        getAgentQualifelecFn,
        getAgentQualifelecInput,
        ApplicationRights.protectedCertificats
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
