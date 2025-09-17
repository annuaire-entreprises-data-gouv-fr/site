/**
 * Utility to determine if a page should have noindex based on query parameters
 * This prevents Google from indexing URLs with problematic query parameters
 * like pathFrom, redirected, etc.
 */

export const PROBLEMATIC_QUERY_PARAMS = [
  'pathFrom',
  'redirected',
  'isABot',
  // Add other parameters that should trigger noindex
] as const;

export type ProblematicQueryParam = (typeof PROBLEMATIC_QUERY_PARAMS)[number];

/**
 * Check if search params contain any problematic query parameters
 * that should trigger a noindex meta tag
 */
export function shouldAddNoIndex(
  searchParams: { [key: string]: string | string[] | undefined } | null
): boolean {
  if (!searchParams) {
    return false;
  }

  return PROBLEMATIC_QUERY_PARAMS.some(
    (param) => searchParams[param] !== undefined
  );
}

/**
 * Get the list of problematic parameters found in the search params
 * Useful for debugging or logging
 */
export function getProblematicParams(
  searchParams: { [key: string]: string | string[] | undefined } | null
): ProblematicQueryParam[] {
  if (!searchParams) {
    return [];
  }

  return PROBLEMATIC_QUERY_PARAMS.filter(
    (param) => searchParams[param] !== undefined
  );
}
