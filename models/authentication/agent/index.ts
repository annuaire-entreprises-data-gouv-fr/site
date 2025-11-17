import type { Siret } from "#utils/helpers";
import type { IAgentScope } from "./scopes/constants";

export type IAgentInfo = {
  proConnectSub: string;
  idpId: string;
  domain: string;
  email: string;
  familyName: string;
  firstName: string;
  fullName: string;
  siret: string;
  scopes: IAgentScope[];
  groupsScopes: Record<Siret, IAgentScope[]>;
  userType: string;
  isSuperAgent: boolean;
};
