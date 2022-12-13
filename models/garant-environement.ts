import { clientRGE, WORKING_WITH_ENUM } from '#clients/rge';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siret, verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';

export type NomCertificat =
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

export interface IRGECompanyCertifications {
  companyInfo: {
    nomEntreprise: string;
    adresse: string;
    email: string;
    siret: Siret;
    siteInternet: string;
    telephone: string;
    workingWith: WORKING_WITH_ENUM[];
  } | null;
  certifications: {
    codeQualification: string;
    nomCertificat: NomCertificat;
    domaines: string[];
    nomQualification: string;
    organisme: string;
    urlQualification: string;
  }[];
}

const getRGECertificationsFromSlug = async (
  slug: string
): Promise<IRGECompanyCertifications | IAPINotRespondingError | {}> => {
  const siren = verifySiren(slug);
  try {
    return await clientRGE(siren);
  } catch (e: any) {
    logErrorInSentry('Error in API RGE', {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.ADEME, 500);
  }
};

export { getRGECertificationsFromSlug };
