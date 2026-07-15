export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export interface MatomoAbTestVariations {
  AgentHeader: "original" | "VariationA";
  AgentWall: "original" | "VariationA" | "VariationB";
}

declare global {
  interface Window {
    _paq: any[];
    matomoAbTesting?: {
      getVariation<T extends keyof MatomoAbTestVariations>(
        name: T
      ): MatomoAbTestVariations[T];
      setVariation<T extends keyof MatomoAbTestVariations>(
        name: T,
        variation: MatomoAbTestVariations[T]
      ): void;
      subscribe(listener: () => void): () => void;
      variations: MatomoAbTestVariations;
    };
  }
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
