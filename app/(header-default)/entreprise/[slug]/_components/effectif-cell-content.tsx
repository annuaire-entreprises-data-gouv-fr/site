"use client";

import { use } from "react";
import { ProtectedInlineData } from "#components/protected-inline-data";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import {
  type IAPINotRespondingError,
  isAPI404,
} from "#models/api-not-responding";
import { hasAnyError, type IDataFetchingState } from "#models/data-fetching";
import type { IEffectifsAnnuelsProtected } from "#models/espace-agent/effectifs/annuels";
import { formatFloatFr } from "#utils/helpers";

type EffectifCellContentProps = {
  effectifsAnnuelsProtected: Promise<
    | IEffectifsAnnuelsProtected
    | IAPINotRespondingError
    | Exclude<IDataFetchingState, IDataFetchingState.LOADING>
  >;
};

export const EffectifCellContent = ({
  effectifsAnnuelsProtected: effectifsAnnuelsProtectedPromise,
}: EffectifCellContentProps) => {
  const effectifsAnnuelsProtected = use(effectifsAnnuelsProtectedPromise);

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
