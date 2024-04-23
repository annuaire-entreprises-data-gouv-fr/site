import { clientApiEntrepriseQualifelec } from '#clients/api-entreprise/qualifelec';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  EScope,
  INotAuthorized,
  hasRights,
  notAuthorized,
} from '#models/user/rights';
import { ISession } from '#models/user/session';
import { Siret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';
export type IQualifelec = Array<{
  documentUrl: string;
  numero: number;
  rge: boolean;
  dateDebut: string;
  dateFin: string;
  qualification: {
    label: string;
    dateDebut: string;
    dateFin: string;
    indices: Array<{
      code: string;
      label: string;
    }>;
    mentions: Array<{
      code: string;
      label: string;
    }>;
    domaines: Array<{
      code: string;
      label: string;
    }>;
    classification: {
      code: string;
      label: string;
    };
  };
  assuranceCivile: {
    nom: string;
    dateDebut: string;
    dateFin: string;
  };
  assuranceDecennale: {
    nom: string;
    dateDebut: string;
    dateFin: string;
  };
}>;
export const getQualifelec = async (
  siret: Siret,
  session: ISession | null
): Promise<IQualifelec | IAPINotRespondingError | INotAuthorized> => {
  if (!hasRights(session, EScope.qualifelec)) {
    return notAuthorized();
  }
  return clientApiEntrepriseQualifelec(siret, session?.user?.siret).catch(
    (error) => handleApiEntrepriseError(error, { siret })
  );
};
