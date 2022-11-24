import { building, humanPin, mapPin } from '../components-ui/icon';
import { libelleFromCodeNAF, libelleFromCodeSectionNaf } from '../utils/labels';
import { IEtatCivil } from './immatriculation/rncs';

export interface IParams {
  sap?: string;
  naf?: string;
  cp_dep?: string;
  fn?: string;
  n?: string;
  dmin?: string;
  dmax?: string;
  isEmpty?: boolean;
  ageMin?: number | string;
  ageMax?: number | string;
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
      naf = '',
    } = query;

    // ensure dmax > dmin
    const realDmax = dmax && dmin && dmax < dmin ? dmin : dmax;
    const realDmin = dmax && dmin && dmax < dmin ? dmax : dmin;

    this.params = {
      sap,
      //@ts-ignore
      cp_dep: isNaN(cp_dep) ? '' : cp_dep,
      fn,
      n,
      dmin: realDmin,
      dmax: realDmax,
      naf,
      // careful dmin determine ageMax and vice versa
      ageMin: getAge(realDmax),
      ageMax: getAge(realDmin),
    };
  }

  public toJSON() {
    return { ...this.params };
  }

  public toApiURI() {
    let cp_dep = this.params.cp_dep || '';
    const code_postal = cp_dep.length === 5 ? cp_dep : '';
    const departement =
      cp_dep.length === 3 || cp_dep.length === 2 ? cp_dep : '';

    return serializeParams({
      code_postal,
      section_activite_principale: this.params.sap,
      departement,
      prenoms_personne: this.params.fn?.trim(),
      nom_personne: this.params.n?.trim(),
      date_naissance_personne_min: this.params.dmin,
      date_naissance_personne_max: this.params.dmax,
      activite_principale: this.params.naf,
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
      excludeParams: ['sap', 'naf'],
    },
    localisationFilter: {
      icon: mapPin,
      label: '',
      excludeParams: ['cp_dep'],
    },
  };

  if (hasDirigeantFilter(params)) {
    let labelAge = '';

    if (params.dmin && params.dmax) {
      labelAge = `entre ${params.ageMin} et ${params.ageMax} ans`;
    } else if (params.dmin && !params.dmax) {
      labelAge = `moins de ${params.ageMax} ans`;
    } else if (!params.dmin && params.dmax) {
      labelAge = `plus de ${params.ageMin} ans`;
    }

    const labelName = `${params.fn}${params.n ? ` ${params.n}` : ''}`;
    f.dirigeantFilter.label = `${labelName}${
      labelAge && labelName && ', '
    }${labelAge}`;
  }
  if (params.sap) {
    f.administrativeFilter.label = libelleFromCodeSectionNaf(params.sap);
  }
  if (params.sap && params.naf) {
    f.administrativeFilter.label += '・';
  }
  if (params.naf) {
    f.administrativeFilter.label += libelleFromCodeNAF(params.naf);
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
