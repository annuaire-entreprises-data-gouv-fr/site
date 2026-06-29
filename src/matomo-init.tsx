import { useRouter } from "@tanstack/react-router";
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

export function useMatomoInit({ user }: IUseMatomoInitProps) {
  const siteId = import.meta.env.VITE_MATOMO_SITE_ID;
  const isMatomoEnabled =
    import.meta.env.PROD && siteId && !isDoNotTrackEnabled();

  const userType = getAgentUserType({ user });
  const matomoAbTestingListeners = useRef(new Set<() => void>());
  const router = useRouter();
  const lastTrackedHref = useRef<string | null>(null);

  const trackPageView = useCallback((href: string) => {
    // Dedupe: the initial pageview (from the init effect) and the first
    // `onRendered` event can refer to the same URL.
    if (lastTrackedHref.current === href) {
      return;
    }

    if (lastTrackedHref.current) {
      window._paq.push([
        "setReferrerUrl",
        `${window.location.origin}${lastTrackedHref.current}`,
      ]);
    }
    lastTrackedHref.current = href;

    window._paq.push([
      "AbTesting::create",
      {
        name: "FiltresAvances",
        percentage: 100,
        includedTargets: [
          {
            attribute: "url",
            inverted: "0",
            type: "regexp",
            value: "^(.*)/rechercher(?:\\?.*)?$",
          },
        ],
        excludedTargets: [],
        variations: [
          {
            name: "original",
            activate() {
              window.matomoAbTesting?.setVariation(
                "FiltresAvances",
                "original"
              );
            },
          },
          {
            name: "VariationA",
            activate() {
              window.matomoAbTesting?.setVariation(
                "FiltresAvances",
                "VariationA"
              );
            },
          },
          {
            name: "VariationB",
            activate() {
              window.matomoAbTesting?.setVariation(
                "FiltresAvances",
                "VariationB"
              );
            },
          },
        ],
        trigger() {
          return true;
        },
      },
    ]);

    window._paq.push([
      "AbTesting::create",
      {
        name: "AgentHeader",
        percentage: 100,
        includedTargets: [
          { attribute: "url", inverted: "0", type: "any", value: "" },
        ],
        excludedTargets: [],
        variations: [
          {
            name: "original",
            activate() {
              window.matomoAbTesting?.setVariation("AgentHeader", "original");
            },
          },
          {
            name: "VariationA",
            activate() {
              window.matomoAbTesting?.setVariation("AgentHeader", "VariationA");
            },
          },
        ],
        trigger() {
          return true;
        },
      },
    ]);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: onMount effect
  useEffect(() => {
    window.matomoAbTesting = {
      variations: {
        FiltresAvances: "original",
        AgentHeader: "original",
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

    trackPageView(router.state.location.href);
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
    const unsubscribe = router.subscribe("onRendered", (event) => {
      trackPageView(event.toLocation.href);
    });

    return unsubscribe;
  }, [router, isMatomoEnabled, trackPageView]);
}
