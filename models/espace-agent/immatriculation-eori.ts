import { clientApiEntrepriseImmatriculationEORI } from '#clients/api-entreprise/immatriculation-eori';
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

export type IImmatriculationEORI = {
  identifiantEORI: string;
  actif: boolean;
  codePays: string;
};

export const getImmatriculationEORI = async (
  siret: Siret,
  session: ISession | null
): Promise<IImmatriculationEORI | IAPINotRespondingError | INotAuthorized> => {
  if (!hasRights(session, EScope.eori)) {
    return notAuthorized();
  }
  return clientApiEntrepriseImmatriculationEORI(siret).catch((error) =>
    handleApiEntrepriseError(error, { siret })
  );
};
