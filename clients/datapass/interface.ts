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
