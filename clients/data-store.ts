import { HttpServerError } from '#clients/exceptions';
import { FetchRessourceException } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';

/**
 * Generic client that cache an API response in memory
 */
export class DataStore<T> {
  private data: { [key: string]: T } | null;

  constructor(
    private getData: () => Promise<any>,
    private storeName: string,
    private mapToDomainObject: (result: any) => { [key: string]: T },
    private TTL?: number
  ) {
    this.data = null;
  }

  fetchAndStoreData = async () => {
    try {
      const response = await this.getData();
      this.data = this.mapToDomainObject(response);
    } catch (e) {
      logWarningInSentry(
        new FetchRessourceException({
          ressource: `DataStore : ${this.storeName}`,
          cause: e,
        })
      );
    }
    /** refresh */
    if (this.TTL && this.TTL > 0) {
      setTimeout(this.fetchAndStoreData, this.TTL);
    }
  };

  get = async (key: string) => {
    if (!this.data) {
      await this.fetchAndStoreData();
    }

    if (!this.data || Object.values(this.data).length === 0) {
      throw new HttpServerError(`Empty data list : ${this.storeName}`);
    }

    if (key in this.data) {
      return this.data[key];
    } else {
      return null;
    }
  };
}
