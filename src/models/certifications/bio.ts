import { clientProfessionnelBio } from "#/clients/api-bio";
import type { IBioResponse } from "#/clients/api-bio/interface";
import { HttpNotFound } from "#/clients/exceptions";
import { EAdministration } from "#/models/administrations/e-administration";
import { APINotRespondingFactory } from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import type { Siren } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";

export interface IEtablissementsBio {
  etablissementsBio: IEtablissementBio[];
}

export interface IEtablissementBio {
  activities: string[];
  adresse: string;
  categories: string[];
  certificat: IBioCertification;
  denomination: string;
  enseigne: string;
  numeroBio: string;
  onlyBio: boolean;
  products: string[];
  siret: string;
  websites: string[];
}

export interface IBioCertification {
  date: {
    end: string;
    start: string;
    suspension: string;
    notification: string;
  };
  exempted: boolean;
  organization: string;
  status: IBioResponse["items"][0]["certificats"][0]["etatCertification"] | "";
  url: string;
}

export const getBio = async (siren: Siren, estBio: boolean) => {
  try {
    if (!estBio) {
      return APINotRespondingFactory(EAdministration.AGENCE_BIO, 404);
    }
    return await clientProfessionnelBio(siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.AGENCE_BIO, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        ressource: "ProfessionnelBio",
        cause: e,
        context: {
          siren,
        },
        administration: EAdministration.AGENCE_BIO,
      })
    );
    return APINotRespondingFactory(EAdministration.AGENCE_BIO, 500);
  }
};
