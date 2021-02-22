import { IEtablissement, IUniteLegale } from '.';
import { getEtablissementInsee } from '../clients/sirene-insee/siret';
import { getEtablissementSireneOuverte } from '../clients/sirene-ouverte/siret';
import getUniteLegale from './unite-legale';

export class SiretNotFoundException extends Error {
  constructor(public message: string) {
    super();
  }
}

export class SirenNotFoundException extends Error {
  constructor(public message: string) {
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
  const etablissement = await getEtablissement(siret);

  if (!etablissement) {
    throw new SiretNotFoundException(
      `Cannot find etablissement for siret : ${siret}`
    );
  }

  //@ts-ignore
  const uniteLegale = await getUniteLegale(etablissement.siren);

  if (!uniteLegale) {
    throw new SirenNotFoundException(
      `Cannot find etablissement for siret : ${etablissement.siren}`
    );
  }

  return { etablissement, uniteLegale };
};

export { getEtablissementWithUniteLegale, getEtablissement };

export default getEtablissement;
