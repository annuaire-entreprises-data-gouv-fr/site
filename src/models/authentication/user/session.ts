import type { IAgentInfo } from "../agent";

export interface ISession {
  // FranceConnect hide personal data request
  franceConnectHidePersonalDataSession?: {
    firstName?: string;
    familyName?: string;
    birthdate?: string;
    tokenId: string;
    sub: string;
  };
  lastVisitTimestamp?: number;
  nonce?: string;
  // connexion
  pathFrom?: string;
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
