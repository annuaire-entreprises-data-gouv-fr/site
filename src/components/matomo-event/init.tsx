import { useEffect } from "react";
import { useAuth } from "#/contexts/auth.context";
import { getAgentUserType } from "#/models/authentication/user/helpers";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";

const isMatomoEnabled =
  import.meta.env.PROD && import.meta.env.VITE_MATOMO_SITE_ID;

const TRACKER_BASE_URL = "https://stats.data.gouv.fr";

export function MatomoInit() {
  const { user } = useAuth();

  useEffect(() => {
    if (!isMatomoEnabled) {
      return;
    }

    window._paq ??= [];

    if (hasRights({ user }, ApplicationRights.isAgent)) {
      window._paq.push(["setCustomDimension", "1", getAgentUserType({ user })]);
    }

    window._paq.push(["trackPageView"]);
    window._paq.push(["enableLinkTracking"]);
    window._paq.push(["setTrackerUrl", `${TRACKER_BASE_URL}/piwik.php`]);
    window._paq.push(["setSiteId", import.meta.env.VITE_MATOMO_SITE_ID]);

    const script = document.createElement("script");
    script.src = "https://stats.data.gouv.fr/piwik.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return null;
}
