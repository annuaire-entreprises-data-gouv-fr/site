import { clientApiEntrepriseQualifelec } from '#clients/api-entreprise/qualifelec';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { verifySiret } from '#utils/helpers';
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
  maybeSiret: string
): Promise<IQualifelec | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  return clientApiEntrepriseQualifelec(siret)
    .then((response) =>
      response.length === 0
        ? APINotRespondingFactory(EAdministration.QUALIFELEC, 404)
        : response
    )
    .catch((error) =>
      handleApiEntrepriseError(error, { siret, apiResource: 'Qualifelec' })
    );
};
