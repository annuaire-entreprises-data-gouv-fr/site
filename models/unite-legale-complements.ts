import { HttpNotFound } from '../clients/exceptions';
import clientComplementsSireneOuverte from '../clients/recherche-entreprise/siren';
import { Siren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
import { IEtatCivil } from './immatriculation/rncs';

export interface IUniteLegaleComplements {
  complements: {
    estEntrepreneurIndividuel: boolean;
    estEss: boolean;
  };
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
export const getUniteLegaleComplements = async (siren: Siren) => {
  const emptyComplements = { complements: null, colter: { codeColter: null } };
  try {
    return await clientComplementsSireneOuverte(siren);
  } catch (e: any) {
    if (!(e instanceof HttpNotFound)) {
      logErrorInSentry('Error in Search API : complements', {
        siren,
        details: e.toString(),
      });
    }
    return emptyComplements;
  }
};
