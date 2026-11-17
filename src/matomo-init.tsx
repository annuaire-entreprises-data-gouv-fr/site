import { type AnyRouter, rootRouteId, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { getAgentUserType } from "./models/authentication/user/helpers";
import type { ISession } from "./models/authentication/user/session";

interface IUseMatomoInitProps {
  user: ISession["user"] | null;
}

function isDoNotTrackEnabled() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }

  const doNotTrack =
    navigator.doNotTrack ??
    (window as { doNotTrack?: string }).doNotTrack ??
    (navigator as { msDoNotTrack?: string }).msDoNotTrack;

  return doNotTrack === "1" || doNotTrack === "yes";
}

/**
 * URL sent to Matomo: the route pattern instead of the real pathname
 * (e.g. `/entreprise/$slug/dirigeants` instead of
 * `/entreprise/entreprise-123456789/dirigeants`), so that visits are grouped
 * by page regardless of the entreprise. Search params are kept.
 */
function getTrackedUrl({ matches, location }: AnyRouter["state"]) {
  const leafMatch = matches.at(-1);

  // No route matched (404): only the root route is in the matches
  const isUnmatched =
    !leafMatch ||
    (leafMatch.routeId === rootRouteId && location.pathname !== "/");

  const path = isUnmatched
    ? location.pathname
    : // index routes' fullPath end with a slash (e.g. `/rechercher/`)
      leafMatch.fullPath.replace(/(.)\/$/, "$1");

  return `${window.location.origin}${path}${location.searchStr}`;
}

export function useMatomoInit({ user }: IUseMatomoInitProps) {
  const siteId = import.meta.env.VITE_MATOMO_SITE_ID;
  const isMatomoEnabled =
    import.meta.env.PROD && siteId && !isDoNotTrackEnabled();

  const userType = getAgentUserType({ user });
  const matomoAbTestingListeners = useRef(new Set<() => void>());
  const router = useRouter();
  const lastTrackedHref = useRef<string | null>(null);
  const lastTrackedUrl = useRef<string | null>(null);

  const trackPageView = useCallback((routerState: AnyRouter["state"]) => {
    // Dedupe on the real href: the initial pageview (from the init effect)
    // and the first `onRendered` event can refer to the same URL.
    const { href } = routerState.location;
    if (lastTrackedHref.current === href) {
      return;
    }
    lastTrackedHref.current = href;

    const url = getTrackedUrl(routerState);
    if (lastTrackedUrl.current) {
      window._paq.push(["setReferrerUrl", lastTrackedUrl.current]);
    }
    lastTrackedUrl.current = url;
    window._paq.push(["setCustomUrl", url]);

    window._paq.push([
      "AbTesting::create",
      {
        name: "AgentWall",
        percentage: 100,
        includedTargets: [
          { attribute: "url", inverted: "0", type: "any", value: "" },
        ],
        excludedTargets: [],
        variations: [
          {
            name: "original",
            activate() {
              window.matomoAbTesting?.setVariation("AgentWall", "original");
            },
          },
          {
            name: "VariationA",
            activate() {
              window.matomoAbTesting?.setVariation("AgentWall", "VariationA");
            },
          },
          {
            name: "VariationB",
            activate() {
              window.matomoAbTesting?.setVariation("AgentWall", "VariationB");
            },
          },
        ],
        trigger() {
          return true;
        },
      },
    ]);

    window._paq.push(["trackPageView"]);
  }, []);

  useEffect(() => {
    window.matomoAbTesting = {
      variations: {
        AgentWall: "original",
      },
      getVariation(name) {
        return this.variations[name] ?? "original";
      },
      setVariation(name, variation) {
        if (this.variations[name] === variation) {
          return;
        }

        this.variations[name] = variation;
        for (const listener of matomoAbTestingListeners.current) {
          listener();
        }
      },
      subscribe(listener) {
        matomoAbTestingListeners.current.add(listener);
        return () => matomoAbTestingListeners.current.delete(listener);
      },
    };

    if (!isMatomoEnabled) {
      return;
    }

    window._paq = window._paq || [];
    if (userType) {
      window._paq.push(["setCustomDimension", "1", userType]);
    }
    window._paq.push(["setTrackerUrl", "https://stats.data.gouv.fr/piwik.php"]);
    window._paq.push(["setSiteId", siteId]);

    trackPageView(router.state);
    window._paq.push(["enableLinkTracking"]);

    const script = document.createElement("script");
    script.src = "https://stats.data.gouv.fr/piwik.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isMatomoEnabled) {
      return;
    }

    // `onRendered` fires *after* the new route is rendered and the URL is
    // committed to `window.location` (unlike router state / `useRouterState`,
    // which updates as soon as navigation starts). This guarantees Matomo
    // tracks the new URL instead of the stale one.
    const unsubscribe = router.subscribe("onRendered", () => {
      trackPageView(router.state);
    });

    return unsubscribe;
  }, [router, isMatomoEnabled, trackPageView]);
}
