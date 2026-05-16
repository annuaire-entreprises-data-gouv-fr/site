import type { IAgentScope } from "./scopes/constants";

export interface IAgentInfo {
  domain: string;
  email: string;
  familyName: string;
  firstName: string;
  fullName: string;
  groupsScopes: Record<string, IAgentScope[]>;
  idpId: string;
  isSuperAgent: boolean;
  proConnectSub: string;
  scopes: IAgentScope[];
  siret: string;
  userType: string;
}
