import { IUniteLegale } from '.';
import { HttpNotFound } from '../clients/exceptions';
import { fetchRNCSIMR } from '../clients/rncs/IMR';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';
import { EAdministration } from './administration';
import {
  IAPINotRespondingError,
  APINotRespondingFactory,
} from './api-not-responding';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IEtatCivil {
  sexe: 'M' | 'F' | null;
  nom: string;
  prenom: string;
  role: string;
  dateNaissance: string;
  lieuNaissance: string;
}

export interface IBeneficiaire {
  nom: string;
  prenoms: string;
  dateNaissance: string;
  nationalite: string;
}

export interface IPersonneMorale {
  siren: string;
  denomination: string;
  natureJuridique: string;
  role: string;
}

export type IDirigeant = IEtatCivil | IPersonneMorale;

export interface IDirigeants {
  uniteLegale: IUniteLegale;
  dirigeants: IDirigeant[] | IAPINotRespondingError;
  beneficiaires: IBeneficiaire[] | IAPINotRespondingError;
}

export const getDirigeantsWithUniteLegaleFromSlug = async (slug: string) => {
  const siren = verifySiren(slug);
  const [uniteLegale, dirigeantsAndBeneficiaires] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    getDirigeantsFromImmatriculations(siren),
  ]);

  const { dirigeants, beneficiaires } = dirigeantsAndBeneficiaires;

  return {
    uniteLegale,
    dirigeants,
    beneficiaires,
  };
};

export const getDirigeantsFromImmatriculations = async (siren: Siren) => {
  const notFound = APINotRespondingFactory(EAdministration.INPI, 404);
  try {
    const { dirigeants, beneficiaires } = await fetchRNCSIMR(siren);
    return {
      dirigeants: dirigeants.length > 0 ? dirigeants : notFound,
      beneficiaires: beneficiaires.length > 0 ? beneficiaires : notFound,
    };
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return { dirigeants: notFound, beneficiaires: notFound };
    } else {
      logWarningInSentry('IMR Fetching failed', { siren, details: e.message });
      const error = APINotRespondingFactory(EAdministration.INPI, 500);
      return { dirigeants: error, beneficiaires: error };
    }
  }
};
