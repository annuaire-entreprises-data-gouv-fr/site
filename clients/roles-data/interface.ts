export type IDRolesUser = {
  email: string;
  id: number;
  role_name: string;
  role_id: number;
  is_admin: boolean;
};

export type IDRolesAuthTokenRequest = {
  client_id: string;
  client_secret: string;
  grant_type: string;
};

export type IDRolesAuthTokenResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
};

export type IDRolesGroupResponse = {
  name: string;
  id: number;
  organisation_siret: string;
  users: IDRolesUser[];
  scopes: string;
  contract_description: string;
  contract_url?: string;
};

export type IDRolesRoles = {
  role_name: string;
  is_admin: boolean;
  id: number;
};

export type IDRolesGroupSearchResponse = IDRolesGroupResponse[];
