import { clientProfessionnelBio } from '#clients/api-bio';
import { IBioResponse } from '#clients/api-bio/interface';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { APINotRespondingFactory } from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IEtablissementsBio {
  etablissementsBio: IEtablissementBio[];
}

export interface IEtablissementBio {
  siret: string;
  enseigne: string;
  denomination: string;
  adresse: string;
  numeroBio: string;
  websites: string[];
  activities: string[];
  categories: string[];
  products: string[];
  onlyBio: boolean;
  certificat: IBioCertification;
}

export interface IBioCertification {
  date: {
    end: string;
    start: string;
    suspension: string;
    notification: string;
  };
  url: string;
  organization: string;
  status: IBioResponse['items'][0]['certificats'][0]['etatCertification'] | '';
  exempted: boolean;
}

export const getBio = async (uniteLegale: IUniteLegale) => {
  try {
    if (!uniteLegale.complements.estBio) {
      return APINotRespondingFactory(EAdministration.AGENCE_BIO, 404);
    }
    return await clientProfessionnelBio(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.AGENCE_BIO, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'ProfessionnelBio',
        cause: e,
        context: {
          siren: uniteLegale.siren,
        },
        administration: EAdministration.AGENCE_BIO,
      })
    );
    return APINotRespondingFactory(EAdministration.AGENCE_BIO, 500);
  }
};
