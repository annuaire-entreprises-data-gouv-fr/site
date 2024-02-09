import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';

export function shouldUseInsee<T extends {}>(
  etablissementRechercheEntreprise: T | IAPINotRespondingError,
  isBot: boolean,
  isEI: (r: T) => boolean
) {
  const rechercheEntrepriseFailed = isAPINotResponding(
    etablissementRechercheEntreprise
  );

  if (rechercheEntrepriseFailed) {
    return true;
  } else {
    if (isBot) {
      return false;
    }

    if (isEI(etablissementRechercheEntreprise)) {
      return true;
    }

    return false;
  }
}
