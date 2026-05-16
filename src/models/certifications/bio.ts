import { clientProfessionnelBio } from "#/clients/api-bio";
import type { IBioResponse } from "#/clients/api-bio/interface";
import { HttpNotFound } from "#/clients/exceptions";
import { EAdministration } from "#/models/administrations/EAdministration";
import { APINotRespondingFactory } from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";
import type { IUniteLegale } from "../core/types";

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
        ressource: "ProfessionnelBio",
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
