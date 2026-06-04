import { useSyncExternalStore } from "react";

const ORIGINAL_VARIATION = "original";

interface IAbTestProps {
  name: keyof Window["matomoAbTesting"]["variations"];
}

function subscribe(listener: () => void) {
  return window.matomoAbTesting?.subscribe(listener) ?? (() => undefined);
}

function getServerSnapshot() {
  return ORIGINAL_VARIATION;
}

function useAbTest({ name }: IAbTestProps) {
  return useSyncExternalStore(
    subscribe,
    () => window.matomoAbTesting?.getVariation(name) ?? ORIGINAL_VARIATION,
    getServerSnapshot
  );
}

export function useAdvancedSearchFiltersAbTest() {
  return useAbTest({ name: "AdvancedSearchFilters" });
}
