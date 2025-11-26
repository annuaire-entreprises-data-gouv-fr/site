import type { IAgentInfo } from "../agent";

export type ISession = {
  user: IAgentInfo | null;

  // pro connect
  state?: string;
  nonce?: string;
  proConnectTokenSet?: {
    idToken?: string;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
  };
  // connexion
  pathFrom?: string;

  // FranceConnect hide personal data request
  franceConnectHidePersonalDataSession?: {
    firstName?: string;
    familyName?: string;
    birthdate?: string;
    tokenId: string;
    sub: string;
  };
};
