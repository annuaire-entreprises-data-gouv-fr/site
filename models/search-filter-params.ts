import { building, humanPin, mapPin } from '../components-ui/icon';
import { libelleFromDepartement } from '../utils/labels';

export interface IParams {
  sap?: string;
  cp?: string;
  dep?: string;
  fn?: string;
  n?: string;
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
    return this.params;
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
    const filters = [];
    if (this.params.fn || this.params.n) {
      filters.push({
        icon: humanPin,
        label: `${this.params.fn} ${this.params.n}`,
        url: this.serialize(this.params, ['fn', 'n']),
      });
    }
    if (this.params.sap) {
      filters.push({
        icon: building,
        label: this.params.sap,
        url: this.serialize(this.params, ['sap']),
      });
    }
    if (this.params.cp) {
      filters.push({
        icon: mapPin,
        label: this.params.cp,
        url: this.serialize(this.params, ['cp']),
      });
    }
    if (this.params.dep) {
      filters.push({
        icon: mapPin,
        label: libelleFromDepartement(this.params.dep),
        url: this.serialize(this.params, ['dep']),
      });
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

  public isEmpty() {
    return Object.values(this.params).some((v) => v !== '');
  }

  public hasParam() {
    return this.isEmpty();
  }
}

export default SearchFilterParams;
