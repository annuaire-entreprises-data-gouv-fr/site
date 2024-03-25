import { checkIsSuperAgent } from '#utils/helpers/is-super-agent';

export type IScope = 'super' | 'rne' | 'nondiffusible' | 'conformite';

export const getUserScopes = async (
  userEmail: string
): Promise<{ scopes: IScope[]; userType: string }> => {
  const isSuperAgent = await checkIsSuperAgent(userEmail);

  if (isSuperAgent) {
    return {
      scopes: ['super', 'nondiffusible', 'conformite', 'rne'],
      userType: 'Super-agent connecté',
    };
  }

  return {
    scopes: ['nondiffusible', 'rne'],
    userType: 'Agent connecté',
  };
};
