import { checkIsSuperAgent } from '#utils/helpers/is-super-agent';

export type IScope = 'rne' | 'nonDiffusible' | 'conformite' | 'agent';

export const getUserScopes = async (
  userEmail: string
): Promise<{ scopes: IScope[]; userType: string }> => {
  const isSuperAgent = await checkIsSuperAgent(userEmail);

  if (isSuperAgent) {
    return {
      scopes: ['agent', 'nonDiffusible', 'conformite', 'rne'],
      userType: 'Super-agent connecté',
    };
  }

  return {
    scopes: ['agent', 'nonDiffusible', 'rne'],
    userType: 'Agent connecté',
  };
};
