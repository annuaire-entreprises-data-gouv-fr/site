import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { INotAuthorized, isNotAuthorized } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { IOpqibi, getOpqibi } from './opqibi';
import { IQualibat, getQualibat } from './qualibat';
import { IQualifelec, getQualifelec } from './qualifelec';

export type IProtectedCertificatsEntreprise = {
  qualifelec: IQualifelec | IAPINotRespondingError | INotAuthorized;
  qualibat: IQualibat | IAPINotRespondingError | INotAuthorized;
  opqibi: IOpqibi | IAPINotRespondingError | INotAuthorized;
};

export async function getProtectedCertificats(
  uniteLegale: IUniteLegale,
  session: ISession | null
): Promise<IProtectedCertificatsEntreprise> {
  const [qualifelec, qualibat, opqibi] = await Promise.all([
    getQualifelec(uniteLegale.siege.siret, session),
    getQualibat(uniteLegale.siege.siret, session),
    getOpqibi(uniteLegale.siren, session),
  ]);
  return { qualifelec, qualibat, opqibi };
}

export function hasProtectedCertificatsEntreprise(
  privateCertificats: IProtectedCertificatsEntreprise
): boolean {
  return Object.values(privateCertificats).some(
    (certificat) =>
      !isNotAuthorized(certificat) && !isAPINotResponding(certificat)
  );
}
