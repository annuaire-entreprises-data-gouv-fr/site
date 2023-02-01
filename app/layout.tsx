import StyledJsxRegistry from './registry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head />
      <body>
        {process.env.NODE_ENV === 'production' && process.env.MATOMO_SITE_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
          var _paq = window._paq || [];
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
          })();`,
            }}
          ></script>
        )}
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
