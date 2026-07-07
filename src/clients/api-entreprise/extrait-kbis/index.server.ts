import routes from "#/clients/routes";
import type { IAgentScope } from "#/models/authentication/agent/scopes/constants";
import type { Siren } from "#/utils/helpers";
import clientAPIEntreprise, {
  type IAPIEntrepriseResponse,
} from "../client.server";

type NullableString = string | null;

export interface IAPIEntrepriseExtraitKbisMandataireSocial {
  date_naissance?: NullableString;
  fonction: NullableString;
  nom?: NullableString;
  numero_identification?: NullableString;
  prenom?: NullableString;
  raison_sociale?: NullableString;
  type?: "personne_morale" | "personne_physique";
}

export interface IAPIEntrepriseExtraitKbisObservation {
  date?: string;
  libelle?: string;
  numero?: string;
}

export interface IAPIEntrepriseExtraitKbisEtablissementPrincipal {
  activite: NullableString;
  code_ape: string;
  mode_exploitation: NullableString;
  origine_fonds: NullableString;
}

export interface IAPIEntrepriseExtraitKbisCapital {
  code_devise: NullableString;
  devise: NullableString;
  montant: number | null;
}

export interface IAPIEntrepriseExtraitKbisGreffe {
  code: string;
  valeur: string;
}

export interface IAPIEntrepriseExtraitKbisAdresse {
  bureau_distributeur: NullableString;
  code_postal: NullableString;
  ligne_1: NullableString;
  ligne_2: NullableString;
  localite: NullableString;
  nom_postal: NullableString;
  numero: NullableString;
  pays: NullableString;
  type: NullableString;
  voie: NullableString;
}

export interface IAPIEntrepriseExtraitKbisCodeValeur {
  code: NullableString;
  valeur: NullableString;
}

export interface IAPIEntrepriseExtraitKbisNaissance {
  date: NullableString;
  lieu: NullableString;
  pays: IAPIEntrepriseExtraitKbisCodeValeur;
}

export interface IAPIEntrepriseExtraitKbisPersonnePhysique {
  adresse: IAPIEntrepriseExtraitKbisAdresse;
  naissance: IAPIEntrepriseExtraitKbisNaissance;
  nationalite: IAPIEntrepriseExtraitKbisCodeValeur;
  nom: NullableString;
  prenom: NullableString;
}

export interface IAPIEntrepriseExtraitKbisPersonneMorale {
  date_cloture_exercice_comptable: NullableString;
  date_fin_de_vie: NullableString;
  denomination: NullableString;
  forme_juridique: IAPIEntrepriseExtraitKbisCodeValeur;
}

export interface IAPIEntrepriseExtraitKbisData {
  capital: IAPIEntrepriseExtraitKbisCapital;
  date_extrait: NullableString;
  date_immatriculation: NullableString;
  date_radiation: NullableString;
  etablissement_principal: IAPIEntrepriseExtraitKbisEtablissementPrincipal;
  greffe: IAPIEntrepriseExtraitKbisGreffe;
  mandataires_sociaux: IAPIEntrepriseExtraitKbisMandataireSocial[];
  nom_commercial: NullableString;
  observations: IAPIEntrepriseExtraitKbisObservation[];
  personne_morale: IAPIEntrepriseExtraitKbisPersonneMorale;
  personne_physique: IAPIEntrepriseExtraitKbisPersonnePhysique;
  siren: string;
}

export type IAPIEntrepriseExtraitKbis =
  IAPIEntrepriseResponse<IAPIEntrepriseExtraitKbisData>;

/**
 * GET extrait Kbis from API Entreprise
 */
export const clientApiEntrepriseExtraitKbis = async (
  siren: Siren,
  scope: IAgentScope | null
) =>
  await clientAPIEntreprise<
    IAPIEntrepriseExtraitKbis,
    IAPIEntrepriseExtraitKbisData
  >(routes.apiEntreprise.extraitKbis(siren), mapToDomainObject, { scope });

const mapToDomainObject = (
  response: IAPIEntrepriseExtraitKbis
): IAPIEntrepriseExtraitKbisData => response.data;
