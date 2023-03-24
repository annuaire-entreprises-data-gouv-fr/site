import { fetchRNCSImmatriculation } from '#clients/api-proxy/rncs';
import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IImmatriculation } from '.';

export interface IEtatCivil {
  sexe: 'M' | 'F' | null;
  nom: string;
  prenom: string;
  role: string;
  dateNaissancePartial: string;
  dateNaissanceFull: string;
  lieuNaissance: string;
}

export interface IBeneficiaire {
  type: string;
  nom: string;
  prenoms: string;
  dateNaissancePartial: string;
  nationalite: string;
  dateGreffe: string;
}
export interface IIdentite {
  denomination: string;
  dateImmatriculation: string;
  dateDebutActiv: string;
  dateRadiation: string;
  dateCessationActivite: string;
  isPersonneMorale: boolean;
  dateClotureExercice: string;
  dureePersonneMorale: string;
  capital: string;
  libelleNatureJuridique: string;
  natureEntreprise?: string;
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
    const {
      identite,
      dirigeants = [],
      beneficiaires = [],
      metadata,
    } = await fetchRNCSImmatriculation(siren);

    return {
      siren,
      downloadLink: `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`,
      siteLink: `${routes.rne.portail.entreprise}${siren}`,
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
