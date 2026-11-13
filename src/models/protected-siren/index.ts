import { readFromGrist } from "#/clients/external-tooling/grist.server";
import { InternalError } from "#/models/exceptions";
import { DataStore } from "#/utils/data-store";
import { normalizeName } from "#/utils/helpers/name";
import { logErrorInSentry } from "#/utils/sentry";
import {
  extractSirenFromSiret,
  type Siren,
  type Siret,
} from "../../utils/helpers/siren-and-siret";

interface IGristProtectedSiren {
  date_de_naissance: string;
  legacy: boolean;
  nom: string;
  prenoms: string;
  siren: string;
}

export interface IProtectedSiren {
  dirigeants: {
    dateDeNaissance: string;
    nom: string;
    prenoms: string;
  }[];
  isLegacy: boolean;
}

/**
 * List of siren whose owner asked to be removed from website
 * See /public/protected-siren.txt
 */
class ProtectedSirenList {
  _list: DataStore<IProtectedSiren>;
  // time before protected siren list update
  private readonly TTL = 3_600_000; // 1h

  constructor() {
    this._list = new DataStore<IProtectedSiren>(
      () => readFromGrist("protected-siren-dirigeants").catch(() => []),
      "protected-siren-dirigeants",
      this.mapResponseToProtectedSirenList,
      this.TTL
    );
  }

  mapResponseToProtectedSirenList = (response: IGristProtectedSiren[]) => {
    const protectedSiren: Record<string, IProtectedSiren> = {};

    for (const row of response) {
      if (!(row.prenoms || row.nom || row.date_de_naissance || row.legacy)) {
        continue;
      }
      if (!protectedSiren[row.siren]) {
        protectedSiren[row.siren] = {
          dirigeants: [],
          isLegacy: row.legacy,
        };
      }
      protectedSiren[row.siren].dirigeants.push({
        prenoms: normalizeName(row.prenoms),
        nom: normalizeName(row.nom),
        dateDeNaissance: row.date_de_naissance,
      });
      if (!protectedSiren[row.siren].isLegacy && row.legacy) {
        protectedSiren[row.siren].isLegacy = true;
      }
    }

    if (Object.keys(protectedSiren).length < 4000) {
      logErrorInSentry(
        new InternalError({
          message: "ProtectedSirenList is abnormally low",
        })
      );
    }
    return protectedSiren;
  };
}

const protectedSiren = new ProtectedSirenList();

export const isProtectedSiren = async (siren: Siren) =>
  !!(await protectedSiren._list.get(siren));

export const getProtectedSiren = async (siren: Siren) =>
  await protectedSiren._list.get(siren);

export const isProtectedSiret = async (siret: Siret) => {
  const siren = extractSirenFromSiret(siret);
  return await protectedSiren._list.get(siren);
};

export const getProtectedSirenList = async () =>
  await protectedSiren._list.getKeys();
