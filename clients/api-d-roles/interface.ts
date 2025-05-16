export type IDRolesUser = {
  email: string;
  sub_pro_connect: string;
  is_email_confirmed: boolean;
  id: number;
  role_name: string;
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
};

export type IDRolesGroup = {
  name: string;
  id: number;
  organisation_siren: string;
  users: IDRolesUser[];
  scopes: string;
};

export type IDRolesGroupSearchResponse = IDRolesGroup[];
