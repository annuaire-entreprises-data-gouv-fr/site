'use client';

import InformationTooltip from '#components-ui/information-tooltip';
import { Loader } from '#components-ui/loader';
import { ProtectedInlineData } from '#components/protected-inline-data';
import { IUniteLegale } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { libelleTrancheEffectif } from '#utils/helpers/formatting/codes-effectifs';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const LibelleTrancheEffectif = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  const rcdEffectifsAnnuelsProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentRcdEffectifsAnnuelsProtected,
    uniteLegale.siren,
    session
  );

  if (isDataLoading(rcdEffectifsAnnuelsProtected)) {
    return (
      <>
        <Loader />
        &nbsp;
      </>
    );
  }

  if (
    !hasRights(session, ApplicationRights.rcd) ||
    hasAnyError(rcdEffectifsAnnuelsProtected)
  ) {
    return libelleTrancheEffectif(
      uniteLegale.trancheEffectif,
      uniteLegale.anneeTrancheEffectif
    );
  }

  const { trancheEffectif, anneeTrancheEffectif } =
    rcdEffectifsAnnuelsProtected;
  return (
    <InformationTooltip
      tabIndex={undefined}
      label={
        'Ces données sont issues du répertoire commun des déclarants (RCD)'
      }
    >
      <ProtectedInlineData>
        {trancheEffectif}, en {anneeTrancheEffectif}
      </ProtectedInlineData>
    </InformationTooltip>
  );
};
