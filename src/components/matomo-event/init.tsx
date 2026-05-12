import { useAuth } from "#/contexts/auth.context";
import { getAgentUserType } from "#/models/authentication/user/helpers";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";

const TRACKER_BASE_URL = "https://stats.data.gouv.fr";
export function MatomoInit() {
  const { user } = useAuth();
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              var _paq = window._paq || [];
              ${
                hasRights({ user }, ApplicationRights.isAgent)
                  ? `_paq.push(['setCustomDimension', '1', '${getAgentUserType({
                      user,
                    })}']);`
                  : ""
              }
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              _paq.push(['setTrackerUrl', '${TRACKER_BASE_URL}/piwik.php']);
              _paq.push(['setSiteId', ${process.env.MATOMO_SITE_ID}]);
              `,
        }}
      />
      <script
        async
        defer
        src={`${TRACKER_BASE_URL}/piwik.js`}
        type="text/javascript"
      />
    </>
  );
}
