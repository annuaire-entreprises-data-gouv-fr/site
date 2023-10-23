export const CACHE_TIMEOUT = 1000 * 60 * 15;

export const defaultCacheConfig = {
  // 15 minutes lifespan as average session is ~ 3 min.
  ttl: CACHE_TIMEOUT,

  // only cache 200
  cachePredicate: {
    statusCheck: (status: number) => {
      return status >= 200 && status < 300;
    },
    responseMatch: ({ data }: { data: any }) => {
      // only caches if the response is not fallback
      const isFallback = !!data?.metadata?.isFallback;
      return !isFallback;
    },
  },
  // If we should return a old (possibly expired) cache when the current request failed
  // to get a valid response because of a network error, invalid status or etc.
  staleIfError: false,
};
