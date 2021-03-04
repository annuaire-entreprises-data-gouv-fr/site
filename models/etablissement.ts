import {
  IEtablissement,
  IUniteLegale,
  SirenNotFoundError,
  NotASiretError,
  SiretNotFoundError,
} from '.';
import { getEtablissementInsee } from '../clients/sirene-insee/siret';
import { getEtablissementSireneOuverte } from '../clients/sirene-ouverte/siret';
import { isSiret } from '../utils/helpers/siren-and-siret';
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

  const etablissement = await getEtablissementSireneOuverte(siret);
  if (etablissement) {
    return etablissement;
  }

  const inseeEteablissement = await getEtablissementInsee(siret);
  if (inseeEteablissement) {
    return inseeEteablissement;
  }

  throw new SiretNotFoundError(
    `Cannot find etablissement for siret : ${siret}`
  );
};

/**
 * Download Etablissement and the corresponding UniteLegale
 */
const getEtablissementWithUniteLegale = async (
  siret: string
): Promise<IEtablissementWithUniteLegale> => {
  const etablissement = await getEtablissement(siret);

  if (!etablissement) {
    throw new SiretNotFoundError(
      `Cannot find etablissement for siret : ${siret}`
    );
  }

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
