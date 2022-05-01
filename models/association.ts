import { IAssociation, IUniteLegale, NotAValidIdRnaError } from '.';
import { reverseGeoLoc } from '../clients/base-adresse';
import { HttpNotFound } from '../clients/exceptions';
import { fetchAssociation } from '../clients/rna';
import { escapeTerm } from '../utils/helpers/formatting';
import { verifyIdRna } from '../utils/helpers/id-rna';
import logErrorInSentry, { logWarningInSentry } from '../utils/sentry';

const getAssociation = async (slug: string, uniteLegale: IUniteLegale) => {
  try {
    const idRna = verifyIdRna(slug);
    const association = await fetchAssociation(idRna);

    association.adresseInconsistency = await verifyAdressConsistency(
      uniteLegale,
      association
    );

    return association;
  } catch (e: any) {
    const more = {
      siren: uniteLegale.siren,
      details: `n°RNA ${slug} - ${e.message}`,
    };

    if (e instanceof HttpNotFound) {
      logWarningInSentry('Id RNA not found', more);
    } else if (e instanceof NotAValidIdRnaError) {
      // no need to log warning or to make an api call, we know Id is not valid
      return {};
    } else {
      logErrorInSentry('Error in API RNA', more);
    }
    return {};
  }
};

/**
 * Compare adress in base Sirene and in RNA
 * Use API BAN geocode to complete the verification
 *
 * @param uniteLegale
 * @param association
 * @returns
 */
const verifyAdressConsistency = async (
  uniteLegale: IUniteLegale,
  association: IAssociation
) => {
  try {
    const adressInsee = escapeTerm(uniteLegale.siege.adresse.toLowerCase());
    const adressAssociation = escapeTerm(
      (association.adresse || '').toLowerCase()
    );
    const hasDifferences = adressInsee !== adressAssociation;

    if (hasDifferences) {
      const [adress1, adress2] = await Promise.all([
        reverseGeoLoc(adressInsee),
        reverseGeoLoc(adressAssociation),
      ]);
      return adress1.geoCodedAdress !== adress2.geoCodedAdress;
    }

    return false;
  } catch (e: any) {
    logErrorInSentry('Error in association adress check', {
      siren: uniteLegale.siren,
      details: e.toString(),
    });
    return false;
  }
};

export { getAssociation };
