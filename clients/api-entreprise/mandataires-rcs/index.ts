import routes from '#clients/routes';
import {
  IDirigeant,
  IEtatCivil,
  IPersonneMorale,
} from '#models/immatriculation';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';
export type IAPIEntrepriseMandatairesRCS = IAPIEntrepriseResponse<
  Array<
    | {
        type: 'personne_physique';
        fonction: string; // "PRESIDENT",
        nom: string; // "GAUQUELIN",
        prenom: string; // "ARNAUD",
        date_naissance: string; // "1969-08-24",
        date_naissance_timestamp: number; // -11235600,
        lieu_naissance: string; // "FLERS",
        pays_naissance: string; // "FRANCE",
        code_pays_naissance: string; // "FR",
        nationalite: string; // "FRANCAISE",
        code_nationalite: string; // "FR"
      }
    | {
        type: 'personne_morale'; // "personne_morale",
        numero_identification: string; // "784824153",
        fonction: string; // "COMMISSAIRE AUX COMPTES TITULAIRE",
        raison_sociale: string; // "MAZARS - SOCIETE ANONYME A DIRECTOIRE ET CONSEIL DE SURVEILLANCE",
        code_greffe: string; // "9201",
        libelle_greffe: string; // "NANTERRE"
      }
  >
>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseMandatairesRCS = async (siren: Siren) => {
  return await clientAPIEntreprise<
    IAPIEntrepriseMandatairesRCS,
    Array<IDirigeant>
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.mandatairesRCS.replace('{siren}', siren)}`,
    mapToDomainObject
  );
};

const mapToDomainObject = (
  response: IAPIEntrepriseMandatairesRCS
): Array<IDirigeant> => {
  return response.data.map((dirigeant) => {
    if (dirigeant.type === 'personne_physique') {
      return {
        sexe: null,
        nom: dirigeant.nom,
        prenom: dirigeant.prenom,
        role: dirigeant.fonction,
        lieuNaissance: dirigeant.lieu_naissance,
        dateNaissance: dirigeant.date_naissance,
      } as IEtatCivil;
    }
    return {
      siren: dirigeant.numero_identification,
      denomination: dirigeant.raison_sociale,
      natureJuridique: null,
      role: dirigeant.fonction,
    } as IPersonneMorale;
  });
};
