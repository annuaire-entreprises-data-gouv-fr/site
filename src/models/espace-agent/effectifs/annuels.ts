import { clientApiEntrepriseEffectifsAnnuels } from "#/clients/api-entreprise/effectifs/annuels.server";
import type { TNatureEffectif } from "#/clients/api-entreprise/effectifs/types";
import type { IAPINotRespondingError } from "#/models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#/models/authentication/user/rights";
import type { UseCase } from "#/models/use-cases";
import { verifySiren } from "#/utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export interface IEffectifAnnuelItem {
  nature:
    | "effectif_moyen_annuel"
    | "effectif_boeth_annuel"
    | "effectif_ecap_annuel"
    | "effectif_assujettissement_oeth_annuel";
  regime: "regime_general" | "regime_agricole";
  value: number | null;
}

export interface IEffectifsAnnuelsProtected {
  anneeEffectif: string;
  effectifsRegimeAgricole: IEffectifAnnuelItem[];
  effectifsRegimeGeneral: IEffectifAnnuelItem[];
}

export const getEffectifsAnnuelsProtected = async (
  maybeSiren: string,
  params: {
    natureEffectif: TNatureEffectif;
    useCase: UseCase;
    profondeur: number;
  }
): Promise<Array<IEffectifsAnnuelsProtected | IAPINotRespondingError>> => {
  const siren = verifySiren(maybeSiren);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const effectifsAnnuelsYear =
    currentMonth === 0 ? currentYear - 2 : currentYear - 1;

  const yearsToFetch = new Array(params.profondeur)
    .fill(0)
    .map((_, index) => effectifsAnnuelsYear - index);

  return Promise.all(
    yearsToFetch.map((year) =>
      clientApiEntrepriseEffectifsAnnuels(
        siren,
        year,
        ApplicationRightsToScopes[ApplicationRights.effectifs],
        params.useCase,
        {
          nature_effectif: params.natureEffectif,
        }
      ).catch((error) =>
        handleApiEntrepriseError(error, {
          siren,
          apiResource: "EffectifsAnnuelsProtected",
        })
      )
    )
  );
};
