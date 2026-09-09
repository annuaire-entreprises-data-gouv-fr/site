import { ApplicationRights } from "#/models/authentication/user/rights";
import type { UseCase } from "#/models/use-cases";
import { getAgentFondationsRestreintesFn } from "#/server-functions/agent/data-fetching";
import { useServerFnData } from "./use-server-fn-data";

const cacheOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
};

/** Reuse the full RNF response across sections; storage stays in QueryClient memory. */
export function useFondationsRestreintes(idRnf: string, useCase: UseCase) {
  return useServerFnData(
    getAgentFondationsRestreintesFn,
    { idRnf, useCase },
    ApplicationRights.isAgent,
    cacheOptions
  );
}
