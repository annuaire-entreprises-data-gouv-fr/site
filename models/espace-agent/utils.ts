import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { APINotRespondingFactory } from '#models/api-not-responding';
import { FetchRessourceException, IExceptionContext } from '#models/exceptions';
import {
  IDirigeants,
  IDirigeantsMergedIGInpi,
  IEtatCivil,
  IEtatCivilMergedIGInpi,
  IPersonneMorale,
  IPersonneMoraleMergedIGInpi,
  IRole,
} from '#models/rne/types';
import { removeSpecialChars } from '#utils/helpers';
import { isPersonneMorale } from '#utils/helpers/is-personne-morale';
import logErrorInSentry from '#utils/sentry';

export function handleApiEntrepriseError(
  e: any,
  context: IExceptionContext & { apiResource: string }
) {
  if (e instanceof HttpNotFound) {
    return APINotRespondingFactory(EAdministration.DINUM, 404);
  }

  logErrorInSentry(
    new FetchRessourceException({
      cause: e,
      ressource: 'APIEntreprise',
      context,
      administration: EAdministration.DINUM,
    })
  );
  return APINotRespondingFactory(EAdministration.DINUM, e.status || 500);
}

const createUniqueKey = (dirigeant: IEtatCivil | IPersonneMorale): string => {
  if ('siren' in dirigeant) {
    return `pm-${dirigeant.siren}`;
  } else {
    const cleanedPrenom = removeSpecialChars(dirigeant.prenom).toUpperCase();

    const hasNomDeNaissanceMatch = dirigeant.nom.match(/\(([^)]+)\)/);
    const nom = hasNomDeNaissanceMatch
      ? hasNomDeNaissanceMatch[1]
      : dirigeant.nom;
    const cleanedNom = removeSpecialChars(nom).toUpperCase();

    const partialDate =
      dirigeant.dateNaissancePartial ||
      dirigeant.dateNaissance?.slice(0, 7) ||
      '';
    return `pf-${cleanedPrenom}-${cleanedNom}-${partialDate}`;
  }
};

export const mergeDirigeants = (
  dirigeantsRCS: IDirigeants,
  dirigeantsRNE: IDirigeants
): IDirigeantsMergedIGInpi => {
  const mergedDirigeants: Record<
    string,
    IEtatCivilMergedIGInpi | IPersonneMoraleMergedIGInpi
  > = {};
  const mergedRoles: Record<string, Record<string, IRole>> = {};

  const dirigeants = [
    ...dirigeantsRCS.map((d) => ({ ...d, isInIg: true, isInInpi: false })),
    ...dirigeantsRNE.map((d) => ({ ...d, isInIg: false, isInInpi: true })),
  ] as (IEtatCivilMergedIGInpi | IPersonneMoraleMergedIGInpi)[];

  for (const dirigeant of dirigeants) {
    const { isInInpi, isInIg, role } = dirigeant;
    const currentDirigeantKey = createUniqueKey(dirigeant);

    const foundDirigeant = mergedDirigeants[currentDirigeantKey];
    if (!foundDirigeant) {
      mergedDirigeants[currentDirigeantKey] = {
        ...dirigeant,
        isInInpi,
        isInIg,
      };
      mergedRoles[currentDirigeantKey] = {};
    } else if (isInInpi) {
      foundDirigeant.isInInpi = true;
      if (!isPersonneMorale(dirigeant) && !isPersonneMorale(foundDirigeant)) {
        foundDirigeant.nom = dirigeant.nom;
      }
    } else if (isInIg) {
      foundDirigeant.isInIg = true;
      if (!isPersonneMorale(dirigeant) && !isPersonneMorale(foundDirigeant)) {
        foundDirigeant.dateNaissance = dirigeant.dateNaissance;
        foundDirigeant.lieuNaissance = dirigeant.lieuNaissance;
      }
    }

    const cleanedRole = removeSpecialChars(role).toUpperCase();
    const foundCleanedRole = mergedRoles[currentDirigeantKey][cleanedRole];
    if (!foundCleanedRole) {
      mergedRoles[currentDirigeantKey][cleanedRole] = {
        label: cleanedRole,
        isInInpi,
        isInIg,
      };
    } else if (isInInpi) {
      foundCleanedRole.isInInpi = true;
    } else if (isInIg) {
      foundCleanedRole.isInIg = true;
    }
  }

  return Object.values(mergedDirigeants).map((dirigeant) => ({
    ...dirigeant,
    roles: Object.values(mergedRoles[createUniqueKey(dirigeant)]),
  }));
};
