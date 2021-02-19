import { IEtablissement } from '.';
import { getEtablissementInsee } from '../clients/sirene-insee/siret';
import { getEtablissementSireneOuverte } from '../clients/sirene-ouverte/siret';

/**
 * Download Etablissement from Etalab SIRENE API (fallback on INSEE's API)
 */
const getEtablissement = async (siret: string): Promise<IEtablissement> => {
  const etablissement = await getEtablissementSireneOuverte(siret);

  if (!etablissement) {
    return await getEtablissementInsee(siret);
  }
  return etablissement;
};
export default getEtablissement;
