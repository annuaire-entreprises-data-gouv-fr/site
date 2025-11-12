"use client";

import { useMemo } from "react";
import { getAgentEffectifsAnnuelsProtectedAction } from "server-actions/agent/data-fetching";
import { GIPMDS, INSEE } from "#components/administrations";
import NonRenseigne from "#components/non-renseigne";
import { ProtectedInlineData } from "#components/protected-inline-data";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import { Loader } from "#components-ui/loader";
import { useServerActionData } from "#hooks/fetch/use-server-action-data";
import { isAPI404 } from "#models/api-not-responding";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { hasAnyError, isDataLoading } from "#models/data-fetching";
import { formatFloatFr } from "#utils/helpers";
import { libelleTrancheEffectif } from "#utils/helpers/formatting/codes-effectifs";

export const FAQEffectifAnnuel = () => (
  <FAQLink tooltipLabel="Effectif annuel">
    L’effectif moyen annuel (EMA), correspond à la somme des effectifs moyens
    mensuels (EMM) de tous les établissements, divisée par le nombre de mois au
    cours desquels des salariés ont été employés.
    <br />
    Ces données sont issues du Répertoire Commun des Déclarants (RCD) et
    réservées aux agents publics.
  </FAQLink>
);

export const ProtectedEffectifCell = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  const input = useMemo(
    () => ({ siren: uniteLegale.siren }),
    [uniteLegale.siren]
  );
  const effectifsAnnuelsProtected = useServerActionData(
    getAgentEffectifsAnnuelsProtectedAction,
    session,
    input
  );

  if (isDataLoading(effectifsAnnuelsProtected)) {
    return (
      <ProtectedInlineData>
        <Loader />
        &nbsp;
      </ProtectedInlineData>
    );
  }

  if (isAPI404(effectifsAnnuelsProtected)) {
    return <ProtectedInlineData>Pas de données</ProtectedInlineData>;
  }

  if (hasAnyError(effectifsAnnuelsProtected)) {
    return (
      <InformationTooltip
        horizontalOrientation="left"
        label={
          <>
            Nous n’avons pas pu récupérer les effectifs de cette structure car
            le téléservice ne fonctionne pas actuellement. Merci de ré-essayer
            plus tard.
          </>
        }
        left="5px"
        tabIndex={0}
      >
        <Icon color="#df0a00" slug="errorFill">
          <em>Service indisponible</em>
        </Icon>
      </InformationTooltip>
    );
  }

  const { effectif, anneeEffectif } = effectifsAnnuelsProtected;
  return (
    <ProtectedInlineData>
      {formatFloatFr(effectif.toString())} salarié{effectif > 1 ? "s" : ""}, en{" "}
      {anneeEffectif}
    </ProtectedInlineData>
  );
};

export const EffectifCell = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  if (hasRights(session, ApplicationRights.effectifsAnnuels)) {
    return (
      <ul>
        <li>
          Tranche statistique (<INSEE />) :{" "}
          {libelleTrancheEffectif(
            uniteLegale.trancheEffectif,
            uniteLegale.anneeTrancheEffectif
          )}
        </li>
        <li>
          <span>
            <FAQEffectifAnnuel /> (<GIPMDS />) :{" "}
          </span>
          <ProtectedEffectifCell session={session} uniteLegale={uniteLegale} />
        </li>
      </ul>
    );
  }
  const effectif = libelleTrancheEffectif(
    uniteLegale.trancheEffectif,
    uniteLegale.anneeTrancheEffectif
  );
  return effectif ?? <NonRenseigne />;
};
