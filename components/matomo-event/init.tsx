import { ISession, isAgent, isSuperAgent } from '#utils/session';
const TRACKER_BASE_URL = 'https://stats.data.gouv.fr';
export function MatomoInit({ session }: { session: ISession | null }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              var _paq = window._paq || [];
              ${
                isSuperAgent(session)
                  ? `_paq.push(['setCustomDimension', '1', 'Super-agent connecté']);`
                  : isAgent(session)
                  ? `_paq.push(['setCustomDimension', '1', 'Agent connecté']);`
                  : ''
              }
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              _paq.push(['setTrackerUrl', '${TRACKER_BASE_URL}/piwik.php']);
              _paq.push(['setSiteId', ${process.env.MATOMO_SITE_ID}]);
              `,
        }}
      ></script>
      <div
        dangerouslySetInnerHTML={{
          __html: `
        <script type="text/javascript" async defer src="${TRACKER_BASE_URL}/piwik.js"></script>
      `,
        }}
      />
    </>
  );
}
