import { getAdditionnalIAgentScope } from '#clients/authentication/super-agent-scopes';

export type IAgentScope =
  | 'rne'
  | 'nonDiffusible'
  | 'conformite'
  | 'beneficiaires'
  | 'agent'
  | 'pseudo_opendata'
  | 'cibtp'
  | 'cnetp'
  | 'probtp';

export const isAgentScope = (str: string): str is IAgentScope => {
  if (
    [
      'rne',
      'nonDiffusible',
      'conformite',
      'beneficiaires',
      'agent',
      'pseudo_opendata',
      'cibtp',
      'cnetp',
      'probtp',
    ].indexOf(str) > 0
  ) {
    return true;
  }
  return false;
};

const defaultAgentScopes = [
  'agent',
  'nonDiffusible',
  'rne',
  'pseudo_opendata',
] as IAgentScope[];

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
      scopes: [
        ...defaultAgentScopes,
        'conformite',
        'beneficiaires',
        'cibtp',
        'cnetp',
        'probtp',
      ],
      userType: 'Super-agent connecté',
      hasHabilitation: true,
    };
  }

  const additionnalScopes = await getAdditionnalIAgentScope(userEmail);

  return {
    scopes: [...defaultAgentScopes, ...additionnalScopes],
    userType:
      additionnalScopes.length > 0 ? 'Super-agent connecté' : 'Agent connecté',
    hasHabilitation: additionnalScopes.length > 0,
  };
};
