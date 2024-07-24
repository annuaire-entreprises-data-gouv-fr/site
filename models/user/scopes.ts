import { checkIsSuperAgent } from '#clients/authentication/super-agent';

export type IScope =
  | 'rne'
  | 'nonDiffusible'
  | 'conformite'
  | 'agent'
  | 'opendata';

const agentScope = ['agent', 'nonDiffusible', 'rne', 'opendata'] as const;
const superAgentScope = [...agentScope, 'conformite'] as const;

export const getUserScopes = async (
  userEmail: string
): Promise<{ scopes: IScope[]; userType: string }> => {
  const isSuperAgent = await checkIsSuperAgent(userEmail);

  if (isSuperAgent) {
    return {
      scopes: [...superAgentScope],
      userType: 'Super-agent connecté',
    };
  }

  return {
    scopes: [...agentScope],
    userType: 'Agent connecté',
  };
};
