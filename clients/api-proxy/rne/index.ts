import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import {
  IDirigeants,
  IEtatCivil,
  IIdentite,
  IObservations,
  IPersonneMorale,
} from '#models/rne/types';
import { formatFirstNames, formatLastName, Siren } from '#utils/helpers';
import { getDateFin } from '#utils/helpers/rne-variables';
import { clientAPIProxy } from '../client';

type IRNEEtatCivilProxyResponse = {
  nom: string;
  prenom: string;
  role: string;
  dateNaissanceFull: string;
  dateNaissancePartiel: string;
};
type IRNEPersonneMoraleProxyResponse = {
  denomination: string;
  natureJuridique: string;
  role: string;
  siren: string;
};
type IRNEIdentiteProxyResponse = {
  capital: string;
  dateCessationActivite: string;
  dateClotureExercice: string;
  dateDebutActiv: string;
  dateImmatriculation: string;
  dateRadiation: string;
  denomination: string;
  dureePersonneMorale: number;
  isPersonneMorale: boolean;
  libelleNatureJuridique: string;
  natureEntreprise: string;
};
export type IRNEObservationsProxyResponse = {
  dateAjout: string;
  description: string;
  numObservation: string;
}[];

type IRNEProxyResponse = {
  identite: IRNEIdentiteProxyResponse;
  observations: IRNEObservationsProxyResponse;
  dirigeants: (IRNEPersonneMoraleProxyResponse | IRNEEtatCivilProxyResponse)[];
};

/**
 * RNE through the API proxy - API RNE
 * @param siren
 */
const clientRNEImmatriculation = async (siren: Siren) => {
  const response = await clientAPIProxy<IRNEProxyResponse>(
    routes.proxy.rne.immatriculation.default + siren,
    {
      timeout: constants.timeout.XS,
    }
  );
  return mapToDomainObject(response);
};

/**
 * RNE through the API proxy - scrapping site as fallback
 * @param siren
 */
const clientRNEImmatriculationFallback = async (siren: Siren) => {
  const response = await clientAPIProxy<IRNEProxyResponse>(
    routes.proxy.rne.immatriculation.fallback + siren,
    {
      timeout: constants.timeout.XXXL,
    }
  );
  return mapToDomainObject(response);
};

const mapToDomainObject = ({
  observations,
  identite,
  dirigeants,
}: IRNEProxyResponse): {
  observations: IObservations;
  immatriculation: IIdentite;
  dirigeants: IDirigeants;
} => {
  const newDirigeants = dirigeants.map((dirigeant) => {
    if (!('siren' in dirigeant || 'denomination' in dirigeant)) {
      const etatCivil = dirigeant as IRNEEtatCivilProxyResponse;

      const { prenom, prenoms } = formatFirstNames(etatCivil.prenom, ', ');

      return {
        sexe: null,
        nom: formatLastName(etatCivil.nom),
        prenom,
        prenoms,
        role: etatCivil.role,
      } as IEtatCivil;
    }
    const personneMorale = dirigeant as IRNEPersonneMoraleProxyResponse;

    return {
      siren: personneMorale.siren,
      denomination: personneMorale.denomination,
      natureJuridique: personneMorale.natureJuridique,
      role: personneMorale.role,
    } as IPersonneMorale;
  });

  return {
    observations,
    immatriculation: {
      capital: identite.capital,
      dateCessationActivite: getDateFin(
        identite.dureePersonneMorale,
        identite.dateImmatriculation
      ),
      dateClotureExercice: identite.dateClotureExercice,
      dateDebutActivite: identite.dateDebutActiv,
      dateImmatriculation: identite.dateImmatriculation,
      dateRadiation: identite.dateRadiation,
      denomination: identite.denomination,
      dureePersonneMorale: identite.dureePersonneMorale,
      isPersonneMorale: identite.isPersonneMorale,
      libelleNatureJuridique: identite.libelleNatureJuridique,
      natureEntreprise: identite.natureEntreprise,
    },
    dirigeants: newDirigeants,
  };
};

const stubbedClient = stubClientWithSnapshots({
  clientRNEImmatriculation,
});
const stubbedClientFallback = stubClientWithSnapshots({
  clientRNEImmatriculationFallback,
});

export {
  stubbedClient as clientRNEImmatriculation,
  stubbedClientFallback as clientRNEImmatriculationFallback,
};
