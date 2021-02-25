import { IEtablissement, IUniteLegale } from '.';
import { getEtablissementInsee } from '../clients/sirene-insee/siret';
import { getEtablissementSireneOuverte } from '../clients/sirene-ouverte/siret';
import { isSiret } from '../utils/helpers/siren-and-siret';
import getUniteLegale from './unite-legale';

export class SiretNotFoundError extends Error {
  constructor(public message: string) {
    super();
  }
}
export class NotASiretError extends Error {
  constructor() {
    super();
  }
}

export interface IEtablissementWithUniteLegale {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

/**
 * Download Etablissement
 */
const getEtablissement = async (siret: string): Promise<IEtablissement> => {
  const etablissement = await getEtablissementSireneOuverte(siret);

  if (!etablissement) {
    return await getEtablissementInsee(siret);
  }
  return etablissement;
};

/**
 * Download Etablissement and the corresponding UniteLegale
 */
const getEtablissementWithUniteLegale = async (
  siret: string
): Promise<IEtablissementWithUniteLegale> => {
  if (!isSiret(siret)) {
    throw new NotASiretError();
  }

  const etablissement = await getEtablissement(siret);

  if (!etablissement) {
    throw new SiretNotFoundError(
      `Cannot find etablissement for siret : ${siret}`
    );
  }

  //@ts-ignore
  const uniteLegale = await getUniteLegale(etablissement.siren);

  if (!uniteLegale) {
    throw new SiretNotFoundError(
      `Cannot find unite legale for siren : ${etablissement.siren}`
    );
  }

  return { etablissement, uniteLegale };
};

export { getEtablissementWithUniteLegale, getEtablissement };

export default getEtablissement;
