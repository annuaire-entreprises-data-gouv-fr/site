import {
  getCompanyName,
  getCompanyTitle,
  isSirenOrSiret,
  libelleFromCodeNaf,
} from '../utils/helper';
import routes, {getResultUniteLegalePage } from './routes';

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

export interface ResultUniteLegale {
  siren: string;
  siret: string;
  etablissement_siege: Etablissement;
  categorie_juridique: string;
  nombre_etablissements: number;
  date_creation: string;
  libelle_activite_principale:string;
  l1_normalisee:string;
  geo_adresse:string;
  latitude:string;
  longitude:string;
}

export interface SearchResults {
  page: string;
  total_results: number;
  total_pages: number;
  unite_legale: ResultUniteLegale[];
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
  const response = await fetch(getResultUniteLegalePage(searchTerms, page));

  if (response.status === 404) {
    return undefined;
  }

  const results = (await response.json()) || [];
  const {total_results=0, total_pages=0, unite_legale} = results[0];

  return ({
    page: 0,
    total_results,
    total_pages,
    unite_legale: (unite_legale|| []).map((result: any) => {
      const {
        siren,
        siret,
        nic,
        etat_administratif = null,
        date_creation,
        activite_principale,
        latitude,
        longitude,
        geo_adresse,
        nom_raison_sociale,
        prenom,
        nom,
        nature_juridique_entreprise,
        sigle,
        nombre_etablissements =1
      } = result;

      //@ts-ignore
      return {
        siren,
        siret,
        nic,
        etat_administratif,
        nombre_etablissements,
        date_creation,
        activite_principale,
        latitude,
        longitude,
        geo_adresse,
        libelle_activite_principale: libelleFromCodeNaf(activite_principale),
        l1_normalisee: getCompanyName(
          nom_raison_sociale,
          prenom,
          nom,
          nature_juridique_entreprise,
          sigle
        ),
      } as ResultUniteLegale;
    }),
  } as unknown) as SearchResults;
};

export { getEtablissement, getUniteLegale, getResults };
