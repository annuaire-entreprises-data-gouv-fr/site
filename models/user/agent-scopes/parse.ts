import { allAgentScopes } from './all-agent-scopes';

export type IAgentScope = (typeof allAgentScopes)[number];

export const isAgentScope = (str: string): str is IAgentScope => {
  if (allAgentScopes.indexOf(str as IAgentScope) > 0) {
    return true;
  }
  return false;
};

export const parseAgentScope = (rawScope: string) => {
  const inValidScopes = [] as string[];

  const validScopes = (rawScope || '').split(' ').filter((s: string) => {
    const isScopeValid = isAgentScope(s);
    if (!isScopeValid) {
      inValidScopes.push(s);
    }
    return isScopeValid;
  }) as IAgentScope[];
  return { inValidScopes, validScopes };
};
