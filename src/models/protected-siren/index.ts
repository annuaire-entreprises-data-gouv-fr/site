import { readFromGrist } from "#/clients/external-tooling/grist.server";
import { InternalError } from "#/models/exceptions";
import { DataStore } from "#/utils/data-store";
import { normalizeName, normalizePrenoms } from "#/utils/helpers/name";
import { logErrorInSentry } from "#/utils/sentry";
import {
  extractSirenFromSiret,
  type Siren,
  type Siret,
} from "../../utils/helpers/siren-and-siret";

interface IGristProtectedSiren {
  date_de_naissance: number | string | null;
  legacy: boolean;
  nom: string;
  prenoms: string;
  siren: string;
}

const YEAR_MONTH_REGEX = /^\d{4}-\d{2}/;
const DIGITS_ONLY_REGEX = /^\d+$/;

/**
 * Grist dates are unix timestamps in seconds, at midnight UTC
 */
const toYearMonth = (value: number | string | null) => {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    if (YEAR_MONTH_REGEX.test(value)) {
      return value.slice(0, 7);
    }
    if (!DIGITS_ONLY_REGEX.test(value)) {
      return "";
    }
  }
  const date = new Date(Number(value) * 1000);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}`;
};

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
      () => readFromGrist("protected-siren-dirigeants"),
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
        prenoms: normalizePrenoms(row.prenoms),
        nom: normalizeName(row.nom),
        dateDeNaissance: toYearMonth(row.date_de_naissance),
      });
      if (row.legacy) {
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
