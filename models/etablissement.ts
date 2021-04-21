import {
  IEtablissement,
  IUniteLegale,
  NotASiretError,
  SiretNotFoundError,
  createDefaultEtablissement,
} from '.';
import {
  HttpNotFound,
  HttpTooManyRequests,
  HttpAuthentificationFailure,
  HttpServerError,
} from '../clients/exceptions';
import { InseeForbiddenError } from '../clients/sirene-insee';
import { getEtablissementInsee } from '../clients/sirene-insee/siret';
import { getEtablissementSireneOuverte } from '../clients/sirene-ouverte/siret';
import {
  extractSirenFromSiret,
  isSiret,
} from '../utils/helpers/siren-and-siret';
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
    return await getEtablissementInsee(siret);
  } catch (e) {
    if (
      e instanceof HttpTooManyRequests ||
      e instanceof HttpAuthentificationFailure
    ) {
      logWarningInSentry(e.message);
    } else if (e instanceof InseeForbiddenError) {
      // this means company is not diffusible
      const etablissement = createDefaultEtablissement();
      etablissement.siret = siret;
      etablissement.siren = extractSirenFromSiret(siret);

      return etablissement;
    } else if (e instanceof HttpNotFound) {
      // do nothing
    } else {
      logWarningInSentry(
        `Server error in SireneInsee, fallback on Sirene Ouverte (Etalab) ${siret}. ${e}`
      );
    }

    try {
      return await getEtablissementSireneOuverte(siret);
    } catch (e) {
      if (e instanceof HttpNotFound) {
        // do nothing
      } else {
        logWarningInSentry(
          `Server error in SireneEtalab, fallback on not found. ${e}`
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
