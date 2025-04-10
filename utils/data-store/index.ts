import { HttpServerError } from '#clients/exceptions';
import { FetchRessourceException } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';

/**
 * Caches a promise response in memory
 *
 * When gave a TTR, it will attempt to refresh data every TTR milliseconds.
 * As long as it as a data in store it will ignore any failed attempt to refresh and still return outdated cached data
 */
export class DataStore<T> {
  private data: { [key: string]: T } | null;
  private onGoingRefresh: Promise<T> | null;
  private shouldAttemptRefresh: boolean;

  /**
   * @param getData
   * @param storeName
   * @param mapToDomainObject
   * @param TTR Time To Refresh | default is 24h, set 0 to deactivate refresh
   */
  constructor(
    private fetchData: () => Promise<any>,
    private storeName: string,
    private mapToDomainObject: (result: any) => { [key: string]: T },
    private TTR = 86400000
  ) {
    this.data = null;
    this.onGoingRefresh = null;
    this.shouldAttemptRefresh = this.TTR > 0;
  }

  private refresh = async () => {
    try {
      if (!this.onGoingRefresh) {
        this.onGoingRefresh = this.fetchData();

        if (this.shouldAttemptRefresh) {
          setTimeout(this.refresh, this.TTR);
        }
      }

      const response = await this.onGoingRefresh;
      this.data = this.mapToDomainObject(response);
    } catch (e) {
      logWarningInSentry(
        new FetchRessourceException({
          ressource: `DataStore : ${this.storeName}`,
          cause: e,
        })
      );
    } finally {
      this.onGoingRefresh = null;
    }
  };

  get = async (key: string) => {
    if (!this.data) {
      await this.refresh();
    }

    if (!this.data || this.data.size === 0) {
      throw new HttpServerError(`Empty data list : ${this.storeName}`);
    }
    const value = this.data[key];
    return typeof value === 'undefined' ? null : value;
  };

  getKeys = async () => {
    if (!this.data) {
      await this.refresh();
    }

    if (!this.data || this.data.size === 0) {
      throw new HttpServerError(`Empty data list : ${this.storeName}`);
    }
    return Object.keys(this.data);
  };

  getData = async () => {
    if (!this.data) {
      await this.refresh();
    }

    if (!this.data || this.data.size === 0) {
      throw new HttpServerError(`Empty data list : ${this.storeName}`);
    }
    return this.data;
  };
}
