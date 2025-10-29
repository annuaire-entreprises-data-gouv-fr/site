import routes from "#clients/routes";
import constants from "#models/constants";
import type {
  IDirigeants,
  IEtatCivil,
  IObservations,
  IPersonneMorale,
} from "#models/rne/types";
import {
  formatFirstNames,
  formatLastName,
  formatRole,
  type Siren,
} from "#utils/helpers";
import { clientAPIProxy } from "../client";
import type {
  IRNEEtatCivilProxyResponse,
  IRNEObservationsFallbackProxyResponse,
  IRNEPersonneMoraleProxyResponse,
  IRNEProxyResponse,
} from "./types";

/**
 * RNE through the API proxy - API RNE
 * @param siren
 */
export const clientRNEImmatriculation = async (siren: Siren) => {
  const response = await clientAPIProxy<IRNEProxyResponse>(
    routes.proxy.rne.immatriculation.default(siren),
    {
      timeout: constants.timeout.XS,
    }
  );
  return mapToDomainObject(response);
};

/**
 * RNE observations through the API proxy - scrapping site as fallback
 * @param siren
 */
export const clientRNEObservationsFallback = async (siren: Siren) => {
  const response = await clientAPIProxy<IRNEObservationsFallbackProxyResponse>(
    routes.proxy.rne.observations.fallback(siren),
    {
      timeout: constants.timeout.XXXL,
    }
  );
  return mapObservationsToDomainObject(response);
};

const mapToDomainObject = ({
  observations,
  dirigeants,
}: IRNEProxyResponse): {
  observations: IObservations;
  dirigeants: IDirigeants;
} => {
  const newDirigeants = dirigeants.map((dirigeant) => {
    if (!("siren" in dirigeant || "denomination" in dirigeant)) {
      const etatCivil = dirigeant as IRNEEtatCivilProxyResponse;

      const { prenom, prenoms } = formatFirstNames(etatCivil.prenom, ", ");

      return {
        sexe: null,
        nom: formatLastName(etatCivil.nom),
        dateNaissance: "",
        dateNaissancePartial: etatCivil.dateNaissancePartial,
        prenom,
        prenoms,
        role: formatRole(etatCivil.role),
        estDemissionnaire: etatCivil.estDemissionnaire,
        dateDemission: etatCivil.dateDemission,
      } as IEtatCivil;
    }
    const personneMorale = dirigeant as IRNEPersonneMoraleProxyResponse;

    return {
      siren: personneMorale.siren,
      denomination: personneMorale.denomination,
      natureJuridique: personneMorale.natureJuridique,
      role: formatRole(personneMorale.role),
    } as IPersonneMorale;
  });

  return {
    observations: mapObservationsToDomainObject(observations),
    dirigeants: newDirigeants,
  };
};

function mapObservationsToDomainObject(
  observations: IRNEObservationsFallbackProxyResponse
): IObservations {
  return observations.map((observation) => ({
    dateAjout: observation.dateAjout,
    description: observation.description,
    numObservation: observation.numObservation,
  }));
}
