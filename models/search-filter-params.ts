import { building, humanPin, mapPin } from '../components-ui/icon';
import {
  libelleFromCodeSectionNaf,
  libelleFromDepartement,
} from '../utils/labels';

export interface IParams {
  sap?: string;
  cp?: string;
  dep?: string;
  fn?: string;
  n?: string;
  dmin?: string;
  dmax?: string;
  isEmpty?: boolean;
}

class SearchFilterParams {
  private params: IParams;

  constructor(query: IParams = {}) {
    const {
      sap = '',
      dep = '',
      cp = '',
      fn = '',
      n = '',
      dmin = '',
      dmax = '',
    } = query;

    this.params = {
      sap,
      cp,
      dep,
      fn,
      n,
      dmin,
      dmax,
    };
  }

  public toJSON() {
    return { ...this.params };
  }

  public toApiURI() {
    return serializeParams({
      code_postal: this.params.cp,
      section_activite_principale: this.params.sap,
      departements: this.params.dep,
      prenoms_dirigeant: this.params.fn?.trim(),
      nom_dirigeant: this.params.n?.trim(),
      date_naissance_dirigeant_min: this.params.dmin,
      date_naissance_dirigeant_max: this.params.dmax,
    });
  }

  public toURI() {
    return serializeParams(this.params);
  }
}

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

export const extractFilters = (params: IParams) => {
  const f: {
    icon: JSX.Element;
    label: string;
    excludeParams: string[];
  }[] = [];

  const add = (icon: JSX.Element, label: string, excludeParams: string[]) => {
    f.push({
      icon,
      label,
      excludeParams,
    });
  };

  if (params.fn || params.n || params.dmin || params.dmax) {
    const label = `${params.fn}${params.n ? ` ${params.n}` : ''}${
      params.dmin || params.dmax ? `(plage de date)` : ''
    }`;
    add(humanPin, label, ['fn', 'n', 'dmin', 'dmax']);
  }
  if (params.sap) {
    add(building, libelleFromCodeSectionNaf(params.sap), ['sap']);
  }
  if (params.cp) {
    add(mapPin, params.cp, ['cp']);
  }
  if (params.dep) {
    add(mapPin, libelleFromDepartement(params.dep), ['dep']);
  }

  return f;
};

export const hasSearchParam = (params: object) => {
  return Object.values(params).some((v) => v !== '');
};

export default SearchFilterParams;
