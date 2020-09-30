import { isSirenOrSiret } from '../utils/helper';
import routes, { getResultPage } from './routes';

export interface Etablissement {
  siren: string;
  siret: string;
  nic: string;
  etat_administratif: 'A' | null;
  date_creation: string;
  geo_adresse: string;
  etablissement_siege: string;
  activite_principale: string;
  date_dernier_traitement: string;
  l1_normalisee: string;
  libelle_activite_principale: string;
  is_siege: '1' | null;
  tranche_effectifs: string;
  latitude: string;
  longitude: string;
}

export interface UniteLegale {
  siren: string;
  etablissement_siege: Etablissement;
  categorie_juridique: string;
  etablissements: Etablissement[];
  date_creation: string;
  statut_diffusion: string;
}

export interface SearchResults {
  page: string;
  total_results: number;
  total_pages: number;
  etablissement: Etablissement[];
}

const getUniteLegale = async (siren: string): Promise<UniteLegale> => {
  if (!isSirenOrSiret(siren)) {
    throw new Error(`Ceci n'est pas un numéro SIREN valide : ${siren}`);
  }
  const response = await fetch(`${routes.uniteLegale}${encodeURI(siren)}`);
  if (response.status === 404) {
    throw new Error('404');
  }
  const { unite_legale } = await response.json();
  return unite_legale as UniteLegale;
};

const getEtablissement = async (siret: string): Promise<Etablissement> => {
  if (!isSirenOrSiret(siret)) {
    throw new Error(`Ceci n'est pas un numéro SIRET valide : ${siret}`);
  }
  const response = await fetch(`${routes.etablissement}${encodeURI(siret)}`);
  if (response.status === 404) {
    throw new Error('404');
  }
  const { etablissement } = await response.json();
  return etablissement as Etablissement;
};

const getResults = async (
  searchTerms: string,
  page: string
): Promise<SearchResults | undefined> => {
  const response = await fetch(getResultPage(searchTerms, page));

  if (response.status === 404) {
    return undefined;
  }

  return (await response.json()) as SearchResults;
};

export { getEtablissement, getUniteLegale, getResults };
