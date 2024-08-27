import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { IObservations } from '#models/rne/types';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';

type IRNEProxyResponse = {
  identite: {
    denomination: string;
    natureEntreprise: string;
    dateImmatriculation: string;
    dateDebutActiv: string;
    dateRadiation: string;
    dateCessationActivite: string;
    isPersonneMorale: boolean;
    dateClotureExercice: string;
    dureePersonneMorale: string;
    capital: string;
    libelleNatureJuridique: string;
  };
  observations: IObservations[];
};

/**
 * RNE through the API proxy - API RNE
 * @param siren
 */
const fetchRNEImmatriculation = async (siren: Siren, useCache = true) => {
  const response = await clientAPIProxy<IRNEProxyResponse>(
    routes.proxy.rne.immatriculation.default + siren,
    {
      timeout: constants.timeout.XXXL,
      useCache,
    }
  );
  return mapToDomainObject(response);
};

/**
 * RNE through the API proxy - scrapping site as fallback
 * @param siren
 */
const fetchRNEImmatriculationFallback = async (
  siren: Siren,
  useCache = true
) => {
  const response = await clientAPIProxy<IRNEProxyResponse>(
    routes.proxy.rne.immatriculation.fallback + siren,
    {
      timeout: constants.timeout.XXXL,
      useCache,
    }
  );
  return mapToDomainObject(response);
};

const mapToDomainObject = ({ observations, identite }: IRNEProxyResponse) => {
  return {
    observations,
    immatriculation: {
      natureEntreprise: (identite.natureEntreprise || '').split(', '),
      dateImmatriculation: identite.dateImmatriculation,
      dateDebutActivite: identite.dateDebutActiv,
      dateRadiation: identite.dateRadiation,
      isPersonneMorale: identite.isPersonneMorale,
      dateCloture: identite.dateClotureExercice,
      duree: identite.dureePersonneMorale,
      capital: identite.capital,
    },
  };
};

const stubbedClient = stubClientWithSnapshots({
  fetchRNEImmatriculation,
});
const stubbedClientFallback = stubClientWithSnapshots({
  fetchRNEImmatriculationFallback,
});

export {
  stubbedClient as fetchRNEImmatriculation,
  stubbedClientFallback as fetchRNEImmatriculationFallback,
};
