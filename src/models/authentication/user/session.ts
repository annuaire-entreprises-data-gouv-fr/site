import type { IAgentInfo } from "../agent";

export interface ISession {
  // FranceConnect hide personal data request
  FC_CONNECT_CHECK?: {
    codeVerifier: string;
    nonce: string;
    state: string;
  };
  franceConnectHidePersonalDataSession?: {
    firstName?: string;
    familyName?: string;
    birthdate?: string;
    tokenId: string;
    sub: string;
  };
  nonce?: string;
  // connexion
  pathFrom?: string;
  pkceCodeVerifier?: string;
  proConnectTokenSet?: {
    idToken?: string;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
  };

  // pro connect
  state?: string;
  user: IAgentInfo | null;
}
