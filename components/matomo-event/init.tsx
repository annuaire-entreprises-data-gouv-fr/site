import { ISession } from '#models/user/session';

const TRACKER_BASE_URL = 'https://stats.data.gouv.fr';
export function MatomoInit({ session }: { session: ISession | null }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              var _paq = window._paq || [];
              ${
                session?.rights.isAgent
                  ? `_paq.push(['setCustomDimension', '1', '${session?.user?.userType}']);`
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
