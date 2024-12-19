'use client';

import FAQLink from '#components-ui/faq-link';
import { Loader } from '#components-ui/loader';
import { isAPINotResponding } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import {
  hasFetchError,
  isDataLoading,
  isUnauthorized,
} from '#models/data-fetching';
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

  if (
    !hasRights(session, ApplicationRights.rcd) ||
    hasFetchError(rcdEffectifsAnnuelsProtected) ||
    isUnauthorized(rcdEffectifsAnnuelsProtected) ||
    isAPINotResponding(rcdEffectifsAnnuelsProtected)
  ) {
    return libelleTrancheEffectif(
      uniteLegale.trancheEffectif,
      uniteLegale.anneeTrancheEffectif
    );
  }

  if (isDataLoading(rcdEffectifsAnnuelsProtected)) {
    return (
      <>
        <Loader />
        &nbsp;
      </>
    );
  }

  const { trancheEffectif, anneeTrancheEffectif } =
    rcdEffectifsAnnuelsProtected;
  return (
    <FAQLink tooltipLabel={`${trancheEffectif}, en ${anneeTrancheEffectif}`}>
      Ces données sont issues du répertoire commun des déclarants (RCD)
    </FAQLink>
  );
};
