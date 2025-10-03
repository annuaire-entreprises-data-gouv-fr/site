import type { IAgentInfo } from "../agent";

export type ISession = {
  lastVisitTimestamp?: number;
  user: IAgentInfo | null;

  // agent connect
  state?: string;
  nonce?: string;
  idToken?: string;
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
