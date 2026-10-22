import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "#/contexts/auth.context";
import type { IAgentInfo } from "#/models/authentication/agent";
import { getUserQueryKey } from "#/models/authentication/user/query-key";
import type { IUniteLegale } from "#/models/core/types";

export const UNITE_LEGALE_STALE_TIME = 5 * 60 * 1000;

/**
 * Unité légale is cached by siren (not slug) so that switching between
 * /entreprise/{chemin} and /entreprise/{siren}/... does not refetch it.
 * It is anonymised depending on the user's rights, hence the user in the key.
 */
export const uniteLegaleQueryKey = (
  user: IAgentInfo | null,
  siren: string,
  page?: number
) => {
  const key = ["unite-legale", getUserQueryKey(user), siren];
  return page === undefined ? key : [...key, page];
};

/**
 * Any unité légale already loaded for this siren and this user (whatever the
 * etablissements page), e.g. to display its title while a page is loading
 */
export const useCachedUniteLegale = (siren: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return queryClient
    .getQueriesData<IUniteLegale>({
      queryKey: uniteLegaleQueryKey(user, siren),
    })
    .find(([, data]) => data)?.[1];
};

/**
 * Unité légale loaded by a route (including during SSR, whose loader data is
 * not in the client query cache) is added to the cache, so that navigating to
 * the entreprise pages of the same unité légale does not refetch it
 */
export const useSeedUniteLegaleQueryCache = (
  uniteLegale: IUniteLegale | null,
  page = 1
) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!uniteLegale) {
      return;
    }
    const queryKey = uniteLegaleQueryKey(
      user,
      uniteLegale.oldSiren || uniteLegale.siren,
      page
    );
    if (!queryClient.getQueryData(queryKey)) {
      queryClient.setQueryData(queryKey, uniteLegale);
    }
  }, [queryClient, user, uniteLegale, page]);
};
