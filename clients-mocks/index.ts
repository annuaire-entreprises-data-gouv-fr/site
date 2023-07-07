import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type IMock = {
  match: string | string[];
  response: any;
};

export class MissingMockException extends Error {}

class MockStore {
  private _mocks = [] as IMock[];

  constructor() {
    if (process.env.END2END_MOCKING !== 'enabled') {
      // dont load mocks
      return;
    }

    this._mocks.push(require('./api-proxy/association').default);
    this._mocks.push(require('./api-proxy/rne/severnaya').default);
    this._mocks.push(require('./api-proxy/rne/solution-energie').default);
    this._mocks.push(require('./api-proxy/tva').default);

    this._mocks.push(require('./base-adresse').default);
    this._mocks.push(require('./entrepreneur-spectacle/dataset').default);
    this._mocks.push(require('./entrepreneur-spectacle/records').default);
    this._mocks.push(require('./geo/communes').default);
    this._mocks.push(require('./geo/departements').default);
    this._mocks.push(require('./recherche-entreprise/finassure').default);
    this._mocks.push(require('./recherche-entreprise/ganymede').default);
    this._mocks.push(require('./recherche-entreprise/grand-paris').default);
    this._mocks.push(require('./recherche-entreprise/la-poste').default);
    this._mocks.push(
      require('./recherche-entreprise/manakin-production').default
    );
    this._mocks.push(require('./recherche-entreprise/raphael').default);
    this._mocks.push(require('./recherche-entreprise/red-needles').default);
    this._mocks.push(require('./recherche-entreprise/sauvage').default);
    this._mocks.push(require('./recherche-entreprise/severnaya').default);
    this._mocks.push(
      require('./recherche-entreprise/solution-energie').default
    );
    this._mocks.push(require('./recherche-entreprise/text-ganymede').default);
    this._mocks.push(require('./rge').default);
    this._mocks.push(require('./sirene-insee/siren/finassure').default);
    this._mocks.push(require('./sirene-insee/siren/ganymede').default);
    this._mocks.push(require('./sirene-insee/siren/grand-paris').default);
    this._mocks.push(require('./sirene-insee/siren/la-poste').default);
    this._mocks.push(
      require('./sirene-insee/siren/manakin-production').default
    );
    this._mocks.push(require('./sirene-insee/siren/raphael').default);
    this._mocks.push(require('./sirene-insee/siren/red-needles').default);
    this._mocks.push(require('./sirene-insee/siren/sauvage').default);
    this._mocks.push(require('./sirene-insee/siren/severnaya').default);
    this._mocks.push(require('./sirene-insee/siren/solution-energie').default);
    this._mocks.push(require('./sirene-insee/siret/ganymede').default);
    this._mocks.push(
      require('./sirene-insee/siret-by-siren/finassure').default
    );
    this._mocks.push(require('./sirene-insee/siret-by-siren/ganymede').default);
    this._mocks.push(
      require('./sirene-insee/siret-by-siren/grand-paris').default
    );
    this._mocks.push(require('./sirene-insee/siret-by-siren/la-poste').default);
    this._mocks.push(
      require('./sirene-insee/siret-by-siren/manakin-production').default
    );
    this._mocks.push(require('./sirene-insee/siret-by-siren/raphael').default);
    this._mocks.push(
      require('./sirene-insee/siret-by-siren/red-needles').default
    );
    this._mocks.push(require('./sirene-insee/siret-by-siren/sauvage').default);
    this._mocks.push(
      require('./sirene-insee/siret-by-siren/severnaya').default
    );
    this._mocks.push(
      require('./sirene-insee/siret-by-siren/solution-energie').default
    );

    this._mocks.push(require('./sirene-insee/token').default);
  }

  public get(url: string) {
    for (let mock of this._mocks) {
      const regexes =
        typeof mock.match === 'string'
          ? [mock.match as string]
          : (mock.match as string[]);

      for (let regex of regexes) {
        if (url.indexOf(regex) > -1) {
          return mock.response;
        }
      }
    }

    console.error(`Could not find a mock for ${url}`);
    throw new MissingMockException();
  }

  public mockedAxiosInstance = (
    axiosConfig: AxiosRequestConfig
  ): AxiosResponse => {
    const params = axiosConfig.params
      ? Object.keys(axiosConfig.params)
          .map((k) => `${k}=${axiosConfig.params[k]}`)
          .join('&')
      : '';

    const url = `${axiosConfig.url}${params}`;
    if (typeof url === 'undefined') {
      console.error(`No url provided ${url}`);
      throw new MissingMockException();
    } else {
      return { data: this.get(url) } as AxiosResponse;
    }
  };
}

export const mockStore = new MockStore();
