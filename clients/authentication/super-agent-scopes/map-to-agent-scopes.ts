import { InternalError } from '#models/exceptions';
import { IAgentScope, isAgentScope } from '#models/user/scopes';
import logErrorInSentry from '#utils/sentry';

export const mapToAgentScopes = (rawScope: string) => {
  const inValidScopes = [] as string[];

  const validScopes = (rawScope || '').split(' ').filter((s: string) => {
    const isScopeValid = isAgentScope(s);
    if (!isScopeValid) {
      inValidScopes.push(s);
    }
    return isScopeValid;
  }) as IAgentScope[];

  if (inValidScopes.length > 0) {
    logErrorInSentry(
      new InternalError({
        message: `Unknown agent scopes : ${inValidScopes.join(',')}`,
      })
    );
  }

  return validScopes;
};
