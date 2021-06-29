import { IUniteLegale } from '.';
import { HttpNotFound } from '../clients/exceptions';
import { fetchRNCSIMR } from '../clients/rncs/IMR';
import { Siren } from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';
import { EAdministration } from './administration';
import {
  IAPINotRespondingError,
  APINotRespondingFactory,
} from './api-not-responding';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IEtatCivil {
  sexe?: 'M' | 'F' | null;
  nom?: string;
  prenom?: string;
  role?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
}

export interface IPersonneMorale {
  siren?: string;
  denomination?: string;
  natureJuridique?: string;
  role?: string;
}

export type IDirigeant = IEtatCivil & IPersonneMorale;

// export const isPersonneMorale = (
//   toBeDetermined: IEtatCivil | IPersonneMorale
// ): toBeDetermined is IPersonneMorale => {
//   if (
//     (toBeDetermined as IPersonneMorale).siren ||
//     (toBeDetermined as IPersonneMorale).denomination
//   ) {
//     return true;
//   }
//   return false;
// };

export interface IDirigeants {
  uniteLegale: IUniteLegale;
  dirigeants: IDirigeant[] | IAPINotRespondingError;
}

export const getDirigeantsWithUniteLegaleFromSlug = async (slug: string) => {
  const uniteLegale = await getUniteLegaleFromSlug(slug);
  const dirigeants = await getDirigeantsFromImmatricualtions(uniteLegale.siren);

  return {
    uniteLegale,
    dirigeants,
  };
};

export const getDirigeantsFromImmatricualtions = async (siren: Siren) => {
  try {
    return await fetchRNCSIMR(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    } else {
      logWarningInSentry('IMR Fetching failed', { siren, details: e.message });
      return APINotRespondingFactory(EAdministration.INPI, 500);
    }
  }
};
