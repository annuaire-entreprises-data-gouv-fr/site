import { HttpServerError } from '#clients/exceptions';
import { httpGet } from '#utils/network';

export class MetadataStore<T> {
  private metadata: { [key: string]: T } | null;

  constructor(
    private metadataUrl: string,
    private storeName: string,
    private mapToDomainObject: (e: any) => { [key: string]: T }
  ) {
    this.metadata = null;
  }

  get = async (key: string) => {
    if (!this.metadata) {
      const response = await httpGet(this.metadataUrl);
      this.metadata = this.mapToDomainObject(response);
    }

    if (Object.values(this.metadata).length === 0) {
      throw new HttpServerError(`Empty metadata list : ${this.storeName}`);
    }

    if (key in this.metadata) {
      return this.metadata[key];
    } else {
      return null;
    }
  };
}
