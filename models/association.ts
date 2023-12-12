import { clientAssociation } from '#clients/api-proxy/association';
import { clientBanGeoLoc } from '#clients/base-adresse';
import { HttpNotFound } from '#clients/exceptions';
import { escapeTerm, Siren } from '#utils/helpers';
import logErrorInSentry, { logWarningInSentry } from '#utils/sentry';
import { IDataAssociation, IUniteLegale } from '.';
import { EAdministration } from './administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';
import {
  Exception,
  FetchRessourceException,
  IExceptionContext,
} from './exceptions';

export const getAssociation = async (
  uniteLegale: IUniteLegale
): Promise<IDataAssociation | IAPINotRespondingError> => {
  const rna = uniteLegale.association.idAssociation || '';
  const { siren } = uniteLegale;

  let data: IDataAssociation;
  try {
    data = await clientAssociation(siren, uniteLegale.siege.siret);

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
          message: 'Id RNA not found',
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
      ressource: 'Association',
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
  adress1 = '',
  adress2 = ''
) => {
  try {
    const adress1formatted = escapeTerm(adress1.toLowerCase());
    const adress2formatted = escapeTerm(adress2.toLowerCase());

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
          name: 'FailToVerifyAdressConsistencyException',
          cause: e,
          context: { siren },
        })
      );
    }
    return false;
  }
};
