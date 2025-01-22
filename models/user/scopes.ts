import { superAgents } from '#clients/authentication/super-agent-scopes';
import { allAgentScopes } from './all-agent-scopes';

export type IAgentScope = (typeof allAgentScopes)[number];

export const isAgentScope = (str: string): str is IAgentScope => {
  if (allAgentScopes.indexOf(str as IAgentScope) > 0) {
    return true;
  }
  return false;
};

export const defaultAgentScopes: IAgentScope[] = [
  'agent',
  'nonDiffusible',
  'rne',
  'pseudo_opendata',
];

/**
 * Get Agent rights written as scopes. There is no 1-to-1 match between UI and scopes.
 * This is a model persepective
 * @param userEmail
 * @returns
 */
export const getAgentScopes = async (
  userEmail: string
): Promise<{
  scopes: IAgentScope[];
  userType: string;
  hasHabilitation: boolean;
}> => {
  const additionnalScopes = await superAgents.getScopeForAgent(userEmail);

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
