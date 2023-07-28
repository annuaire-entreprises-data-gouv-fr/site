import { clientAssociation } from '#clients/api-proxy/association';
import { clientBanGeoLoc } from '#clients/base-adresse';
import { HttpNotFound } from '#clients/exceptions';
import { escapeTerm, Siren } from '#utils/helpers';
import logErrorInSentry, { logWarningInSentry } from '#utils/sentry';
import { IDataAssociation, IUniteLegale } from '.';

export const getAssociation = async (
  uniteLegale: IUniteLegale
): Promise<null | IDataAssociation> => {
  const slug = uniteLegale.association.idAssociation || '';
  const { siren } = uniteLegale;

  try {
    const data = await clientAssociation(siren, uniteLegale.siege.siret);

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
      logWarningInSentry('Id RNA not found', {
        siren,
        details: `RNA : ${slug}`,
      });
    } else {
      logErrorInSentry('Error in API RNA', { siren, details: e.toString() });
    }
    return null;
  }
};

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
    logErrorInSentry('Error in API BAN', {
      siren,
      details: e.toString(),
    });
    return false;
  }
};
