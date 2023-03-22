import { clientBio } from '#clients/bio';
import { IBioResponse } from '#clients/bio/type';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations';
import { APINotRespondingFactory } from '#models/api-not-responding';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IBioCompany {
  numeroBio: string;
  phone?: string;
  businessPhone?: string;
  email?: string;
  websites?: string[];
  activities?: string[];
  categories?: string[];
  products?: string[];
  totalyBio: boolean;
  certifications: IBioCertification[];
}

interface IBioCertification {
  date: {
    end?: string;
    start?: string;
    suspension?: string;
    notification?: string;
  };
  url?: string;
  organization?: string;
  status?: IBioResponse['items'][0]['certificats'][0]['etatCertification'];
}

export const getBio = async (uniteLegale: IUniteLegale) => {
  try {
    if (!uniteLegale.complements.estBio) {
      throw new HttpNotFound('Not bio company');
    }
    return await clientBio(uniteLegale.siege.siret);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.AGENCE_BIO, 404);
    }
    logErrorInSentry('Error in API bio', {
      siren: uniteLegale.siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.AGENCE_BIO, 500);
  }
};
