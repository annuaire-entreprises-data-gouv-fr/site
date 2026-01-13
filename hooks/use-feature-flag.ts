import { useQuery } from "@tanstack/react-query";
import type { FeatureFlag } from "#models/feature-flags";

export const useFeatureFlag = (featureFlag: FeatureFlag) => {
  const { data, isLoading } = useQuery<{
    featureFlags: Record<FeatureFlag, boolean>;
  }>({
    gcTime: Number.POSITIVE_INFINITY,
    queryKey: ["feature-flags"],
    queryFn: () =>
      fetch("/api/feature-flags").then((res) =>
        res.ok ? res.json() : Promise.reject(res.statusText)
      ),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return { isEnabled: data?.featureFlags[featureFlag] ?? false, isLoading };
};
