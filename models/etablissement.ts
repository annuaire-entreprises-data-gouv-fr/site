import {
  IEtablissement,
  IUniteLegale,
  SirenNotFoundError,
  NotASiretError,
  SiretNotFoundError,
  createDefaultEtablissement,
} from '.';
import {
  HttpNotFound,
  HttpServerError,
  HttpTooManyRequests,
  HttpAuthentificationFailure,
} from '../clients/exceptions';
import { InseeForbiddenError } from '../clients/sirene-insee';
import { getEtablissementInsee } from '../clients/sirene-insee/siret';
import { getEtablissementSireneOuverte } from '../clients/sirene-ouverte/siret';
import { isSiret } from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';
import getUniteLegale from './unite-legale';

export interface IEtablissementWithUniteLegale {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

/**
 * Download Etablissement
 */
const getEtablissement = async (siret: string): Promise<IEtablissement> => {
  if (!isSiret(siret)) {
    throw new NotASiretError();
  }

  try {
    return await getEtablissementSireneOuverte(siret);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      // do nothing
    } else {
      logWarningInSentry(
        `Server error in SireneEtalab, fallback on INSEE ${e}`
      );
    }
    try {
      return await getEtablissementInsee(siret);
    } catch (e) {
      if (
        e instanceof HttpTooManyRequests ||
        e instanceof HttpAuthentificationFailure
      ) {
        logWarningInSentry(e);
      } else if (e instanceof InseeForbiddenError) {
        // this means company is not diffusible
        const etablissement = createDefaultEtablissement();
        etablissement.siret = siret;

        return etablissement;
      } else {
        logWarningInSentry(
          `Server error in SireneInsee, fallback on Siret not found ${e}`
        );
      }

      // Siren was not found in both API
      const message = `Siret ${siret} was not found in both siren API`;
      throw new SiretNotFoundError(message);
    }
  }
};

/**
 * Download Etablissement and the corresponding UniteLegale
 */
const getEtablissementWithUniteLegale = async (
  siret: string
): Promise<IEtablissementWithUniteLegale> => {
  const etablissement = await getEtablissement(siret);
  //@ts-ignore
  const uniteLegale = await getUniteLegale(etablissement.siren);

  return { etablissement, uniteLegale };
};

export { getEtablissementWithUniteLegale, getEtablissement };
