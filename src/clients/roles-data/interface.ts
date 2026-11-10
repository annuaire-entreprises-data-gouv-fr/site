export interface IRolesDataAuthTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface IRolesDataRoles {
  id: number;
  is_admin: boolean;
  role_name: string;
}

export interface IRolesDataUser {
  email: string;
  id: number;
  is_admin: boolean;
  role_id: number;
  role_name: string;
}

export interface IRolesDataGroupUser extends IRolesDataUser {
  added_by_email: string | null;
}

export interface IAgentsGroupCreate {
  admin: { email: string };
  contract_description: string;
  contract_url?: string;
  members?: { email: string }[];
  name: string;
  organisation_siret: string;
  scopes: string;
}

export interface IRolesDataGroupAdmin {
  email: string;
  id: number;
}

export interface IRolesDataCurrentUserRole {
  id: number;
  is_admin: boolean;
  role_name: string;
}

interface IAgentsGroupBaseResponse {
  contract_description: string;
  contract_url?: string;
  current_user_role: IRolesDataCurrentUserRole;
  id: number;
  name: string;
  organisation_siret: string;
  scopes: string;
}

export interface IAgentsGroupResponse extends IAgentsGroupBaseResponse {
  admins: IRolesDataGroupAdmin[];
}

export interface IAgentsGroupDetailsResponse extends IAgentsGroupBaseResponse {
  users: IRolesDataGroupUser[];
  users_pagination: {
    page: number;
    size: number;
    total: number;
    total_pages: number;
  };
}

export interface IAgentsOrganizationGroupResponse {
  admin_emails: string[];
  id: number;
  name: string;
  organisation_siret: string;
  scopes: string;
}
