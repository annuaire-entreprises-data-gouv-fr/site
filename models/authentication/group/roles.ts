import { getRoles } from '#clients/api-d-roles';
import { IDRolesRoles } from '#clients/api-d-roles/interface';
import { DataStore } from '#utils/data-store';

class DRolesStore {
  private _dRolesStore: DataStore<IDRolesRoles[]>;
  private TTL = 300000; // 5min

  constructor() {
    this._dRolesStore = new DataStore<IDRolesRoles[]>(
      () => getRoles(),
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

export const dRolesStore = new DRolesStore();
