import { useSyncExternalStore } from "react";
import type { MatomoAbTestVariations } from "../../types";

const ORIGINAL_VARIATION =
  "original" satisfies MatomoAbTestVariations[keyof MatomoAbTestVariations];

interface IAbTestProps<T extends keyof MatomoAbTestVariations> {
  name: T;
}

function subscribe(listener: () => void) {
  return window.matomoAbTesting?.subscribe(listener) ?? (() => undefined);
}

function getServerSnapshot<T extends keyof MatomoAbTestVariations>() {
  return ORIGINAL_VARIATION as MatomoAbTestVariations[T];
}

function useAbTest<T extends keyof MatomoAbTestVariations>({
  name,
}: IAbTestProps<T>): MatomoAbTestVariations[T] {
  return useSyncExternalStore(
    subscribe,
    () =>
      window.matomoAbTesting?.getVariation(name) ??
      (ORIGINAL_VARIATION as MatomoAbTestVariations[T]),
    getServerSnapshot<T>
  );
}

export function useAdvancedSearchFiltersAbTest() {
  return useAbTest({ name: "FiltresAvances" });
}

export function useAgentHeaderAbTest() {
  return useAbTest({ name: "AgentHeader" });
}
