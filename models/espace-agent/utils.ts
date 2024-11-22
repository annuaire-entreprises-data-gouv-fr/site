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
import { capitalize, removeSpecialChars } from '#utils/helpers';
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

const cleanString = (nom: string) => {
  return removeSpecialChars(nom).toUpperCase();
};

const cleanPrenoms = (prenoms: string) => {
  return removeSpecialChars(prenoms).split(/, | /).map(capitalize).join(', ');
};

const cleanRole = (role: string) => {
  return removeSpecialChars(role).toUpperCase();
};

const createUniqueKey = (dirigeant: IEtatCivil | IPersonneMorale): string => {
  if ('siren' in dirigeant) {
    return `pm-${dirigeant.siren}`;
  } else {
    const prenoms = dirigeant.prenoms || '';
    const nom = dirigeant.nom || '';

    const cleanedPrenoms = cleanPrenoms(prenoms);
    const hasNomDeNaissanceMatch = nom.match(/\(([^)]+)\)/);
    const nomDeNaissance = hasNomDeNaissanceMatch
      ? hasNomDeNaissanceMatch[1]
      : nom;
    const cleanedNomDeNaissance = cleanString(nomDeNaissance);

    const partialDate =
      dirigeant.dateNaissancePartial ||
      dirigeant.dateNaissance?.slice(0, 7) ||
      '';
    return `pf-${cleanedPrenoms}-${cleanedNomDeNaissance}-${partialDate}`;
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

  const cleanedDirigeants = dirigeants.map((dirigeant) => {
    if (!isPersonneMorale(dirigeant)) {
      return {
        ...dirigeant,
        prenoms: cleanPrenoms(dirigeant.prenoms || ''),
        nom: cleanString(dirigeant.nom || ''),
        role: cleanRole(dirigeant.role || ''),
      };
    } else {
      return {
        ...dirigeant,
        denomination: cleanString(dirigeant.denomination || ''),
        natureJuridique: cleanString(dirigeant.natureJuridique || ''),
        role: cleanRole(dirigeant.role || ''),
      };
    }
  }) as (IEtatCivilMergedIGInpi | IPersonneMoraleMergedIGInpi)[];

  for (const dirigeant of cleanedDirigeants) {
    const { isInInpi, isInIg } = dirigeant;
    const role = dirigeant.role || '';

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

    const foundCleanedRole = mergedRoles[currentDirigeantKey][role];
    if (!foundCleanedRole) {
      mergedRoles[currentDirigeantKey][role] = {
        label: role,
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
