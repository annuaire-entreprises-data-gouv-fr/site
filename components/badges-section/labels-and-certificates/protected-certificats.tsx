'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { Loader } from '#components-ui/loader';
import NonRenseigne from '#components/non-renseigne';
import constants from '#models/constants';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import React from 'react';
import {
  LabelsAndCertificatesBadgesSection,
  checkHasLabelsAndCertificates,
} from '.';
import { IUniteLegale } from '../../../models/core/types';
import { LabelWithLinkToSection } from './label-with-link-to-section';

export const ProtectedCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const hasOtherCertificates = checkHasLabelsAndCertificates(uniteLegale);

  const protectedCertificates = [
    {
      data: useAPIRouteData(
        APIRoutesPaths.EspaceAgentOpqibi,
        uniteLegale.siren,
        session
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
      data: useAPIRouteData(
        APIRoutesPaths.EspaceAgentQualibat,
        uniteLegale.siege.siret,
        session
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
      data: useAPIRouteData(
        APIRoutesPaths.EspaceAgentQualifelec,
        uniteLegale.siege.siret,
        session
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
    {
      data: useAPIRouteData(
        APIRoutesPaths.EspaceAgentCibtp,
        uniteLegale.siege.siret,
        session
      ),
      render: (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure a un certificat CIBTP, attestant qu'elle est en règle de ses cotisations congés payés et chômage-intempéries"
          label="CIBTP - Bâtiment et travaux publics"
          sectionId="cibtp"
          siren={uniteLegale.siren}
        />
      ),
    },
    {
      data: useAPIRouteData(
        APIRoutesPaths.EspaceAgentCnetp,
        uniteLegale.siren,
        session
      ),
      render: (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure a un certificat CNETP, attestant qu'elle est en règle de ses cotisations congés payés et chômage-intempéries"
          label="CNETP - Entreprises de travaux publics"
          sectionId="cnetp"
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
      <div
        style={{
          borderRadius: '30px',
          border: `2px solid ${constants.colors.espaceAgentPastel}`,
          paddingLeft: '8px',
          display: 'inline-block',
        }}
      >
        <Icon slug="lockFill" color={constants.colors.espaceAgent}>
          {protectedCertificates.map((certificate, index) =>
            !hasAnyError(certificate.data) ? (
              <React.Fragment key={index}>{certificate.render}</React.Fragment>
            ) : null
          )}
        </Icon>
      </div>
    </>
  );
};
