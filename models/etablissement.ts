import {
  IEtablissement,
  IUniteLegale,
  SirenNotFoundError,
  NotASiretError,
  SiretNotFoundError,
} from '.';
import {
  InseeAuthError,
  InseeForbiddenError,
  InseeTooManyRequestsError,
} from '../clients/sirene-insee';
import { CreateNonDiffusibleUniteLegale } from '../clients/sirene-insee/siren';
import {
  CreateNonDiffusibleEtablissement,
  getEtablissementInsee,
} from '../clients/sirene-insee/siret';
import {
  SireneEtalabNotFound,
  SireneEtalabServerError,
} from '../clients/sirene-ouverte';
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
    if (e instanceof SireneEtalabNotFound) {
      // do nothing
    }
    if (e instanceof SireneEtalabServerError) {
      logWarningInSentry(
        `Server error in SireneEtalab, fallback on INSEE ${e}`
      );
    }
    try {
      return await getEtablissementInsee(siret);
    } catch (e) {
      if (
        e instanceof InseeTooManyRequestsError ||
        e instanceof InseeAuthError
      ) {
        logWarningInSentry(e);
      }

      if (e instanceof InseeForbiddenError) {
        // this means company is not diffusible
        return CreateNonDiffusibleEtablissement(siret);
      }

      // Siren was not found in both API
      const message = `Siret ${siret} was not found in both siren API`;
      logWarningInSentry(message);
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

  if (!uniteLegale) {
    throw new SirenNotFoundError(
      `Cannot find unite legale for siren : ${etablissement.siren}`
    );
  }
  return { etablissement, uniteLegale };
};

export { getEtablissementWithUniteLegale, getEtablissement };

export default getEtablissement;
