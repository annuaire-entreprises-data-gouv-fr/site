export type IDatapassAuthTokenRequest = {
  client_id: string;
  client_secret: string;
  grant_type: string;
};

export type IDatapassAuthTokenResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
  created_at: number;
};

export type IDatapassHabilitationResponse = {
  id: string;
  slug: string;
  revoked: boolean;
  state: 'active' | 'obsolete' | 'revoked';
  created_at: string;
  data: any;
  definition_id: string;
  request_id: string;
  organization: {
    id: string;
    siret: string;
    name: string;
    insee_payload: any;
  };
};

export type IDatapassDemandeResponse = {
  id: string;
  public_id: string;
  definition_id: string;
  state:
    | 'draft'
    | 'submitted'
    | 'changes_requested'
    | 'validated'
    | 'refused'
    | 'archived'
    | 'revoked';
  form_uid: string;
  data: any;
  created_at: string;
  last_submited_at: string;
  last_validated_at: string;
  reopening: boolean;
  reopened_at: string;
  organization: {
    id: string;
    siret: string;
    name: string;
    insee_payload: any;
  };
  applicant: {
    id: string;
    uid: string;
    email: string;
    given_name: string;
    family_name: string;
    phone_number: string;
    job_title: string;
  };
  habilitations: any[];
  events: any[];
};
