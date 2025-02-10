import { HttpServerError } from '#clients/exceptions';
import { FetchRessourceException } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';

/**
 * Generic client that caches an API response in memory
 */
export class DataStore<T> {
  private data: { [key: string]: T } | null;

  private refreshPromise: Promise<T> | null;

  /**
   * Default TTL is 24h, set 0 to deactivate refresh
   * @param getData
   * @param storeName
   * @param mapToDomainObject
   * @param TTL
   */
  constructor(
    private getData: () => Promise<any>,
    private storeName: string,
    private mapToDomainObject: (result: any) => { [key: string]: T },
    private TTL = 86400000
  ) {
    this.data = null;
    this.refreshPromise = null;
  }

  fetchAndStoreData = async () => {
    try {
      if (!this.refreshPromise) {
        this.refreshPromise = this.getData();

        /** refresh */
        if (this.TTL && this.TTL > 0) {
          setTimeout(this.fetchAndStoreData, this.TTL);
        }
      }

      const response = await this.refreshPromise;
      this.data = this.mapToDomainObject(response);
    } catch (e) {
      logWarningInSentry(
        new FetchRessourceException({
          ressource: `DataStore : ${this.storeName}`,
          cause: e,
        })
      );
    } finally {
      this.refreshPromise = null;
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

  getKeys = async () => {
    if (!this.data) {
      await this.fetchAndStoreData();
    }

    if (!this.data || Object.values(this.data).length === 0) {
      throw new HttpServerError(`Empty data list : ${this.storeName}`);
    }

    return Object.keys(this.data);
  };
}
