import { building, humanPin, mapPin } from '../components-ui/icon';
import { libelleFromCodeSectionNaf } from '../utils/labels';
import { IEtatCivil } from './immatriculation/rncs';

export interface IParams {
  sap?: string;
  cp_dep?: string;
  fn?: string;
  n?: string;
  dmin?: string;
  dmax?: string;
  isEmpty?: boolean;
  ageMin?: number;
  ageMax?: number;
}

class SearchFilterParams {
  private params: IParams;

  constructor(query: IParams = {}) {
    const {
      sap = '',
      cp_dep = '',
      fn = '',
      n = '',
      dmin = '',
      dmax = '',
    } = query;

    this.params = {
      sap,
      cp_dep,
      fn,
      n,
      dmin,
      dmax,
      ageMin: getAge(dmin),
      ageMax: getAge(dmax),
    };
  }

  public toJSON() {
    return { ...this.params };
  }

  public toApiURI() {
    const cp_dep = this.params.cp_dep || '';
    const code_postal = cp_dep.length === 5 ? cp_dep : '';
    const departement =
      cp_dep.length === 3 || cp_dep.length === 2 ? cp_dep : '';

    return serializeParams({
      code_postal,
      section_activite_principale: this.params.sap,
      departement,
      prenoms_dirigeant: this.params.fn?.trim(),
      nom_dirigeant: this.params.n?.trim(),
      date_naissance_dirigeant_min: this.params.dmin,
      date_naissance_dirigeant_max: this.params.dmax,
    });
  }

  public toURI() {
    return serializeParams(this.params);
  }

  public getPersonne(): IEtatCivil {
    return {
      nom: this.params.n?.trim() || '',
      prenom: this.params.fn?.trim() || '',
      sexe: null,
      dateNaissanceFull: '',
      dateNaissancePartial: this.params.dmin || '',
      lieuNaissance: '',
      role: '',
    };
  }
}

const getAge = (d: string) => {
  try {
    const ageMilliseconds = Date.now() - new Date(d).getTime();

    // this is an approximation of age
    const age = Math.floor(ageMilliseconds / 31557600000);
    if (isNaN(ageMilliseconds)) {
      return '';
    }
    return age;
  } catch {
    return '';
  }
};

const serializeParams = (
  params: IParams | object,
  excludeParams: string[] = []
) => {
  return Object.entries(params).reduce((uri, [key, value]) => {
    if (!!value && excludeParams.indexOf(key) === -1) {
      uri += `&${key}=${encodeURIComponent(value)}`;
    }
    return uri;
  }, '');
};

export const buildSearchQuery = (
  searchTerm: string,
  params: IParams | object,
  excludeParams: string[] = []
) => {
  return `?terme=${encodeURIComponent(searchTerm)}${serializeParams(
    params,
    excludeParams
  )}`;
};

export interface ISearchFilter {
  icon: JSX.Element;
  label: string;
  excludeParams: string[];
}

export const extractFilters = (params: IParams) => {
  const f = {
    dirigeantFilter: {
      icon: humanPin,
      label: '',
      excludeParams: ['fn', 'n', 'dmin', 'dmax'],
    },
    administrativeFilter: {
      icon: building,
      label: '',
      excludeParams: ['sap'],
    },
    localisationFilter: {
      icon: mapPin,
      label: '',
      excludeParams: ['cp_dep'],
    },
  };

  if (hasDirigeantFilter(params)) {
    const labelDate =
      params.dmin || params.dmax ? '  filtre sur la date de naissance' : '';
    const labelName = `${params.fn}${params.n ? ` ${params.n}` : ''}`;
    f.dirigeantFilter.label = `${labelName}${
      labelDate && labelName && '・'
    }${labelDate}`;
  }
  if (params.sap) {
    f.administrativeFilter.label = libelleFromCodeSectionNaf(params.sap);
  }

  if (params.cp_dep) {
    f.localisationFilter.label = params.cp_dep;
  }

  return f;
};

export const hasDirigeantFilter = (params: IParams = {}) => {
  return params.fn || params.n || params.dmin || params.dmax;
};

export const hasSearchParam = (params: object) => {
  return Object.values(params).some((v) => v !== '');
};

export default SearchFilterParams;
