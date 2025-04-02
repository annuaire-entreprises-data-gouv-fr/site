import { IProConnectUserInfo } from '#clients/authentication/pro-connect/strategy';
import { superAgentsList } from '#clients/authentication/super-agents';
import {
  defaultAgentScopes,
  IAgentScope,
} from '#models/authentication/agent/scopes';
import { InternalError } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';

const isLikelyPrestataire = (domain: string) => {
  try {
    const excludedDomains = ['@beta.gouv.fr', '@i-carre.net'];
    if (excludedDomains.includes(domain)) {
      return true;
    } else {
      if (!!domain.match(/[.@-]*(ext)(ernal|ernes|erne)*[.@-]/g)) {
        return true;
      }
      return false;
    }
  } catch (e) {
    logWarningInSentry(
      new InternalError({
        message: 'Failed to determine agent level',
        cause: e,
      })
    );
    return false;
  }
};

const isFromMCP = (idp_id: string) => {
  if (idp_id === '71144ab3-ee1a-4401-b7b3-79b44f7daeeb') {
    return true;
  } else {
    return false;
  }
};

export type IAgentInfo = {
  userId: string;
  idpId: string;
  domain: string;
  email: string;
  familyName: string;
  firstName: string;
  fullName: string;
  siret: string;
  scopes: IAgentScope[];
  userType: string;
  isPrestataire: boolean;
  isMCP: boolean;
  hasHabilitation: boolean;
};

const extractDomain = (email: string) => {
  try {
    return (email.match(/@(.*)/) || ['']).shift() || '';
  } catch {
    return '';
  }
};

/**
 * Return a verified agent with actual scopes, hasHabilitation and user type
 * @param agent
 * @returns
 */
export const getVerifiedAgent = async (agent: IAgentInfo) => {
  const { scopes, userType, hasHabilitation } = await getAgentScopes(
    agent.email
  );
  return {
    ...agent,
    scopes,
    userType,
    hasHabilitation,
  };
};

export const createAgent = async (
  userInfo: IProConnectUserInfo
): Promise<IAgentInfo> => {
  const { scopes, userType, hasHabilitation } = await getAgentScopes(
    userInfo?.email
  );

  const domain = extractDomain(userInfo?.email || '');
  const isPrestataire = isLikelyPrestataire(domain);
  const isMCP = isFromMCP(userInfo.idp_id);

  const idpId = userInfo.idp_id ?? '';
  const email = userInfo.email ?? '';
  const familyName = userInfo.family_name ?? '';
  const firstName = userInfo.given_name ?? '';
  const userId = userInfo.sub;
  const siret = (userInfo.siret || '').replaceAll(' ', '');

  return {
    userId,
    idpId,
    domain,
    email,
    familyName,
    firstName,
    fullName: familyName ? `${firstName} ${familyName}` : '',
    siret,
    scopes,
    userType,
    isPrestataire,
    isMCP,
    hasHabilitation,
  };
};

/**
 * Get Agent rights written as scopes. There is no 1-to-1 match between UI and scopes.
 * This is a model persepective
 * @param userEmail
 * @returns
 */
const getAgentScopes = async (
  userEmail: string
): Promise<{
  scopes: IAgentScope[];
  userType: string;
  hasHabilitation: boolean;
}> => {
  const additionnalScopes = await superAgentsList.getScopeForAgent(userEmail);

  return {
    scopes: [
      // default agent scopes
      ...defaultAgentScopes,
      // additionnal scopes from super agent list
      ...additionnalScopes,
    ],
    userType:
      additionnalScopes.length > 0 ? 'Super-agent connecté' : 'Agent connecté',
    hasHabilitation: additionnalScopes.length > 0,
  };
};
