import {
  clientApiEntrepriseCarteProfessionnelleTravauxPublics,
  clientApiEntrepriseCibtp,
  clientApiEntrepriseCnetp,
  clientApiEntrepriseProbtp,
} from '#clients/api-entreprise/travaux-publics';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export type IDocumentDownloader = {
  url: string;
};

export type ITravauxPublics = {
  fntp: IDocumentDownloader | IAPINotRespondingError;
  cibtp: IDocumentDownloader | IAPINotRespondingError;
  cnetp: IDocumentDownloader | IAPINotRespondingError;
  probtp: IDocumentDownloader | IAPINotRespondingError;
};

export const getTravauxPublic = async (
  slug: string
): Promise<ITravauxPublics | IAPINotRespondingError> => {
  const siret = verifySiret(slug as string);
  const siren = extractSirenFromSiret(siret);

  const errorHandler = (e: any) =>
    handleApiEntrepriseError(e, {
      siren,
      siret,
      apiResource: 'TravauxPublics',
    });

  const [fntp, cibtp, cnetp, probtp] = await Promise.all([
    clientApiEntrepriseCarteProfessionnelleTravauxPublics(siren).catch(
      errorHandler
    ),
    clientApiEntrepriseCibtp(siret).catch(errorHandler),
    clientApiEntrepriseCnetp(siren).catch(errorHandler),
    clientApiEntrepriseProbtp(siret).catch(errorHandler),
  ]);
  return { fntp, cibtp, cnetp, probtp };
};
