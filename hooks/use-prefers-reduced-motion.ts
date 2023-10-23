// https://www.joshwcomeau.com/react/prefers-reduced-motion/

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: no-preference)';
const getInitialState = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  !window.matchMedia(QUERY).matches;

/**
 * Returns whether the user has requested that the system minimize the amount of
 * motion it uses.
 *
 * Should be used to conditionally render animations and transitions.
 */
export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(getInitialState);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia) return;
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };
    mediaQueryList?.addEventListener?.('change', listener);
    return () => {
      mediaQueryList?.removeEventListener?.('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}
