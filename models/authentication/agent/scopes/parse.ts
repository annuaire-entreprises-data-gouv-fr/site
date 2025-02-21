import { allAgentScopes, IAgentScope } from './';

export const isAgentScope = (str: string): str is IAgentScope => {
  if (allAgentScopes.indexOf(str as IAgentScope) > -1) {
    return true;
  }
  return false;
};

export const parseAgentScope = (rawScope: string) => {
  const inValidScopes = [] as string[];

  const validScopes = (rawScope || '').split(' ').filter((s: string) => {
    const isScopeValid = isAgentScope(s);
    // there can be trailing whitespace, therefore s can be an empty string
    if (s && !isScopeValid) {
      inValidScopes.push(s);
    }
    return isScopeValid;
  }) as IAgentScope[];
  return { inValidScopes, validScopes };
};
