import { IAgentScope } from './scopes/constants';

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
  userType: string;
};
