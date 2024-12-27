import { getAdditionnalIAgentScope } from '#clients/authentication/super-agent-scopes';

const allAgentScopes = [
  'rne',
  'nonDiffusible',
  'conformite',
  'beneficiaires',
  'agent',
  'pseudo_opendata',
  'cibtp',
  'cnetp',
  'probtp',
  'effectifs_annuels',
] as const;

export type IAgentScope = (typeof allAgentScopes)[number];

export const isAgentScope = (str: string): str is IAgentScope => {
  if (allAgentScopes.indexOf(str as IAgentScope) > 0) {
    return true;
  }
  return false;
};

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
  const isTestAccount =
    userEmail === 'user@yopmail.com' &&
    (process.env.NODE_ENV !== 'production' ||
      process.env.NEXT_PUBLIC_END2END_MOCKING === 'enabled');

  if (isTestAccount) {
    return {
      scopes: [...allAgentScopes],
      userType: 'Super-agent connecté',
      hasHabilitation: true,
    };
  }

  const additionnalScopes = await getAdditionnalIAgentScope(userEmail);

  return {
    scopes: [
      // default agent scopes
      'agent',
      'nonDiffusible',
      'rne',
      'pseudo_opendata',
      // additionnal scopes from super agent list
      ...additionnalScopes,
    ],
    userType:
      additionnalScopes.length > 0 ? 'Super-agent connecté' : 'Agent connecté',
    hasHabilitation: additionnalScopes.length > 0,
  };
};
