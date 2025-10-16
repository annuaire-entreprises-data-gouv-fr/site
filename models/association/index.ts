import {
  clientAPIAssociation,
  clientAPIAssociationPartenaires,
} from "#clients/api-association";
import { clientBanGeoLoc } from "#clients/base-adresse-nationale";
import { HttpNotFound } from "#clients/exceptions";
import { getUniteLegaleFromSlug } from "#models/core/unite-legale";
import { type IdRna, removeSpecialChars, type Siren } from "#utils/helpers";
import logErrorInSentry, { logWarningInSentry } from "#utils/sentry";
import { EAdministration } from "../administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "../api-not-responding";
import { isAssociation } from "../core/types";
import {
  Exception,
  FetchRessourceException,
  type IExceptionContext,
} from "../exceptions";
import type { IDataAssociation } from "./types";

export const getAssociationFromSlug = async (
  slug: string
): Promise<IDataAssociation | IAPINotRespondingError | null> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug, {
    isBot: false,
  });

  if (!isAssociation(uniteLegale)) {
    return null;
  }

  const rna = uniteLegale.association.idAssociation || "";
  const { siren } = uniteLegale;

  let data: IDataAssociation;
  try {
    data = await clientAPIAssociationPartenaires(
      siren,
      uniteLegale.siege.siret
    ).catch((e) => {
      if (!(e instanceof HttpNotFound)) {
        return clientAPIAssociation(siren, uniteLegale.siege.siret);
      }
      throw e;
    });

    if (rna && rna !== data.idAssociation) {
      data = await clientAPIAssociationPartenaires(
        rna as IdRna,
        uniteLegale.siege.siret
      ).catch((e) => {
        if (!(e instanceof HttpNotFound)) {
          return clientAPIAssociation(rna as IdRna, uniteLegale.siege.siret);
        }
        throw e;
      });
    }

    const adresseInconsistency = await verifyAdressConsistency(
      siren,
      uniteLegale.siege.adresse,
      data.adresseSiege
    );

    return {
      ...data,
      adresseInconsistency,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      logWarningInSentry(
        new FetchAssociationException({
          message: "Id RNA not found",
          cause: e,
          context: {
            idRna: rna,
            siren,
          },
        })
      );

      return APINotRespondingFactory(EAdministration.DJEPVA, 404);
    }

    logErrorInSentry(
      new FetchAssociationException({
        cause: e,
        context: {
          idRna: rna,
          siren,
        },
      })
    );
    return APINotRespondingFactory(EAdministration.DJEPVA, 500);
  }
};

type IFetchAssociationExceptionArgs = {
  message?: string;
  cause: any;
  context?: IExceptionContext;
};
class FetchAssociationException extends FetchRessourceException {
  constructor(args: IFetchAssociationExceptionArgs) {
    super({
      ...args,
      ressource: "Association",
      administration: EAdministration.DJEPVA,
    });
  }
}

/**
 * Compare adress in base Sirene and in RNA
 * Use API BAN geocode to complete the verification
 *
 * @param association
 * @returns
 */
const verifyAdressConsistency = async (
  siren: Siren,
  adress1 = "",
  adress2 = ""
) => {
  try {
    const adress1formatted = removeSpecialChars(adress1.toLowerCase());
    const adress2formatted = removeSpecialChars(adress2.toLowerCase());

    const hasDifferences = adress1formatted !== adress2formatted;

    if (hasDifferences) {
      if (!adress1formatted || !adress2formatted) {
        return true;
      }

      const [adress1, adress2] = await Promise.all([
        clientBanGeoLoc(adress1formatted),
        clientBanGeoLoc(adress2formatted),
      ]);
      return adress1.geoCodedAdress !== adress2.geoCodedAdress;
    }
    return false;
  } catch (e: any) {
    if (!(e instanceof HttpNotFound)) {
      logWarningInSentry(
        new Exception({
          name: "FailToVerifyAdressConsistencyException",
          cause: e,
          context: { siren },
        })
      );
    }
    return false;
  }
};
