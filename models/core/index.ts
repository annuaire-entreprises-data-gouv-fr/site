import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';

export function shouldUseInsee<T extends {}>(
  rechercheEntrepriseResponse: T | IAPINotRespondingError,
  isBot: boolean,
  isEI: (r: T) => boolean,
  hasInconsistencies?: (r: T) => boolean
) {
  const rechercheEntrepriseFailed = isAPINotResponding(
    rechercheEntrepriseResponse
  );

  if (rechercheEntrepriseFailed) {
    return true;
  } else {
    if (isBot) {
      return false;
    }

    if (rechercheEntrepriseResponse) {
      if (
        hasInconsistencies &&
        hasInconsistencies(rechercheEntrepriseResponse)
      ) {
        return true;
      }

      if (isEI(rechercheEntrepriseResponse)) {
        return true;
      }
    }

    return false;
  }
}
