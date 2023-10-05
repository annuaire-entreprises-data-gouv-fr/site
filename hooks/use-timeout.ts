import { useEffect, useState } from 'react';

/**
 * A hooks that returns true after a given delay.
 * @param ms: the delay in milliseconds
 */
export function useTimeout(ms: number): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(timeout);
  }, []);
  return ready;
}
