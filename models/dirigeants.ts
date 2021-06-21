import { HttpNotFound } from '../clients/exceptions';
import { fetchRNCSDirigeants } from '../clients/rncs/dirigeants';
import { Siren } from '../utils/helpers/siren-and-siret';
import { EAdministration } from './administration';
import { IAPINotRespondingError } from './api-not-responding';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IEtatCivil {
  sexe: 'M' | 'F';
  nom: string;
  prenom: string;
  role?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
}

export interface IPersonneMorale {
  siren: string;
  denomination: string;
  natureJuridique: string;
  role?: string;
}

export interface IDirigeants {
  INSEE: IEtatCivil | null;
  RNCS: (IEtatCivil & IPersonneMorale)[] & IAPINotRespondingError;
}

export const getDirigeantsWithUniteLegaleFromSlug = async (slug: string) => {
  const uniteLegale = await getUniteLegaleFromSlug(slug);

  return {
    uniteLegale,
    dirigeants: {
      INSEE: uniteLegale.dirigeant,
      RNCS: await getDirigeantsFromImmatricualtions(uniteLegale.siren),
    },
  };
};

export const getDirigeantsFromImmatricualtions = async (siren: Siren) => {
  try {
    return await fetchRNCSDirigeants(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return null;
    } else {
      return {
        administration: EAdministration.INPI,
        type: 500,
      };
    }
  }
};
