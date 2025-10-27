import { getAgentUserType } from "#models/authentication/user/helpers";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { getNonce } from "#utils/headers/nonce";

const TRACKER_BASE_URL = "https://stats.data.gouv.fr";
export async function MatomoInit({ session }: { session: ISession | null }) {
  const nonce = await getNonce();
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              var _paq = window._paq || [];
              ${
                hasRights(session, ApplicationRights.isAgent)
                  ? `_paq.push(['setCustomDimension', '1', '${getAgentUserType(
                      session
                    )}']);`
                  : ""
              }
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              _paq.push(['setTrackerUrl', '${TRACKER_BASE_URL}/piwik.php']);
              _paq.push(['setSiteId', ${process.env.MATOMO_SITE_ID}]);
              `,
        }}
        nonce={nonce}
      />
      <script
        async
        defer
        nonce={nonce}
        src={`${TRACKER_BASE_URL}/piwik.js`}
        type="text/javascript"
      />
    </>
  );
}
