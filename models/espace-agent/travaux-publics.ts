import { clientApiEntrepriseCarteProfessionnelleTravauxPublics } from '#clients/api-entreprise/carte-professionnelle-travaux-publics';
import { clientApiEntrepriseCibtp } from '#clients/api-entreprise/certificats/cibtp';
import { clientApiEntrepriseCnetp } from '#clients/api-entreprise/certificats/cnetp';
import { clientApiEntrepriseProbtp } from '#clients/api-entreprise/certificats/probtp';
import { HttpNotFound } from '#clients/exceptions';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export type ICertificatTravauxPublics = {
  documentUrl: string;
  expiresIn: number;
};
export type ICarteProfessionnelleTravauxPublics = {
  documentUrl: string;
};
export type ITravauxPublics = {
  fntp: ICarteProfessionnelleTravauxPublics | null;
  cibtp: ICertificatTravauxPublics | null;
  cnetp: ICertificatTravauxPublics | null;
  probtp: ICertificatTravauxPublics | null;
};

export const getTravauxPublic = async (
  slug: string
): Promise<ITravauxPublics | IAPINotRespondingError> => {
  const siret = verifySiret(slug as string);
  const siren = extractSirenFromSiret(siret);
  try {
    const [fntp, cibtp, cnetp, probtp] = await Promise.all([
      clientApiEntrepriseCarteProfessionnelleTravauxPublics(siren).catch(
        (e) => {
          if (e instanceof HttpNotFound) {
            return null;
          } else {
            throw e;
          }
        }
      ),
      clientApiEntrepriseCibtp(siret).catch((e) => {
        if (e instanceof HttpNotFound) {
          return null;
        } else {
          throw e;
        }
      }),
      clientApiEntrepriseCnetp(siren).catch((e) => {
        if (e instanceof HttpNotFound) {
          return null;
        } else {
          throw e;
        }
      }),
      clientApiEntrepriseProbtp(siret).catch((e) => {
        if (e instanceof HttpNotFound) {
          return null;
        } else {
          throw e;
        }
      }),
    ]);
    return { fntp, cibtp, cnetp, probtp };
  } catch (e) {
    return handleApiEntrepriseError(e, {
      siren,
      apiResource: 'TravauxPublics',
    });
  }
};
