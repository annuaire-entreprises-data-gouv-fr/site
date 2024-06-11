import { clientApiEntrepriseImmatriculationEORI } from '#clients/api-entreprise/immatriculation-eori';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { Siret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export type IImmatriculationEORI = {
  identifiantEORI: string;
  actif: boolean;
  codePays: string;
};

export const getImmatriculationEORI = async (
  siret: Siret
): Promise<IImmatriculationEORI | IAPINotRespondingError> => {
  return clientApiEntrepriseImmatriculationEORI(siret).catch((error) =>
    handleApiEntrepriseError(error, { siret, apiResource: 'EORI' })
  );
};
