import { HttpNotFound } from '#clients/exceptions';
import { clientRGE } from '#clients/rge';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export type INomCertificat =
  | 'QUALIBAT-RGE'
  | 'QualiPAC Chauffage'
  | 'Qualibois module Eau'
  | 'Certificat OPQIBI'
  | 'Qualibois module Air'
  | 'Chauffage +'
  | 'Certificat Qualifelec RGE'
  | 'Qualisol CESI'
  | 'QualiPV 36'
  | 'Ventilation +'
  | 'Qualisol Combi'
  | 'QualiPAC module CET'
  | 'QualiPV 500'
  | 'CERTIBAT-RGE'
  | ' NF HABITAT Rénovation Maison RGE par CERQUAL'
  | 'Qualiforage module Sonde'
  | 'Qualiforage module Nappe'
  | 'Qualisol Collectif';

export interface IRGECertification {
  companyInfo: {
    nomEntreprise: string;
    adresse: string;
    email: string;
    siret: string;
    siteInternet: string;
    telephone: string;
    workingWithIndividual: boolean;
  };
  certifications: {
    codeQualification: string;
    nomCertificat: INomCertificat;
    domaines: string[];
    nomQualification: string;
    organisme: string;
    urlQualification: string;
  }[];
}

export const getRGECertifications = async (
  uniteLegale: IUniteLegale
): Promise<IRGECertification | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.estRge) {
      throw new HttpNotFound('Not a RGE company');
    }
    return await clientRGE(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.ADEME, 404);
    }
    logErrorInSentry('Error in API RGE', {
      siren: uniteLegale.siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.ADEME, 500);
  }
};
