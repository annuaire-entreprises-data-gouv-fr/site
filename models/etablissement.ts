import {
  IEtablissement,
  IUniteLegale,
  SiretNotFoundError,
  createDefaultEtablissement,
  NotASiretError,
  NotLuhnValidSiretError,
} from '.';
import {
  HttpNotFound,
  HttpTooManyRequests,
  HttpAuthentificationFailure,
} from '../clients/exceptions';
import { InseeForbiddenError } from '../clients/sirene-insee';
import { getEtablissementInsee } from '../clients/sirene-insee/siret';
import { getEtablissementSireneOuverte } from '../clients/sirene-ouverte/siret';
import {
  extractSirenFromSiret,
  hasSiretFormat,
  isSiret,
  Siret,
} from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';
import { getUniteLegaleFromSlug } from './unite-legale';

const getEtablissementFromSlug = async (
  slug: string
): Promise<IEtablissement> => {
  if (!isSiret(slug)) {
    if (!hasSiretFormat(slug)) {
      throw new NotASiretError(slug);
    } else {
      throw new NotLuhnValidSiretError(slug);
    }
  }
  return getEtablissement(slug);
};

/**
 * Download Etablissement
 */
const getEtablissement = async (siret: Siret): Promise<IEtablissement> => {
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

export interface IEtablissementWithUniteLegale {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

/**
 * Download Etablissement and the corresponding UniteLegale
 */
const getEtablissementWithUniteLegale = async (
  siret: string
): Promise<IEtablissementWithUniteLegale> => {
  const etablissement = await getEtablissementFromSlug(siret);
  const uniteLegale = await getUniteLegaleFromSlug(etablissement.siren);

  return { etablissement, uniteLegale };
};

export { getEtablissementWithUniteLegale, getEtablissementFromSlug };
