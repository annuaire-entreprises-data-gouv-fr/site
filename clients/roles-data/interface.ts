export type IRolesDataUser = {
  email: string;
  id: number;
  role_name: string;
  role_id: number;
  is_admin: boolean;
};

export type IRolesDataAuthTokenRequest = {
  client_id: string;
  client_secret: string;
  grant_type: string;
};

export type IRolesDataAuthTokenResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
};

export type IRolesDataGroupResponse = {
  name: string;
  id: number;
  organisation_siret: string;
  users: IRolesDataUser[];
  scopes: string;
  contract_description: string;
  contract_url?: string;
};

export type IRolesDataRoles = {
  role_name: string;
  is_admin: boolean;
  id: number;
};

export type IRolesDataGroupSearchResponse = IRolesDataGroupResponse[];
