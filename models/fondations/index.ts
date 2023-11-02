import { clientRNF } from '#clients/api-rnf';
import { HttpNotFound } from '#clients/exceptions';
import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { IdRnf, verifyIdRnf } from '#utils/helpers/id-rnf';
import logErrorInSentry from '#utils/sentry';
import { NotAnIdRnfError, RnfNotFoundError } from '..';

export type IFondation = {
  idRnf: IdRnf;
  etatAdministratif: IETATADMINSTRATIF;
  nomComplet: string;
  adresse: string;
  departement: string;
  type: string;
  dateCreation: string;
  dateFermeture: string;
  telephone: string;
  email: string;
};

/**
 * Get a fondation if it exists
 * @param slug
 * @returns
 */
export const getFondationFromSlug = async (slug: string) => {
  try {
    const idRnf = verifyIdRnf(slug);
    return await clientRNF(idRnf);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      throw new RnfNotFoundError(slug);
    } else if (e instanceof NotAnIdRnfError) {
      throw e;
    }

    logErrorInSentry(e, {
      details: slug,
      errorName: 'Error in API RNF',
    });
    throw e;
  }
};
