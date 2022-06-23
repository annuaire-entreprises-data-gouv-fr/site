import { ParsedUrlQuery } from 'querystring';

export interface IParams {
  section_activite_principale: string;
  code_postal: string;
  departement: string;
}

class SearchFilterParams {
  private params: IParams;

  constructor(query: ParsedUrlQuery | IParams = {}) {
    const section_activite_principale = (query.section_activite_principale ||
      '') as string;
    const code_postal = (query.code_postal || '') as string;
    const departement = (query.departement || '') as string;

    this.params = {
      section_activite_principale,
      code_postal,
      departement,
    };
  }

  public toJSON() {
    return this.params || {};
  }

  toURI() {
    return Object.keys(this.params).reduce((uri, key) => {
      //@ts-ignore
      const value = this.params[key];

      if (!!value) {
        uri += `&${key}=${value}`;
      }
      return uri;
    }, '');
  }

  isEmpty() {
    return Object.values(this.params).some((v) => v !== '');
  }

  static hasParam(params: IParams) {
    const p = new SearchFilterParams(params);
    return p.isEmpty();
  }
}

export default SearchFilterParams;
