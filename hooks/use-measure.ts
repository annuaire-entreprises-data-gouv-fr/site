import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * A hooks that measure the size of an element, thanks to the ResizeObserver API.
 * @returns
 */
type IMeasures = {
  width: number | undefined;
  height: number | undefined;
};
export function useMeasure(): [
  ref: (node: HTMLElement | null) => void,
  measures: IMeasures
] {
  const [measures, setMeasures] = useState<IMeasures>({
    width: undefined,
    height: undefined,
  });

  const [node, setNode] = useState<HTMLElement | null>(null);

  const elementObserver = useMemo(() => {
    if (typeof window === 'undefined' || !window.ResizeObserver) {
      return;
    }
    return new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setMeasures({ width, height });
      }
    });
  }, []);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      setNode(node);
      if (elementObserver) {
        setMeasures({
          height: node.clientHeight,
          width: node.clientWidth,
        });
        elementObserver.observe(node);
      }
    },
    [elementObserver]
  );

  useEffect(() => {
    return () => {
      if (node && elementObserver) {
        elementObserver.unobserve(node);
      }
    };
  }, [elementObserver, node]);

  return [ref, measures];
}
