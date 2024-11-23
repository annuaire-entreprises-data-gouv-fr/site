import { HttpServerError } from '#clients/exceptions';
import { httpGet } from '#utils/network';

/**
 * Basic client that store an API response in memory
 *
 * Call once and cache response.
 */
export class DataStore<T> {
  private data: { [key: string]: T } | null;

  constructor(
    private dataUrl: string,
    private storeName: string,
    private mapToDomainObject: (e: any) => { [key: string]: T }
  ) {
    this.data = null;
  }

  get = async (key: string) => {
    if (!this.data) {
      const response = await httpGet(this.dataUrl);
      this.data = this.mapToDomainObject(response);
    }

    if (Object.values(this.data).length === 0) {
      throw new HttpServerError(`Empty data list : ${this.storeName}`);
    }

    if (key in this.data) {
      return this.data[key];
    } else {
      return null;
    }
  };
}
