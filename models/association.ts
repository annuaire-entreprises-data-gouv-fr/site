import { fetchAssociation } from '../clients/rna';
import { Siren } from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';

const getAssociation = async (idRna: string, siren: Siren) => {
  try {
    return await fetchAssociation(idRna);
  } catch (e) {
    logWarningInSentry(e.message, { siren, details: `n°RNA ${idRna}` });
    return {};
  }
};

export { getAssociation };
