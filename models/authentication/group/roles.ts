import { getRolesMetadata } from '#clients/roles-data';
import { IDRolesRoles } from '#clients/roles-data/interface';
import { DataStore } from '#utils/data-store';

class RolesmetadataStore {
  private _dRolesStore: DataStore<IDRolesRoles[]>;
  private TTL = 300000; // 5min

  constructor() {
    this._dRolesStore = new DataStore<IDRolesRoles[]>(
      () => getRolesMetadata(),
      'd-roles-roles',
      (response) => ({ roles: response }),
      this.TTL
    );
  }

  getRoles = async () => {
    const data = await this._dRolesStore.getData();
    return data.roles;
  };
}

export const rolesMetadataStore = new RolesmetadataStore();
