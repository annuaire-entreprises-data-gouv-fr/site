import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { IOpqibi, getOpqibi } from './opqibi';
import { IQualibat, getQualibat } from './qualibat';
import { IQualifelec, getQualifelec } from './qualifelec';

export type IProtectedCertificatsEntreprise = {
  qualifelec: IQualifelec | IAPINotRespondingError;
  qualibat: IQualibat | IAPINotRespondingError;
  opqibi: IOpqibi | IAPINotRespondingError;
};

export async function getProtectedCertificats(
  uniteLegale: IUniteLegale,
  user: ISession['user'] | null
): Promise<IProtectedCertificatsEntreprise> {
  const [qualifelec, qualibat, opqibi] = await Promise.all([
    getQualifelec(uniteLegale.siege.siret, user),
    getQualibat(uniteLegale.siege.siret, user),
    getOpqibi(uniteLegale.siren, user),
  ]);
  return { qualifelec, qualibat, opqibi };
}

export function hasProtectedCertificatsEntreprise(
  privateCertificats: IProtectedCertificatsEntreprise
): boolean {
  return Object.values(privateCertificats).some(
    (certificat) => !isAPINotResponding(certificat)
  );
}
