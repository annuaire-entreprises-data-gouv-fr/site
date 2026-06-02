import { clientRolesGetMetadata } from "#/clients/roles-data/index.server";
import type { IRolesDataRoles } from "#/clients/roles-data/interface";
import { DataStore } from "#/utils/data-store";

class RolesmetadataStore {
  private readonly _rolesDataStore: DataStore<IRolesDataRoles[]>;
  private readonly TTL = 36_000_000; // 10h

  constructor() {
    this._rolesDataStore = new DataStore<IRolesDataRoles[]>(
      () => clientRolesGetMetadata(),
      "roles-data-roles",
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
