import { IUniteLegale } from '.';
import { HttpNotFound } from '../clients/exceptions';
import { fetchRNCSIMR } from '../clients/rncs/IMR';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
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
  type: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  nationalite: string;
  dateGreffe: string;
}
export interface IIdentite {
  denomination: string;
  codeGreffe: string;
  greffe: string;
  numeroRCS: string;
  numGestion: string;
  dateGreffe: string;
  dateImmatriculation: string;
  dateDebutActiv: string;
  dateRadiation: string;
  dateCessationActivite: string;
  isPersonneMorale: boolean;
  dateClotureExercice: string;
  dureePersonneMorale: string;
  capital: string;
  libelleNatureJuridique: string;
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
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return { dirigeants: notFound, beneficiaires: notFound };
    } else {
      logErrorInSentry(new Error('Error in API INPI'), {
        siren,
        details: `Dirigeants fetching failed : ${e.message || e}`,
      });
      const error = APINotRespondingFactory(EAdministration.INPI, 500);
      return { dirigeants: error, beneficiaires: error };
    }
  }
};
