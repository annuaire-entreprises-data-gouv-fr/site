import routes from "#clients/routes";
import constants from "#models/constants";
import {
  type IUniteLegale,
  createDefaultEtablissement,
  createDefaultUniteLegale,
} from "#models/core/types";
import { type Siren, formatDateYear } from "#utils/helpers";
import { etatFromEtatAdministratifInsee } from "#utils/helpers/insee-variables";
import { clientAPIProxy } from "../client";
import type { IIGResponse } from "./types";

/**
 * Call EORI to validate a French EORI number
 * @param siret
 */
export const clientUniteLegaleIG = async (
  siren: Siren
): Promise<IUniteLegale> => {
  return mapToDomainObject(
    await clientAPIProxy<IIGResponse>(routes.proxy.ig(siren), {
      timeout: constants.timeout.XL,
    }),
    siren
  );
};

const mapToDomainObject = (r: IIGResponse, siren: Siren): IUniteLegale => {
  const defaultUniteLegale = createDefaultUniteLegale(siren);
  return {
    ...defaultUniteLegale,
    ...r,
    siege: createDefaultEtablissement(),
    dateMiseAJourIG: formatDateYear(new Date()) || "",
    etatAdministratif: etatFromEtatAdministratifInsee(r.etat, r.siren),
  };
};
