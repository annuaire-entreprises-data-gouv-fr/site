import { HttpNotFound } from '#clients/exceptions';
import { clientComplementsSireneOuverte } from '#clients/recherche-entreprise/siren';
import { IEtatCivil } from '#models/immatriculation/rncs';
import { Siren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import {
  createDefaultUniteLegaleComplements,
  IUniteLegaleComplements,
} from '.';

export interface IComplements {
  complements: IUniteLegaleComplements;
  colter:
    | {
        codeColter: string;
        codeInsee: string;
        niveau: string;
        elus: IEtatCivil[];
      }
    | { codeColter: string | null };
}

/**
 * Retrieve complements for a given unite legale
 * @param siren
 * @returns
 */
export const getComplements = async (siren: Siren) => {
  try {
    return await clientComplementsSireneOuverte(siren);
  } catch (e: any) {
    if (!(e instanceof HttpNotFound)) {
      logErrorInSentry('Error in Search API : complements', {
        siren,
        details: e.toString(),
      });
    }
    throw e;
  }
};
