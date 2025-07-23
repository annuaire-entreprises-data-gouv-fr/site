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
      (response) => response,
      this.TTL
    );
  }

  getRoles = async () => {
    return await this._dRolesStore.getData();
  };
}

export const dRolesStore = new DRolesStore();
