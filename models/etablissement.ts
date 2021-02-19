import { getEtablissementInsee } from '../clients/sirene-insee/sirene-insee';
import { getEtablissementSireneOuverte } from '../clients/sirene-ouverte';

/**
 * Download Etablissement from Etalab SIRENE API (fallback on INSEE's API)
 */
const getEtablissement = async (siret: string) => {
  const etablissement = await getEtablissementSireneOuverte(siret);

  if (!etablissement) {
    return await getEtablissementInsee(siret);
  }
  return etablissement;
};
export default getEtablissement;
