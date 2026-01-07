import { useQuery } from "@tanstack/react-query";
import type { FeatureFlag } from "#models/feature-flags";

export const useFeatureFlag = (featureFlag: FeatureFlag) => {
  const { data, isLoading, dataUpdatedAt } = useQuery<{ isEnabled: boolean }>({
    gcTime: Number.POSITIVE_INFINITY,
    queryKey: ["feature-flag", featureFlag],
    queryFn: () =>
      fetch(`/api/feature-flags?featureFlag=${featureFlag}`).then((res) =>
        res.ok ? res.json() : Promise.reject(res.statusText)
      ),
    refetchInterval: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return { isEnabled: data?.isEnabled ?? false, isLoading };
};
