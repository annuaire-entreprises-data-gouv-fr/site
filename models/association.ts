import { HttpNotFound } from '../clients/exceptions';
import { fetchAssociation } from '../clients/rna';
import { Siren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry, { logWarningInSentry } from '../utils/sentry';

const getAssociation = async (idRna: string, siren: Siren) => {
  try {
    return await fetchAssociation(idRna);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      logWarningInSentry('Id RNA not found', {
        siren,
        details: `n°RNA ${idRna} - ${e.message}`,
      });
    } else {
      logErrorInSentry(new Error('Error in API RNA'), {
        siren,
        details: `n°RNA ${idRna} - ${e.message}`,
      });
    }
    return {};
  }
};

export { getAssociation };
