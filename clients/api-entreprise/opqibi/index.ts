import routes from "#clients/routes";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { IOpqibi } from "#models/espace-agent/certificats/opqibi";
import type { Siren } from "#utils/helpers";
import clientAPIEntreprise, { type IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseOpqibi = IAPIEntrepriseResponse<{
  numero_certificat: string; // "string",
  url: string; // "https://www.opqibi.com/fiche/1777",
  date_delivrance_certificat: string; // "2021-01-28",
  duree_validite_certificat: string; // "valable un an",
  assurances: string; // "ALLIANZ - XL INSURANCE",
  qualifications: Array<{
    nom: string; // "Etude thermique réglementaire \"maison individuelle\"",
    code_qualification: string; // "1331",
    definition: string; // "Cette qualification correspond à la réalisation des calculs thermiques réglementaires pour les constructions neuves.",
    rge: boolean; // false
  }>;
  date_validite_qualifications: string; // "2025-02-21",
  qualifications_probatoires: Array<{
    nom: string; // "Etude thermique réglementaire \"maison individuelle\"",
    code_qualification: string; // "1331",
    definition: string; // "Cette qualification correspond à la réalisation des calculs thermiques réglementaires pour les constructions neuves.",
    rge: boolean; // false
  }>;
  date_validite_qualifications_probatoires: string; //"2025-02-21"
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseOpqibi = async (
  siren: Siren,
  scope: IAgentScope | null
) =>
  await clientAPIEntreprise(
    routes.apiEntreprise.certifications.opqibi(siren),
    mapToDomainObject,
    { scope }
  );

const mapQualification = (
  qualification: IAPIEntrepriseOpqibi["data"]["qualifications"][0]
) => ({
  nom: qualification.nom,
  codeQualification: qualification.code_qualification,
  definition: qualification.definition,
  rge: qualification.rge,
});

const mapToDomainObject = ({ data }: IAPIEntrepriseOpqibi): IOpqibi => ({
  numeroCertificat: data.numero_certificat,
  url: data.url,
  dateDelivranceCertificat: data.date_delivrance_certificat,
  dureeValiditeCertificat: data.duree_validite_certificat,
  assurances: data.assurances,
  qualifications: data.qualifications.map(mapQualification),
  dateValiditeQualifications: data.date_validite_qualifications,
  qualificationsProbatoires:
    data.qualifications_probatoires.map(mapQualification),
  dateValiditeQualificationsProbatoires:
    data.date_validite_qualifications_probatoires,
});
