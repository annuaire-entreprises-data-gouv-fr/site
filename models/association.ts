import { NotAValidIdRnaError } from '.';
import { HttpNotFound } from '../clients/exceptions';
import { fetchAssociation } from '../clients/rna';
import { verifyIdRna } from '../utils/helpers/id-rna';
import { Siren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry, { logWarningInSentry } from '../utils/sentry';

const getAssociation = async (slug: string, siren: Siren) => {
  try {
    const idRna = verifyIdRna(slug);
    return await fetchAssociation(idRna);
  } catch (e) {
    const more = {
      siren,
      details: `n°RNA ${slug} - ${e.message}`,
    };

    if (e instanceof HttpNotFound) {
      logWarningInSentry('Id RNA not found', more);
    } else if (e instanceof NotAValidIdRnaError) {
      // no need to log warning or to make an api call, we know Id is not valid
      return {};
    } else {
      logErrorInSentry(new Error('Error in API RNA'), more);
    }
    return {};
  }
};

export { getAssociation };
