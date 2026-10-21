import type { IAgentInfo } from "../agent";

/**
 * Part of a query key that identifies the viewer, for data that depends on the
 * user's rights (e.g. anonymised for non-agents). Cached data must never be
 * served to another viewer, including after a session expiry or a logout in
 * another browser tab, which do not reload the page.
 */
export const getUserQueryKey = (user: IAgentInfo | null) =>
  user && {
    proConnectSub: user.proConnectSub,
    email: user.email,
    siret: user.siret,
    scopes: user.scopes,
    groupsScopes: user.groupsScopes,
  };
