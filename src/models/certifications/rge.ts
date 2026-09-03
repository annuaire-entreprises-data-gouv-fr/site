import { HttpNotFound } from "#/clients/exceptions";
import { clientRGE } from "#/clients/rge";
import { EAdministration } from "#/models/administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import type { Siren } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";

export type INomCertificat =
  | "QUALIBAT-RGE"
  | "QualiPAC Chauffage"
  | "Qualibois module Eau"
  | "Certificat OPQIBI"
  | "Qualibois module Air"
  | "Chauffage +"
  | "Certificat Qualifelec RGE"
  | "Qualisol CESI"
  | "QualiPV 36"
  | "Ventilation +"
  | "Qualisol Combi"
  | "QualiPAC module CET"
  | "QualiPV 500"
  | "CERTIBAT-RGE"
  | " NF HABITAT Rénovation Maison RGE par CERQUAL"
  | "Qualiforage module Sonde"
  | "Qualiforage module Nappe"
  | "Qualisol Collectif";

export interface IRGECertification {
  etablissements: {
    certifications: {
      logoPath: string;
      codeQualification: string;
      nomCertificat: INomCertificat;
      domaines: string[];
      nomQualification: string;
      organisme: string;
      urlQualification: string;
    }[];
    companyInfo: {
      nomEntreprise: string;
      adresse: string;
      email: string;
      siret: string;
      siteInternet: string;
      telephone: string;
      workingWithIndividual: boolean;
    };
  }[];
}

export const getRGECertifications = async (
  siren: Siren,
  estRge: boolean
): Promise<IRGECertification | IAPINotRespondingError> => {
  try {
    if (!estRge) {
      throw new HttpNotFound("Not a RGE company");
    }
    return await clientRGE(siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.ADEME, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "RGECertifications",
        context: {
          siren,
        },
        administration: EAdministration.ADEME,
      })
    );
    return APINotRespondingFactory(EAdministration.ADEME, 500);
  }
};
