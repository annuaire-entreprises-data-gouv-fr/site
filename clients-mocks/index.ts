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

    this._mocks.push(require('./base-adresse').default);
    this._mocks.push(require('./sirene-insee/token').default);

    this._mocks.push(require('./geo/communes').default);
    this._mocks.push(require('./geo/departements').default);
    this._mocks.push(require('./geo/regions').default);

    this._mocks.push(require('./rge').default);
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
