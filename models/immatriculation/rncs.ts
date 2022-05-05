import { IImmatriculation } from '.';
import { HttpNotFound } from '../../clients/exceptions';
import { fetchRNCSImmatriculation } from '../../clients/rncs';
import routes from '../../clients/routes';
import { Siren } from '../../utils/helpers/siren-and-siret';
import logErrorInSentry from '../../utils/sentry';
import { EAdministration } from '../administration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '../api-not-responding';

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

export interface IImmatriculationRNCSCore {
  identite: IIdentite;
  dirigeants: IDirigeant[];
  beneficiaires: IBeneficiaire[];
  metadata: {
    isFallback: boolean;
  };
}

export interface IImmatriculationRNCS
  extends IImmatriculation,
    IImmatriculationRNCSCore {
  siren: Siren;
}

/*
 * Request Immatriculation from INPI's RNCS
 * @param siren
 */
const getImmatriculationRNCS = async (
  siren: Siren
): Promise<IAPINotRespondingError | IImmatriculationRNCS> => {
  try {
    // fetch IMR and use cache
    const { identite, dirigeants, beneficiaires, metadata } =
      await fetchRNCSImmatriculation(siren, true);

    return {
      siren,
      downloadlink: routes.rncs.portail.entreprise + siren,
      identite,
      dirigeants,
      beneficiaires,
      metadata,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    logErrorInSentry('Error in INPI : API and fallback failed', {
      siren,
      details: e.toString(),
    });

    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
};

export default getImmatriculationRNCS;
