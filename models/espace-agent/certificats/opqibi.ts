import { clientApiEntrepriseOpqibi } from '#clients/api-entreprise/opqibi';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  EScope,
  INotAuthorized,
  hasRights,
  notAuthorized,
} from '#models/user/rights';
import { ISession } from '#models/user/session';
import { Siren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';
type Qualification = {
  nom: string;
  codeQualification: string;
  definition: string;
  rge: boolean;
};
export type IOpqibi = {
  numeroCertificat: string;
  url: string;
  dateDelivranceCertificat: string;
  dureeValiditeCertificat: string;
  assurances: string;
  qualifications: Array<Qualification>;
  dateValiditeQualifications: string;
  qualificationsProbatoires: Array<Qualification>;
  dateValiditeQualificationsProbatoires: string;
};

export const getOpqibi = async (
  siren: Siren,
  session: ISession | null
): Promise<IOpqibi | IAPINotRespondingError | INotAuthorized> => {
  if (!hasRights(session, EScope.opqibi)) {
    return notAuthorized();
  }
  return clientApiEntrepriseOpqibi(siren, session?.user?.siret).catch((error) =>
    handleApiEntrepriseError(error, { siren })
  );
};
