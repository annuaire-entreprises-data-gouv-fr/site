import { clientApiEntrepriseEffectifsMensuels } from "#clients/api-entreprise/effectifs/mensuels";
import type { TNatureEffectif } from "#clients/api-entreprise/effectifs/types";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
import { verifySiret } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export interface IEffectifMensuelItem {
  date: string;
  nature:
    | "effectif_moyen_mensuel"
    | "effectif_boeth_mensuel"
    | "effectif_ecap_mensuel"
    | "effectif_assujettissement_oeth_mensuel";
  regime: "regime_general" | "regime_agricole";
  value: number | null;
}

export interface IEffectifsMensuelsProtected {
  effectifsRegimeAgricole: IEffectifMensuelItem[];
  effectifsRegimeGeneral: IEffectifMensuelItem[];
}

const allowedNatureEffectifs = [
  "assujettissement_oeth",
  "boeth",
  "ecap",
  "moyen",
] as const satisfies readonly TNatureEffectif[];

export const getEffectifsMensuelsProtected = async (
  maybeSiret: string,
  params: {
    natureEffectif: TNatureEffectif;
    year: string;
  }
): Promise<IEffectifsMensuelsProtected | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const defaultYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const parsedYear = Number.parseInt(params.year ?? "", 10);
  const year = Number.isNaN(parsedYear) ? defaultYear : parsedYear;
  const natureEffectif = allowedNatureEffectifs.includes(
    params.natureEffectif ?? "moyen"
  )
    ? params.natureEffectif
    : "moyen";

  if (year === currentYear && currentMonth === 0) {
    return {
      effectifsRegimeGeneral: [],
      effectifsRegimeAgricole: [],
    };
  }

  const effectifsMensuelsMonth = year === currentYear ? currentMonth : 12;
  const profondeur = year === currentYear ? currentMonth - 1 : 11;

  return clientApiEntrepriseEffectifsMensuels(
    siret,
    year,
    effectifsMensuelsMonth,
    ApplicationRightsToScopes[ApplicationRights.effectifs],
    {
      profondeur,
      nature_effectif: natureEffectif,
    }
  ).catch((error) =>
    handleApiEntrepriseError(error, {
      siret,
      apiResource: "EffectifsMensuelsProtected",
    })
  );
};
