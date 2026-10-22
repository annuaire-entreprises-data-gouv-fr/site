import { createServerOnlyFn } from "@tanstack/react-start";
import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "#/models/api-not-responding";
import type { IEtablissement, IUniteLegale } from "./types";

export const shouldUseInsee = createServerOnlyFn(
  <T extends IUniteLegale | IEtablissement>(
    rechercheEntrepriseResponse: T | IAPINotRespondingError,
    isBot: boolean,
    isEI: (r: T) => boolean,
    hasInconsistencies?: (r: T) => boolean
  ) => {
    if (process.env.INSEE_ENABLED === "disabled") {
      return false;
    }

    const rechercheEntrepriseFailed = isAPINotResponding(
      rechercheEntrepriseResponse
    );

    if (rechercheEntrepriseFailed) {
      return true;
    }
    if (isBot) {
      return false;
    }

    if (rechercheEntrepriseResponse) {
      if (
        "sirenConserve" in rechercheEntrepriseResponse &&
        rechercheEntrepriseResponse.sirenConserve
      ) {
        return false;
      }

      if (hasInconsistencies?.(rechercheEntrepriseResponse)) {
        return true;
      }

      if (isEI(rechercheEntrepriseResponse)) {
        return true;
      }
    }

    return false;
  }
);
