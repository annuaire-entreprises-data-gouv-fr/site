import { getRolesMetadata } from '#clients/roles-data';
import { IRolesDataRoles } from '#clients/roles-data/interface';
import { DataStore } from '#utils/data-store';

class RolesmetadataStore {
  private _rolesDataStore: DataStore<IRolesDataRoles[]>;
  private TTL = 36000000; // 10h

  constructor() {
    this._rolesDataStore = new DataStore<IRolesDataRoles[]>(
      () => getRolesMetadata(),
      'roles-data-roles',
      (response) => ({ roles: response }),
      this.TTL
    );
  }

  getRoles = async () => {
    const data = await this._rolesDataStore.getData();
    return data.roles;
  };
}

export const rolesMetadataStore = new RolesmetadataStore();
