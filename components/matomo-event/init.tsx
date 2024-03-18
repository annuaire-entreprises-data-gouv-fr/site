import { ISession, isAgent, isSuperAgent } from '#utils/session';

export function MatomoInit({ session }: { session: ISession | null }) {
  return (
    <script
      defer
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
              (function () {
                var u = 'https://stats.data.gouv.fr/';
                _paq.push(['setTrackerUrl', u + 'piwik.php']);
                _paq.push(['setSiteId', ${process.env.MATOMO_SITE_ID}]);
                var d = document,
                  g = d.createElement('script'),
                  s = d.getElementsByTagName('script')[0];
                g.type = 'text/javascript';
                g.async = true;
                g.defer = true;
                g.src = u + 'piwik.js';
                s.parentNode.insertBefore(g, s);
              })();
              `,
      }}
    ></script>
  );
}
