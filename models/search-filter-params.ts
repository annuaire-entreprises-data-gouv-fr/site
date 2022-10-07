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
  isEmpty?: boolean;
}

class SearchFilterParams {
  private params: IParams;

  constructor(query: IParams = {}) {
    const { sap = '', dep = '', cp = '', fn = '', n = '' } = query;

    this.params = {
      sap,
      cp,
      dep,
      fn,
      n,
    };
  }

  public toJSON() {
    return { ...this.params };
  }

  public toApiURI() {
    return this.serialize({
      code_postal: this.params.cp,
      section_activite_principale: this.params.sap,
      departements: this.params.dep,
      prenoms_dirigeant: this.params.fn,
      nom_dirigeant: this.params.n,
    });
  }

  public toURI() {
    return this.serialize(this.params);
  }

  public toFilters() {
    const filters: { icon: JSX.Element; label: string; url: string }[] = [];
    const add = (icon: JSX.Element, label: string, excludeParams: string[]) => {
      filters.push({
        icon,
        label,
        url: this.serialize(this.params, excludeParams),
      });
    };

    if (this.params.fn || this.params.n) {
      add(
        humanPin,
        `${this.params.fn}${this.params.n ? ` ${this.params.n}` : ''}`,
        ['fn', 'n']
      );
    }
    if (this.params.sap) {
      add(building, libelleFromCodeSectionNaf(this.params.sap), ['sap']);
    }
    if (this.params.cp) {
      add(mapPin, this.params.cp, ['cp']);
    }
    if (this.params.dep) {
      add(mapPin, libelleFromDepartement(this.params.dep), ['dep']);
    }

    return filters;
  }

  private serialize(obj: object, exclude: string[] = []) {
    return Object.entries(obj).reduce((uri, [key, value]) => {
      if (!!value && exclude.indexOf(key) === -1) {
        uri += `&${key}=${value}`;
      }
      return uri;
    }, '');
  }
}

export const hasSearchParam = (params: object) => {
  return Object.values(params).some((v) => v !== '');
};

export default SearchFilterParams;
