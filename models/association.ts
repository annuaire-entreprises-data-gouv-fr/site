import { IAssociation, IUniteLegale, NotAValidIdRnaError } from '.';
import { clientBanGeoLoc } from '../clients/base-adresse';
import { HttpNotFound } from '../clients/exceptions';
import { clientRNA } from '../clients/rna';
import { escapeTerm } from '../utils/helpers/formatting';
import { verifyIdRna } from '../utils/helpers/id-rna';
import logErrorInSentry, { logWarningInSentry } from '../utils/sentry';

const getAssociation = async (
  uniteLegale: IUniteLegale
): Promise<IAssociation> => {
  const uniteLegaleAsAssociation = uniteLegale as IAssociation;
  const slug = uniteLegale.association.idAssociation || '';
  uniteLegaleAsAssociation.association = { idAssociation: slug };

  // either we dont even have the id RNA,
  // or it is bot
  // then no need to call API RNA
  if (!slug) {
    return uniteLegaleAsAssociation;
  }

  try {
    const idRna = verifyIdRna(slug);
    const data = await clientRNA(idRna);
    uniteLegaleAsAssociation.association = {
      ...data,
      idAssociation: idRna,
    };

    uniteLegaleAsAssociation.association.adresseInconsistency =
      await verifyAdressConsistency(uniteLegaleAsAssociation);

    return uniteLegale as IAssociation;
  } catch (e: any) {
    const more = {
      siren: uniteLegale.siren,
      details: `n°RNA ${slug} - ${e.message}`,
    };

    if (e instanceof HttpNotFound) {
      logWarningInSentry('Id RNA not found', more);
    } else if (e instanceof NotAValidIdRnaError) {
      // no need to log warning or to make an api call, we know Id is not valid
      return uniteLegaleAsAssociation;
    } else {
      logErrorInSentry('Error in API RNA', more);
    }
    return uniteLegaleAsAssociation;
  }
};

/**
 * Compare adress in base Sirene and in RNA
 * Use API BAN geocode to complete the verification
 *
 * @param association
 * @returns
 */
const verifyAdressConsistency = async (association: IAssociation) => {
  try {
    const adressInsee = escapeTerm(association.siege.adresse.toLowerCase());
    const adressAssociation = escapeTerm(
      (association.association.adresse || '').toLowerCase()
    );
    const hasDifferences = adressInsee !== adressAssociation;

    if (hasDifferences) {
      const [adress1, adress2] = await Promise.all([
        clientBanGeoLoc(adressInsee),
        clientBanGeoLoc(adressAssociation),
      ]);
      return adress1.geoCodedAdress !== adress2.geoCodedAdress;
    }

    return false;
  } catch (e: any) {
    logErrorInSentry('Error in association adress check', {
      siren: association.siren,
      details: e.toString(),
    });
    return false;
  }
};

export { getAssociation };
