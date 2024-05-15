import { clientApiEntrepriseQualifelec } from '#clients/api-entreprise/qualifelec';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ISession } from '#models/user/session';
import { Siret } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';
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
  user: ISession['user'] | null
): Promise<IQualifelec | IAPINotRespondingError> => {
  return clientApiEntrepriseQualifelec(siret, user?.siret).catch((error) =>
    handleApiEntrepriseError(error, { siret })
  );
};
