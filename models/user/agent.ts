import { IProConnectUserInfo } from '#clients/authentication/pro-connect/strategy';
import { superAgentsList } from '#clients/authentication/super-agent-list/agent-list';
import { InternalError } from '#models/exceptions';
import { isLuhnValid } from '#utils/helpers';
import { logWarningInSentry } from '#utils/sentry';
import { defaultAgentScopes } from './agent-scopes';
import { IAgentScope } from './agent-scopes/parse';
import getSiretFromIdpTemporary from './getSiretFromIdpTemporary';

const isLikelyPrestataire = (domain: string) => {
  try {
    if (domain === '@beta.gouv.fr') {
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

export enum UseCase {
  autre = "Autre cas d'usage",
  aidesEntreprises = 'Aides publiques aux entreprises',
  aidesAsso = 'Aides publiques aux associations',
  marches = 'Marchés publics',
  fraude = 'Détection de la fraude',
}

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
 * Get siret or idpId fallback siret
 * @param siret
 * @param idpId
 * @returns
 */
const getSiretOrFallbackOnIdpId = (siret: string, idpId: string) => {
  const cleanedSiret = (siret || '').replaceAll(' ', '');
  if (cleanedSiret && isLuhnValid(cleanedSiret)) {
    return cleanedSiret;
  }
  return getSiretFromIdpTemporary(idpId);
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
  const siret = getSiretOrFallbackOnIdpId(userInfo.siret, idpId);

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
