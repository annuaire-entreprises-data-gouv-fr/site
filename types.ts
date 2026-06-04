export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

declare global {
  interface Window {
    _paq: any[];
    matomoAbTesting: {
      getVariation(
        name: keyof Window["matomoAbTesting"]["variations"]
      ): "original" | "Variation1";
      setVariation(
        name: keyof Window["matomoAbTesting"]["variations"],
        variation: "original" | "Variation1"
      ): void;
      subscribe(listener: () => void): () => void;
      variations: {
        AdvancedSearchFilters: "original" | "Variation1";
      };
    };
  }
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
