export type IRolesDataAuthTokenResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
};

export type IRolesDataRoles = {
  role_name: string;
  is_admin: boolean;
  id: number;
};

export type IRolesDataUser = {
  email: string;
  id: number;
  role_name: string;
  role_id: number;
  is_admin: boolean;
};

export interface IRolesDataGroupCreate {
  name: string;
  organisation_siret: string;
  admin: { email: string };
  scopes: string;
  contract_description: string;
  contract_url?: string;
  members?: { email: string }[];
}

export interface IRolesDataGroupResponse extends IRolesDataGroupCreate {
  id: number;
  users: IRolesDataUser[];
}
